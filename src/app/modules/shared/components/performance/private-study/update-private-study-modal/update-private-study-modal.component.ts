import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StudentService } from '../../../../../student/services/student.service';
import { PrivateStudyService } from '../../../../../student/services/private-study.service';
import { TalentService } from '../../../../../student/services/talent.service';
import {ListService} from '../../../../../student/services/list.service';
import { PrivateStudyModel } from '../../../../../student/models/private-study.model';
import {
	CatalogService,
	GoogleAnalyticsEventsService,
	UserModel
} from '../../../../../shared/shared.module';

@Component({
	selector: 'app-update-private-study-modal',
	templateUrl: './update-private-study-modal.component.html'
})

export class UpdatePrivateStudyModalComponent implements OnInit {

	@Input() student_id: string;
	@Input() psid: string;

	student = new UserModel({});
	model = new PrivateStudyModel({});
	searchingCompositions = false;
	searchFailed = false;
	form: FormGroup;
	submitAttempted = false;
	families: string[];
	instruments: any[];
	subjects: string[];
	critiqueSelection = ['No', 'Yes'];
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';
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
		private psService: PrivateStudyService,
		public activeModal: NgbActiveModal,
		private router: Router,
		private catalogService: CatalogService,
		private talentService: TalentService,
		private listService:ListService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		this.form = new FormGroup({
			instructor: new FormControl('', [Validators.required]),
			institution: new FormControl(''),
			family: new FormControl('', [Validators.required]),
			instrument: new FormControl('', [Validators.required]),
			subject: new FormControl('', [Validators.required]),
			started: new FormControl(''),
			ended: new FormControl(''),
			hours: new FormControl('', [Validators.required]),
			critiqued: new FormControl(''),
			video_url: new FormControl(''),
			comments: new FormControl(''),
		});

		this.families = [];
		this.subjects = [];
		this.instruments = [];
	}

	ngOnInit() {
		this.listService.getFamiliesList()
		.subscribe(
			(response: any) => {
				this.families = response.data;
			},
			err => {
				console.error('SA.privateStudyHistory.privateStudyHistory-form.component - getFamiliesList', err);
			}
		);

		this.listService.getStudySubjects()
		.subscribe(
			(response: any) => {
				this.subjects = response.data;
			},
			err => {
				console.error('SA.privateStudyHistory.privateStudyHistory-form.component - getFamiliesList', err);
			}
		);

		this.getMyProfile();
		this.getTalent();
		this.respondToFamilyChange();
		this.getYearList();
		setTimeout(()=>{
			this.startYear = this.form.get('started').value;
			this.endYear = this.form.get('ended').value;
	   }, 3000);
	}

	getMyProfile() {
		this.studentService.getStudentById(this.student_id).subscribe(
			(response: any) => {
				this.student = response.data;
				this.updateForm();
			},
			err => {
				console.error( 'SA.privateStudyHistory.privateStudyHistory-form.component - getUser', err );
			}
		);
	}

	updateForm() {
		const ps = this.student.private_studies.find(ps => {
			return ps._id === this.psid;
		});
		this.form.setValue({
			instructor: ps.instructor || '',
			institution: ps.institution || '',
			family: ps.family || '',
			instrument: ps.instrument || '',
			subject: ps.subject || '',
			started: ps.dates.started || '',
			ended: ps.dates.ended || '',
			hours: ps.hours || '',
			critiqued: ps.critiqued || '',
			video_url: ps.video_url || '',
			comments: ps.comments || '',
		});
	}

	getTalent() {
		this.talentService.getTalent().subscribe(
			(response: any) => {
				this.instruments = response.data;
			},
			err => {
				console.error( 'SA.extraCurricular.privateStudies-form.component - getTalent', err );
			}
		);
	}

	respondToFamilyChange() {
		this.form.get('family').valueChanges.subscribe(val => {
			this.talentService.getTalentByFamily(val).subscribe(
				(response: any) => {
					this.instruments = response.data;
					if (
						!this.instruments.find(
							i => i.name === this.form.get('instrument').value
						)
					) {
						this.form.get('instrument').setValue('');
					}
				},
				err => {
					console.error( 'SA.extracurricular.private-study-form.component - getTalentByFamily', err );
				}
			);
		});
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			_id: this.psid,
			instructor: this.form.get('instructor').value,
			institution: this.form.get('institution').value,
			family: this.form.get('family').value,
			instrument: this.form.get('instrument').value,
			subject: this.form.get('subject').value,
			started: this.form.get('started').value,
			ended: this.form.get('ended').value,
			hours: this.form.get('hours').value,
			critiqued: this.form.get('critiqued').value,
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
		this.googleAnalyticsEventsService.emitEvent(
			'Public',
			'Form Submition',
			'Private Studies Form',
			20040
		);

		this.requestFailed = this.requestSuccess = false;

		if (this.form.valid) {
			this.psService
				.updateStudentPrivateStudy(
					this.student_id,
					new PrivateStudyModel(this.formModel)
				)
				.subscribe(
					(response: any) => {
						this.loading = false;
						this.student = response.data;
						this.googleAnalyticsEventsService.emitEvent(
							'Public',
							'Form Submition',
							'Private Study History Form',
							19100
						);
						this.feedback = 'Private study information updated';
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
							'SA.extraCurricular.privateStudies-form.component - putUserPrivateStudies',
							err
						);
						this.googleAnalyticsEventsService.emitEvent(
							'Public',
							'Form Submition',
							'Private Studies Form',
							20240
						);
						this.feedback =
							'Unable to update private study information';
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
			'Private Studies Form FormField: ' + this.form.get(fieldName),
			20340
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
