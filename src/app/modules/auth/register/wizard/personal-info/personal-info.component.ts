import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserModel } from '../../../../shared/models/user.model';
import { UserService } from '../../../../shared/services/user.service';
import { GoogleAnalyticsEventsService } from '../../../../../modules/shared/services/ga.event.service';
import { StudentService } from '../../../../student/services/student.service';

@Component({
	selector: 'app-personal-info',
	templateUrl: './personal-info.component.html',
	styleUrls: ['./personal-info.component.css']
})

export class PersonalInfoComponent implements OnInit {

	@Input() user_id: string;
	@Input() type: string;
	@Input() role: string;
	@Input() student_Id: string;

	@Output() saveEmitter = new EventEmitter();

	user = new UserModel({});
	form: FormGroup;
	feedback = '';
	states: any[];
	dob_min_year: number;
	dob_max_year: number;
	months: string[];
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	ShowChildElement: boolean = true;

	constructor(
		private studentService: StudentService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
		private activatedRoute: ActivatedRoute,
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

		let today = new Date();
		this.dob_min_year = today.getFullYear() - 85;
		this.dob_max_year = today.getFullYear();
		this.form = new FormGroup({
			first_name: new FormControl( '', [Validators.required] ),
			last_name: new FormControl( '', [Validators.required] ),
			dob_year: new FormControl( '', [ Validators.min(this.dob_min_year), Validators.max(this.dob_max_year) ] ),
			dob_month: new FormControl( '', [ Validators.min(1), Validators.max(12) ] ),
			dob_day: new FormControl( '', [ Validators.min(1), Validators.max(31) ] )
		});
	}

	ngOnInit() {
		this.activatedRoute
			.params
			.subscribe(
				params => {
					this.role = params['role'];
				}
			);

		if (this.role == 'Parent' && this.type == 'Child') {
			this.ShowChildElement = true;
		} else if (this.role == 'Parent' && this.type == 'Parent') {
			this.ShowChildElement = false;
		} else if (this.role == 'Recruiter' || this.role == 'Teacher') {
			this.ShowChildElement = false;
		}

		if (this.type == 'Parent') {
			this.updateForm()
		}

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

	get formModel() {
		return {
			_id: this.user_id,
			first_name: this.form.get('first_name').value,
			last_name: this.form.get('last_name').value,
			dob: {
				year: this.form.get('dob_year').value,
				month: this.form.get('dob_month').value,
				day: this.form.get('dob_day').value,
			},
		};
	}

	submitForm() {

		let emit = {
			user_Id: this.user_id,
			student_id: '',
			message: 'PersonalInfoSuccess',
			btnType: 'Continue',
			role: this.role,
			type: this.type,
			childData: this.formModel
		}

		if (!this.loading) {
			this.loading = true;
			this.submitAttempted = true;
			this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'User Account Form', 20040);

			this.requestFailed = this.requestSuccess = false;
			if (this.form.valid) {

				if (this.type == 'Child') {

					this.saveEmitter.emit(emit);

				} else {
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
								this.form.reset();
								this.requestSuccess = true;

								let emit = {
									user_Id: this.user_id,
									student_id: '',
									message: 'PersonalInfoSuccess',
									btnType: 'Continue',
									role: this.role,
									type: this.type,
								}
								this.saveEmitter.emit(emit);
							},
							err => {
								console.error('SA.register-wizard.personal-info.component - formSubmit', err);
								this.loading = false;
								this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'User Account Form', 20240);
								this.feedback = 'Unable to update account information';
								this.requestFailed = true;
							}
						);
				}


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

	updateForm() {
		this.studentService
			.getStudentById(
				this.user_id
			)
			.subscribe(
				(response: any) => {
					const student: any = response.data;
					let dob_year: any, dob_month: any, dob_day: any;
					if (student.dob) {
						dob_year = student.dob.year ? student.dob.year : '';
						dob_month = student.dob.month ? student.dob.month : '';
						dob_day = student.dob.day ? student.dob.day : '';
					}
					this.form.setValue({
						first_name: student.first_name || '',
						last_name: student.last_name || '',
						dob_year: dob_year || '',
						dob_month: dob_month || '',
						dob_day: dob_day || '',
					});
				},
				err => {
					console.error('SA.register-wizard.school-info.component - updateForm', err);
				}
			);
	}

	onClickBack() {
		let emit = {
			message: 'BackPersonalInfo',
			btnType: 'Back',
			role: this.role,
			type: 'Parent',
			user_Id: this.user_id,
		}

		this.saveEmitter.emit(emit);
	}

}
