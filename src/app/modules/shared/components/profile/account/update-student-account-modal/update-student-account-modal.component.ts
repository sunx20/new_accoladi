import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StudentService } from '../../../../../student/services/student.service';
import { GoogleAnalyticsEventsService, LocationService, UserModel } from '../../../../../shared/shared.module';

@Component({
	selector: 'app-update-student-account-modal',
	templateUrl: './update-student-account-modal.component.html'
})

export class UpdateStudentAccountModalComponent implements OnInit {

	@Input() student_id: string;
	@Input() msg: string;


	student = new UserModel({});
	form: FormGroup;
	submitAttempted = false;
	states: any[];
	ethnicities: string[];
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';
	dob_min_year: number;
	dob_max_year: number;
	months: string[];

	constructor(
		private studentService: StudentService,
		public activeModal: NgbActiveModal,
		private locationService: LocationService,
		private router: Router,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
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
			first_name: new FormControl('', [Validators.required]),
			middle_name: new FormControl(''),
			last_name: new FormControl('', [Validators.required]),
			username: new FormControl('', [Validators.required]),
			email: new FormControl(''),
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
			street1: new FormControl('', [Validators.required]),
			street2: new FormControl(''),
			city: new FormControl('', [Validators.required]),
			state: new FormControl('', [Validators.required]),
			postal_code: new FormControl('', [Validators.required]),
			country: new FormControl(''),
			phone: new FormControl(''),
			international: new FormControl('1'),
			sex: new FormControl(''),
			ethnicity: new FormControl(''),
			graduation_year: new FormControl('', [
				Validators.required,
				Validators.max(2100),
				Validators.min(2000)
			])
		});

		this.states = this.locationService.getStates();
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

	getMyProfile() {
		this.studentService.getStudentById(this.student_id).subscribe(
			(response: any) => {
				this.student = response.data;
				this.updateForm();
			},
			err => {
				console.error( 'SA.accountInfo.student-account-form.component - getUser', err );
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

		if (this.student.address) {
			if (this.student.address.street1) {
				street1 = this.student.address.street1;
			}
			if (this.student.address.street2) {
				street2 = this.student.address.street2;
			}
			if (this.student.address.city) {
				city = this.student.address.city;
			}
			if (this.student.address.state) {
				state = this.student.address.state;
			}
			if (this.student.address.postal_code) {
				postal_code = this.student.address.postal_code;
			}
			if (this.student.address.country) {
				country = this.student.address.country;
			}
		}

		let phone = '',
			international = '1';
		if (this.student.phone) {
			if (this.student.phone.phone) {
				phone = this.student.phone.phone;
			}
			if (this.student.phone.international) {
				international = this.student.phone.international;
			}
		}

		let sex = '',
			ethnicity = '';
		if (this.student.demographics) {
			sex = this.student.demographics.sex;
			ethnicity = this.student.demographics.ethnicity;
		}

		let dob_year: any, dob_month: any, dob_day: any;

		if (this.student.dob) {
			dob_year = this.student.dob.year ? this.student.dob.year : '';
			dob_month = this.student.dob.month ? this.student.dob.month : '';
			dob_day = this.student.dob.day ? this.student.dob.day : '';
		}

		this.form.setValue({
			username: this.student.username || '',
			email: this.student.email || '',
			first_name: this.student.first_name || '',
			middle_name: this.student.middle_name || '',
			last_name: this.student.last_name || '',
			dob_year: dob_year,
			dob_month: dob_month,
			dob_day: dob_day,
			street1: street1 || '',
			street2: street2 || '',
			city: city || '',
			state: state || '',
			postal_code: postal_code || '',
			country: country || '',
			phone: phone || '',
			international: international || '1',
			sex: sex || '',
			ethnicity: ethnicity || '',
			graduation_year: this.student.graduation_year || ''
		});
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			_id: this.student._id,
			username: this.form.get('username').value,
			first_name: this.form.get('first_name').value,
			middle_name: this.form.get('middle_name').value,
			last_name: this.form.get('last_name').value,
			dob: {
				year: this.form.get('dob_year').value,
				month: this.form.get('dob_month').value,
				day: this.form.get('dob_day').value
			},
			street1: this.form.get('street1').value,
			street2: this.form.get('street2').value,
			city: this.form.get('city').value,
			state: this.form.get('state').value,
			postal_code: this.form.get('postal_code').value,
			country: this.form.get('country').value,
			phone: this.form.get('phone').value,
			international: this.form.get('international').value,
			sex: this.form.get('sex').value,
			ethnicity: this.form.get('ethnicity').value,
			graduation_year: this.form.get('graduation_year').value
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
		if(!this.loading){
		this.loading = true;
		this.submitAttempted = true;
		this.googleAnalyticsEventsService.emitEvent(
			'Public',
			'Form Submition',
			'Student Account Form',
			20040
		);

		this.requestFailed = this.requestSuccess = false;

		if (this.form.valid) {
			this.studentService.updateStudentAccount(this.formModel).subscribe(
				(response: any) => {
					this.loading = false;
					this.student = response.data;
					this.googleAnalyticsEventsService.emitEvent(
						'Public',
						'Form Submition',
						'Account Information Form',
						19100
					);
					this.feedback = 'Account information updated';
					//this.form.reset();
        			this.requestSuccess = true;
							

					setTimeout(() => {
						//this.resetForm();
						this.activeModal.close(this.student);
					}, 2000);
				},
				err => {
					this.loading = false;
					console.error(
						'SA.accountInfo.student-account-form.component - update',
						err
					);
					this.googleAnalyticsEventsService.emitEvent(
						'Public',
						'Form Submition',
						'Student Account Form',
						20240
					);
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
		this.googleAnalyticsEventsService.emitEvent(
			'Public',
			'Form Submition',
			'Student Account Form FormField: ' + this.form.get(fieldName),
			20340
		);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}
}
