import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StudentService } from '../../../../../student/services/student.service';
import { MusicalClassService } from '../../../../../student/services/musical-class.service';
import { MusicalClassModel } from '../../../../../student/models/musical-class.model';

import {
	GoogleAnalyticsEventsService,
	UserModel,
	CustomValidators
} from '../../../../../shared/shared.module';

@Component({
	selector: 'app-update-musical-class-modal',
	templateUrl: './update-musical-class-modal.component.html'
})

export class UpdateMusicalClassModalComponent implements OnInit {

	@Input() student_id: string;

	student = new UserModel({});
	model = new MusicalClassModel({});

	form: FormGroup;
	feedback = '';
	classesList: string[];
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	searchingCompositions = false;
	searchFailed = false;

	constructor(
		private studentService: StudentService,
		private mcService: MusicalClassService,
		public activeModal: NgbActiveModal,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		this.classesList = [
			'Theory 1',
			'Theory 2',
			'Theory AP',
			'History 1',
			'History 2',
			'History AP',
			'Harmony',
			'Composition',
			'Arranging',
			'Song Writing',
			'Solfege',
		];

		this.form = new FormGroup({
			musical_classes: new FormArray(this.classesList.map(mc => {
				return new FormControl(false);
			}), CustomValidators.multipleCheckboxRequireOne)
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
			musical_classes: this.form.get('musical_classes').value,
		};
	}

	getMyProfile() {
		this.studentService
			.getStudentById(
				this.student_id
			)
			.subscribe(
				(response: any) => {
					this.student = response.data;
					this.updateForm();
				},
				err => {
					console.error('SA.musicalClassHistory.add-musical-class-modal.component - getMyProfile', err);
				}
			);
	}

	updateForm() {
		let musical_classes =  this.classesList.map(mc => {
			return this.student.musical_classes.indexOf(mc) < 0 ? false : true;
		});

		this.form.setValue({
			musical_classes
		});
	}

	resetForm() {
		this.submitAttempted = false;
		this.loading = false;
		this.form.reset();
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
			this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Musical Class Form', 20030);
			this.requestFailed = this.requestSuccess = false;

			let fm = Object.assign({}, this.formModel);
			let tempMC = fm.musical_classes.map((e, index) => {
				return e ? this.classesList[index] : null;
			}).filter(e => e);
			fm.musical_classes = tempMC;

			if (this.form.valid) {
				this.mcService
					.updateStudentMCs(
						this.student_id, 
						new MusicalClassModel(fm)
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.student = response.data;
							this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Musical Class Form', 20130);
							this.feedback = 'Musical class information updated';
							this.requestSuccess = true;	
							setTimeout(() => {
								//this.resetForm();
								this.activeModal.close(this.student);
							}, 2000);
						},
						err => {
							this.loading = false;
							console.error('SA.musicalClassHistory.add-musical-class-modal.component - createStudentMC', err);
							this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Musical Class Form', 20230);
							this.feedback = 'Unable to update musical class information';
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

	validateAllFormFields(formGroup: FormGroup | FormArray) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl || control instanceof FormArray) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	isFieldInvalid(fieldName: string) {
		const field = this.form.get(fieldName);
		this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Musical Class Form FormField: ' + this.form.get(fieldName), 20330);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

}