import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserModel } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
// import { CustomValidators } from '../../../validators/custom.validator';
import { LocationService } from '../../../services/location.service';

@Component({
	selector: 'app-edit-contact-info',
	templateUrl: './edit-contact-info.component.html'
})

export class EditContactInfoComponent implements OnInit {

	user = new UserModel({});
	form: FormGroup;
	submitAttempted: boolean = false;
	loading: boolean  = false;
	requestFailed: boolean  = false;
	requestSuccess: boolean  = false;
	feedback: string = '';
	states: any[] = [];

	constructor(
		private userService: UserService,
		public activeModal: NgbActiveModal,
		public locationService: LocationService
	) {
		this.form = new FormGroup({
			phone: new FormControl(''),
			email: new FormControl(''),
			street1: new FormControl(''),
			street2: new FormControl(''),
			city: new FormControl(''),
			state: new FormControl('', [Validators.required]),
			postalCode: new FormControl(''),
			country: new FormControl(''),
			countryCode: new FormControl('')
		});

		this.states = this.locationService.getStates();
	}

	ngOnInit() {
		this.getMyProfile();
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
					console.error('SA.userInfo.edit-information-form.component - getUser', err);
				}
			);
	}

	updateForm() {
		this.form.patchValue({
			street1: ( this.user.address !== null ? this.user.address.street1 : '' ) || '',
			street2: ( this.user.address !== null ? this.user.address.street2 : '' ) || '',
			city: ( this.user.address !== null ? this.user.address.city : '' ) || '',
			state: ( this.user.address !== null ? this.user.address.state : '' ) || '',
			postalCode: ( this.user.address !== null ? this.user.address.postal_code : '' ) || '',
			country: ( this.user.address !== null ? this.user.address.country : '' ) || '',
			phone: ( this.user.address !== null ? this.user.phone.phone : '' ) || '',
			countryCode: ( this.user.address !== null ? this.user.phone.international : '' ) || '',
			email: this.user.email || ''
		});
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			_id: this.user._id,
			first_name: this.user.first_name,
			middle_name: this.user.middle_name,
			last_name: this.user.last_name,
			username: this.user.username,
			graduation_year: this.user.graduation_year,
			dob: {
				day: this.user.dob.day,
				month: this.user.dob.month,
				year: this.user.dob.year
			},
			street1: this.form.get('street1').value,
			street2: this.form.get('street2').value,
			city: this.form.get('city').value,
			state: this.form.get('state').value,
			postal_code: this.form.get('postalCode').value,
			country: this.form.get('country').value,
			phone: this.form.get('phone').value,
			international: this.form.get('countryCode').value,
			sex: this.user.demographics.sex,
			ethnicity: this.user.demographics.ethnicity
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

	submitForm() {
		if (!this.loading) {
			this.loading = true;
			this.submitAttempted = true;
			this.requestFailed = this.requestSuccess = false;

			if (this.form.valid) {
				this.userService
					.updateUserAccount(this.formModel)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.user = response.data;
							this.feedback = 'User contact information updated';
							this.requestSuccess = true;
							setTimeout(() => {
								this.activeModal.close(this.user);
							}, 2000);
						},
						err => {
							this.loading = false;
							console.error( 'SA.userInfo.user-information-form.component - update', err );
							this.feedback = 'Unable to edit user contact information';
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
