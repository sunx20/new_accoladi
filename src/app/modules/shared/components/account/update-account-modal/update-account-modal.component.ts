import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../../../services/user.service';
import { GoogleAnalyticsEventsService } from '../../../services/ga.event.service';
import { LocationService } from '../../../services/location.service';

import { UserModel } from '../../../models/user.model';

@Component({
	selector: 'app-update-account-modal',
	templateUrl: './update-account-modal.component.html'
})

export class UpdateAccountModalComponent implements OnInit {

	@Input() user_id: string;
	@Input() msg: string;

	user = new UserModel({});

	feedback = '';
	form: FormGroup;
	states: any[];
	dob_min_year: number;
	dob_max_year: number;
	months: string [];
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;

	constructor(
		private userService: UserService,
		public activeModal: NgbActiveModal,
		private locationService: LocationService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
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
			first_name: new FormControl('', [Validators.required]),
			middle_name: new FormControl(''),
			last_name: new FormControl('', [Validators.required]),
			username: new FormControl('', [Validators.required]),
			email: new FormControl(''),
			dob_year: new FormControl('', [
				Validators.min(this.dob_min_year),
				Validators.max(this.dob_max_year)]),
			dob_month: new FormControl('', [
				Validators.min(1),
				Validators.max(12)]),
			dob_day: new FormControl('', [
				Validators.min(1),
				Validators.max(31)]),
			street1: new FormControl('', [Validators.required]),
			street2: new FormControl(''),
			city: new FormControl('', [Validators.required]),
			state: new FormControl('', [Validators.required]),
			postal_code: new FormControl('', [Validators.required]),
			country: new FormControl(''),
			phone: new FormControl(''),
			international: new FormControl('1'),
			title: new FormControl(''),
			discipline: new FormControl(''),
			url: new FormControl('')
		});

		this.states = this.locationService.getStates();
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
			username: this.form.get('username').value,
			first_name: this.form.get('first_name').value,
			middle_name: this.form.get('middle_name').value,
			last_name: this.form.get('last_name').value,
			dob: {
				year: this.form.get('dob_year').value,
				month: this.form.get('dob_month').value,
				day: this.form.get('dob_day').value,
			},
			street1: this.form.get('street1').value,
			street2: this.form.get('street2').value,
			city: this.form.get('city').value,
			state: this.form.get('state').value,
			postal_code: this.form.get('postal_code').value,
			country: this.form.get('country').value,
			phone: this.form.get('phone').value,
			international: this.form.get('international').value,
			title: this.form.get('title').value,
			discipline: this.form.get('discipline').value,
			faculty_url: this.form.get('url').value,
			// sex: this.form.get('sex').value
		};
	}

	getMyProfile() {
		this.userService
			.getUserProfile(
				this.userService.currentUser._id
			)
			.subscribe(
				(response: any) => {
					this.user = response.data;
					this.updateForm();
				},
				err => {
					console.error('SA.accountInfo.account-information-form.component - getUser', err);
				}
			);
	}

	updateForm() {
		let street1 = '',
			street2 = '',
			city = '',
			state = '',
			postal_code = '',
			country = '';

		if (this.user.address) {
			if (this.user.address.street1) {street1 = this.user.address.street1;}
			if (this.user.address.street2){ street2 = this.user.address.street2;}
			if (this.user.address.city) {city = this.user.address.city;}
			if (this.user.address.state) {state = this.user.address.state;}
			if (this.user.address.postal_code) {postal_code = this.user.address.postal_code;}
			if (this.user.address.country) {country = this.user.address.country;}
		}

		let phone = '', international = '1';
		if (this.user.phone) {
			if (this.user.phone.phone) {phone = this.user.phone.phone;}
			if (this.user.phone.international) {international = this.user.phone.international;}
		}

		let dob_year:any, dob_month:any , dob_day:any;

		if (this.user.dob) {
			dob_year = this.user.dob.year ? this.user.dob.year : '';
			dob_month = this.user.dob.month ? this.user.dob.month : '';
			dob_day = this.user.dob.day ? this.user.dob.day : '';
		}

		let title:any, discipline:any , url:any;

		if (this.user.meta &&
			this.user.meta.verified) {
			title = this.user.meta.verified.title ? this.user.meta.verified.title : '';
			discipline = this.user.meta.verified.discipline ? this.user.meta.verified.discipline : '';
			url = this.user.meta.verified.faculty_url ? this.user.meta.verified.faculty_url : '';
		}


		this.form.setValue({
			username: this.user.username || '',
			email: this.user.email || '',
			first_name: this.user.first_name || '',
			middle_name: this.user.middle_name || '',
			last_name: this.user.last_name || '',
			dob_year: dob_year || '',
			dob_month: dob_month || '',
			dob_day: dob_day || '',
			street1: street1 || '',
			street2: street2 || '',
			city: city || '',
			state: state || '',
			postal_code: postal_code || '',
			country: country || '',
			phone: phone || '',
			international: international || '1',
			title: title || '',
			discipline: discipline || '',
			url: url || ''
			//	sex: this.user.sex || ''
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
			this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'User Account Form', 20040);
			this.requestFailed = this.requestSuccess = false;

			if (this.form.valid) {
				this.userService
					.updateUserAccount(
						this.formModel
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.user = response.data;
							this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Account Information Form', 19100);
							this.feedback = 'Account information updated';
							//this.form.reset();
							this.requestSuccess = true;
								

							setTimeout(() => {
								//this.resetForm();
								this.activeModal.close(this.user);
							}, 2000);
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
		this.activeModal.dismiss('Cross click');
	}

}