import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CustomValidators } from '../../../../shared/shared.module';
import { AuthService } from '../../../auth.service';
import { GoogleAnalyticsEventsService } from '../../../../../modules/shared/services/ga.event.service';
import { ParentService } from '../../../../../modules/parent/services/parent.service';
import { UserService } from '../../../../shared/services/user.service';
import { ValidateEmailNotTaken } from '../../../../shared/validators/custom.validator';

@Component({
	selector: 'app-account-info',
	templateUrl: './account-info.component.html',
	styleUrls: ['./account-info.component.css']
})

export class AccountInfoComponent implements OnInit {

	@Input() role: string;
	@Input() user_id: string;
	@Input() type: string;
	@Input() student_Id: string;
	@Input() childData: any;

	@Output() saveEmitter = new EventEmitter();

	form: FormGroup;
	feedback: string;
	student_id: any
	submitAttempted = false;
	loading = false;
	resetFailed = false;
	requestSuccess = false;

	constructor(
		private authService: AuthService,
		private parentService: ParentService,
		private userService: UserService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
	}

	ngOnInit() {
		if (this.type == 'Child') {
			this.form = new FormGroup({
				password: new FormControl( '', [Validators.required] ), // Add more validators to password strength
				confirm_password: new FormControl( '', [Validators.required] ),
				email: new FormControl( '', [Validators.required, Validators.email], ValidateEmailNotTaken.createValidator(this.userService) ),
				username: new FormControl( '', [Validators.required] ),
			}, 
			{
				validators: CustomValidators.checkPasswords
			});
		} else {
			this.form = new FormGroup({
				password: new FormControl( '', [Validators.required] ), // Add more validators to password strength
				confirm_password: new FormControl( '', [Validators.required] ),
				username: new FormControl( '' ),
				email: new FormControl( '' ),
			}, 
			{
				validators: CustomValidators.checkPasswords
			});
		}
	}

	get formModel() {
		return {
			_id: this.user_id,
			password: this.form.get('password').value,
			confirm_password: this.form.get('confirm_password').value
		};
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.form.controls;
	}

	get basicInfoModel() {
		let mail = this.form.get('email').value
		let register: any = {
			username: mail.substring(0, mail.indexOf('@') - 1),
			email: this.form.get('email').value,
			role: 'Student',
		};

		return register;
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
		if (this.childData == undefined) {
			if (!this.loading) {
				this.loading = true;
				this.submitAttempted = true;
				this.resetFailed = false;
				this.requestSuccess = false;

				if (this.form.valid) {
					this.authService
						.resetPassword(
							this.formModel
						)
						.subscribe(
							(response: any) => {
								this.loading = false;
								this.requestSuccess = true;
								let emit = {
									user_Id: this.user_id,
									student_id: '',
									message: 'AccountInfoSuccess',
									btnType: 'Continue',
									role: this.role,
									type: this.type,
								}
								this.saveEmitter.emit(emit);
							},
							err => {
								console.log(err);
								this.loading = false;
								this.resetFailed = true;
								if (err.error.status == 'failed') {
									this.feedback = err.error.message;
								} else {
									this.feedback = 'Unable to update account information';
								}
							}
						);
				} else {
					this.validateAllFormFields(this.form);
					this.loading = false;
					this.submitAttempted = false;
				}

			}
		} else {
			if (!this.loading) {

				this.loading = true;
				this.submitAttempted = true;
				this.googleAnalyticsEventsService.emitEvent(
					'Public',
					'Form Submition',
					'Account Info Form',
					22000
				);

				let data = {
					email: this.form.get('email').value,
					username: this.form.get('username').value,
					first_name: this.childData.first_name,
					last_name: this.childData.last_name,
					password: this.form.get('password').value,
					dob: this.childData.dob,
					role: 'Student'
				}

				if (this.form.valid) {
					this.parentService
						.addStudent(localStorage.getItem('userId'), data)
						.subscribe(
							(response: any) => {
								this.resetStudentPassword(response.data[0].student_id);
								this.loading = false;
								this.feedback = 'Student added successfully';
								this.googleAnalyticsEventsService.emitEvent(
									'Public',
									'Form Submition',
									'Account Info Form',
									22100
								);
							},
							err => {
								this.loading = false;
								console.error('SA.register-wizard.account-info.component - submitForm', err);
								this.googleAnalyticsEventsService.emitEvent(
									'Public',
									'Form Submition',
									'account information Form',
									22200
								);
								this.feedback = 'Unable to update account information';

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
		return field.invalid && (field.touched || this.submitAttempted);
	}

	resetStudentPassword(id) {
		let data = {
			_id: id,
			password: this.form.get('password').value,
			confirm_password: this.form.get('confirm_password').value,
		}

		this.authService
			.resetPassword(
				data
			)
			.subscribe(
				(response: any) => {
					this.loading = false;
					let emit = {
						user_Id: this.user_id,
						student_id: id,
						message: 'AccountInfoSuccess',
						btnType: 'Continue',
						role: this.role,
						type: this.type,
						childData: this.childData
					}
					this.saveEmitter.emit(emit);
				},
				err => {
					console.log(err);
					this.loading = false;
					this.resetFailed = true;
					if (err.error.status == 'failed') {
						this.feedback = err.error.message;
					} else {
						this.feedback = 'Unable to update account information';
					}
				}
			);
	}

	onClickBack() {
		this.form
		let emit = {
			message: 'BackAccountInfo',
			btnType: 'Back',
			role: this.role,
			type: this.type,
			user_Id: this.user_id,
			childData: this.childData
		}
		this.saveEmitter.emit(emit);
	}

}
