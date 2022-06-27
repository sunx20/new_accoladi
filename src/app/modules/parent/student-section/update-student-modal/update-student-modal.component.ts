import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { GoogleAnalyticsEventsService, UserModel } from '../../../../modules/shared/shared.module';
import { StudentService } from '../../../../modules/student/services/student.service';

import { StudentModel } from '../../../../modules/student/models/student.model';
import { ParentService } from '../../services/parent.service';

@Component({
	selector: 'app-update-student-modal',
	templateUrl: './update-student-modal.component.html'
})

export class UpdateStudentPModalComponent implements OnInit {

	@Input() parent_id: string;
	@Input() student_id: string;

	form: FormGroup;
	parent = new UserModel({});
	model = new StudentModel({});
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';
	dob_min_year: number;
	dob_max_year: number;
	months: string [];
	graduation_year: number;

	constructor(
		private parentService: ParentService,
		private studentService: StudentService,
		public activeModal: NgbActiveModal,
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
		const today = new Date();
		this.dob_min_year = today.getFullYear() - 85;
		this.dob_max_year = today.getFullYear();
		this.form = new FormGroup({
			first_name: new FormControl('', [Validators.required]),
			middle_name: new FormControl(''),
			last_name: new FormControl('', [Validators.required]),
			username: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			dob_year: new FormControl('', [
				Validators.min(this.dob_min_year),
				Validators.max(this.dob_max_year)]),
			dob_month: new FormControl('', [
				Validators.min(1),
				Validators.max(12)]),
			dob_day: new FormControl('', [
				Validators.min(1),
				Validators.max(31)]),
			sponsor: new FormControl(true),
			use_address: new FormControl(true),
			use_phone: new FormControl(true),
			graduation_year: new FormControl(true)
		});

	}

	ngOnInit() {
		this.parentService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.parent = response.data;
					this.updateForm();
				},
				err => {
					console.error('SA.studentSection.studentSection-form.component - getUser', err);
				}
			);
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			_id: this.student_id,
			first_name: this.form.get('first_name').value,
			middle_name: this.form.get('middle_name').value,
			last_name: this.form.get('last_name').value,
			username: this.form.get('username').value,
			email: this.form.get('email').value,
			dob: {
				year: this.form.get('dob_year').value,
				month: this.form.get('dob_month').value,
				day: this.form.get('dob_day').value,
			},
			sponsor: this.form.get('sponsor').value,
			use_address: this.form.get('use_address').value,
			use_phone: this.form.get('use_phone').value,
			graduation_year: this.form.get('graduation_year').value,
		};
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.form.controls;
	}

	updateForm() {
		this.studentService
			.getStudentById(
				this.student_id
			)
			.subscribe(
				(response: any) => {
					const student: StudentModel = response.data;
					let dob_year: any, dob_month: any , dob_day: any;
					if (student.dob) {
						dob_year = student.dob.year ? student.dob.year : '';
						dob_month = student.dob.month ? student.dob.month : '';
						dob_day = student.dob.day ? student.dob.day : '';
					}
					this.form.setValue({
						first_name: student.first_name || '' ,
						middle_name: student.middle_name || '',
						last_name: student.last_name || '',
						username: student.username || '',
						email: student.email || '',
						dob_year: dob_year || '',
						dob_month: dob_month || '',
						dob_day: dob_day || '',
						sponsor: student.sponsor || true,
						use_address: student.use_address || true,
						use_phone: student.use_phone || true,
						graduation_year: student.graduation_year || '',
					});
				},
				err => {
					console.error('SA.studentSection.studentSection-form.component - getUser', err);
				}
			);
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
			this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Update Student Form', 22000);
			this.submitAttempted = true;
			this.requestFailed = this.requestSuccess = false;

			if (this.form.valid) {
				this.parentService
					.updateStudent(
						this.parent_id,
						new StudentModel(this.formModel)
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Update Student Form', 22100);
							this.feedback = 'Student updated successfully';
							//this.form.reset();
							this.requestSuccess = true;
							setTimeout(() => {
								//this.resetForm();
								this.activeModal.close(response.data);
							}, 2000);
						},
						err => {
							this.loading = false;
							console.error('SA.studentSection.studentSection-form.component - updateStudent', err);
							this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Update Student Form', 22200);
							this.feedback = 'Unable to update student';
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
		this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Form Field: ' + this.form.get(fieldName), 19300);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

}
