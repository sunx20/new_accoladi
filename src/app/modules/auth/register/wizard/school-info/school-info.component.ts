import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { Observable } from "rxjs";

import { UserModel } from '../../../../shared/models/user.model';

import {
	debounceTime,
	distinctUntilChanged,
	filter,
	map,
} from "rxjs/operators";

import { SchoolService } from '../../../../../modules/shared/services/school.service';
import { LocationService } from '../../../../../modules/shared/services/location.service';
import { EducationSchoolService } from '../../../../student/services/education-school.service';
import { GoogleAnalyticsEventsService } from '../../../../../modules/shared/services/ga.event.service';
import { NewEducationSchoolModelComponent } from '../../../../shared/components/education/education-school/new-education-school-model/new-education-school-model.component';
import { CollegeService } from '../../../../../modules/shared/services/college.service';
import { StudentService } from '../../../../student/services/student.service';


@Component({
	selector: 'app-school-info',
	templateUrl: './school-info.component.html',
	styleUrls: ['./school-info.component.css']
})

export class SchoolInfoComponent implements OnInit {

	@Input() user_id: string;
	@Input() student_Id: string;
	@Input() type: string;
	@Input() msg: string;
	@Input() role: string;

	@Output() saveEmitter = new EventEmitter();

	student = new UserModel({});
	schools: any[];
	colleges: any[];
	years: string[];
	states: any[];
	school_id: string;
	school_name: string;
	school_city: string;
	college_id: string;
	college_name: string;
	college_city: string;
	form: FormGroup;
	feedback = '';
	btnName: string;
	onClickCheckBox: boolean = true;
	submitAttempted: boolean = false;
	loading: boolean = false;
	requestFailed: boolean = false;
	requestSuccess: boolean = false;
	loadingSchools: boolean = false;
	loadingColleges: boolean = false;
	searchFailed: boolean = false;
	noresult: boolean = false;
	dob_min_year: number;
	dob_max_year: number;

	constructor(
		private studentService: StudentService, 
		public schoolService: SchoolService, 
		public collegeService: CollegeService, 
		private modalService: NgbModal, 
		private locationService: LocationService, 
		private esService: EducationSchoolService, 
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
	) {
		let today = new Date();
		this.form = new FormGroup({
			state: new FormControl( '', [Validators.required]),
			school: new FormControl( { value: '' }, [Validators.required]),
			school_id: new FormControl( '', [Validators.required]),
			college: new FormControl( { value: '', disabled: true }),
			college_id: new FormControl( ''),
			agree: new FormControl( ''),
			attended_from: new FormControl( ''),
			attended_to: new FormControl( '' ),
			current: new FormControl( true, [] ),
			city: new FormControl( '', [] ),
			graduation_year: new FormControl( '',  [ Validators.min( this.dob_min_year ), Validators.max( this.dob_max_year) ]),
			title: new FormControl( '', [] ),
			discipline: new FormControl( '', [] ),
			faculty_url: new FormControl( '', [] ),
			// promo: new FormControl( '' ),
		});
		this.states = this.locationService.getStates();
		this.dob_min_year = today.getFullYear() - 85;
		this.dob_max_year = today.getFullYear();
		this.years = this.genYears();
		this.schools = [];
		this.school_id = '';
		this.school_name = '';
		this.school_city = '';
		this.states = this.locationService.getStates();
	}

