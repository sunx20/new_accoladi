import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserModel } from '../../../../shared/models/user.model';
import { ListService } from '../../../../../modules/student/services/list.service';
import { TalentService } from '../../../../../modules/student/services/talent.service';
import { GoogleAnalyticsEventsService } from '../../../../../modules/shared/services/ga.event.service';
import { StudentService } from '../../../../student/services/student.service';

@Component({
	selector: 'app-talent-info',
	templateUrl: './talent-info.component.html',
	styleUrls: ['./talent-info.component.css']
})

export class TalentInfoComponent implements OnInit {

	@Input() student_Id: string;
	@Input() user_id: string;
	@Input() type: string;
	@Input() role: string;
	@Input() childData: any;
	@Input() seid: string;

	@Output() saveEmitter = new EventEmitter();

	student = new UserModel({});

	form: FormGroup;
	feedback = '';
	talents: any[];
	families: string[];
	states: any[];
	searchingCompositions = false;
	searchFailed = false;
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;

	constructor(
		private studentService: StudentService, 
		private listService: ListService, 
		private router: Router, 
		private talentService: TalentService, 
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
	) {
		this.form = new FormGroup({
			family: new FormControl( '', Validators.required ),
			talent: new FormControl( '', Validators.required )
		});

		this.families = [];
		this.talents = [];
	}

	ngOnInit() {
		this.listService
			.getFamiliesList()
			.subscribe(
				(response: any) => {
					this.families = response.data;
				},
				err => {
					console.error('SA.extraCurricular.summerEnrichment-form.component - getFamiliesList', err);
				}
			);

		this.talentService
			.getTalent()
			.subscribe(
				(response: any) => {
					this.talents = response.data;
				},
				err => {
					console.error('SA.extraCurricular.summerEnrichment-form.component - getTalent', err);
				}
			);
		this.respondToFamilyChange();
		this.getMyProfile()
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			family: this.form.get('family').value,
			talent: this.form.get('talent').value,

		};
	}

	respondToFamilyChange() {
		this.form.get('family').valueChanges.subscribe(val => {
			this.talentService
				.getTalentByFamily(
					val
				)
				.subscribe(
					(response: any) => {
						this.talents = response.data;
						if (
							!this.talents.find(
								i => i.name === this.form.get('talent').value
							)
						) {
							this.form.get('talent').setValue('');
						}
					},
					err => {
						console.error(
							'SA.extracurricular.summer-enrichment-form.component - getTalentByFamily',
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
			this.googleAnalyticsEventsService.emitEvent(
				'Public',
				'Form Submition',
				'Register Wizard - Talent Form',
				19000
			);
			this.requestFailed = this.requestSuccess = false;
			if (this.form.valid) {
				this.talentService
					.createStudentTalent(
						this.user_id, 
						this.formModel
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.requestSuccess = true;
							this.student = response.data;
							this.feedback = 'Talent updated';
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Register Wizard - Talent Form - success',
								19100
							);

							let emit = {
								user_Id: this.user_id,
								student_id: '',
								message: 'TalentInfoSuccess',
								btnType: 'Continue',
								role: this.role,
								type: this.type,
							}
							this.saveEmitter.emit(emit);
						},
						err => {
							this.loading = false;
							this.requestFailed = true;
							this.feedback = 'Unable to update Talent information';
							console.error( 'SA.register-wizard.talent-form.component - putUserTalent', err );
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Register Wizard - Talent Form',
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
		this.googleAnalyticsEventsService.emitEvent(
			'Public',
			'Form Submition',
			'Register Wizard - Form FormField: ' + this.form.get(fieldName),
			20340
		);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	onClickBack() {
		let emit = {
			message: 'BackTalentInfo',
			btnType: 'Back',
			role: this.role,
			type: this.type,
			user_Id: this.user_id,
			childData: this.childData
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
					console.error(
						'SA.register-wizard.talent-form.component - getProfile',
						err
					);
				}
			);
	}

	updateForm(student) {
		if (student.talents.legnth > 0) {
			this.form.setValue({
				family: student.talents[0].family || '',
				talent: student.talents[0].talent || '',
			});
		}

	}

}