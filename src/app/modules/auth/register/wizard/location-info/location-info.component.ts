import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserModel } from '../../../../shared/models/user.model';
import { UserService } from '../../../../shared/services/user.service';
import { StudentService } from '../../../../student/services/student.service';
import { LocationService } from '../../../../shared/services/location.service';

@Component({
	selector: 'app-location-info',
	templateUrl: './location-info.component.html',
	styleUrls: ['./location-info.component.css']
})

export class LocationInfoComponent implements OnInit {

	@Input() role: string;
	@Input() user_id: string;
	@Input() type: string;

	@Output() saveEmitter = new EventEmitter();
	
	user = new UserModel({});
	form: FormGroup;
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';
	states: any[];
	student: any
	
	constructor(
		private studentService: StudentService,
		private userService: UserService,
		public locationService: LocationService
	) {
		this.form = new FormGroup({
			country: new FormControl( '' ),
			countryCode: new FormControl( '' ),
			phone: new FormControl( '', [Validators.pattern(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)] ),
			postalCode: new FormControl( '' ),
		});

		this.states = this.locationService.getStates();
	}

	ngOnInit() {
		this.getMyProfile()
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			postal_code: this.form.get('postalCode').value,
			country: this.form.get('country').value,
			country_Code: this.form.get('countryCode').value
		};
	}

	get phoneModel() {
		return {
			phone: this.form.get('phone').value
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
					.updateUserAddress(
						this.user_id, 
						this.formModel
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.user = response.data;
							this.feedback = 'User contact information updated';
							this.requestSuccess = true;
							this.submitPhone();

						},
						err => {
							this.loading = false;
							console.error('SA.register-wizard.location-info.component - submitForm', err);
							this.feedback = 'Unable to edit user location information';
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

	submitPhone() {
		if (!this.loading) {
			this.loading = true;
			this.submitAttempted = true;
			this.requestFailed = this.requestSuccess = false;

			if (this.form.valid) {
				this.userService
					.updateUserPhone(
						this.user_id, 
						this.phoneModel
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.user = response.data;
							this.feedback = 'User phone information updated';
							this.requestSuccess = true;
							let emit = {
								user_Id: this.user_id,
								student_id: '',
								message: 'LocationInfoSuccess',
								btnType: 'Continue',
								role: this.role,
								type: this.type,
							}
							this.saveEmitter.emit(emit);
						},
						err => {
							this.loading = false;
							console.error('SA.register-wizard.location-info.component - submitPhone', err);
							this.feedback = 'Unable to edit user Phone information';
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

	getMyProfile() {
		this.studentService
			.getStudentById(
				this.user_id
			)
			.subscribe(
				(response: any) => {

					this.student = response.data;
					this.updateForm(response.data);
				},
				err => {
					console.error('SA.register-wizard.location-info.component - getMyProfile', err);
				}
			);
	}

	updateForm(student) {
		this.form.setValue({
			postalCode: student.address.postal_code || '',
			country: student.address.country || '',
			phone: student.phone.phone || '',
			countryCode: student.address.country_Code || '',
		});
	}

	onClickBack() {
		let emit = {
			message: 'BackLocationInfo',
			btnType: 'Back',
			role: this.role,
			type: this.type,
			user_Id: this.user_id,
		}

		this.saveEmitter.emit(emit);
	}
	
}
