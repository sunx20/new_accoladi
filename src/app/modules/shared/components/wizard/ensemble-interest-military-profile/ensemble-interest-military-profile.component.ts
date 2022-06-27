import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CollegeService } from '../../../services/college.service';
import { GoogleAnalyticsEventsService } from '../../../services/ga.event.service';
import { CollegePreferenceService } from '../../../../student/services/college-preference.service';
import { UserService } from '../../../services/user.service';
import { LocationService } from '../../../services/location.service';
import { StudentService } from '../../../../student/services/student.service';
import { UserModel } from '../../../models/user.model';
import { CollegePreferenceModel } from '../../../../student/models/college-preference.model';

@Component({
  selector: 'app-ensemble-interest-military-profile',
  templateUrl: './ensemble-interest-military-profile.component.html',
  styleUrls: ['./ensemble-interest-military-profile.component.css']
})
export class EnsembleInterestMilitaryProfileComponent implements OnInit {
  student_id: string;
  student = new UserModel({});
  ensemblesList: any[];
  militaryList: any[];
  form: FormGroup;
  searchingColleges = false;
  searchFailed = false;
  submitAttempted = false;
  loading = false;
  requestFailed = false;
  requestSuccess = false;
  feedback = "";
  isValueAdd: boolean = false;
  isFieldsEmpty: boolean = false;
  @Input() isWizardOpen: boolean;
  @Output() openProfile = new EventEmitter();

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private router: Router,
    private collegeService: CollegeService,
    private cpService: CollegePreferenceService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private studentService: StudentService,
    private locationService: LocationService
  ) {
    this.form = new FormGroup({
      ensembles: new FormControl([]),
      military: new FormControl([])
    });
    this.ensemblesList = this.cpService.getCollegeEnsembles();
    this.militaryList = this.cpService.getCollegeMilitaryEnsembles();
  }

  ngOnInit() {
    this.student_id = this.userService.currentUser._id;
    this.getMyProfile();
  }

  getMyProfile() {
    this.studentService.getStudentById(this.student_id).subscribe(
      (response: any) => {
        this.student = response.data;
      },
      err => {
        console.error("SA.collegePreference.update-college-preference-modal.component - getUser", err);
      }
    );
  }

  get formDisabled() {
    return this.loading === true;
  }

  get formModel() {
    return {
      colleges: this.student.college_pref.colleges || "",
      majors: this.student.college_pref.majors || "",
      ensembles: this.form.get("ensembles").value,
      military: this.form.get("military").value
    };
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
    this.isValueAdd = true;
    this.checkFields();
    if (this.isFieldsEmpty == false) {
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
                this.feedback = "Ensembles updated";
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
                  "Unable to update Ensembles information";
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

  BackToPreviousProfile() {
    if (this.isValueAdd == true || this.student.college_pref.colleges != null || this.student.college_pref.majors != null) {
      this.openProfile.emit({ action: "openCollegePref", value: "fromEnsemble" });
    }
    else if (this.student.college_pref.colleges == null && this.student.college_pref.majors == null && this.isValueAdd == false) {
      this.openProfile.emit({ action: "openCollegePref" });
    }
  }

  checkFields() {
    if (this.form.value.ensembles.length == 0 && this.form.value.military.length == 0) {
      this.isFieldsEmpty = true;
      this.feedback = "Please fill the Ensembles details";
      this.requestFailed = true;
    }
    else {
      this.isFieldsEmpty = false;
    }
  }
}