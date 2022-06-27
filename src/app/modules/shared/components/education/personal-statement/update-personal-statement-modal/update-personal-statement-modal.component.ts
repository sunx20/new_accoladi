import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StudentService } from '../../../../../student/services/student.service';
import { PersonalStatementService } from '../../../../../student/services/personal-statement.service';

import {
	GoogleAnalyticsEventsService,
	UserModel
} from '../../../../../shared/shared.module';

@Component({
	selector: 'app-update-personal-statement-modal',
	templateUrl: './update-personal-statement-modal.component.html'
})

export class UpdatePSModalComponent implements OnInit {

	@Input() student_id: string;

	student = new UserModel({});

	form: FormGroup;
	feedback = '';
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;

	constructor(
		private studentService: StudentService,
		private psService: PersonalStatementService,
		private activeModal: NgbActiveModal,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		this.form = new FormGroup({
			statement: new FormControl('', [Validators.required])
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
			statement: this.form.get('statement').value
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
						'SA.personalStatement.update-personal-statement-modal.component - getUser',
						err
					);
				}
			);
	}

	updateForm() {
		this.form.setValue({
			statement: this.student.personal_statement || ''
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
				'College Intro Statement Form',
				18000
			);

			if (this.form.valid) {
				this.psService
					.updateStudentPS(
						this.student_id, 
						this.formModel
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.student = response.data;
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'College Intro Statement Form',
								19100
							);
							this.feedback = 'College Intro statement updated';
							this.requestSuccess = true;
							this.submitAttempted = false;
							setTimeout(() => {
								this.activeModal.close(this.student);
							}, 2000);
						},
						err => {
							console.error(
								'SA.personalStatement.update-personal-statement-form.component - addCollegePreference',
								err
							);
							this.loading = false;
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'College Intro Statement Form',
								18200
							);
							this.feedback = 'Unable to update College Intro statement information';
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
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

}