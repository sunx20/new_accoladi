import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';
import {
	debounceTime,
	distinctUntilChanged,
	filter,
	map
} from 'rxjs/operators';


import { StudentService } from '../../../../../student/services/student.service';
import { EducationSchoolService } from '../../../../../student/services/education-school.service';
import { EducationModel } from '../../../../../student/models/education.model';

import {
	SchoolService,
	GoogleAnalyticsEventsService,
	LocationService,
	UserModel
} from '../../../../../shared/shared.module';
import { NewEducationSchoolModelComponent } from '../new-education-school-model/new-education-school-model.component';

@Component({
	selector: 'app-add-education-school-modal',
	templateUrl: './add-education-school-modal.component.html',
	styleUrls: ['./add-education-school-modal.component.css']
})

export class AddESModalComponent implements OnInit {

	@Input() student_id: string;

	student = new UserModel({});
	model = new EducationModel({});
	schools: any[];
	years: string[];
	states: any[];
	school_id: string;
	school_name: string;
	school_city: string;
	form: FormGroup;
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';
	loadingSchools = false;
	searchFailed = false;
	noresult = false;

	constructor(
		private studentService: StudentService,
		private esService: EducationSchoolService,
		private schoolService: SchoolService,
		private locationService: LocationService,
		private activeModal: NgbActiveModal,
		private router: Router,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
		private modalService: NgbModal,
	) {
		this.form = new FormGroup({
			school: new FormControl({ value: '', disabled: true }, [Validators.required]),
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
		this.studentService.getStudentById(this.student_id).subscribe(
			(response: any) => {
				this.student = response.data;
			},
			err => {
				console.error( 'SA.educationSchool.add-education-school-modal.component - getUser', err );
			}
		);

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
			school_id: this.form.get('school_id').value,
			name: this.form.get('school_id').value ? this.school_name : '',
			city: this.school_city,
			state: this.form.get('state').value,
			attended_from: this.form.get('attended_from').value,
			attended_to: this.form.get('attended_to').value,
			current: this.form.get('current').value
		};
	}

	respondToSchoolStateChange() {
		this.form.get('state').valueChanges.subscribe(val => {
			this.form.get('school').disable();
			this.loadingSchools = true;

			this.schoolService.getSchoolListByState(val).subscribe(
				(response: any) => {
					this.schools = response.data;
					if (this.schools && this.schools.length > 0) {
						this.form.get('school').enable();
					}
					this.loadingSchools = false;
				},
				err => {
					console.error( 'SA.educationSchool.add-education-school-modal.component - getSchoolListByState', err );
				}
			);
		});
	}

	respondToSchoolChange() {
		this.form.get('school').valueChanges.subscribe(val => {
			let school = this.schools.find(s => s._id == val);
			if (school && school._id) {
				this.school_id = school._id;
				this.school_name = school.name;
				this.school_city = school.address.city;
			}
		});
	}

	searchSchools = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			filter(term => term.length > 1),
			map(
				term => {
					let selectedSchools = this.schools.filter(s => s.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)

					if (selectedSchools.length < 1) {
						this.noresult = true;
					} else {
						this.noresult = false;
					}
					return selectedSchools;
				}
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
		if (!this.loading) {
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
					.createStudentES(
						this.student_id,
						new EducationModel(this.formModel)
					)
					.subscribe(
						(response: any) => {
							this.student = response.data;
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Educational Info Form',
								19100
							);
							this.feedback = 'Education information added';
							this.requestSuccess = true;
							setTimeout(() => {
								this.loading = false;
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
							this.feedback = 'Unable to add education information';
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

	addSchool() {
		let modalRef = this.modalService.open(NewEducationSchoolModelComponent, {
			size: 'lg',
			backdrop: 'static',
			keyboard: false
		});
		modalRef.componentInstance.state = this.form.get('state').value;
		modalRef.result
				.then(
				school => {
					this.form.get('school').setValue(school);
					this.form.get('school_id').setValue(school._id);
					this.form.get('state').setValue(school.address.state);
					this.school_name = school.name;
					this.school_city = school.address.city;
				},
				reason => { }
			);

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
