import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StudentService } from '../../../../../student/services/student.service';
import { ScholasticInformationService } from '../../../../../student/services/scholastic-information.service';
import { ScholasticModel } from '../../../../../student/models/scholastic.model';
import {
	GoogleAnalyticsEventsService,
	UserModel
} from '../../../../../shared/shared.module';

@Component({
	selector: 'app-update-scholastic-information-modal',
	templateUrl: './update-scholastic-information-modal.component.html'
})

export class UpdateSIModalComponent implements OnInit {
	
	@Input() student_id: string;

	student = new UserModel({});
	model = new ScholasticModel({});

	form: FormGroup;
	gpa: number;
	act: number;
	sat: number;
	dob_min_year: number;
	dob_max_year: number;
	graduation_year: number;
	feedback = '';
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;

	constructor(
		private studentService: StudentService,
		private siService: ScholasticInformationService,
		private activeModal: NgbActiveModal,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		let today = new Date();
		this.dob_min_year = today.getFullYear() - 85;
		this.dob_max_year = today.getFullYear();

		this.form = new FormGroup({
			gpa: new FormControl('', [Validators.max(5), Validators.min(0)]),
			sat: new FormControl(''),
			act: new FormControl(''),
			graduation_year: new FormControl('', [
				Validators.min(2000),
				Validators.max(2100)
			])
		});
	}

	ngOnInit() {
		this.getMyProfile();
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			gpa: this.form.get('gpa').value,
			sat: this.form.get('sat').value,
			act: this.form.get('act').value,
			graduation_year: this.form.get('graduation_year').value
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
					console.error(
						'SA.student.student-scholastic-form.component - getUser',
						err
					);
				}
			);
	}

	updateForm() {
		this.form.patchValue({
			gpa: this.student.scholastics && this.student.scholastics.gpa || '',
			sat: this.student.scholastics && this.student.scholastics.sat || '',
			act: this.student.scholastics && this.student.scholastics.act || '',
			graduation_year:this.student.graduation_year || ''
		});
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
			this.requestFailed = this.requestSuccess = false;
			this.googleAnalyticsEventsService.emitEvent(
				'Public',
				'Form Submition',
				'Scholastic Information Form',
				18000
			);

			if (this.form.valid) {
				this.siService
					.updateStudentSI(
						this.student_id,
						new ScholasticModel(this.formModel)
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.student = response.data;
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Scholastic Information Form',
								19100
							);
							this.feedback = 'Scholastic information updated';
							this.requestSuccess = true;
							setTimeout(() => {
								//this.resetForm();
								this.activeModal.close(this.student);
							}, 2000);
						},
						err => {
							this.loading = false;
							console.error(
								'SA.student.student-scholastic-form.component - putUserStudentScholastics',
								err
							);
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Student - Scholastic Information Form',
								20210
							);
							this.feedback = 'Unable to update scholastic information';
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
			'Student- Scholastic Information FormField: ' +
				this.form.get(fieldName),
			20310
		);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

}