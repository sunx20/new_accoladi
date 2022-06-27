import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StudentService } from '../../../../../student/services/student.service';
import { MusicalTheaterService } from '../../../../../student/services/musical-theater.service';
import { TalentService } from '../../../../../student/services/talent.service';
import {ListService} from '../../../../../student/services/list.service';

import { MusicalTheaterModel } from '../../../../../student/models/musical-theater.model';

import {
	CatalogService,
	GoogleAnalyticsEventsService,
	UserModel
} from '../../../../../shared/shared.module';

@Component({
	selector: 'app-update-musical-theater-modal',
	templateUrl: './update-musical-theater-modal.component.html'
})

export class UpdateMusicalTheaterModalComponent implements OnInit {

	@Input() student_id: string;
	@Input() mtid: string;

	searchingCompositions = false;
	searchFailed = false;
	student = new UserModel({});
	model = new MusicalTheaterModel({});
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
		private mtService: MusicalTheaterService,
		public activeModal: NgbActiveModal,
		private router: Router,
		private catalogService: CatalogService,
		private talentService: TalentService,
		private listService:ListService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {
		this.form = new FormGroup({
			show: new FormControl('', [Validators.required]),
			role: new FormControl('', [Validators.required]),
			piece: new FormControl('', [Validators.required]),
			date_performed: new FormControl('', []),
			school_grade: new FormControl('', []),
			type: new FormControl('', [Validators.required]),
			family: new FormControl('', [Validators.required]),
			instrument: new FormControl('', [Validators.required]),
			video_url: new FormControl('', []),
			comments: new FormControl('', []),
		});

		this.families = [];
		this.instruments = [];
		this.types = [];
		this.grades = [];
	}

	ngOnInit() {
		this.listService.getMusicalTheaterTypes()
		.subscribe(
			(response: any) => {
				this.types = response.data;
			},
			err => {
				console.error('SA.musicalTheaterHistory.musicalTheaterHistory-form.component - getMusicalTheaterTypes', err);
			}
		);

		this.listService.getFamiliesList()
		.subscribe(
			(response: any) => {
				this.families = response.data;
			},
			err => {
				console.error('SA.musicalTheaterHistory.musical-theater-form.component - getFamiliesList', err);
			}
		);

		this.listService.getGrades()
		.subscribe(
			(response: any) => {
				this.grades = response.data;
			},
			err => {
				console.error('SA.musicalTheaterHistory.musical-theater-form.component - getGrades', err);
			}
		);

		this.getMyProfile();
		this.getTalent();
		this.respondToFamilyChange();
		this.respondToTypeChange();
		this.getYearList();
	}

	getMyProfile() {
		this.studentService.getStudentById(this.student_id).subscribe(
			(response: any) => {
				this.student = response.data;
				this.updateForm();
			},
			err => {
				console.error('SA.musicalTheaterHistory.musicalTheaterHistory-form.component - getUser', err);
			}
		);
	}

	updateForm() {
		let mt = this.student.musical_theater.find(p => {
			return p._id === this.mtid;
		});

		console.log(mt);

		this.form.setValue({
			show: mt.show || '',
			role: mt.role || '',
			piece: mt.piece || '',
			school_grade: mt.school_grade || '',
			date_performed: mt.date_performed || '',
			type: mt.type || '',
			family: mt.family || '',
			instrument: mt.instrument || '',
			video_url: mt.video_url || '',
			comments: mt.comments || '',
		});
	}

	getTalent() {
		this.talentService.getTalent().subscribe(
			(response: any) => {
				this.instruments = response.data;
			},
			err => {
				console.error(
					'SA.musicalTheaterHistory.musical-theater-form.component - getTalent',
					err
				);
			}
		);
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
			if (val === 'Cast/Chorus') {
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
		return {
			_id: this.mtid,
			piece: this.form.get('piece').value,
			family: this.form.get('family').value,
			instrument: this.form.get('instrument').value,
			type: this.form.get('type').value,
			date_performed: this.form.get('date_performed').value,
			school_grade: this.form.get('school_grade').value,
			show: this.form.get('show').value,
			role: this.form.get('role').value,
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
			'Musical Theater Form',
			20030
		);

		this.requestFailed = this.requestSuccess = false;

		if (this.form.valid) {
			this.mtService
				.updateStudentMT(
					this.student_id,
					new MusicalTheaterModel(this.formModel)
				)
				.subscribe(
					(response: any) => {
						this.loading = false;
						this.student = response.data;
						this.googleAnalyticsEventsService.emitEvent(
							'Public',
							'Form Submition',
							'MusicalTheater History Form',
							19100
						);
						this.feedback = 'Musical theater information updated';
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
							'SA.musicalTheaterHistory.musical-theater-form.component - putUserMusicalTheater',
							err
						);
						this.googleAnalyticsEventsService.emitEvent(
							'Public',
							'Form Submition',
							'Musical Theater Form',
							20230
						);
						this.feedback =
							'Unable to update musical theater information';
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
			'Musical Theater Form FormField: ' + this.form.get(fieldName),
			20330
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
