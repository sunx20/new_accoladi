import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

import { StudentService } from '../../../../student/services/student.service';
import { LetterService } from '../../../../student/services/letter.service';

import { CollegePreferenceService } from '../../../../student/services/college-preference.service';
import { LetterModel } from '../../../../student/models/letter.model';

import { UserModel } from '../../../../shared/shared.module';

@Component({
	selector: 'app-send-letter-modal',
	templateUrl: './send-letter-modal.component.html'
})

export class SendLetterModalComponent implements OnInit {

	@Input() student_id: string;

	student = new UserModel({});
	model = new LetterModel({});
	form: FormGroup;
	letterTypes: any[];
	educatorsList: any[];
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	searchingFaculties = false;
	searchFailed = false;
	feedback = '';

	constructor(
		private studentService: StudentService,
		private letterService: LetterService,
		private collegePreferenceService: CollegePreferenceService,
		public activeModal: NgbActiveModal,
		private router: Router
	) {
		this.form = new FormGroup({
			educator: new FormControl(''),
			faculty: new FormControl(''),
			faculty_id: new FormControl(''),
			toEmail: new FormControl(false),
			email: new FormControl('', [Validators.email]),
			subject: new FormControl('', [Validators.required]),
			body: new FormControl('', [Validators.required])
		});

		this.letterTypes = [
			{
				type: 'request',
				display: 'Request letter of recommendation'
			},
			{
				type: 'referral',
				display: 'Referral letter of reference'
			},
			{
				type: 'introduction',
				display: 'Write letter of introduction'
			}
		];

		this.educatorsList = [];
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		const toFaculty = this.form.get('faculty_id').value;
		const toEducator = this.form.get('educator').value;
		const to = toFaculty ? toFaculty : toEducator ? toEducator : '';
		const receiver = toFaculty ? 'faculty' : toEducator ? 'educator' : '';

		return {
			to: to,
			receiver: receiver,
			toEmail: this.form.get('toEmail').value,
			email: this.form.get('email').value,
			subject: this.form.get('subject').value,
			body: this.form.get('body').value
		};
	}

	ngOnInit() {
		this.getMyProfile();
		this.respondToLetterTypeChange();
		this.respondToEmailChange();
		this.getPrefillForLetters();
		this.getStudentTeachers();
	}

	getStudentTeachers() {
		this.studentService
			.getStudentTeachers(this.student_id)
			.subscribe((response: any) => {
				this.educatorsList = response.data;
			});
	}

	getPrefillForLetters() {
		this.letterService.getPrefills().subscribe((response: any) => {
			this.letterTypes = this.letterTypes
				.filter(t => t.type !== 'referral')
				.map(t => {
					return {
						...t,
						body: response.data[t.type]
					};
				});
		});
	}

	respondToLetterTypeChange() {
		this.form.get('subject').valueChanges.subscribe(val => {
			const pretypedMessage = this.letterTypes
				.filter(m => m.type == val)
				.map(m => m.body)
				.pop();
			this.form.get('body').setValue(pretypedMessage);
		});
	}

	respondToEmailChange() {
		this.form.get('toEmail').valueChanges.subscribe(val => {
			this.form.get('email').setValue('');
			this.form.get('faculty').setValue('');
			this.form.get('faculty_id').setValue('');
			this.form.get('educator').setValue('');
		});
	}

	getMyProfile() {
		this.studentService.getStudentById(this.student_id).subscribe(
			(response: any) => {
				this.student = response.data;
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
			tap(() => (this.searchingFaculties = true)),
			switchMap(term =>
				this.collegePreferenceService
					.getStudentFaculty(this.student_id, term)
					.pipe(
						map((res: any) => res.data),
						tap(() => (this.searchFailed = false)),
						catchError(() => {
							this.searchFailed = true;
							return of([]);
						})
					)
			),
			tap(() => {
				this.searchingFaculties = false;
			})
		);

	selectedFaculty = (e: any) => {
		const item = e.item;
		this.form.get('faculty_id').setValue(item._id);
	}

	formatMatches = (item: any) => {
		if (!item) {
			return '';
		}

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

	// convenience getter for easy access to form fields
	get f() {
		return this.form.controls;
	}

	submitForm() {
		if(!this.loading){
		this.loading = true;
		this.submitAttempted = true;
		this.requestFailed = this.requestSuccess = false;

		if (this.form.valid) {
			this.letterService
				.sendLetter(this.student, new LetterModel(this.formModel))
				.subscribe(
					(response: any) => {
						this.loading = false;
						this.feedback = response.message;
						//this.form.reset();
						this.requestSuccess = true;
							

						setTimeout(() => {
							//this.resetForm();
							this.activeModal.close(response.data);
						}, 2000);
					},
					err => {
						console.error(
							'SA.send.send.letter.component - sendLetter',
							err
						);
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
