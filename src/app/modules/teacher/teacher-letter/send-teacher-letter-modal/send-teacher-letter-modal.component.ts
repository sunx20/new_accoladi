import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable, of } from 'rxjs';
import {
	catchError,
	debounceTime,
	distinctUntilChanged,
	filter,
	map,
	tap,
	switchMap
} from 'rxjs/operators';

import { UserModel } from '../../../../modules/shared/shared.module';
import { LetterModel } from '../../models/letter.model';
import { TeacherService } from '../../services/teacher.service';
import { TeacherLetterService } from '../../services/letter.service';
import { CollegePreferenceService } from '../../../../modules/student/student.module';


@Component({
	selector: 'app-send-teacher-letter-modal',
	templateUrl: './send-teacher-letter-modal.component.html'
})

export class SendTeacherLetterModalComponent implements OnInit {

	@Input() student_id: string;
	@Input() teacher_id: string;

	teacher = new UserModel({});
	model = new LetterModel({});

	form: FormGroup;
	letterTypes: any[];
	feedback = '';
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	searchingFaculties = false;
	searchFailed = false;

	constructor(
		private teacherService: TeacherService,
		private letterService: TeacherLetterService,
		private collegePreferenceService: CollegePreferenceService,
		public activeModal: NgbActiveModal,
	) {

		this.form = new FormGroup({
			faculty: new FormControl( '' ),
			faculty_id: new FormControl( '' ),
			toEmail: new FormControl( false ),
			email: new FormControl( '', [Validators.email] ),
			subject: new FormControl( '', [Validators.required] ),
			body: new FormControl( '', [Validators.required] ),
		});

		this.letterTypes = [
			{
				type: 'referral',
				display: 'Write letter of recommendation'
			}
		];

	}

	ngOnInit() {
		this.getMyProfile();
		this.respondToEmailChange();
		this.form.get('subject').setValue('referral');
		this.form.get('subject').disable();
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		let toFaculty = this.form.get('faculty_id').value;
		let to = toFaculty ? toFaculty : '';
		let receiver = toFaculty ? 'faculty' : '';

		return {
			to: to,
			receiver: receiver,
			toEmail: this.form.get('toEmail').value,
			email: this.form.get('email').value,
			subject: this.form.get('subject').value,
			body: this.form.get('body').value,
		};
	}

	// convenience getter for easy access to form fields
	get f() { 
		return this.form.controls; 
	}

	respondToEmailChange() {
		this.form.get( 'toEmail' )
			.valueChanges
			.subscribe(
				val => {
					this.form.get('email').setValue('');
					this.form.get('faculty').setValue('');
					this.form.get('faculty_id').setValue('');
				}
			);
	}

	getMyProfile() {
		this.teacherService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.teacher = response.data;
				},
				err => {
					console.error('SA.send.send.letter.component - getUser', err);
				}
			);
	}

	searchFaculties = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			filter(term => term.length > 2),
			tap(() => this.searchingFaculties = true),
			switchMap(term =>
				this.collegePreferenceService
					.getStudentFaculty(
						this.student_id,term
					)
					.pipe(
						map((res: any) => res.data),
						tap(() => this.searchFailed = false),
						catchError(() => {
							this.searchFailed = true;
							return of([]);
						})
					)
			),
			tap(() => {
				this.searchingFaculties = false;
			})
		)

	selectedFaculty = (e: any) => {
		const item = e.item;
		this.form.get('faculty_id').setValue(item._id);
	}

	formatMatches = (item: any) => {
		if (!item) return '';

		return item.first_name + ' ' + item.last_name;
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

			if (this.form.valid) {

				this.letterService
					.sendReferralLetter(
						this.teacher._id, 
						this.student_id , 
						new LetterModel(this.formModel)
					)
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.feedback = response.message;
							this.requestSuccess = true;	
							setTimeout(() => {
								this.activeModal.close(response.data);
							}, 2000);
						},
						err => {
							console.error('SA.send.send.letter.component - sendLetter', err);
							this.loading = false;
							this.feedback = 'Failed to send letter';
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
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

}