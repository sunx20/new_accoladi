import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StudentService } from '../../../../../student/services/student.service';
import { SummerEnrichmentService } from '../../../../../student/services/summer-enrichment.service';
import { TalentService } from '../../../../../student/services/talent.service';
import { GoogleAnalyticsEventsService, CatalogService, LocationService, UserModel } from '../../../../../shared/shared.module';
import { SummerEnrichmentModel } from '../../../../../student/models/summer-enrichment.model';
import { ListService } from '../../../../../student/services/list.service';

@Component({
	selector: 'app-add-summer-enrichment-modal',
	templateUrl: './add-summer-enrichment-modal.component.html'
})

export class AddSummerEnrichmentModalComponent implements OnInit {

	@Input() student_id: string;

	searchingCompositions = false;
	searchFailed = false;
	student = new UserModel({});
	model = new SummerEnrichmentModel({});
	form: FormGroup;
	submitAttempted = false;
	instruments: any[];
	families: string[];
	states: any[];
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';
	videoUrl;
	years: number[] = [];
	currentYear: number;
	startYearErrorShow: boolean = false;
	endYearErrorShow: boolean = false;
	startYear: number;
	endYear: number;
	provideStartYearShow:boolean=true;
	provideEndYearShow:boolean=true;
	constructor(
		private studentService: StudentService,
		private seService: SummerEnrichmentService,
		public activeModal: NgbActiveModal,
		private router: Router,
		private catalogService: CatalogService,
		private locationService: LocationService,
		private talentService: TalentService,
		private listService: ListService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
	) {

		this.form = new FormGroup({
			event: new FormControl('', [Validators.required]),
			institution: new FormControl(),
			started: new FormControl('', [Validators.required]),
			ended: new FormControl('', [Validators.required]),
			city: new FormControl(),
			state: new FormControl(),
			country: new FormControl(),
			primary: new FormControl('', [Validators.required]),
			secondary: new FormControl(),
			ensemble: new FormControl(),
			role: new FormControl(),
			conductor: new FormControl(),
			director: new FormControl(),
			section: new FormControl(),
			chair: new FormControl(),
			family: new FormControl(),
			instrument: new FormControl(),
			video_url: new FormControl(),
			comments: new FormControl()
		});

		this.families = [];
		this.instruments = [];
		this.states = this.locationService.getStates();
	}

	ngOnInit() {
		this.listService.getFamiliesList()
			.subscribe(
				(response: any) => {
					this.families = response.data;
				},
				err => {
					console.error('SA.summerEnrichmentHistory.summerEnrichmentHistory-form.component - getFamiliesList', err);
				}
			);

		this.studentService.getStudentById(this.student_id)
			.subscribe(
				(response: any) => {
					this.student = response.data;
				},
				err => {
					console.error('SA.summerEnrichmentHistory.summerEnrichmentHistory-form.component - getUser', err);
				}
			);

		this.talentService.getTalent()
			.subscribe(
				(response: any) => {
					this.instruments = response.data;
				},
				err => {
					console.error('SA.extraCurricular.summerEnrichment-form.component - getTalent', err);
				}
			);
		this.respondToFamilyChange();
		this.getYearList();
	}

	respondToFamilyChange() {
		this.form.get('family').valueChanges.subscribe(val => {
			this.talentService.getTalentByFamily(val).subscribe((response: any) => {
				this.instruments = response.data;
				if (!this.instruments.find(i => i.name === this.form.get('instrument').value)) {
					this.form.get('instrument').setValue('');
				}
			},
				err => {
					console.error('SA.extracurricular.summer-enrichment-form.component - getTalentByFamily', err);
				});
		});
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			event: this.form.get('event').value,
			institution: this.form.get('institution').value,
			started: this.form.get('started').value,
			ended: this.form.get('ended').value,
			family: this.form.get('family').value,
			instrument: this.form.get('instrument').value,
			city: this.form.get('city').value,
			state: this.form.get('state').value,
			country: this.form.get('country').value,
			primary: this.form.get('primary').value,
			secondary: this.form.get('secondary').value,
			ensemble: this.form.get('ensemble').value,
			role: this.form.get('role').value,
			conductor: this.form.get('conductor').value,
			director: this.form.get('director').value,
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
		if(!this.loading){
		this.loading = true;
		this.submitAttempted = true;
		this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Summer Enrichment History Form', 19000);

		this.requestFailed = this.requestSuccess = false;
		if (this.form.valid) {
			this.seService.createStudentSummerEnrichment(this.student_id, new SummerEnrichmentModel(this.formModel))
				.subscribe(
					(response: any) => {
						
						this.student = response.data;
						this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Summer Enrichment History Form', 19100);
						this.feedback = 'Summer enrichment information added';
						//this.form.reset();
						this.requestSuccess = true;
							

						setTimeout(() => {
							this.loading = false;
							//this.resetForm();
							this.activeModal.close(this.student);
						}, 2000);
					},
					err => {
						this.loading = false;
						console.error('SA.summerEnrichmentHistory.summerEnrichmentHistory-form.component - putUserSummerEnrichment', err);
						this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Summer Enrichment History Form', 19200);
						this.feedback = 'Unable to add summer enrichment information';
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
		this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Summer Enrichment Form FormField: ' + this.form.get(fieldName), 20340);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

	getVideoUrl(url: any) {
		this.videoUrl = url;
	}

	getYearList() {
		var today = new Date();
		this.currentYear = today.getFullYear();
		for (var i = (this.currentYear - 50); i <= this.currentYear; i++) {
			this.years.push(i);
		}
	}

	onStartYearChange(startYear){
		if(startYear=="select"){
			this.provideStartYearShow=true;
			this.startYearErrorShow=false;
			this.form.get('started').setErrors({'incorrect': true});
		}else{
			this.provideStartYearShow=false;
			this.startYear=startYear;
			if(this.startYear>this.endYear){
				this.startYearErrorShow=true;
				this.form.get('started').setErrors({'incorrect': true});
			}else if(this.startYear<=this.endYear){
				this.startYearErrorShow=false;
				this.endYearErrorShow=false;
				this.form.get('started').setErrors(null);
			}
		}
		
	}

	onEndYearChange(endYear){
		if(endYear=="select"){
			this.provideEndYearShow=true;
			this.endYearErrorShow=false;
			this.form.get('ended').setErrors({'incorrect': true});
		}else{
			this.provideEndYearShow=false;
			this.endYear=endYear;
			if(this.startYear>this.endYear){
				this.endYearErrorShow=true;
				this.form.get('ended').setErrors({'incorrect': true});
			}else if(this.startYear<=this.endYear){
				this.endYearErrorShow=false;
				this.startYearErrorShow=false;
				this.form.get('ended').setErrors(null);
	
			}
		}
		
		
	}
}
