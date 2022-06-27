import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { GoogleAnalyticsEventsService } from '../../../../../modules/shared/services/ga.event.service';
import { UserService } from '../../../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-coupon-code',
	templateUrl: './coupon-code.component.html',
	styleUrls: ['./coupon-code.component.css']
})

export class CouponCodeComponent implements OnInit {

	@Input() user_id: string;
	@Input() type: string;
	@Input() role: string;

	@Output() saveEmitter = new EventEmitter();

	form: FormGroup;
	feedback = '';
	btnName: string;
	onClickCheckBox: boolean = true;
	submitAttempted: boolean = false;
	loading: boolean = false;
	requestFailed: boolean = false;
	requestSuccess: boolean = false;
	loadingSchools: boolean = false;
	searchFailed: boolean = false;
	noresult: boolean = false;

	constructor(
		private router: Router, 
		private userService: UserService, 
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
	) {
		this.form = new FormGroup({
			promo: new FormControl(''),
		});
	}	

	ngOnInit() {
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			role: this.role,
			promo: this.form.get('promo').value,
		};
	}

	formatMatches = (item: any) => {
		if (!item) return '';
		return item.name;
	}

	fieldsChange(values: any) {
		console.log(values.currentTarget.checked);
		this.onClickCheckBox = !values.currentTarget.checked
		this.form.get('agree').setValue(values.currentTarget.checked)
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
			this.requestSuccess = false;

			this.googleAnalyticsEventsService.emitEvent(
				'Public',
				'Form Submition',
				'Educational Info Form',
				18000
			);
			let id
			let model: any;
			let data = {
				_id: this.user_id,
				promo_code: this.form.get('promo').value,
			}

			if (this.form.valid) {

				this.userService
					.addPromoCode(
						data
					)
					.subscribe(
						(response: any) => {
							this.requestSuccess = true;
							this.feedback = 'Promotional / Coupon Code added Successfully';
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Promo Code Form',
								19100
							);

							let emit = {
								user_Id: this.user_id,
								student_id: '',
								message: 'CouponCodeSuccess',
								btnType: 'Continue',
								role: this.role,
								type: this.type,
							}
							this.saveEmitter.emit(emit);
						},
						err => {
							this.loading = false;
							this.requestFailed = true;
							console.error( 'SA.register-wizard.promo-info.component - putUserEducation', err );
							this.feedback = 'Unable to add promo code information';
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Promo Code Form',
								18200
							);
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
			'Promo Code Form FormField: ' + this.form.get(fieldName),
			18300
		);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		localStorage.clear();
		return this.router.navigate(['/login']);
	}

}