
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StudentService } from '../../../../../student/services/student.service';
import { DanceService } from '../../../../../student/services/dance.service';
import { GoogleAnalyticsEventsService } from '../../../../../shared/services/ga.event.service';

import { UserModel } from '../../../../../shared/models/user.model';
import { DanceModel } from '../../../../../student/models/dance.model';

@Component({
	selector: 'app-update-dance-model',
	templateUrl: './update-dance-model.component.html',
})

export class UpdateDanceModelComponent implements OnInit {

	@Input() student_id: string;
	@Input() danceid: string;

	form: FormGroup;
	student = new UserModel({});
	model = new DanceModel({});
	loading: boolean = false;
	requestFailed: boolean = false;
	requestSuccess: boolean = false;
	searchFailed: boolean = false;
	searchingCompositions: boolean = false;
	submitAttempted: boolean = false;
	date_performed?: Date;
	feedback: string = '';
	video_url: string = '';
	videoUrl: string = '';
	years: number[] = [];
	currentYear: number;

	constructor(
		private studentService: StudentService,
		private danceService: DanceService,
		public activeModal: NgbActiveModal,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService
	) {

		this.form = new FormGroup({
			_id: new FormControl('', []),
			piece: new FormControl('', [Validators.required]),
			type: new FormControl('', [Validators.required]),
			style: new FormControl('', [Validators.required]),
			company: new FormControl('', []),
			show: new FormControl('', []),
			role: new FormControl('', []),
			performed_at: new FormControl('', []),
			school_grade: new FormControl('', []),
			video_url: new FormControl('', []),
			comments: new FormControl('', []),
		});

	}

	ngOnInit() {

		this.getMyProfile();

	}

	get formDisabled() {

		return this.loading === true;

	}

	get formModel() {

		return {
			_id: this.form.get('_id').value,
			piece: this.form.get('piece').value,
			type: this.form.get('type').value,
			style: this.form.get('style').value,
			company: this.form.get('company').value,
			show: this.form.get('show').value,
			role: this.form.get('role').value,
			performed_at: this.form.get('performed_at').value,
			school_grade: this.form.get('school_grade').value,
			video_url: this.form.get('video_url').value,
			comments: this.form.get('comments').value,
		};

	}

	getMyProfile() {

		this.studentService.getStudentById(this.student_id).subscribe(
			(response: any) => {
				this.student = response.data;
				this.updateForm();
			},
			err => {
				console.error( 'SA.danceHistory.danceHistory-form.component - getUser', err );
			}
		);

	}

	displayFieldCss(field: string) {

		return {
			'has-error': this.isFieldInvalid(field),
			'has-feedback': this.isFieldInvalid(field)
		};

	}

	updateForm() {

		let dance = this.student.dance.find(p => {
			return p._id === this.danceid;
		});

		console.log(dance);

		this.form.setValue({
			_id: dance._id || '',
			piece: dance.piece || '',
			type: dance.type || '',
			style: dance.style || '',
			company: dance.company || '',
			show: dance.show || '',
			role: dance.role || '',
			performed_at: dance.performed_at || '',
			school_grade: dance.school_grade || '',
			video_url: dance.video_url || '',
			comments: dance.comments || ''
		});

	}

	resetForm() {

		this.form.reset();
		this.submitAttempted = false;

	}

	submitForm() {
		if (!this.loading) {

			this.loading = true;
			this.submitAttempted = true;
			this.googleAnalyticsEventsService.emitEvent(
				'Public',
				'Form Submition',
				'Dance Form',
				20030
			);

			this.requestFailed = this.requestSuccess = false;

			if (this.form.valid) {

				this.danceService
					.updateStudentDance(
						this.student_id,
						new DanceModel(this.formModel)
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.student = response.data;
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Dance History Form',
								19100
							);
							this.feedback = 'Dance information updated';

							this.requestSuccess = true;


							setTimeout(() => {
								this.activeModal.close(this.student);
							}, 2000);
						},
						err => {
							this.loading = false;
							console.error(
								'SA.danceHistory.dance-form.component - putUserDance',
								err
							);
							this.googleAnalyticsEventsService.emitEvent(
								'Public',
								'Form Submition',
								'Dance Form',
								20230
							);
							this.feedback =
								'Unable to update dance information';
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
			'Dance Form FormField: ' + this.form.get(fieldName),
			20330
		);

		return field.invalid && (field.touched || this.submitAttempted);

	}

	close() {

		this.activeModal.dismiss('Cross click');

	}

	getVideoUrl(url:any) {
		this.videoUrl = url;
	}

}