	ngOnInit() {

		if (this.role == 'Parent' || this.role == 'Teacher') {
			this.btnName = 'Finish'
		} else {
			this.btnName = 'Continue'
		}

		if (this.role == 'Recruiter') {
			this.form.get('college').setValidators([Validators.required]);
			this.form.get('college').updateValueAndValidity();
			this.form.get('school').clearValidators();
			this.form.get('school').updateValueAndValidity();
			this.form.get('school_id').clearValidators();
			this.form.get('school_id').updateValueAndValidity();
			this.respondToCollegeStateChange();
		} else {
			this.respondToSchoolStateChange();
		}

		if (this.role == 'Teacher') {
			this.form.get('state').clearValidators();
			this.form.get('state').updateValueAndValidity();
			this.form.get('school').clearValidators();
			this.form.get('school').updateValueAndValidity();
			this.form.get('school_id').clearValidators();
			this.form.get('school_id').updateValueAndValidity();
		}
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
			role: this.role,
			school_id: this.form.get('school_id').value,
			name: this.form.get('school_id').value ? this.school_name : '',
			city: this.school_city,
			state: this.form.get('state').value,
			graduation_year: this.form.get('graduation_year').value,
			attended_from: this.form.get('attended_from').value,
			attended_to: this.form.get('attended_to').value,
			current: this.form.get('current').value
		};
	}

	get recruiterFormModel() {
		return {
			role: this.role,
			school_id: this.form.get('college_id').value,
			name: this.form.get('college_id').value ? this.college_name : '',
			state: this.form.get('state').value,
			title: this.form.get('title').value,
			discipline: this.form.get('discipline').value,
			faculty_url: this.form.get('faculty_url').value,
			agree: this.form.get('agree').value,
		};
	}

	get teacherFormModel() {
		return {
			role: this.role,
			school_id: this.form.get('school_id').value,
			name: this.form.get('school_id').value ? this.school_name : '',
			title: this.form.get('title').value,
			attended_from: this.form.get('attended_from').value,
			city: this.form.get('city').value,
		};
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
						console.error('SA.register-wizard.school-info.component - respondToSchoolStateChange', err );
					}
				);
		});
	}

	respondToCollegeStateChange() {
		this.form.get('state').valueChanges.subscribe(val => {
			this.form.get('college').disable();
			this.loadingColleges = true;
			this.collegeService
				.getCollegeListByState(
					val
				)
				.subscribe(
					(response: any) => {
						this.colleges = response.data;
						if (this.colleges && this.colleges.length > 0) {
							this.form.get('college').enable();
						}
						this.loadingColleges = false;
						this.respondToCollegeChange();
					},
					err => {
						console.error('SA.register-wizard.school-info.component - respondToCollegeStateChange', err);
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

	respondToCollegeChange() {
		this.form.get('college').valueChanges.subscribe(val => {
			let college = this.colleges.find(s => s._id == val);
			if (college && college._id) {
				this.college_id = college._id;
				this.college_name = college.name;
				this.college_city = college.address.city;
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

	searchColleges = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			filter(term => term.length > 1),
			map(
				term => {
					let selectedColleges = this.colleges.filter(s => s.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)

					if (selectedColleges.length < 1) {
						this.noresult = false;
					} else {
						this.noresult = false;
					}
					return selectedColleges;
				}
			)
		);

	selectedSchool = (e: any) => {
		const item = e.item;
		this.form.get('school_id').setValue(item._id);
		this.school_name = item.name;
		this.school_city = item.address.city;
	}

	selectedCollege = (e: any) => {
		const item = e.item;
		this.form.get('college_id').setValue(item._id);
		this.college_name = item.name;
		this.college_city = item.address.city;
	}

	formatMatches = (item: any) => {
		if (!item) return '';
		return item.name;
	}

	fieldsChange(values: any) {
		console.log(values.currentTarget.checked);
		this.onClickCheckBox = !values.currentTarget.checked
		this.form.get('agree').setValue(values.currentTarget.checked)
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
			let model: any;
			if (this.role == 'Recruiter') {
				model = this.recruiterFormModel
			} else if (this.role == 'Teacher') {
				model = this.teacherFormModel
			} else {
				model = this.formModel
			}
			if (this.form.valid) { console.log('valid form -> model', model);
				this.esService
					.createStudentES( 
						this.user_id, 
						model 
					)
					.subscribe( 
						(response: any) => { console.log('student ES servce -> ', response.data);
							this.student = response.data;
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Educational Info Form',
								19100
							);
							this.feedback = 'Education information added';
							this.requestSuccess = true;
							let emit = {
								user_Id: this.user_id,
								student_id: '',
								message: 'SchoolInfoSuccess',
								btnType: 'Continue',
								role: this.role,
								type: this.type,
							}
							this.saveEmitter.emit(emit);
						},
						err => {
							console.error( 'SA.register-wizard.school-info.component - putUserEducation', err );
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
		let modalRef = this.modalService
							.open(
								NewEducationSchoolModelComponent, 
								{
									size: 'lg',
									backdrop: 'static',
									keyboard: false
								}
							);
		modalRef.componentInstance.state = this.form.get('state').value;
		modalRef.result
				.then(
					school => {
						this.form.get('school').setValue(school);
						this.form.get('school_id').setValue(school._id);
						this.form.get('state').setValue(school.address.state);
						this.form.get('state').setValue(school.address.state);
						this.form.get('city').setValue(school.address.city);
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

	onClickBack() {
		let emit = {
			message: 'BackSchoolInfor',
			btnType: 'Back',
			role: this.role,
			type: this.type,
			user_Id: this.user_id,
		}

		this.saveEmitter.emit(emit);
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
					console.error( 'SA.register-wizard.school-info.component - getMyProfile', err );
				}
			);
	}

	updateForm(student) {

		if (student.education.length > 0) {
			this.school_id = student.education[0].school_id;
			this.school_name = student.education[0].name;
			this.school_city = student.education[0].city;
			this.form.setValue({
				agree: '',
				college_id: '',
				discipline: '',
				faculty_url: '',
				graduation_year: student.graduation_year,
				title: '',
				college: '',
				city: student.education[0].city || '',
				school_id: student.education[0].school_id || '',
				school: student.education[0].name,
				state: student.education[0].state || '',
				attended_from: student.education[0].attended_from || '',
				attended_to: student.education[0].attended_to || '',
				current: student.education[0].current || ''
			});
		}

	}

}