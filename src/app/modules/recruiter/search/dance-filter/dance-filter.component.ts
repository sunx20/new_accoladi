import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import { CatalogService, GoogleAnalyticsEventsService, LocationService, SchoolService, StateModel, UserModel, UserService } from '../../../../modules/shared/shared.module';
import { CollegePreferenceService } from '../../../../modules/student/services/college-preference.service';
import { TalentService } from '../../../../modules/student/services/talent.service';
import { ListService } from '../../../student/services/list.service';
import { RecruiterSearchModel } from '../../models/recruiter-search.model';
import { RecruiterService } from '../../services/recruiter.service';
import { StudentSearchLogService } from '../../services/student-search-log.service';


@Component({
	selector: 'app-dance-filter',
	templateUrl: './dance-filter.component.html'
})
export class DanceFilterComponent implements OnInit, OnChanges {

	@Input() page: number;
	@Input() pageSize: number;

	@Output() search: EventEmitter<any> = new EventEmitter();

	studentProfile = new UserModel({});
	model = new RecruiterSearchModel({});

	loc = location;
	recruiter: UserModel;
	states: StateModel[];
	grades: number[];
	types: string[];
	family: string[];
	eventsList: any[];
	events: string[];
	radiusList: number[];
	catalog: any[];
	instruments: any[];
	requiredFieldCount = 4;
	form: FormGroup;
	loading = false;
	submitAttempted = false;
	searchingCompositions = false;
	searchCompositionsFailed = false;
	searchingMajors = false;
	searchMajorsFailed = false;
	searchingEnsembles = false;
	searchEnsemblesFailed = false;
	searchingMilitary = false;
	searchMilitaryFailed = false;
	savingStudentId = '';
	savedStudentsList: any[];
	feedback = '';
	requestFailed = false;
	majorsList: any[];
	ensemblesList: any[];
	militaryList: any[];
	schools: any[];
	loadingSchools = false;
	searchFailed = false;
	school_id: string;
	school_name: string;
	school_city: string;
	showForm: Boolean = false;
	resetValue: boolean = false;
	isSearchLogSaved: boolean = false;
	styles = [
		{ id: 1, name: 'Jazz' },
		{ id: 2, name: 'Blues' },
		{ id: 3, name: 'Folk' },
		{ id: 4, name: 'Popular' },
		{ id: 5, name: 'Classical' },
		{ id: 6, name: 'Opera' },
		{ id: 7, name: 'Musical Theater' }
	];

	emphasis = [
		{ id: 1, name: 'Performance' },
		{ id: 2, name: 'Composition' },
		{ id: 3, name: 'Production' }
	];

	typeList = [
		{ id: "Variation ", name: 'Variation' },
		{ id: "Solo", name: 'Solo' },
		{ id: "Combo", name: 'Combo' },
		{ id: "Chorus", name: 'Chorus' },
		{ id: "Other", name: 'Other' },
	]

	constructor(
		private recruiterService: RecruiterService,
		private catalogService: CatalogService,
		private locationService: LocationService,
		private schoolService: SchoolService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		this.states = this.locationService.getStates();
		this.schools = [];
		this.school_id = '';
		this.school_name = '';
		this.school_city = '';
		this.types = [];
		this.family = [];
		this.radiusList = [10, 20, 50, 100, 150, 200, 500, 1000, 2000];
	}

	ngOnInit() {
		this.onInitLoad();
		this.search.emit('');		
		this.respondToSchoolStateChange();
		this.getProfile();
		setTimeout(() => {
			this.showForm = true;
		}, 3000);

		this.isSearchLogSaved = false;
	}

	get formDisabled() {
		if (this.showForm) {
			return this.loading === true;
		}
	}

	ngOnChanges() {
		if (!this.resetValue) {
			if (this.page) {
				this.submitForm();
			}
		}
	}

	onInitLoad() {
		this.form = new FormGroup({
			last_name: new FormControl(''),
			radius: new FormControl(''),
			school: new FormControl(''),
			school_id: new FormControl(''),
			state: new FormControl(''),
			type: new FormControl(null),
			piece_performed: new FormControl(''),
			company: new FormControl(''),
			show: new FormControl(''),
			role: new FormControl(''),
		});
	}

