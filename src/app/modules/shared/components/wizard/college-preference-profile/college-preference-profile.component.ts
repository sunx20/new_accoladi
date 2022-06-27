import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { Observable, of } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, filter, map, tap, switchMap } from "rxjs/operators";

import { CollegeService } from '../../../services/college.service';
import { GoogleAnalyticsEventsService } from '../../../services/ga.event.service';
import { CollegePreferenceService } from '../../../../student/services/college-preference.service';
import { UserService } from '../../../services/user.service';
import { LocationService } from '../../../services/location.service';
import { StudentService } from '../../../../student/services/student.service';
import { UserModel } from '../../../models/user.model';
import { CollegePreferenceModel } from '../../../../student/models/college-preference.model';

@Component({
	selector: 'app-college-preference-profile',
	templateUrl: './college-preference-profile.component.html',
	styleUrls: ['./college-preference-profile.component.css']
})

export class CollegePreferenceProfileComponent implements OnInit {
		
	@Output() openProfile = new EventEmitter();
	student = new UserModel({});
	form: FormGroup;

	feedback: string = "";
	student_id: string;
	collegesList: any[];
	selectedColleges: any[];
	majorsList: any[];
	searchingColleges: Boolean = false;
	searchFailed: Boolean = false;
	submitAttempted: Boolean = false;
	loading: Boolean = false;
	requestFailed: Boolean = false;
	requestSuccess: Boolean = false;
  isCollegeAdd: boolean = false;
  isFieldsEmpty: boolean = false;
  @Input() isWizardOpen: boolean;

	constructor(
		private userService: UserService,
		//private modalService: NgbModal,
		private activeModal: NgbActiveModal,
		//private router: Router,
		private collegeService: CollegeService,
		private cpService: CollegePreferenceService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
		private studentService: StudentService,
		//private locationService: LocationService
	) {
		this.form = new FormGroup({
			college: new FormControl(""),
			college_id: new FormControl(""),
			majors: new FormControl([]),
		});
		this.majorsList = this.cpService.getCollegeMajors();
		this.collegesList = [];
		this.selectedColleges = [];
	}

	ngOnInit() {
		this.student_id = this.userService.currentUser._id;
		this.getMyProfile();
    if (this.isWizardOpen == true) {
      this.resetForm();
    }
	}

	getMyProfile() {
		this.studentService.getStudentById(this.student_id).subscribe(
			(response: any) => {
				this.student = response.data;
        if (this.isWizardOpen == false) {
          this.updateForm();
        }
			},
			err => {
				console.error("SA.collegePreference.update-college-preference-modal.component - getUser", err);
			}
		);
	}

	searchColleges = (text$: Observable<string>) => text$.pipe(
		debounceTime(300),
		distinctUntilChanged(),
		filter(term => term.length > 2),
		tap(() => (this.searchingColleges = true)),
		switchMap(term =>
			this.collegeService.getCollegeListByKeyword(term).pipe(
				map((res: any) => res.data),
				map(data => {
					return data.filter(d => {
						let r = !this.selectedColleges
							.map(sc => sc._id)
							.includes(d._id);
						return r;
					});
				}),
				tap(() => (this.searchFailed = false)),
				catchError(() => {
					this.searchFailed = true;
					return of([]);
				})
			)
		),
		tap(() => {
			this.searchingColleges = false;
		})
	);

	selectedCollege = (e: any) => {
		const item = e.item;
		this.form.get("college").setValue("");
		this.form.get("college_id").setValue("");
		this.selectedColleges.push(item);
	};

	formatMatches = (item: any) => {
		if (!item) return "";
		return "";
	};

	updateForm() {
		this.selectedColleges = this.student.college_pref.colleges;

		this.form.setValue({
			college: "",
			college_id: "",
      majors: "",
		});
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			colleges: this.selectedColleges,
			majors: this.form.get("majors").value,
      ensembles: this.student.college_pref.ensembles || "",
      military: this.student.college_pref.military || "",
		};
	}

	removeCollege(cid: string) {
		this.selectedColleges = this.selectedColleges.filter(
			sc => sc._id !== cid
		);
	}

	resetForm() {
		this.form.reset();
		this.submitAttempted = false;
	}

	displayFieldCss(field: string) {
		return {
			"has-error": this.isFieldInvalid(field),
			"has-feedback": this.isFieldInvalid(field)
		};
	}

	submitForm() {
    this.checkFields();
    if (this.isFieldsEmpty == false) {
      this.isCollegeAdd = true;
      if (!this.loading) {
        this.loading = true;
        this.submitAttempted = true;
        this.googleAnalyticsEventsService.emitEvent(
          "Public",
          "Form Submition",
          "College Preference Form",
          18000
        );

        this.requestFailed = this.requestSuccess = false;

        if (this.form.valid) {
          this.cpService
            .updateStudentCP(
              this.student_id,
              new CollegePreferenceModel(this.formModel)
            )
            .subscribe(
              (response: any) => {
                this.loading = false;
                this.student = response.data;
                this.googleAnalyticsEventsService.emitEvent(
                  "Public",
                  "Form Submition",
                  "College Preference Form",
                  19100
                );
                this.feedback = "College preference updated";
                this.form.reset();
                this.requestSuccess = true;

                this.submitAttempted = false;
                setTimeout(() => {
                }, 2000);
              },
              err => {
                console.error(
                  "SA.collegePreference.update-college-preference-form.component - addCollegePreference",
                  err
                );
                this.loading = false;
                this.googleAnalyticsEventsService.emitEvent(
                  "Public",
                  "Form Submition",
                  "College Preference Form",
                  18200
                );
                this.feedback =
                  "Unable to update college preference information";
                this.requestFailed = true;
              }
            );
        } else {
          this.validateAllFormFields(this.form);
          this.loading = false;
          this.submitAttempted = false;
        }
      }
    }
  }

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	isFieldInvalid(fieldName: string) {
		const field = this.form.get(fieldName);
		this.googleAnalyticsEventsService.emitEvent(
			"Public",
			"Form Submition",
			"College Preference Form Field: " + this.form.get(fieldName),
			17300
		);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal.dismiss("Cross click");
	}

	submitAndNext() {
		this.openProfile.emit({ action: "openEnsemble" });
	}

	BackToPreviousProfile() {
    if (this.isCollegeAdd == false) {
      this.openProfile.emit({ action: "openSchool" });
    }
    else {
      this.openProfile.emit({ action: "openSchool", value: "fromCollegePref" });
    }
  }

  checkFields() {
    if (this.form.value.majors == null && this.form.value.college == null) {
      this.isFieldsEmpty = true;
      this.feedback = "Please fill the college preference details";
      this.requestFailed = true;
    }
    else {
      this.isFieldsEmpty = false;
    }
	}
}

