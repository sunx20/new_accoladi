import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//import { Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable, of } from 'rxjs';
import {
	catchError,
	debounceTime,
	distinctUntilChanged,
	map,
	tap,
	switchMap,
	filter
} from 'rxjs/operators';

import { StudentService } from '../../../../../student/services//student.service';
import { FestivalCompetitionService } from '../../../../../student/services//festival-competition.service';
import { TalentService } from '../../../../../student/services//talent.service';
import { ListService } from '../../../../../student/services/list.service';

import { FestivalCompetitionModel } from '../../../../../student/models/festival-competition.model';
import {
	CatalogService,
	GoogleAnalyticsEventsService,
	LocationService,
	StateModel,
	UserModel
} from '../../../../../shared/shared.module';

@Component({
	selector: 'app-update-festival-competition-modal',
	templateUrl: './update-festival-competition-modal.component.html'
})

export class UpdateFCModalComponent implements OnInit {

	@Input() student_id: string;
	@Input() fcid: string;

	searchingCompositions = false;
	searchFailed = false;
	student = new UserModel({});
	model = new FestivalCompetitionModel({});
	form: FormGroup;
	submitAttempted = false;
	families: string[];
	instruments: any[];
	types: string[];
	date_performed?: Date;
	grades: number[];
	section: string;
	chair: string;
	video_url: string;
	states: StateModel[];
	events: string[];
	festivalRatings: string[];
	competitionPlacements: string[];
	selectedRating: string;
	selectedPlacement: string;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';
	years: number[] = [];
	currentYear: number;

	constructor(
		private studentService: StudentService,
		private fcService: FestivalCompetitionService,
		private activeModal: NgbActiveModal,
		//private router: Router,
		private catalogService: CatalogService,
		private talentService: TalentService,
		private locationService: LocationService,
		private listService:ListService,
		private googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		this.form = new FormGroup({
			composition_id: new FormControl('', []),//Validators.required
			composition: new FormControl('', []),//Validators.required
			family: new FormControl('', [Validators.required]),
			instrument: new FormControl('', [Validators.required]),
			type: new FormControl('', [Validators.required]),
			date_performed: new FormControl('', []),
			school_grade: new FormControl('', []),
			section: new FormControl('', []),
			chair: new FormControl('', []),
			event: new FormControl('', [Validators.required]),
			state: new FormControl('', [Validators.required]),
			placement: new FormControl('', []),
			rating: new FormControl('', []),
			judge: new FormControl('', []),
			judges_comments: new FormControl(''),
			video_url: new FormControl('', []),
			comments: new FormControl('')
		});

		this.families = [];
		this.instruments = [];
		this.types = [];
		this.festivalRatings = [];
		this.competitionPlacements = [];
		this.grades = [];
		this.states = this.locationService.getStates();
	}

	ngOnInit() {
		this.listService.getPerformanceCategories()
		.subscribe(
			(response: any) => {
				this.types = response.data;
			},
			err => {
				console.error('SA.festival-competitionHistory.festival-competitionHistory-form.component - getPerformanceCategories', err);
			}
		);

		this.listService.getGrades()
		.subscribe(
			(response: any) => {
				this.grades = response.data;
			},
			err => {
				console.error('SA.festival-competitionHistory.festival-competitionHistory-form.component - getGrades', err);
			}
		);

		this.listService.getCompetitionPlacements()
		.subscribe(
			(response: any) => {
				this.competitionPlacements = response.data;
			},
			err => {
				console.error('SA.festival-competitionHistory.festival-competitionHistory-form.component - getCompetitionPlacements', err);
			}
		);

		this.listService.getFestivalRatings()
		.subscribe(
			(response: any) => {
				this.festivalRatings = response.data;
			},
			err => {
				console.error('SA.festival-competitionHistory.festival-competitionHistory-form.component - getFestivalRatings', err);
			}
		);

		this.listService.getFamiliesList()
		.subscribe(
			(response: any) => {
				this.families = response.data;
			},
			err => {
				console.error('SA.festival-competitionHistory.festival-competitionHistory-form.component - getFamiliesList', err);
			}
		);


		this.getMyProfile();
		this.respondToFamilyChange();
		this.getYearList();
		// this.respondToTypeChange();
	}

	getMyProfile() {
		this.studentService
			.getStudentById(this.student_id)
			.subscribe(
				(response: any) => {
					this.student = response.data;
					this.updateForm();
				},
				err => {
					console.error(
						'SA.festival-competitionHistory.festival-competitionHistory-form.component - getUser',
						err
					);
				}
			);
	}

