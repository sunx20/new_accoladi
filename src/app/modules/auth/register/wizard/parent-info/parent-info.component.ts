import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../../../shared/services/user.service';
import { GoogleAnalyticsEventsService } from '../../../../../modules/shared/services/ga.event.service';

import { ValidateEmailNotTaken } from '../../../../shared/validators/custom.validator';

@Component({
	selector: 'app-parent-info',
	templateUrl: './parent-info.component.html',
	styleUrls: ['./parent-info.component.css']
})

export class ParentInfoComponent implements OnInit {
	
	@Input() user_id: string;
	@Input() type: string;
	@Input() role: string;

	@Output() saveEmitter = new EventEmitter();

	form: FormGroup;
	states: any[];
	feedback = '';
	loading: boolean = false;
	submitAttempted: boolean = false;
	requestFailed: boolean = false;
	requestSuccess: boolean = false;

	constructor( 
		private router: Router,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService, 
		private userService: UserService,
	) {
		this.form = new FormGroup({
			first_name: new FormControl( '', [Validators.required] ),
			last_name: new FormControl( '', [Validators.required] ),
			email: new FormControl( '', [Validators.required, Validators.email], ValidateEmailNotTaken.createValidator(this.userService) ),
			phone: new FormControl( '', [Validators.pattern(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)] ),
		});
	}

	ngOnInit() {
	}

	get formModel() {
		return {
			_id: this.user_id,
			first_name: this.form.get('first_name').value,
			last_name: this.form.get('last_name').value,
			email: this.form.get('email').value,
			phone: { phone: this.form.get('phone').value }
		};
	}

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
			this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'User Account Form', 20040);
			this.requestFailed = this.requestSuccess = false;
			
			if (this.form.valid) {
				this.userService
					.updateUserParent(
						this.formModel
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Account Information Form', 19100);
							this.feedback = 'Account information updated';
							this.requestSuccess = true;
							let emit = {
								user_Id: this.user_id,
								student_id: '',
								message: 'ParentInfoSuccess',
								btnType: 'Continue',
								role: this.role,
								type: this.type,
							 }
							 this.saveEmitter.emit(emit);
						},
						err => {
							this.loading = false;
							console.error('SA.accountInfo.account-information-form.component - update', err);
							this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'User Account Form', 20240);
							this.feedback = 'Unable to update account information';
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
		this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'User Account Form FormField: ' + this.form.get(fieldName), 20340);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		localStorage.clear();
		return this.router.navigate(['/login']);
	}

	onClickBack() {
		let emit = {
			user_Id: this.user_id,
			student_id: '',
			message: 'BackParentInfo',
			btnType: 'Back',
			role: this.role,
			type: this.type,
		}

		this.saveEmitter.emit(emit);
	}

}