import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserModel } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
// import { CustomValidators } from '../../../validators/custom.validator';

@Component({
	selector: 'app-demographic-personal-info',
	templateUrl: './edit-demographic-info.component.html'
})

export class EditDemographicInfoComponent implements OnInit {

	user = new UserModel({});
	form: FormGroup;
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';
	ethnicities: string[];

	constructor(
		private userService: UserService,
		public activeModal: NgbActiveModal
	) {

		this.form = new FormGroup({
			sex: new FormControl(''),
			ethnicity: new FormControl('')
		});

		this.ethnicities = [
			'White/European',
			'Black/African',
			'American Indian or Alaska Native',
			'Asian',
			'Native Hawaiian/Pacific Islander',
			'Other',
			'Prefer not to answer'
		];

	}

	ngOnInit() {
		this.getMyProfile();
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			//_id: this.user._id,
			// username: this.user.username,
			// first_name: this.user.first_name,
			// middle_name: this.user.middle_name,
			// last_name: this.user.last_name,
			// dob: {
			// 	year: this.user.dob.year,
			// 	month: this.user.dob.month,
			// 	day: this.user.dob.day,
			// },
			// street1: this.user.address.street1,
			// street2: this.user.address.street2,
			// city: this.user.address.city,
			// state: this.user.address.state,
			// postal_code: this.user.address.postal_code,
			// country: this.user.address.country,
			// phone: this.user.phone.phone,
			// international: this.user.phone.international,
			// graduation_year: this.user.graduation_year,
			sex: this.form.get('sex').value,
			ethnicity: this.form.get('ethnicity').value
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
					console.error('SA.userInfo.edit-information-form.component - getUser', err);
				}
			);
	}

	updateForm() {
		let sex = '',
			ethnicity = '';
		if (this.user.demographics) {
			sex = this.user.demographics.sex;
			ethnicity = this.user.demographics.ethnicity;
		}

		this.form.patchValue({
			sex: this.user.demographics.sex || '',
			ethnicity: this.user.demographics.ethnicity || ''
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
			this.requestFailed = this.requestSuccess = false;

			if (this.form.valid) {
				this.userService
					.updateUserDemographics(this.user._id,this.formModel)
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
						console.error(
							'SA.userInfo.user-information-form.component - update',
							err
						);
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