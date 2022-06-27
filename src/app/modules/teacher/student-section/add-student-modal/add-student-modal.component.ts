import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserModel, UserService, GoogleAnalyticsEventsService, ValidateEmailNotTaken } from '../../../../modules/shared/shared.module';
import { TeacherService } from '../../services/teacher.service';
import { StudentModel } from '../../models/student.model';

@Component({
	selector: 'app-add-student-modal',
	templateUrl: './add-student-modal.component.html'
})

export class AddStudentTModalComponent implements OnInit {

	@Input() teacher_id: string;

	teacher = new UserModel({});
	model = new StudentModel({});

	form: FormGroup;
	dob_min_year: number;
	dob_max_year: number;
	months: string[];
	graduation_year: number;
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';

	constructor(
		private teacherService: TeacherService,
		private userService: UserService,
		public activeModal: NgbActiveModal,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		this.months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];

		let today = new Date();
		this.dob_min_year = today.getFullYear() - 85;
		this.dob_max_year = today.getFullYear();
		this.form = new FormGroup({
			first_name: new FormControl( '', [Validators.required] ),
			middle_name: new FormControl( '' ),
			last_name: new FormControl( '', [Validators.required] ),
			username: new FormControl( '', [Validators.required] ),
			email: new FormControl( '', [Validators.required, Validators.email], ValidateEmailNotTaken.createValidator(this.userService) ),
			dob_year: new FormControl( '', [Validators.min(this.dob_min_year), Validators.max(this.dob_max_year)] ),
			dob_month: new FormControl( '', [Validators.min(1), Validators.max(12)] ),
			dob_day: new FormControl( '', [Validators.min(1), Validators.max(31)] ),
			sponsor: new FormControl( false ),
			use_address: new FormControl( false ),
			use_phone: new FormControl( false ),
			graduation_year: new FormControl( '', [Validators.min(2000), Validators.max(2100)] )
		});
	}

	ngOnInit() {
		this.teacherService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.teacher = response.data;
				},
				err => {
					console.error( 'SA.studentSection.studentSection-form.component - getUser', err );
				}
			);
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			first_name: this.form.get('first_name').value,
			middle_name: this.form.get('middle_name').value,
			last_name: this.form.get('last_name').value,
			username: this.form.get('username').value,
			email: this.form.get('email').value,
			dob: {
				year: this.form.get('dob_year').value,
				month: this.form.get('dob_month').value,
				day: this.form.get('dob_day').value
			},
			sponsor: this.form.get('sponsor').value,
			use_address: this.form.get('use_address').value,
			use_phone: this.form.get('use_phone').value,
			graduation_year: this.form.get('graduation_year').value,
		};
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.form.controls;
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
			this.googleAnalyticsEventsService.emitEvent(
				'Public',
				'Form Submition',
				'Add Student Form',
				22000
			);

			this.submitAttempted = true;
			this.requestFailed = this.requestSuccess = false;

			if (this.form.valid) {
				this.teacherService
					.addStudent(
						this.teacher_id, 
						new StudentModel(this.formModel)
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Add Student Form',
								22100
							);
							this.feedback = 'Student added successfully';
							this.requestSuccess = true;
							setTimeout(() => {
								this.activeModal.close(response.data);
							}, 2000);
						},
						err => {
							this.loading = false;
							console.error( 'SA.studentSection.studentSection-form.component - putNewStudent', err );
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Add Student Form',
								22200
							);
							this.feedback = 'Unable to add student';
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
			'Form Field: ' + this.form.get(fieldName),
			19300
		);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

}