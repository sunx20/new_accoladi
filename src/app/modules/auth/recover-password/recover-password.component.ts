import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
	selector: 'app-recover-password',
	templateUrl: './recover-password.component.html',
	styleUrls: ['./recover-password.component.css']
})

export class RecoverPasswordComponent {

	form: FormGroup;
	feedback: string;
	submitAttempted = false;
	loading = false;
	sentSuccess = false;
	sentFailed = false;

	constructor(
		private authService: AuthService
	) {
		this.form = new FormGroup({
			email: new FormControl( '', [Validators.required, Validators.email] )
		});
	}

	get formModel() {
		return {
			email: this.form.get('email').value
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
			this.submitAttempted = true;
			this.sentFailed = false;
			this.sentSuccess = false;

			if (this.form.valid) {
				this.authService
					.recoverPassword(
						this.formModel
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.sentSuccess = true;
							this.feedback = 'Email sent successfully. redirecting to login...';
						},
						err => {
							console.log(err);
							this.loading = false;
							this.sentFailed = true;
							if (err.error.status === 'failed') {
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
