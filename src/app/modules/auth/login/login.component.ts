import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../auth.service';
import { UserService, PaymentService } from '../../shared/shared.module';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

	form: FormGroup;
	feedback: string;
	invite = '';
	submitAttempted = false;
	loading = false;
	loginSuccess = false;
	loginFailed = false;

	constructor(
		private authService: AuthService,
		private router: Router,
		private paymentService: PaymentService,
		private userService: UserService,
		private activatedRoute: ActivatedRoute
	) {
		this.form = new FormGroup({
			email: new FormControl( '', [Validators.required, Validators.email] ),
			password: new FormControl( '', [Validators.required] )
		});
	}

	ngOnInit() {
		this.activatedRoute
			.queryParams
			.subscribe(
				(params: Params) => {
					if (params.inv) {
						this.invite = params['inv'];
					}
				}
			);

		if (this.authService.isLoggedIn()) {
			this.router.navigate([
				this.userService.currentUser.role.toLowerCase()
			]);
		}
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.form.controls;
	}

	get formModel() {
		const login: any = {
			email: this.form.get('email').value,
			password: this.form.get('password').value
		};

		if (this.invite) {
			login.invite = this.invite;
		}
		return login;
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

	submitForm() { console.log('Logging in...');
		this.loading = true;
		this.submitAttempted = true;
		this.loginFailed = false;
		this.loginSuccess = false;

		if (this.form.valid) { console.log('Form data valid...');
			this.authService
				.login(
					this.formModel
				)
				.subscribe(
					(response: any) => {
						this.loading = false;
						if (response && response.data && response.data.token) {
							this.authService.saveToStorage(response.data);
							this.updatePaidThruDate(response.data.user._id)
						}
						this.resetForm();
						this.loginSuccess = true;
						this.feedback = 'Login successfully. Loading Profile ...';
						console.log('Login successfully. Loading Profile ...');
						setTimeout(() => {
							this.router.navigate([
								response.data.user.role.toLowerCase()
							]);
						}, 2000);
					},
					err => {
						this.loading = false;
						this.loginFailed = true;
						if (err.error.status == 'failed') {
							console.log('Unable to process this request ...',err.error.message);
							this.feedback = err.error.message;
						} else {
							console.log('Unable to process this request');
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

	updatePaidThruDate(sid) {
		this.paymentService
			.updatePaidThruDate(
				sid
			)
			.subscribe(
				(response: any) => {
					console.log('Paid thru date is updated')
				}
			)
	}

}