	updateForm() {
		let fc = this.student.festivals_competitions.find(p => {
			return p._id === this.fcid;
		});
		
		if (fc.composition_id) {
			this.catalogService
				.getCompositionById(fc.composition_id)
				.subscribe((response: any) => {
					this.fillValues(fc, response.data);
				});
		} else {
			this.fillValues(fc, '');
		}
	}

	fillValues(fc, composition) {

		this.form.setValue({
			composition_id: fc.composition_id || '',
			composition: composition,
			family: fc.family || '',
			instrument: fc.instrument || '',
			type: fc.type || '',
			date_performed: fc.date_performed || '',
			school_grade: fc.school_grade || '',
			section: fc.section || '',
			chair: fc.chair || '',
			event: fc.event || '',
			state: fc.state || '',
			placement: fc.placement || '',
			rating: fc.rating || '',
			judge: fc.judge || '',
			judges_comments: fc.judges_comments || '',
			video_url: fc.video_url || '',
			comments: fc.comments || ''
		});

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
					tap(() => (this.searchFailed = false)),
					catchError(() => {
						this.searchFailed = true;
						return of([]);
					})
				)
			),
			tap(() => {
				this.searchingCompositions = false;
			})
		);

	selectedComposition = (e: any) => {
		const item = e.item;

		this.form.get('composition_id').setValue(item._id);
		this.form.get('instrument').setValue(item.instrument.name);
		this.form.get('family').setValue(item.instrument.family);
		this.form.get('type').setValue(item.instrument.type);
	};

	formatMatches = (item: any) => {
		if (!item) return '';
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
	};

	respondToFamilyChange() {
		this.form.get('family').valueChanges.subscribe(val => {
			this.talentService
				.getTalentByFamily(val)
				.subscribe((response: any) => {
					this.instruments = response.data;
					if (
						!this.instruments.find(
							i => i.name === this.form.get('instrument').value
						)
					) {
						this.form.get('instrument').setValue('');
					}
				});
		});
	}

	respondToTypeChange() {
		this.form.get('type').valueChanges.subscribe(val => {
			if (val === 'Chorus') {
				this.families = ['Voice'];
			} else {
				this.families = ['Brass', 'Percussion', 'String', 'Woodwind'];
			}
		});
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		let composition_title = this.form.get('composition').value
			? this.form.get('composition').value.title
			: '';

		return {
			_id: this.fcid,
			composition_id: this.form.get('composition_id').value,
			composition_title: composition_title,
			family: this.form.get('family').value,
			instrument: this.form.get('instrument').value,
			type: this.form.get('type').value,
			event: this.form.get('event').value,
			state: this.form.get('state').value,
			date_performed: this.form.get('date_performed').value,
			school_grade: this.form.get('school_grade').value,
			section: this.form.get('section').value,
			chair: this.form.get('chair').value,
			rating: this.form.get('rating').value,
			judge: this.form.get('judge').value,
			judges_comments: this.form.get('judges_comments').value,
			placement: this.form.get('placement').value,
			video_url: this.form.get('video_url').value,
			comments: this.form.get('comments').value
		};
	}

	respondToPlacementChange() {
		this.form.get('placement').valueChanges.subscribe(val => {});
	}

	respondToRatingChange() {
		this.form.get('rating').valueChanges.subscribe(val => {});
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

			this.googleAnalyticsEventsService.emitEvent(
				'Public',
				'Form Submition',
				'Festivals Competitions Form',
				19000
			);

			if (this.form.valid) {
				this.fcService
					.updateStudentFC(
						this.student_id,
						new FestivalCompetitionModel(this.formModel)
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.student = response.data;
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Festivals & Competitions History Form',
								19100
							);
							this.feedback =
								'Festivals and competitions information updated';
							//this.form.reset();
							this.requestSuccess = true;
							setTimeout(() => {
								//this.resetForm();
								this.activeModal.close(this.student);
							}, 2000);
						},
						err => {
							this.loading = false;
							console.error(
								'SA.festival-competitionHistory.festival-competitionHistory-form.component - putUserFestivalsCompetitions',
								err
							);
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Festivals & Competitions History Form',
								19200
							);
							this.feedback =
								'Unable to update festivals and competitions information';
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
			'Festivals Competitions Form FormField: ' +
				this.form.get(fieldName),
			20310
		);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

	getYearList() {
		var today = new Date();
		this.currentYear = today.getFullYear();
		for (var i = (this.currentYear - 50); i <= this.currentYear; i++) {
			this.years.push(i);
		}
	}

}