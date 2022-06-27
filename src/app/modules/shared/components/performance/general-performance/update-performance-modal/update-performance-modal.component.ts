import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
import { GeneralPerformanceService } from '../../../../../student/services/general-performance.service';
import { TalentService } from '../../../../../student/services/talent.service';
import {ListService} from '../../../../../student/services/list.service';
import { PerformanceModel } from '../../../../../student/models/performance.model';

import {
	CatalogService,
	GoogleAnalyticsEventsService,
	UserModel
} from '../../../../../shared/shared.module';

@Component({
	selector: 'app-update-performance-modal',
	templateUrl: './update-performance-modal.component.html'
})

export class UpdatePerformanceModalComponent implements OnInit {

	@Input() student_id: string;
	@Input() performance_id: string;

	searchingCompositions = false;
	searchFailed = false;
	student = new UserModel({});
	model = new PerformanceModel({});
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
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';
	years: number[] = [];
	currentYear: number;

	constructor(
		private studentService: StudentService,
		private gpService: GeneralPerformanceService,
		public activeModal: NgbActiveModal,
		private router: Router,
		private catalogService: CatalogService,
		private talentService: TalentService,
		private listService:ListService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		this.form = new FormGroup({
			composition_id: new FormControl('', []),//Validators.required
			composition: new FormControl({}, []),//Validators.required
			family: new FormControl('', [Validators.required]),
			instrument: new FormControl('', [Validators.required]),
			type: new FormControl('', [Validators.required]),
			date_performed: new FormControl('', []),
			school_grade: new FormControl('', []),
			section: new FormControl('', []),
			chair: new FormControl('', []),
			video_url: new FormControl('', []),
			comments: new FormControl('', [])
		});

		this.families = [];
		this.instruments = [];
		this.types = [];
		this.grades = [];
	}

	ngOnInit() {
		this.listService.getPerformanceCategories()
			.subscribe(
				(response: any) => {
					this.types = response.data;
				},
				err => {
					console.error('SA.performanceHistory.performanceHistory-form.component - getPerformanceCategories', err);
				}
			);

		this.listService.getFamiliesList()
			.subscribe(
				(response: any) => {
					this.families = response.data;
				},
				err => {
					console.error('SA.performanceHistory.performanceHistory-form.component - getFamiliesList', err);
				}
			);

		this.listService.getGrades()
			.subscribe(
				(response: any) => {
					this.grades = response.data;
				},
				err => {
					console.error('SA.performanceHistory.performanceHistory-form.component - getGrades', err);
				}
			);
		this.getYearList();
		this.getMyProfile();
		this.respondToFamilyChange();
	}

	getMyProfile() {
		this.studentService.getStudentById(this.student_id).subscribe(
			(response: any) => {
				this.student = response.data;
				this.updateForm();
			},
			err => {
				console.error( 'SA.performanceHistory.performanceHistory-form.component - getUser', err );
			}
		);
	}

	updateForm() {
		let performance = this.student.performances.find(p => {
			return p._id === this.performance_id;
		});

		if (performance.composition_id) {
			this.catalogService
				.getCompositionById(performance.composition_id)
				.subscribe((response: any) => {
					this.fillValues(performance, response.data);
				});
		} else {
			this.fillValues(performance, '');
		}
	}

	fillValues(p, composition) {

		this.form.setValue({
			composition_id: p.composition_id || '',
			composition: composition,
			family: p.family || '',
			instrument: p.instrument || '',
			type: p.type || '',
			date_performed: p.date_performed || '',
			school_grade: p.school_grade || '',
			section: p.section || '',
			chair: p.chair || '',
			video_url: p.video_url || '',
			comments: p.comments || ''
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
		)

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

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		let composition_title = this.form.get('composition').value
			? this.form.get('composition').value.title
			: '';

		return {
			_id: this.performance_id,
			composition_id: this.form.get('composition_id').value,
			composition_title: composition_title,
			family: this.form.get('family').value,
			instrument: this.form.get('instrument').value,
			type: this.form.get('type').value,
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
		if(!this.loading){
		this.loading = true;
		this.submitAttempted = true;
		this.googleAnalyticsEventsService.emitEvent(
			'Public',
			'Form Submition',
			'Performance History Form',
			19000
		);

		this.requestFailed = this.requestSuccess = false;

		if (this.form.valid) {
			this.gpService
				.updateStudentPerformance(
					this.student_id,
					new PerformanceModel(this.formModel)
				)
				.subscribe(
					(response: any) => {
						this.loading = false;
						this.student = response.data;
						this.googleAnalyticsEventsService.emitEvent(
							'Public',
							'Form Submition',
							'Performance History Form',
							19100
						);
						this.feedback = 'Performance information updated';
						this.requestSuccess = true;

						setTimeout(() => {
							//this.resetForm();
							this.activeModal.close(this.student);
						}, 2000);
					},
					err => {
						this.loading = false;
						console.error(
							'SA.performanceHistory.performanceHistory-form.component - putUserPerformance',
							err
						);
						this.googleAnalyticsEventsService.emitEvent(
							'Public',
							'Form Submition',
							'Performance History Form',
							19200
						);
						this.feedback =
							'Unable to update performance information';
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
			'Performance History Form Field: ' + this.form.get(fieldName),
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