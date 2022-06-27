import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';
import {
	debounceTime,
	distinctUntilChanged,
	filter,
	map
} from 'rxjs/operators';

import { StudentService } from "../../../../../student/services/student.service";
import { EducationSchoolService } from "../../../../../student/services/education-school.service";
import { EducationModel } from "../../../../../student/models/education.model";

import {
	SchoolService,
	GoogleAnalyticsEventsService,
	LocationService,
	UserModel
} from '../../../../../shared/shared.module';

@Component({
	selector: 'app-update-education-school-modal',
	templateUrl: './update-education-school-modal.component.html',
	styleUrls: ['./update-education-school-modal.component.css']
})

export class UpdateESModalComponent implements OnInit {

	@Input() student_id: string;
	@Input() esid: string;

	student = new UserModel({});
	model = new EducationModel({});

	form: FormGroup;
	schools: any[];
	years: string[];
	states: any[];
	school_id: string;
	school_name: string;
	school_city: string;
	feedback = '';
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	loadingSchools = false;
	searchFailed = false;

	constructor(
		private studentService: StudentService,
		private esService: EducationSchoolService,
		private schoolService: SchoolService,
		private locationService: LocationService,
		private activeModal: NgbActiveModal,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		this.form = new FormGroup({
			school: new FormControl('', [Validators.required]),
			school_id: new FormControl('', [Validators.required]),
			state: new FormControl('', [Validators.required]),
			attended_from: new FormControl(''),
			attended_to: new FormControl(''),
			current: new FormControl('', [])
		});

		this.years = this.genYears();
		this.schools = [];
		this.school_id = '';
		this.school_name = '';
		this.school_city = '';
		this.states = this.locationService.getStates();
	}

	ngOnInit() {
		this.getMyProfile();
		this.respondToSchoolStateChange();
		this.respondToSchoolChange();
		this.form.get('current').valueChanges.subscribe(val => {
			if (val) {
				this.form.get('attended_to').setValue('');
				this.form.get('attended_to').disable();
			} else {
				this.form.get('attended_to').enable();
			}
		});
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			_id: this.esid,
			school_id: this.school_id,
			name: this.school_id ? this.school_name : '',
			city: this.school_city,
			state: this.form.get('state').value,
			attended_from: this.form.get('attended_from').value,
			attended_to: this.form.get('attended_to').value,
			current: this.form.get('current').value
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
					console.error(
						'SA.educationSchool.add-education-school-modal.component - getUser',
						err
					);
				}
			);
	}

	updateForm() {
		let es = this.student.education.find(e => {
			return e._id == this.esid;
		});

		this.school_id = es.school_id;
		this.school_name = es.name;
		this.school_city = es.city;
		this.form.setValue({
			school_id: es.school_id || '',
			school: es,
			state: es.state || '',
			attended_from: es.attended_from || '',
			attended_to: es.attended_to || '',
			current: es.current || ''
		});
	}

	respondToSchoolStateChange() {
		this.form.get('state').valueChanges.subscribe(val => {
			this.form.get('school').disable();
			this.loadingSchools = true;
			this.schoolService
				.getSchoolListByState(
					val
				)
				.subscribe(
					(response: any) => {
						this.loadingSchools = false;
						this.schools = response.data;
						this.form.get('school').enable();
						this.respondToSchoolChange();
					},
					err => {
						console.error(
							'SA.educationSchool.add-education-school-modal.component - getSchoolListByState',
							err
						);
					}
				);
		});
	}

	respondToSchoolChange() {
		this.form.get('school').valueChanges.subscribe(val => {
			let school = this.schools.find(s => s._id == val);
			if (!school) return;
			this.school_id = school._id || '';
			this.school_name = school.name;
			this.school_city = school.address.city;
		});
	}

	searchSchools = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			filter(term => term.length > 1),
			map(
				term =>
					this.schools
						.filter( s => s.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
						.slice(0, 10)
			)
		);

	selectedSchool = (e: any) => {
		const item = e.item;
		this.form.get('school_id').setValue(item._id);
		this.school_name = item.name;
		this.school_city = item.address.city;
	}

	formatMatches = (item: any) => {
		if (!item) return '';
		return item.name;
	}

	genYears() {
		const currentYear = new Date().getFullYear();
		const years = [];
		let startYear = currentYear - 20 || 2000;

		while (startYear <= currentYear + 1) {
			years.push(startYear++);
		}
		return years;
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
		if ( !this.loading) {
			this.loading = true;
			this.submitAttempted = true;
			this.requestFailed = this.requestSuccess = false;
			this.googleAnalyticsEventsService.emitEvent(
				'Public',
				'Form Submition',
				'Educational Info Form',
				18000
			);
			
			if (this.form.valid) {
				this.esService
					.updateStudentES(
						this.student_id,
						new EducationModel(this.formModel)
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.student = response.data;
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Educational Info Form',
								19100
							);
							this.feedback = 'Education information updated';
							//this.form.reset();
							this.requestSuccess = true;
								

							setTimeout(() => {
								//this.resetForm();
								this.activeModal.close(this.student);
							}, 2000);
						},
						err => {
							console.error(
								'SA.educationInfo.educationInfo-form.component - putUserEducation',
								err
							);
							this.loading = false;
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Educational Info Form',
								18200
							);
							this.feedback =
								'Unable to update education information';
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
			'Educational Info Form FormField: ' + this.form.get(fieldName),
			18300
		);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

}
