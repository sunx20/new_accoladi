import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserModel } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { LocationService } from '../../../services/location.service';

@Component({
	selector: 'app-address-profile',
	templateUrl: './address-profile.component.html',
	styleUrls: ['./address-profile.component.css']
})
export class AddressProfileComponent implements OnInit {

	user = new UserModel({});
	form: FormGroup;
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';
	states: any[];
	@Output() openProfile = new EventEmitter();
	constructor(
		private userService: UserService,
		public activeModal: NgbActiveModal,
		public locationService: LocationService,
		private modalService: NgbModal,
	) {
		this.form = new FormGroup({
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
			street1: this.user.address.street1 || '',
			street2: this.user.address.street2 || '',
			city: this.user.address.city || '',
			state: this.user.address.state || '',
			postalCode: this.user.address.postal_code || '',
			country: this.user.address.country || '',
			phone: this.user.phone.phone || '',
			email: this.user.email || '',
			countryCode: this.user.phone.international || ''
		});
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			_id: this.user._id,
			username: this.user.username,
			first_name: this.user.first_name,
			middle_name: this.user.middle_name,
			last_name: this.user.last_name,
			dob: {
				year: this.user.dob.year,
				month: this.user.dob.month,
				day: this.user.dob.day,
			},
			street1: this.form.get('street1').value,
			street2: this.form.get('street2').value,
			city: this.form.get('city').value,
			state: this.form.get('state').value,
			postal_code: this.form.get('postalCode').value,
			country: this.form.get('country').value,
			graduation_year: this.user.graduation_year,
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

	submitAndNext() {
		this.submitForm();
		this.openProfile.emit({ action: "openDate" });
	}

	submitForm() {
		if (!this.loading) {
			this.loading = true;
			this.submitAttempted = true;
			this.requestFailed = this.requestSuccess = false;

			if (this.form.valid) {
				this.userService.updateUserAccount(this.formModel).subscribe(
					(response: any) => {
						this.loading = false;
						this.user = response.data;
						this.feedback = 'User contact information updated';
						this.requestSuccess = true;
					},
					err => {
						this.loading = false;
						console.error('SA.userInfo.user-information-form.component - update', err);
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


}
