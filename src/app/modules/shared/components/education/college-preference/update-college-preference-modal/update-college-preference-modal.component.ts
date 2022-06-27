import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Observable, of } from "rxjs";
import {
	catchError,
	debounceTime,
	distinctUntilChanged,
	filter,
	map,
	tap,
	switchMap
} from "rxjs/operators";

import { StudentService } from "../../../../../student/services/student.service";
import { CollegePreferenceService } from "../../../../../student/services/college-preference.service";
import { CollegePreferenceModel } from "../../../../../student/models/college-preference.model";

import {
	CollegeService,
	GoogleAnalyticsEventsService,
	UserModel
} from "../../../../../shared/shared.module";

@Component({
	selector: "app-update-college-preference-modal",
	templateUrl: "./update-college-preference-modal.component.html"
})

export class UpdateCPModalComponent implements OnInit {

	@Input() student_id: string;

	student = new UserModel({});
	model = new CollegePreferenceModel({});
	collegesList: any[];
	selectedColleges: any[];
	majorsList: any[];
	ensemblesList: any[];
	militaryList: any[];
	form: FormGroup;
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';
	searchingColleges = false;
	searchFailed = false;

	constructor(
		private studentService: StudentService,
		private cpService: CollegePreferenceService,
		private collegeService: CollegeService,
		private activeModal: NgbActiveModal,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		this.form = new FormGroup({
			college: new FormControl(''),
			college_id: new FormControl(''),
			majors: new FormControl([]),
			ensembles: new FormControl([]),
			military: new FormControl([])
		});

		this.majorsList = this.cpService.getCollegeMajors();
		this.ensemblesList = this.cpService.getCollegeEnsembles();
		this.militaryList = this.cpService.getCollegeMilitaryEnsembles();
		this.collegesList = [];
		this.selectedColleges = [];
	}

	ngOnInit() {
		this.getMyProfile();
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			colleges: this.selectedColleges,
			majors: this.form.get('majors').value,
			ensembles: this.form.get('ensembles').value,
			military: this.form.get('military').value
		};
	}

	getMyProfile() {
		this.studentService
			.getStudentById(
				this.student_id
			)
			.subscribe(
				(response: any) => {
					this.student = response.data;
					this.updateForm();
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
			this.collegeService
				.getCollegeListByKeyword(
					term
				)
				.pipe(
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
		item.date = new Date().toISOString();
		item.status = true;
		this.form.get("college").setValue('');
		this.form.get("college_id").setValue('');
		this.selectedColleges.push(item);
	}

	formatMatches = (item: any) => {
		if (!item) return '';
		return '';
	}

	updateForm() {
		this.selectedColleges = this.student.college_pref.colleges;

		this.form.setValue({
			college: '',
			college_id: '',
			majors: this.student.college_pref.majors || '',
			ensembles: this.student.college_pref.ensembles || '',
			military: this.student.college_pref.military || ''
		});
	}

	removeCollege(cid: string) {
		this.selectedColleges = this.selectedColleges
									.filter(
										sc => sc._id !== cid
									);
	}

	resetForm() {
		this.form.reset();
		this.submitAttempted = false;
	}

	displayFieldCss(field: string) {
		return {
			'has-error': this.isFieldInvalid(field),
			'has-feedback': this.isFieldInvalid(field)
		};
	}

	submitForm() {
		if (!this.loading) {
			this.loading = true;
			this.submitAttempted = true;
			this.googleAnalyticsEventsService.emitEvent(
				'Public',
				'Form Submition',
				'College Preference Form',
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
						this.cpService
							.updateStudentInterested(	
								this.student_id,
								new CollegePreferenceModel(this.formModel)
							)
							.subscribe((responsecc: any)=>{
								this.loading = false;
								this.student = response.data;
								this.googleAnalyticsEventsService.emitEvent(
									'Public',
									'Form Submition',
									'College Preference Form',
									19100
								);
								this.feedback = 'College preference updated';
								this.requestSuccess = true;
								this.submitAttempted = false;
								setTimeout(() => {
									this.activeModal.close(this.student);
								}, 2000);
							})	
						},
						err => {
							console.error( 'SA.collegePreference.update-college-preference-form.component - addCollegePreference', err );
							this.loading = false;
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'College Preference Form',
								18200
							);
							this.feedback =
								'Unable to update college preference information';
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
			'Public',
			'Form Submition',
			'College Preference Form Field: ' + this.form.get(fieldName),
			17300
		);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal
			.dismiss('Cross click');
	}

}
