import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


import { UserModel } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { CustomValidators } from '../../../validators/custom.validator';

@Component({
	selector: 'app-edit-personal-info',
	templateUrl: './edit-personal-info.component.html'
})
export class EditPersonalInfoComponent implements OnInit {

	user = new UserModel({});
	form: FormGroup;
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';
	dob_min_year: number;
	dob_max_year: number;
	months: string[];

	constructor(
		private userService: UserService,
		public activeModal: NgbActiveModal
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

		const today = new Date();
		this.dob_min_year = today.getFullYear() - 85;
		this.dob_max_year = today.getFullYear();

		this.form = new FormGroup({
			first_name: new FormControl('',[Validators.required]),
			middle_name: new FormControl(''),
			last_name: new FormControl('',[Validators.required]),
			username: new FormControl(''),
			dob_year: new FormControl('', [
				Validators.required,
				Validators.min(this.dob_min_year),
				Validators.max(this.dob_max_year)
			]),
			dob_month: new FormControl('', [
				Validators.required,
				Validators.min(1),
				Validators.max(12)
			]),
			dob_day: new FormControl('', [
				Validators.required,
				Validators.min(1),
				Validators.max(31)
			]),
			intro_statement: new FormControl(''),
			intro_video_url: new FormControl('')
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
			first_name: this.form.get('first_name').value,
			middle_name: this.form.get('middle_name').value,
			last_name: this.form.get('last_name').value,
			username: this.user.username,
			dob: {
				year: this.form.get('dob_year').value,
				month: this.form.get('dob_month').value,
				day: this.form.get('dob_day').value,
			},
			graduation_year: this.user.graduation_year,
			street1: this.user.address.street1,
			street2: this.user.address.street2,
			city: this.user.address.city,
			state: this.user.address.state,
			postal_code: this.user.address.postal_code,
			country: this.user.address.country,
			phone: this.user.phone.phone,
			international: this.user.phone.international,
			sex: this.user.demographics.sex,
			ethnicity: this.user.demographics.ethnicity,
			intro_statement: this.form.get('intro_statement').value,
			intro_video_url: this.form.get('intro_video_url').value,
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
		let dob_year: any, dob_month: any, dob_day: any;

		if (this.user.dob) {
			dob_year = this.user.dob.year ? this.user.dob.year : '';
			dob_month = this.user.dob.month ? this.user.dob.month : '';
			dob_day = this.user.dob.day ? this.user.dob.day : '';
		}

		this.form.patchValue({
			first_name: this.user.first_name || '',
			middle_name: this.user.middle_name || '',
			last_name: this.user.last_name || '',
			username: this.user.username || '',
			dob_year: dob_year,
			dob_month: dob_month,
			dob_day: dob_day,
			intro_video_url: this.user.introduction.video_url || '',
			intro_statement: this.user.introduction.statement || ''
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
