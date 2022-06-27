import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SchoolProfileComponent } from '../school-profile/school-profile.component';
import { ListService } from '../../../../student/services/list.service';
import { GoogleAnalyticsEventsService } from '../../../services/ga.event.service';
import { TalentService } from '../../../../student/services/talent.service';
import { StudentService } from '../../../../student/services/student.service';
import { UserModel } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { TalentModel } from '../../../../student/models/talent.model';
import { ParentProfileComponent } from '../parent-profile/parent-profile.component';

@Component({
  selector: 'app-talent-profile',
  templateUrl: './talent-profile.component.html',
  styleUrls: ['./talent-profile.component.css']
})
export class TalentProfileComponent implements OnInit {
   
  student_id: string;
	student = new UserModel({});
	form: FormGroup;
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	families: string[];
	instruments: any[];
	years: string[];
	selectedFamily = '';
	feedback = '';
	selectedStyles = '';
	selectedEmphasis = '';
  @Output() openProfile = new EventEmitter();
  
	styles = [
		{ id: 1, name: 'Jazz' },
		{ id: 2, name: 'Blues' },
		{ id: 3, name: 'Folk' },
		{ id: 4, name: 'Popular' },
		{ id: 5, name: 'Classical' },
		{ id: 6, name: 'Opera' },
		{ id: 7, name: 'Musical Theater' },
		{ id: 8, name: 'Electronic' }
	];

	emphasis = [
		{ id: 1, name: 'Performance' },
		{ id: 2, name: 'Composition' },
		{ id: 3, name: 'Production / Engineering' },
		{ id: 4, name: 'Song Writing' },
		{ id: 5, name: 'Conducting' },
		//{ id: 6, name: 'Music Business' }		
	];

	constructor(
    private modalService: NgbModal,
		private studentService: StudentService,
		public activeModal: NgbActiveModal,
		private talentService: TalentService,
    private listService:ListService,
    private userService:UserService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		this.form = new FormGroup({
			family: new FormControl('', [Validators.required]),
			instrument: new FormControl('', [Validators.required]),
			range: new FormControl(''),
			primary: new FormControl(''),
			year_started: new FormControl('', [Validators.required]),
			reg1_range: new FormControl(''),
			reg2_range: new FormControl(''),
			reg3_range: new FormControl(''),
			reg4_range: new FormControl(''),
			styles: new FormArray([]),
			emphasis: new FormArray([]),
		});

		this.families = [];
		this.instruments = [];
		this.years = this.genYears();
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

	ngOnInit() {
		this.listService.getFamiliesList()
		.subscribe(
			(response: any) => {
				this.families = response.data;
			},
			err => {
				console.error( 'SA.talentInfo.talentInfo-form.component - getFamiliesList', err );
			}
		);
    
    this.student_id=this.userService.currentUser._id; 
		this.getMyProfile();
		this.respondToFamilyChange();
	}

	getMyProfile() {
		this.studentService.getStudentById(this.student_id)
			.subscribe(
				(response: any) => {
					this.student = response.data;
				},
				err => {
					console.error( 'SA.talentInfo.talentInfo-form.component - getUser', err );
				}
			);
	}

	genYears() {
		const currentYear = new Date().getFullYear();
		const years = [];
		let startYear = currentYear - 20 || 2000;
		while (startYear <= currentYear) {
			years.push(startYear++);
		}

		return years;
	}

	respondToFamilyChange() {
		this.form.get('family').valueChanges.subscribe(val => {
			this.selectedFamily = val;

			if (val === 'String' || val === 'Percussion') {
				this.form.get('range').setValue('');
				this.form.get('reg1_range').setValue('');
				this.form.get('reg2_range').setValue('');
				this.form.get('reg3_range').setValue('');
				this.form.get('reg4_range').setValue('');
			}

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
		return {
			family: this.form.get('family').value,
			talent: this.form.get('instrument').value,
			range: this.form.get('range').value,
			primary: this.form.get('primary').value,
			year_started: this.form.get('year_started').value,
			reg1_range: this.form.get('reg1_range').value,
			reg2_range: this.form.get('reg2_range').value,
			reg3_range: this.form.get('reg3_range').value,
			reg4_range: this.form.get('reg4_range').value,
			styles:this.selectedStyles,
			emphasis:this.selectedEmphasis
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
			console.log( 'SA.talentInfo.talentInfo-form.component - createStudentTalent' );

			var x = this.formModel;

			this.selectedStyles = this.form.value.styles
				.map((checked, index) => checked ? this.styles[index].name : null)
				.filter(value => value !== null);

			this.selectedEmphasis = this.form.value.emphasis
			.map((checked, index) => checked ? this.emphasis[index].name : null)
			.filter(value => value !== null);

			this.loading = true;
			this.submitAttempted = true;
			this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Student Talent Form', 19000);
			this.requestFailed = this.requestSuccess = false;

			if (this.form.valid) {

				this.talentService.createStudentTalent(this.student_id, new TalentModel(this.formModel))
					.subscribe(
						(response: any) => {
							
							this.student = response.data;
							this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Student Talent Form', 19100);
							this.feedback = 'Talent information added';
							this.requestSuccess = true;
							
							setTimeout(() => {
								this.loading = false;
								this.resetForm();
							}, 2000);

						},
						err => {
							this.loading = false;
							console.error( 'SA.talentInfo.talentInfo-form.component - createStudentTalent', err );
							this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Student Talent Form', 19200);
							this.feedback = 'Unable to add talent information';
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
		this.googleAnalyticsEventsService.emitEvent('Public', 'Form Submition', 'Form Field: ' + this.form.get(fieldName), 19300);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

  submitAndNext() {
    this.openProfile.emit({ action:"openSchool"});
  }

  BackToPreviousProfile(){
    this.openProfile.emit({ action:"openParent"});
  }

}

