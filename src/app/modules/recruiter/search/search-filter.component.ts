import { Component, EventEmitter, OnChanges, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import { CatalogService, GoogleAnalyticsEventsService, LocationService, SchoolService, StateModel, UserModel } from '../../../modules/shared/shared.module';
import { CollegePreferenceService } from '../../../modules/student/services/college-preference.service';
import { TalentService } from '../../../modules/student/services/talent.service';
import { ListService } from '../../student/services/list.service';
import { RecruiterSearchModel } from '../models/recruiter-search.model';
import { RecruiterService } from '../services/recruiter.service';
import { StudentSearchLogService } from '../services/student-search-log.service';
import { CreateSearchModalComponent } from './create-search-modal/create-search-modal.component';

@Component({
	selector: 'app-search-filter',
	templateUrl: './search-filter.component.html'
})

export class SearchFilterComponent implements OnInit, OnChanges {

	@Input() page: number;
	@Input() pageSize: number;

	@Output() search: EventEmitter<any> = new EventEmitter();

	studentProfile = new UserModel({});
	model = new RecruiterSearchModel({});
	recruiter: UserModel;
	states: StateModel[];
	form: FormGroup;
	grades: number[];
	types: string[];
	family: string[];
	eventsList: any[];
	events: string[];
	radiusList: number[];
	catalog: any[];
	instruments: any[];
	loc = location;
	requiredFieldCount = 4;
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
	public advancedSearch: boolean = false;
	public buttonName: any = 'Show Advanced Search Criteria';

	constructor(
		private recruiterService: RecruiterService,
		private catalogService: CatalogService,
		private talentService: TalentService,
		private locationService: LocationService,
		private schoolService: SchoolService,
		private cpService: CollegePreferenceService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
		private modalService: NgbModal,
		private listService: ListService,
		private studentSLService: StudentSearchLogService,
	) {
		this.majorsList = this.cpService.getCollegeMajors();
		this.ensemblesList = this.cpService.getCollegeEnsembles();
		this.militaryList = this.cpService.getCollegeMilitaryEnsembles();
		this.catalog = [];
		this.instruments = [];
		this.states = this.locationService.getStates();
		this.schools = [];
		this.school_id = '';
		this.school_name = '';
		this.school_city = '';
		this.types = [];
		this.family = [];
		this.eventsList = [];
		this.events = [].concat.apply([], this.eventsList);
		this.grades = [];
		this.radiusList = [10, 20, 50, 100, 150, 200, 500, 1000, 2000];
	}

	ngOnInit() {
		this.listService
			.getPerformanceCategories()
			.subscribe(
				(response: any) => {
					this.types = response.data;
				},
				err => {
					console.error('SA.search-filter.component - getFamiliesList', err);
				}
			);

		this.listService
			.getFamiliesList()
			.subscribe(
				(response: any) => {
					this.family = response.data;
				},
				err => {
					console.error('SA.search-filter.component - getFamiliesList', err);
				}
			);

		this.listService
			.getGrades()
			.subscribe(
				(response: any) => {
					this.grades = response.data;
				},
				err => {
					console.error('SA.search-filter.component - getGrades', err);
				}
			);

		this.listService
			.getEvents()
			.subscribe(
				(response: any) => {
					this.eventsList = response.data;
					this.events = [].concat.apply([], this.eventsList);
					this.onInitLoad();
					this.search.emit('');
					this.respondToFamilyChange();
					this.respondToSchoolStateChange();
					this.getProfile();
					this.recruiterService
						.eventSubscription
						.subscribe(
							(event: any) => {
								if (event && event.type === 'rerun-recruiter-saved-search') {
									let form = JSON.parse(event.data.form_criteria);
									this.updateForm(form);
								}
							}
						);
					setTimeout(() => {
						this.showForm = true;
					}, 3000);
				},
				err => {
					console.error('SA.search-filter.component - getEvents', err);
				}
			);
		this.isSearchLogSaved = false;
	}

	toggle() {
		this.advancedSearch = !this.advancedSearch;
	
		// CHANGE THE NAME OF THE BUTTON.
		if (this.advancedSearch) {
			this.buttonName = 'Hide Advanced Search Criteria';
		} else {
			this.buttonName = 'Show Advanced Search Criteria';
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
			composition1_id: new FormControl( '' ),
			composition1: new FormControl( '' ),
			composition2_id: new FormControl( '' ),
			composition2: new FormControl( '' ),
			composition3_id: new FormControl( '' ),
			composition3: new FormControl( '' ),
			composition2opt: new FormControl( 'OR' ),
			composition3opt: new FormControl( 'OR' ),
			major1: new FormControl( '' ),
			major2: new FormControl( '' ),
			major3: new FormControl( '' ),
			major2opt: new FormControl( 'OR' ),
			major3opt: new FormControl( 'OR' ),
			ensemble1: new FormControl( '' ),
			ensemble2: new FormControl( '' ),
			ensemble3: new FormControl( '' ),
			ensemble2opt: new FormControl( 'OR' ),
			ensemble3opt: new FormControl( 'OR' ),
			military1: new FormControl( '' ),
			military2: new FormControl( '' ),
			military3: new FormControl( '' ),
			military2opt: new FormControl( 'OR' ),
			military3opt: new FormControl( 'OR' ),
			family: new FormControl( '' ),
			instrument: new FormControl( '' ),
			state: new FormControl( '' ),
			school_grade: new FormControl( '' ),
			events: this.buildEventsForm(),
			hpopt: new FormControl( 'All' ),
			last_name: new FormControl( '' ),
			radius: new FormControl( '' ),
			school: new FormControl( '' ),
			school_id: new FormControl( '' ),
			styles: new FormArray([]),
			emphasis: new FormArray([]),
		});

		this.form.get('composition2opt').setValue('OR');
		this.form.get('composition3opt').setValue('OR');
		this.form.get('major2opt').setValue('OR');
		this.form.get('major3opt').setValue('OR');
		this.form.get('ensemble2opt').setValue('OR');
		this.form.get('ensemble3opt').setValue('OR');
		this.form.get('military2opt').setValue('OR');
		this.form.get('military3opt').setValue('OR');
		this.form.get('hpopt').setValue('All');
		this.addCheckboxesStyles();
		this.addCheckboxesEmphasis();
	}

	private addCheckboxesStyles() {
		this.styles.map((o, i) => {
			const control = new FormControl(i === -1); // if first item set to true, else false
			(this.form.controls.styles as FormArray).push(control);
		});
	}

	private addCheckboxesEmphasis() {
		this.emphasis.map((o, i) => {
			const control = new FormControl(i === -1); // if first item set to true, else false
			(this.form.controls.emphasis as FormArray).push(control);
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
				this.catalogService.getCompositions(term).pipe(
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

	formatCompositionMatches = (item: any) => {
		if (!item) {
			return '';
		}
		const composers =
			item.composers && item.composers.length > 0
				? ' / ' + item.composers.join(', ')
				: '';
		const inst_group =
			item.instrument && item.instrument.group
				? ' / ' + item.instrument.group
				: '';
		const inst_name =
			item.instrument && item.instrument.name
				? ' / ' + item.instrument.name
				: '';
		const second_line =
			inst_group && inst_name ? '\n' + inst_group + inst_name : '';
		const name = item.title + composers + second_line;

		return name;
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

	respondToFamilyChange() {
		this.form.get('family').valueChanges.subscribe(val => {
			!val
				? ''
				: this.talentService
					.getTalentByFamily(
						val
					)
					.subscribe(
						(response: any) => {
							this.instruments = response.data;
							if (
								!this.instruments.find(
									i =>
										i.name ===
										this.form.get('instrument').value
								)
							) {
								this.form.get('instrument').setValue('');
							}
						}
					);
		});
	}

	updateForm(form: any) {
		this.majorsList.push(form.major1, form.major2, form.major3);
		this.ensemblesList.push(form.ensemble1, form.ensemble2, form.ensemble3);
		this.militaryList.push(form.military1, form.military2, form.military3);
		this.form.setValue({
			composition1_id: form.composition1_id || '',
			composition2_id: form.composition2_id || '',
			composition3_id: form.composition3_id || '',
			composition1: form.composition1 || '',
			composition2: form.composition2 || '',
			composition3: form.composition3 || '',
			composition2opt: form.composition2opt || '',
			composition3opt: form.composition3opt || '',
			major1: form.major1 || '',
			major2: form.major2 || '',
			major3: form.major3 || '',
			major2opt: form.major2opt,
			major3opt: form.major3opt,
			ensemble1: form.ensemble1 || '',
			ensemble2: form.ensemble2 || '',
			ensemble3: form.ensemble3 || '',
			ensemble2opt: form.ensemble2opt,
			ensemble3opt: form.ensemble3opt,
			military1: form.military1 || '',
			military2: form.military2 || '',
			military3: form.military3 || '',
			military2opt: form.military2opt,
			military3opt: form.military3opt,
			family: form.family || '',
			instrument: form.talent || '',
			events: form.events || '',
			hpopt: form.hpopt || '',
			state: form.state || '',
			school_grade: form.school_grade || '',
			last_name: form.last_name || '',
			radius: form.radius || '',
			school: form.school || '',
			school_id: form.school_id || '',
			styles: form.styles || '',
			emphasis: form.emphasis || '',
		});

		this.submitForm();
	}

	resetForm() {
		this.isSearchLogSaved = false
		this.resetValue = true;
		this.form.reset({
			instrument: '',
			family: '',
			state: '',
			school_grade: '',
			last_name: '',
			radius: '',
			school: '',
			hpopt: 'All',
			composition2opt: 'OR',
			composition3opt: 'OR',
			major2opt: 'OR',
			major3opt: 'OR',
			ensemble2opt: 'OR',
			ensemble3opt: 'OR',
			military2opt: 'OR',
			military3opt: 'OR'
		});
		this.submitAttempted = false;
		this.search.emit('');
	}

	get formDisabled() {
		if (this.showForm) {
			return this.loading === true;
		}
	}

	get formModel() {
		if (this.showForm) {
			let composition1_id = this.form.get('composition1').value
				? this.form.get('composition1_id').value
				: '';
			let composition2_id = this.form.get('composition2').value
				? this.form.get('composition2_id').value
				: '';
			let composition3_id = this.form.get('composition3').value
				? this.form.get('composition3_id').value
				: '';

			return {
				composition1_id: composition1_id,
				composition2_id: composition2_id,
				composition3_id: composition3_id,
				composition2opt: this.form.get('composition2opt').value,
				composition3opt: this.form.get('composition3opt').value,
				major1: this.form.get('major1').value || '',
				major2: this.form.get('major2').value || '',
				major3: this.form.get('major3').value || '',
				major2opt: this.form.get('major2opt').value,
				major3opt: this.form.get('major3opt').value,
				ensemble1: this.form.get('ensemble1').value || '',
				ensemble2: this.form.get('ensemble2').value || '',
				ensemble3: this.form.get('ensemble3').value || '',
				ensemble2opt: this.form.get('ensemble2opt').value,
				ensemble3opt: this.form.get('ensemble3opt').value,
				military1: this.form.get('military1').value || '',
				military2: this.form.get('military2').value || '',
				military3: this.form.get('military3').value || '',
				military2opt: this.form.get('military2opt').value,
				military3opt: this.form.get('military3opt').value,
				family: this.form.get('family').value || '',
				talent: this.form.get('instrument').value || '',
				events: this.form.get('events').value || '',
				hpopt: this.form.get('hpopt').value || '',
				state: this.form.get('state').value || '',
				school_grade: this.form.get('school_grade').value || '',
				last_name: this.form.get('last_name').value || '',
				radius: this.form.get('radius').value || '',
				school_id: this.form.get('school_id').value,
				school: this.form.get('school_id').value ? this.school_name : '',
				styles: this.form.get('styles').value || '',
				emphasis: this.form.get('emphasis').value || '',
			};
		}
	}

	validMinCriteria(fm: any) {
		let count = 0;
		if (fm.composition1_id) { count++; }
		if (fm.composition2_id) { count++; }
		if (fm.composition3_id) { count++; }
		if (fm.major1) { count++; }
		if (fm.major2) { count++; }
		if (fm.major3) { count++; }
		if (fm.ensemble1) { count++; }
		if (fm.ensemble2) { count++; }
		if (fm.ensemble3) { count++; }
		if (fm.military1) { count++; }
		if (fm.military2) { count++; }
		if (fm.military3) { count++; }
		if (fm.family) { count++; }
		if (fm.talent) { count++; }
		if (fm.events && fm.events.length > 0) { count++; }
		if (fm.styles && fm.styles.length > 0) { count++; }
		if (fm.emphasis && fm.emphasis.length > 0) { count++; }
		if (fm.state) { count++; }
		if (fm.school_grade) { count++; }
		if (fm.last_name) { count++; }
		if (fm.radius) { count++; }
		if (fm.school_id) { count++; }
		if (fm.school) { count++; }

		return count > 0 ? true : false;
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

	formatMatches = (item: any) => {
		if (!item) {
			return '';
		}

		return item.name;
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

			const fm = Object.assign({}, this.formModel);
			const tempEvents = fm.events
				.map((e, index) => {
					return e ? this.events[index] : null;
				})
				.filter(e => e);
			fm.events = tempEvents;

			const tempStyles = fm.styles
				.map((e, index) => {
					return e ? this.styles[index].name : null;
				})
				.filter(e => e);
			fm.styles = tempStyles;

			const tempEmphasis = fm.emphasis
				.map((e, index) => {
					return e ? this.emphasis[index].name : null;
				})
				.filter(e => e);
			fm.emphasis = tempEmphasis;

			this.requestFailed = false;
			this.feedback = '';

			if (!this.validMinCriteria(fm)) {
				this.requestFailed = true;
				this.feedback = 'Please select at least one criteria to be able to see results.';
				this.loading = false;
				return;
			}

			if (!this.isSearchLogSaved) {
				var res = new Promise((resolve, reject) => {
					this.studentSLService
						.postSearchLog(
							new RecruiterSearchModel(fm), 
							this.recruiter._id
						)
						.subscribe(
							(response: any) => {
								this.googleAnalyticsEventsService.emitEvent(
									'Public',
									'Form Submition',
									'Recruiter Search Form',
									28100
								);
							},
							err => {
								console.error('SA.recruiter.search-filter.component - postSearchLog', err);
							}
						)
				})

				this.isSearchLogSaved = true;
			}

			const timer = setTimeout(() => {
				if (this.loading) {
					this.requestFailed = true;
					this.feedback = 'There seems to be an issue getting your results - please try different search criteria - If the problem persists, please contact support';
					this.loading = false;
				}
			}, 10000);

			this.recruiterService
				.postStudentSearch(
					new RecruiterSearchModel(fm), 
					this.page, 
					this.pageSize
				)
				.subscribe(
					(response: any) => {
						const search = response.data.map(user => {
							return {
								...user,
								events: Array.from(
									new Set(user.honors.map(h => h.event))
								)
							};
						});

						this.search.emit({
							search: search,
							total: response.total || search.length,
							criteria: fm
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

	saveSearch() {
		const   fm: any = this.formModel;
				fm.composition1 = this.form.get('composition1').value;
				fm.composition2 = this.form.get('composition2').value;
				fm.composition3 = this.form.get('composition3').value;
		const   modalRef = this.modalService
							 .open(
								 CreateSearchModalComponent, 
								 { size: 'lg' }
							 );
				modalRef.componentInstance.recruiter_id = this.recruiter._id;
				modalRef.componentInstance.form_criteria = JSON.stringify(fm);
				modalRef.result.then(() => {}, reason => {});
	}
	
}