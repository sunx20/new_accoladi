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

import { StudentService } from '../../../../../student/services/student.service';
import { HonorAwardService } from '../../../../../student/services/honor-award.service';
import { TalentService } from '../../../../../student/services/talent.service';
import { ListService } from '../../../../../student/services/list.service';
import { HonorAwardModel } from '../../../../../student/models/honor-award.model';

import {
	CatalogService,
	GoogleAnalyticsEventsService,
	LocationService,
	StateModel,
	UserModel
} from '../../../../../shared/shared.module';

@Component({
	selector: 'app-update-honor-award-modal',
	templateUrl: './update-honor-award-modal.component.html'
})

export class UpdateHonorAwardModalComponent implements OnInit {

	@Input() student_id: string;
	@Input() haid: string;

	searchingCompositions = false;
	searchFailed = false;
	student = new UserModel({});
	model = new HonorAwardModel({});
	form: FormGroup;
	submitAttempted = false;
	families: string[];
	instruments: any[];
	types: string[];
	ensembles: string[];
	orchestras: string[];
	chourses: string[];
	date_performed?: Date;
	grades: number[];
	section: string;
	chair: string;
	video_url: string;
	states: StateModel[];
	events: string[];
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';
	years: number[] = [];
	currentYear: number;

	constructor(
		private studentService: StudentService,
		private haService: HonorAwardService,
		public activeModal: NgbActiveModal,
		//private router: Router,
		private catalogService: CatalogService,
		private talentService: TalentService,
		private locationService: LocationService,
		private listService:ListService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		this.form = new FormGroup({
			composition_id: new FormControl(''),
			composition: new FormControl(''),
			family: new FormControl('', [Validators.required]),
			instrument: new FormControl('', [Validators.required]),
			type: new FormControl('', [Validators.required]),
			date_performed: new FormControl('', []),
			school_grade: new FormControl('', []),
			section: new FormControl('', []),
			chair: new FormControl('', []),
			video_url: new FormControl('', []),
			event: new FormControl('', [Validators.required]),
			other: new FormControl(''),
			state: new FormControl('', [Validators.required]),
			comments: new FormControl('', []),
		});

		this.families = [];
		this.instruments = [];
		this.types = [];
		this.ensembles = [];
		this.orchestras = [];
		this.chourses = [];
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
				console.error('SA.honorAwardHistory.honorAwardHistory-form.component - getPerformanceCategories', err);
			}
		);

		this.listService.getGrades()
		.subscribe(
			(response: any) => {
				this.grades = response.data;
			},
			err => {
				console.error('SA.honorAwardHistory.honorAwardHistory-form.component - getOrchestraCategories', err);
			}
		);

		this.listService.getOrchestraCategories()
		.subscribe(
			(response: any) => {
				this.orchestras = response.data;
			},
			err => {
				console.error('SA.honorAwardHistory.honorAwardHistory-form.component - getOrchestraCategories', err);
			}
		);

		this.listService.getChorusCategories()
		.subscribe(
			(response: any) => {
				this.chourses = response.data;
			},
			err => {
				console.error('SA.honorAwardHistory.honorAwardHistory-form.component - getChorusCategories', err);
			}
		);

		this.listService.getEnsembles()
		.subscribe(
			(response: any) => {
				this.ensembles = response.data;
			},
			err => {
				console.error('SA.honorAwardHistory.honorAwardHistory-form.component - getEnsembles', err);
			}
		);

		this.listService.getFamiliesList()
		.subscribe(
			(response: any) => {
				this.families = response.data;
			},
			err => {
				console.error('SA.honorAwardHistory.honorAwardHistory-form.component - getFamiliesList', err);
			}
		);

		this.getMyProfile();
		this.respondToFamilyChange();
		this.respondToTypeChange();
		this.getYearList();
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
					console.error('SA.honorAwardHistory.honorAwardHistory-form.component - getUser', err);
				}
			);
	}

	updateForm() {
		let ha = this.student.honors_awards.find(p => {
			return p._id === this.haid;
		});
		
		if (ha.composition_id) {
			this.catalogService
				.getCompositionById(ha.composition_id)
				.subscribe((response: any) => {
					this.fillValues(ha, response.data);
				});
		} else {
			this.fillValues(ha, '');
		}
	}

	fillValues(ha, composition) {console.log(['fillValues',composition]);
		let event = ha.event;
		let other = '';
		if (
			!this.ensembles.includes(event) &&
			!this.orchestras.includes(event) &&
			!this.chourses.includes(event)
		) {
			event = 'Other...';
			other = ha.event;
		}

		this.form.setValue({
			composition_id: ha.composition_id || '',
			composition: composition || '',
			family: ha.family || '',
			instrument: ha.instrument || '',
			type: ha.type || '',
			date_performed: ha.date_performed || '',
			school_grade: ha.school_grade || '',
			section: ha.section || '',
			chair: ha.chair || '',
			event: event || '',
			other: other || '',
			state: ha.state || '',
			video_url: ha.video_url || '',
			comments: ha.comments || '',
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
	}

	formatMatches = (item: any) => {
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
				this.events = this.chourses;
			} else if (val === 'Orchestra') {
				this.events = this.orchestras;
			} else {
				this.events = this.ensembles;
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

		let event = this.form.get('event').value;
		if (event === 'Other...') {
			event = this.form.get('other').value;
		}

		if (!event) {
			this.form.get('event').setValue('');
		}

		return {
			_id: this.haid,
			composition_id: composition_title ? this.form.get('composition_id').value : '',
			composition_title: composition_title,
			family: this.form.get('family').value,
			instrument: this.form.get('instrument').value,
			type: this.form.get('type').value,
			event: event,
			state: this.form.get('state').value,
			date_performed: this.form.get('date_performed').value,
			school_grade: this.form.get('school_grade').value,
			section: this.form.get('section').value,
			chair: this.form.get('chair').value,
			video_url: this.form.get('video_url').value,
			comments: this.form.get('comments').value
		};
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
				'HonorAward History Form',
				19000
			);

			this.requestFailed = this.requestSuccess = false;

			let fm = this.formModel;

			if (this.form.valid && fm.event) {
				this.haService
					.updateStudentHA(this.student_id, new HonorAwardModel(fm))
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.student = response.data;
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'HonorAward History Form',
								19100
							);
							this.feedback = 'Honors and Awards information updated';
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
								'SA.honorAwardHistory.honorAwardHistory-form.component - putUserHonorAward',
								err
							);
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'HonorAward History Form',
								19200
							);
							this.feedback =
								'Unable to update honors and awards information';
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
			'Honor Award Form Field: ' + this.form.get(fieldName),
			19300
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