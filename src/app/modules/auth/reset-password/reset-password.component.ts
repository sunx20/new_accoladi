import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { CustomValidators } from '../../shared/shared.module';
import { AuthService } from '../auth.service';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {

	form: FormGroup;
	submitAttempted = false;
	loading = false;
	resetSuccess = false;
	resetFailed = false;
	feedback: string;
	key: string;

	constructor(
		private authService: AuthService,
		private activatedRoute: ActivatedRoute,
	) {
		this.form = new FormGroup({
			password: new FormControl('', [Validators.required]), // Add more validators to password strength
			confirm_password: new FormControl('', [Validators.required]),
		}, {
			validators: CustomValidators.checkPasswords}
		);

		this.key = '';
	}

	ngOnInit() {
		this.activatedRoute
			.params
			.subscribe(
				(params: Params) => {
				if ( params.key ) {
					this.key = params['key'];
				}
			}
		);
	}

	get formModel() {
		return {
			_id: this.form.get('password').value,
			password: this.form.get('password').value,
			confirm_password: this.form.get('confirm_password').value,
			key: this.key
		};
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

	// convenience getter for easy access to form fields
	get f() { 
		return this.form.controls; 
	}

	submitForm() {
		if (!this.loading) {
			this.loading = true;
			this.submitAttempted = true;
			this.resetFailed = false;
			this.resetSuccess = false;

			if (this.form.valid) {
				this.authService
					.resetPassword(
						this.formModel
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							//this.resetForm();
							this.resetSuccess = true;
						},
						err => {
							this.loading = false;
							this.resetFailed = true;
							console.log(err);
							if (err.error.status == 'failed') {
								this.feedback = err.error.message;
							} else {
								this.feedback = 'Unable to process this request';
							}
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
	
}
