import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
import { TalentService } from '../../../../../student/services/talent.service';
import { ListService } from '../../../../../student/services/list.service';
import { GeneralPerformanceService } from '../../../../../student/services/general-performance.service';

import { PerformanceModel } from '../../../../../student/models/performance.model';

import { 
	GoogleAnalyticsEventsService,
	LocationService,
	CatalogService,
	StateModel,
	UserModel
} from '../../../../../shared/shared.module';

import { AddCompositionInformationComponent } from '../../../add-composition-information/add-composition-information.component';

@Component({
	selector: 'app-add-performance-modal',
	templateUrl: './add-performance-modal.component.html'
})

export class AddPerformanceModalComponent implements OnInit {

	@Input() student_id: string;

	student = new UserModel({});
	model = new PerformanceModel({});
	form: FormGroup;
	families: string[];
	instruments: any[];
	types: string[];
	date_performed?: string;
	section: string;
	chair: string;
	video_url: string;
	videoUrl: string;
	grades: number[];
	years: number[] = [];
	currentYear: number;
	submitAttempted = false;
	searchingCompositions = false;
	searchFailed = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	noResult = false;
	feedback = '';

	constructor(
		private gpService: GeneralPerformanceService,
		private modalService: NgbModal,
		private studentService: StudentService,
		public activeModal: NgbActiveModal,
		private catalogService: CatalogService,
		private talentService: TalentService,
		private locationService: LocationService,
		private listService: ListService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		this.form = new FormGroup({
			composition_id: new FormControl('', []),//Validators.required
			composition: new FormControl('', []),//Validators.required
			family: new FormControl('', [Validators.required]),
			instrument: new FormControl('', [Validators.required]),
			type: new FormControl('', [Validators.required]),
			date_performed: new FormControl(''),
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
					console.error('SA.performanceHistory.performanceHistory-form.component  - getPerformanceCategories', err);
				}
			);

		this.listService.getFamiliesList()
			.subscribe(
				(response: any) => {
					this.families = response.data;
				},
				err => {
					console.error('SA.performanceHistory.performanceHistory-form.component  - getFamiliesList', err);
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

		this.getMyProfile();
		this.respondToFamilyChange();
		this.getYearList();
	}

	getMyProfile() {
		this.studentService.getStudentById(this.student_id)
			.subscribe(
				(response: any) => {
					this.student = response.data;
				},
				err => {
					console.error('SA.performanceHistory.performanceHistory-form.component - getUser', err);
				}
			);
	}

	searchCompositions = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			filter(term => term.length > 2),
			tap(() => this.searchingCompositions = true),
			switchMap(term => this.catalogService.getCompositions(term).pipe(
				map((res: any) => {
					res.data.length <1
						? this.noResult = true
						: this.noResult = false
					return res.data;
				}),
				tap(() => this.searchFailed = false),
				catchError(() => {
					this.searchFailed = true;
					return of([]);
				}))
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

		const composers = item.composers && item.composers.length > 0
			? ' / ' + item.composers.join(', ')
			: '';
		const inst_group = item.instrument && item.instrument.group
			? ' / ' + item.instrument.group
			: '';
		const inst_name = item.instrument && item.instrument.name
			? ' / ' + item.instrument.name
			: '';
		const second_line = inst_group && inst_name
			? '\n' + inst_group + inst_name
			: '';
		const name = item.title + composers + second_line;

		return name;
	}

	respondToFamilyChange() {
		this.form.get('family').valueChanges.subscribe(val => {
			this.talentService.getTalentByFamily(val).subscribe((response: any) => {
				this.instruments = response.data;
				if (!this.instruments.find(i => i.name === this.form.get('instrument').value)) {
					this.form.get('instrument').setValue('');
				}
			});
		});
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		const composition_title = this.form.get('composition').value ? this.form.get('composition').value.title : '';
		return {
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
			comments: this.form.get('comments').value,
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
				'Performance History Form', 
				19000
			);

			this.requestFailed = this.requestSuccess = false;

			if (this.form.valid) {

				this.requestSuccess = true;
				this.gpService
					.createStudentPerformance(
						this.student_id, 
						new PerformanceModel(this.formModel)
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.student = response.data;
							this.feedback = 'Performance information added';
							this.googleAnalyticsEventsService.emitEvent(
								'Public', 
								'Form Submition', 
								'Performance History Form', 
								19100
							);
							setTimeout(() => {
							// this.form.reset();
							// this.resetForm();
								this.activeModal.close(this.student);
							}, 2000);
						},
						err => {
							console.error('SA.performanceHistory.performanceHistory-form.component - putUserPerformance', err);
							this.loading = false;
							this.requestSuccess = false;
							this.requestFailed = true;
							this.feedback = 'Unable to add performance information';
							this.googleAnalyticsEventsService.emitEvent(
								'Public', 
								'Form Submition', 
								'Performance History Form', 
								19200
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
		this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Recruiter Search Form FormField: ' + this.form.get(fieldName), 19300);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

	componsion() {
		this.modalService.hasOpenModals();
		const modalRef = this.modalService.open(AddCompositionInformationComponent);
		modalRef.componentInstance.savedComposition.subscribe(($e) => {
			this.setAddedComposition($e);
		});
	}

	setAddedComposition = (e: any) => {
		const item = e;
		this.form.get('composition_id').setValue(item._id);
		this.form.get('instrument').setValue(item.instrument.name);
		this.form.get('family').setValue(item.instrument.family);
		this.form.get('type').setValue(item.instrument.type);
		this.form.get('composition').setValue(item);
	}

	getVideoUrl(url:any) {
		this.videoUrl = url;
	}

	getYearList() {
		var today = new Date();
		this.currentYear = today.getFullYear();
		for (var i = (this.currentYear - 50); i <= this.currentYear; i++) {
			this.years.push(i);
		}
	}

}