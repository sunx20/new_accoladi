import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserModel } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { GoogleAnalyticsEventsService } from '../../../services/ga.event.service';
import { CustomValidators } from '../../../validators/custom.validator';

@Component({
	selector: 'app-change-password-modal',
	templateUrl: './change-password-modal.component.html'
})

export class ChangePasswordModalComponent implements OnInit {

	user = new UserModel({});
	form: FormGroup;
	loading: boolean = false;
	submitAttempted: boolean = false;
	requestFailed: boolean = false;
	requestSuccess: boolean = false;
	feedback: string = '';

	constructor(
		private userService: UserService,
		public activeModal: NgbActiveModal,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		this.form = new FormGroup({
			current_password: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
			confirm_password: new FormControl('', [Validators.required])
		}, {
			validators: CustomValidators.checkPasswords
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
			_id: this.user._id,
			current_password: this.form.get('current_password').value,
			password: this.form.get('password').value,
			confirm_password: this.form.get('confirm_password').value
		};
	}

	getMyProfile() {
		this.userService
			.getUserProfile(this.userService.currentUser._id)
			.subscribe(
				(response: any) => {
					this.user = response.data;
					this.updateForm();
				},
				err => {
					console.error( 'SA.userInfo.edit-information-form.component - getUser', err );
				}
			);
	}

	updateForm() {
		this.form.setValue({
			current_password: '',
			password: '',
			confirm_password: ''
		});
	}

	displayFieldCss(field: string) {
		return {
			'has-error': this.isFieldInvalid(field),
			'has-feedback': this.isFieldInvalid(field)
		};
	}

	resetForm() {
		this.form.reset();
		this.submitAttempted = false;
	}

	submitForm() {
		if (!this.loading) {
			this.loading = true;
			this.submitAttempted = true;
			this.requestFailed = this.requestSuccess = false;
			
			this.googleAnalyticsEventsService.emitEvent(
				'Public',
				'Form Submition',
				'User Account Form',
				20040
			);		

			if (this.form.valid) {
				this.userService.editUserInformation(this.formModel).subscribe(
					(response: any) => {
						this.loading = false;
						this.user = response.data;
						this.googleAnalyticsEventsService.emitEvent(
							'Public',
							'Form Submition',
							'Edit Information Form',
							19100
						);
						this.feedback = 'User information updated';
						//this.form.reset();
						this.requestSuccess = true;
						setTimeout(() => {
							//this.resetForm();
							this.activeModal.close(this.user);
						}, 2000);
					},
					err => {
						this.loading = false;
						console.error( 'SA.userInfo.user-information-form.component - update', err );
						this.googleAnalyticsEventsService.emitEvent(
							'Public',
							'Form Submition',
							'User Account Form',
							20240
						);
						this.feedback = 'Unable to edit user information';
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
			'Settings User Info Form FormField: ' + this.form.get(fieldName),
			20340
		);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}
	
}
