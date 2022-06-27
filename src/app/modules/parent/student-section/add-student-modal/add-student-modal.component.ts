import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GoogleAnalyticsEventsService, UserService, ValidateEmailNotTaken, UserModel } from '../../../../modules/shared/shared.module';
import { ParentService } from '../../services/parent.service';

import { StudentModel } from '../../../../modules/student/models/student.model';
import { UpgradeStudentModalComponent } from '../upgrade-student-modal/upgrade-student-modal.component';

@Component({
	selector: 'app-add-student-modal',
	templateUrl: './add-student-modal.component.html'
})

export class AddStudentPModalComponent implements OnInit {

	@Input() parent_id: string;
	@Output() addStudentSucess = new EventEmitter();

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
	months: string[];
	graduation_year: number;
	receivedChildMessage: any;
	requirePaymentForNewStudent: boolean;

	constructor(
		private parentService: ParentService,
		private userService: UserService,
		public activeModal: NgbActiveModal,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
		private modalService: NgbModal,
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
			email: new FormControl(
				'',
				[Validators.required, Validators.email],
				ValidateEmailNotTaken.createValidator(this.userService)
			),
			dob_year: new FormControl('', [
				Validators.min(this.dob_min_year),
				Validators.max(this.dob_max_year)
			]),
			dob_month: new FormControl('', [
				Validators.min(1),
				Validators.max(12)
			]),
			dob_day: new FormControl('', [
				Validators.min(1),
				Validators.max(31)
			]),
			sponsor: new FormControl(true),
			use_address: new FormControl(true),
			use_phone: new FormControl(true),
			graduation_year: new FormControl('', [
				Validators.min(2000),
				Validators.max(2100)
			])
		});
	}

	ngOnInit() {
		this.requirePaymentForNewStudent = false;
		this.parentService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.parent = response.data;
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
			first_name: this.form.get('first_name').value,
			middle_name: this.form.get('middle_name').value,
			last_name: this.form.get('last_name').value,
			username: this.form.get('username').value,
			email: this.form.get('email').value,
			dob: {
				year: this.form.get('dob_year').value,
				month: this.form.get('dob_month').value,
				day: this.form.get('dob_day').value
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
			this.googleAnalyticsEventsService.emitEvent(
				'Public',
				'Form Submition',
				'Add Student Form',
				22000
			);

			this.submitAttempted = true;
			this.requestFailed = this.requestSuccess = false;

			if (this.form.valid) {
				this.parentService
					.addStudent(
						this.parent_id, 
						new StudentModel(this.formModel)
					)
					.subscribe(
						(response: any) => {
							if ( this.requirePaymentForNewStudent ) { // This is a catch - to keep code that should be user IF we require payment
								const modalRef = this.modalService
													.open(
														UpgradeStudentModalComponent, 
														{ size: 'lg' }
													);

								modalRef.componentInstance
										.closeSubscription
										.subscribe(
											result => {
												if (result) {
													this.feedback = 'Student added successfully';
													//this.form.reset();
													this.requestSuccess = true;
													setTimeout(() => {
														this.activeModal.close();
													}, 2000);
												}
											}
										);

								modalRef.componentInstance.currentStudent = response.data.pop();

								modalRef.result
										.then(
											(result: any) => {
												this.loading = false;
												this.googleAnalyticsEventsService.emitEvent(
													'Public',
													'Form Submition',
													'Add Student Form',
													22100
												);
												this.feedback = 'Student added successfully';
												this.requestSuccess = true;
												this.addStudentSucess.emit(result);
												setTimeout(() => {
													this.activeModal.close();
												}, 2000);
											},
											reason => {}
										);
							} else {
								this.loading = false;
								this.googleAnalyticsEventsService.emitEvent(
									'Public',
									'Form Submition',
									'Add Student Form',
									22100
								);
								this.feedback = 'Student added successfully';
								this.requestSuccess = true;
								setTimeout(() => {
									this.activeModal.close();
								}, 2000);
							}
						},
						err => {
							this.loading = false;
							console.error('SA.studentSection.studentSection-form.component - putNewStudent', err);
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Add Student Form',
								22200
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
			'Form Field: ' + this.form.get(fieldName),
			19300
		);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

}
