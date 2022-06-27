import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserModel } from '../../../../../shared/models/user.model';
import { InviteModel } from '../../../../../shared/models/invite.model';

import { InviteService } from '../../../../../shared/services/invite.service';
import { StudentService } from '../../../../../student/services/student.service';

@Component({
	selector: 'app-student-invite-modal',
	templateUrl: './invite-modal.component.html'
})

export class InviteModalComponent implements OnInit {

	@Input() student_id: string;

	student = new UserModel({});
	model = new InviteModel({});
	messageTypes: any[];
	form: FormGroup;
	pretypedMessage = '';
	feedback = '';
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;

	constructor(
		private studentService: StudentService,
		private inviteService: InviteService,
		public activeModal: NgbActiveModal
	) {
		this.form = new FormGroup({
			type: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			additionalMsg: new FormControl('')
		});

		this.messageTypes = [
			{
				type: 'Friend',
				display: 'Invite someone learn about Accoladi.com',
				message: `
Join me on Accoladi.com!

I’m using Accoladi.com to store and organize my performing arts history and repertoire.
My performance history is searchable by some of the best colleges and universities in the country so they can offer scholarships I never knew I was eligible for!

I think you might like to use Accoladi.com, too. Tell them I referred you!`
			},
			{
				type: 'Parent',
				display:
					'Invite a Parent to see your Accoladi.com account',
				message: `
Join me on Accoladi.com!

I’m using Accoladi.com to store and organize my performing arts history and repertoire.
My performance history is searchable by some of the best colleges and universities in the country so they can offer scholarships I never knew I was eligible for!

You are my parent and I could use your help with all the information that is available, please sign-up and help me in my quest for the best fine arts scholarships available. Click here to join or accept my invitation Accoladi.com`
			},
			{
				type: 'Teacher',
				display: 'Invite a Teacher',
				message: `
Follow me on Accoladi.com!

I’m using Accoladi.com to store and organize my performing arts history and repertoire.
My performance history is searchable by some of the best colleges and universities in the country so they can offer scholarships I never knew I was eligible for!

You are my teacher and I could use your help with all the information that is available, please sign-up and help me in my quest for the best fine arts scholarships available. Click here to join or accept my invitation Accoladi.com`
			},
			{
				type: 'Sponsor',
				display:
					'Invite someone to sponsor your journey with Accoladi.com',
				message: `
Join me on Accoladi.com!

I’m using Accoladi.com to store and organize my performing arts history and repertoire.
My performance history is searchable by some of the best colleges and universities in the country so they can offer scholarships I never knew I was eligible for!

I am well on my way to pursuing a scholarship, but I could use some help with the resources provided by Accoladi.com, would you consider sponsoring my membership? you can read more about it here at Accoladi.com`
			}
		];
	}

	ngOnInit() {
		this.getMyProfile();
		this.respondToMessageTypeChange();
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.form.controls;
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			type: this.form.get('type').value,
			email: this.form.get('email').value,
			additionalMsg: this.form.get('additionalMsg').value
		};
	}

	respondToMessageTypeChange() {
		this.form.get('type').valueChanges.subscribe(val => {
			this.pretypedMessage = this.messageTypes
				.filter(m => m.type == val)
				.map(m => m.message)
				.pop();
		});
	}

	getMyProfile() {
		this.studentService.getStudentById(this.student_id).subscribe(
			(response: any) => {
				this.student = response.data;
			},
			err => {
				console.error( 'SA.invite.invite.sponsor.component - getUser', err );
			}
		);
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
				this.inviteService
					.sendInvitation(
						this.student, 
						new InviteModel(this.formModel)
					)
					.subscribe(
						(response: any) => {
							this.feedback = response.message;
							this.requestSuccess = true;
							setTimeout(() => {
								this.loading = false;
								this.activeModal.close(response.data);
							}, 2000);
						},
						err => {
							console.error( 'SA.invite.invite.sponsor.component - sendInvitation', err );
							this.loading = false;
							this.feedback = 'Failed to send invitation';
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