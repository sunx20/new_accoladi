import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StudentService } from '../../../../../student/services/student.service';
import { MasterClassService } from '../../../../../student/services/master-class.service';
import { TalentService } from '../../../../../student/services/talent.service';
import { MasterClassModel } from '../../../../../student/models/master-class.model';
import { ListService } from '../../../../../student/services/list.service'

import {
	GoogleAnalyticsEventsService,
	UserModel
} from '../../../../../shared/shared.module';

@Component({
	selector: 'app-update-master-class-modal',
	templateUrl: './update-master-class-modal.component.html'
})

export class UpdateMasterClassModalComponent implements OnInit {

	@Input() student_id: string;
	@Input() mcid: string;

	student = new UserModel({});
	model = new MasterClassModel({});
	
	form: FormGroup;
	families: string[];
	instruments: any[];
	subjects: string[];
	critiqueSelection = ['No', 'Yes'];
	feedback = '';
	years: number[] = [];
	currentYear: number;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	submitAttempted = false;
	searchingCompositions = false;
	searchFailed = false;
	startYearErrorShow: boolean = false;
	endYearErrorShow: boolean = false;
	startYear: number;
	endYear: number;
	provideStartYearShow: boolean = true;
	provideEndYearShow: boolean = true;
	
	constructor(
		private studentService: StudentService,
		private mcService: MasterClassService,
		public activeModal: NgbActiveModal,
		private talentService: TalentService,
		private listService: ListService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		this.form = new FormGroup({
			institution: new FormControl(),
			instructor: new FormControl('', [Validators.required]),
			family: new FormControl('', [Validators.required]),
			instrument: new FormControl('', [Validators.required]),
			subject: new FormControl('', [Validators.required]),
			subject2: new FormControl(),
			started: new FormControl('', [Validators.required]),
			ended: new FormControl('', [Validators.required]),
			city: new FormControl(),
			state: new FormControl(),
			country: new FormControl({ value: 'USA', disabled: true }),
			hours: new FormControl('', [Validators.required]),
			critiqued: new FormControl(),
			video_url: new FormControl(),
			comments: new FormControl()
		});

		this.families = [];
		this.subjects = [];
		this.instruments = [];
	}

	ngOnInit() {
		this.listService
			.getStudySubjects()
			.subscribe(
				(response: any) => {
					this.subjects = response.data;
				},
				err => {
					console.error(
						'SA.masterClassHistory.masterClassHistory-form.component - getUser',
						err
					);
				}
			);

		this.listService
			.getFamiliesList()
			.subscribe(
				(response: any) => {
					this.families = response.data;
				},
				err => {
					console.error(
						'SA.masterClassHistory.masterClassHistory-form.component - getUser',
						err
					);
				}
			);


		this.getMyProfile();

		this.talentService
			.getTalent()
			.subscribe(
				(response: any) => {
					this.instruments = response.data;
				},
				err => {
					console.error(
						'SA.extraCurricular.masterClasses-form.component - getTalent',
						err
					);
				}
			);

		this.getYearList();
		this.respondToFamilyChange();

		setTimeout(()=>{
			this.startYear = this.form.get('started').value;
			this.endYear = this.form.get('ended').value;
		}, 3000);

	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			_id: this.mcid,
			institution: this.form.get('institution').value,
			instructor: this.form.get('instructor').value,
			family: this.form.get('family').value,
			instrument: this.form.get('instrument').value,
			subject: this.form.get('subject').value,
			subject2: this.form.get('subject2').value,
			started: this.form.get('started').value,
			ended: this.form.get('ended').value,
			hours: this.form.get('hours').value,
			critiqued: this.form.get('critiqued').value,
			city: this.form.get('city').value,
			state: this.form.get('state').value,
			country: this.form.get('country').value,
			video_url: this.form.get('video_url').value,
			comments: this.form.get('comments').value,
		};
	}

	getMyProfile() {
		this.studentService
			.getStudentById(
				this.student_id
			)
			.subscribe(
				(response: any) => {
					this.student = response.data;
					this.updateForm();
				},
				err => {
					console.error(
						'SA.masterClassHistory.masterClassHistory-form.component - getUser',
						err
					);
				}
			);
	}

	updateForm() {
		let mt = this.student.master_classes.find(p => {
			return p._id === this.mcid;
		});

		this.form.setValue({
			institution: mt.institution || '',
			instructor: mt.instructor || '',
			family: mt.family || '',
			instrument: mt.instrument || '',
			subject: mt.subject || '',
			subject2: mt.subject2 || '',
			started: mt.dates.started || '',
			ended: mt.dates.ended || '',
			hours: mt.hours || '',
			critiqued: mt.critiqued || '',
			city: mt.location.city || '',
			state: mt.location.state || '',
			country: 'USA', // mt.country || '',
			video_url: mt.video_url || '',
			comments: mt.comments || ''
		});
	}

	respondToFamilyChange() {
		this.form.get('family').valueChanges.subscribe(val => {
			this.talentService
				.getTalentByFamily(
					val
				)
				.subscribe(
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
						console.error(
							'SA.extracurricular.master-classes-form.component - getTalentByFamily',
							err
						);
					}
				);
		});
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
				'Master Class History Form',
				19000
			);

			if (this.form.valid) {
				this.mcService
					.updateStudentMC(
						this.student_id,
						new MasterClassModel(this.formModel)
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.student = response.data;
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'MasterClass History Form',
								19100
							);
							this.feedback = 'Master class information updated';
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
								'SA.masterClassHistory.masterClassHistory-form.component - putUserMasterClass',
								err
							);
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Master Class History Form',
								19200
							);
							this.feedback =
								'Unable to update master class information';
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
			'Master Classes Form FormField: ' + this.form.get(fieldName),
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

	onStartYearChange(startYear) {
		if (startYear == 'select') {
			this.provideStartYearShow = true;
			this.startYearErrorShow = false;
			this.form.get('started').setErrors({'incorrect': true});
		} else {
			this.provideStartYearShow = false;
			this.startYear=startYear;
			if (this.startYear>this.endYear) {
				this.startYearErrorShow = true;
				this.form.get('started').setErrors({'incorrect': true});
			} else if (this.startYear <= this.endYear) {
				this.startYearErrorShow = false;
				this.endYearErrorShow = false;
				this.form.get('started').setErrors(null);
			}
		}	
	}

	onEndYearChange(endYear) {
		if (endYear == 'select') {
			this.provideEndYearShow = true;
			this.endYearErrorShow = false;
			this.form.get('ended').setErrors({'incorrect': true});
		} else {
			this.provideEndYearShow = false;
			this.endYear=endYear;
			if (this.startYear>this.endYear) {
				this.endYearErrorShow = true;
				this.form.get('ended').setErrors({'incorrect': true});
			} else if(this.startYear <= this.endYear) {
				this.endYearErrorShow = false;
				this.startYearErrorShow = false;
				this.form.get('ended').setErrors(null);
			}
		}
	}

}