	getProfile() {
		this.recruiterService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.recruiter = response.data;
				},
				err => {
					console.error(
						'SA.recruiter.saved-searches.component - getUser',
						err
					);
				}
			);
	}

	buildEventsForm() {
		let formControlArr = this.events.map((e: any) => {
			return new FormControl(false);
		});

		return new FormArray(formControlArr);
	}

	searchCompositions = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			filter(term => term.length > 2),
			tap(() => (this.searchingCompositions = true)),
			switchMap(term =>
				this.catalogService
					.getCompositions(
						term
					)
					.pipe(
						map((res: any) => res.data),
						tap(() => (this.searchCompositionsFailed = false)),
						catchError(() => {
							this.searchCompositionsFailed = true;
							return of([]);
						})
					)
			),
			tap(() => {
				this.searchingCompositions = false;
			})
		)

	selectedComposition1 = (e: any) => {
		const item = e.item;
		this.form.get('composition1_id').setValue(item._id);
	}

	selectedComposition2 = (e: any) => {
		const item = e.item;
		this.form.get('composition2_id').setValue(item._id);
	}

	selectedComposition3 = (e: any) => {
		const item = e.item;
		this.form.get('composition3_id').setValue(item._id);
	}

	searchMajors = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			tap(() => (this.searchingMajors = true)),
			map(term =>
				this.majorsList
					.filter(
						s => s.toLowerCase().indexOf(term.toLowerCase()) > -1
					)
					.slice(0, 10)
			),
			tap(() => {
				this.searchingMajors = false;
			})
		)

	formatMajorMatches = (item: any) => {
		if (!item) {
			return '';
		}

		return item;
	}

	searchEnsembles = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			tap(() => (this.searchingEnsembles = true)),
			map(term =>
				this.ensemblesList
					.filter(
						s => s.toLowerCase().indexOf(term.toLowerCase()) > -1
					)
					.slice(0, 10)
			),
			tap(() => {
				this.searchingEnsembles = false;
			})
		)

	formatEnsembleMatches = (item: any) => {
		if (!item) {
			return '';
		}

		return item;
	}

	searchMilitary = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			tap(() => (this.searchingMilitary = true)),
			map(term =>
				this.militaryList
					.filter(
						s => s.toLowerCase().indexOf(term.toLowerCase()) > -1
					)
					.slice(0, 10)
			),
			tap(() => {
				this.searchingMilitary = false;
			})
		)

	formatMilitaryMatches = (item: any) => {
		if (!item) {
			return '';
		}

		return item;
	}

	resetForm() {
		this.isSearchLogSaved = false
		this.resetValue = true;
		this.form.reset({
			last_name: '',
			radius: '',
			school: '',
			school_id: '',
			state: '',
			type: '',
			piece_performed: '',
			company: '',
			show: '',
			role: '',
		});
		this.submitAttempted = false;
		this.search.emit('');
	}

	respondToSchoolStateChange() {
		this.form.get('state').valueChanges.subscribe(val => {
			if (val) {
				this.form.get('school').disable();
				this.loadingSchools = true;
				this.schoolService
					.getSchoolListByState(
						val
					)
					.subscribe(
						(response: any) => {
							this.schools = response.data;
							if (this.schools && this.schools.length > 0) {
								this.form.get('school').enable();
							}
							this.loadingSchools = false;
						},
						err => {
							console.error(
								'SA.recruiter-search-filter.component - getSchoolListByState',
								err
							);
						}
					);
			} else {
				this.schools = [];
			}
		});
	}

	respondToSchoolChange() {
		this.form.get('school').valueChanges.subscribe(val => {
			const school = this.schools.find(s => s._id == val);
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
				term =>
					this.schools
						.filter(
							s => s.name
								.toLowerCase()
								.indexOf(term.toLowerCase()) > -1
						)
						.slice(0, 10)
			)
		)

	selectedSchool = (e: any) => {
		const item = e.item;
		this.form.get('school_id').setValue(item._id);
		this.school_name = item.name;
		this.school_city = item.address.city;
	}

	submitForm() {
		this.resetValue = false;
		if (this.showForm) {
			this.loading = true;
			this.googleAnalyticsEventsService.emitEvent(
				'Public',
				'Form Submition',
				'Recruiter Search Form',
				28000
			);
			const timer = setTimeout(() => {
				if (this.loading) {
					this.requestFailed = true;
					this.feedback = 'There seems to be an issue getting your results - please try different search criteria - If the problem persists, please contact support';
					this.loading = false;
				}
			}, 10000);
			this.form;

			let body = {
				'last_name': this.form.value.last_name,
				'radius': this.form.value.radius,
				'state': this.form.value.state,
				'school': this.form.value.school,
				'piece': this.form.value.piece,
				'type': this.form.value.type,
				'company': this.form.value.company,
				'show': this.form.value.show,
				'role': this.form.value.role,
			}

			this.recruiterService
				.postDanceSearch(body, this.page, this.pageSize)
				.subscribe(
					(response: any) => {

						//const search = response.data;

						this.search.emit({
							search: response.data,
							total: response.total || response.data.length,
							//criteria: fm
						});
						this.loading = false;
						this.requestFailed = false;
						this.googleAnalyticsEventsService.emitEvent(
							'Public',
							'Form Submition',
							'Recruiter Search Form',
							28100
						);
						clearTimeout(timer);
					},
					(err) => {
						this.loading = false;
						console.error(
							'SA.recruiter.search.component - postStudentSearch',
							err
						);
						this.googleAnalyticsEventsService.emitEvent(
							'Public',
							'Form Submition',
							'Recruiter Search Form',
							28200
						);
					}
				);

		}
	}

}
