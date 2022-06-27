import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../../../../environments/environment';

import { ShareModel } from '../../shared/models/share.model';
import { StudentProfileInteraction } from '../models/student-profile-visit';
import { RecruiterService } from '../services/recruiter.service';
import { ShareService } from '../services/share.service';
import { UserService } from '../../shared/shared.module';

@Component({
	selector: 'app-share-modal',
	templateUrl: './share-modal.component.html'
})

export class ShareModalComponent implements OnInit {

	@Input() student_id: string;
	@Input() recruiter_id: string;

	model = new ShareModel({});
	form: FormGroup;
	role: string;
	name: string;
	link: string;
	additionalMsg: string;
	feedback = '';
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;

	constructor(
		private shareService: ShareService,
		public activeModal: NgbActiveModal,
		private recruiterService:RecruiterService,
		private userService: UserService
	) {
		this.form = new FormGroup({
			email: new FormControl( '', [Validators.required, Validators.email] ),
			link: new FormControl( '', [Validators.required] ),
			additionalMsg: new FormControl( '', [Validators.required] )
		});
	}

	ngOnInit() {
		this.role = this.userService.currentUser.role
		this.name = this.userService.currentUser.first_name + ' ' + this.userService.currentUser.last_name
		
		if (this.recruiter_id != undefined) {
			this.link = environment.uiUrl + '/recruiter/share/student/' + this.student_id;
			this.additionalMsg = this.name + ' Thinks you might like their profile they have on Accoladi.com!';
		} else {
			if (this.role === 'Teacher') {
				this.link = environment.uiUrl + '/teacher/share/teacher/' + this.student_id;
				this.additionalMsg = this.name + ' Thinks you might like their profile they have on Accoladi.com!';
			} else {
				this.link = environment.uiUrl + '/student/share/student/' + this.student_id;
				this.additionalMsg = this.name + ' Thinks you might like their profile they have on Accoladi.com!';
			}
		}
		
		this.form.get('link').setValue(this.link);
		this.form.get('additionalMsg').setValue(this.additionalMsg);
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
			email: this.form.get('email').value,
			link: this.form.get('link').value,
			additionalMsg: this.form.get('additionalMsg').value
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

	submitForm() { console.log(this.formModel);
		if (!this.loading) {
			this.loading = true;
			this.submitAttempted = true;
			this.requestFailed = this.requestSuccess = false;

			if (this.form.valid) {

				if (this.recruiter_id !== undefined) {
					this.shareService
						.sendLink(
							this.recruiter_id,
							new ShareModel(this.formModel)
						)
						.subscribe(
							(response: any) => {
								this.feedback = response.message;
								this.requestSuccess = true;
								setTimeout(() => {
									this.loading = false;
									this.form.reset();
									this.activeModal.close(response.data);
								}, 2000);
							},
							err => {
								console.error('SA.recruiter.share.component - sendLink', err);
								this.loading = false;
								this.feedback = 'Failed to send Link';
								this.requestFailed = true;
							}
						);
						let viewProfileLog: StudentProfileInteraction = {
							student_id: this.student_id,
							searcher_id: this.recruiter_id,
							actions:{
								shared:true
							}
						}		
						this.recruiterService
							.recruiterViewedProfile(
								viewProfileLog,
								'shared'
							)
							.subscribe(
								res => {
									console.log(res);
								},
								error => {
									console.log(error);
								}
							)
							
				} else {
					
					if (this.role=='Teacher') {
						this.shareService
							.sendLinkbByTeacher(
								this.userService.currentUser._id, 
								new ShareModel(this.formModel)
							)
							.subscribe(
								(response: any) => {
									this.feedback = response.message;
									this.requestSuccess = true;
									setTimeout(() => {
										this.loading = false;
										this.resetForm();
										this.activeModal.close(response.data);
									}, 2000);
								},
								err => {
									console.error('SA.recruiter.share.component - sendLink', err);
									this.loading = false;
									this.feedback = 'Failed to send Link';
									this.requestFailed = true;
								}
							);

					} else if (this.role=='Student') {
						this.shareService
							.sendLinkbByStudent(
								this.student_id, 
								new ShareModel(this.formModel)
							)
							.subscribe(
								(response: any) => {
									this.feedback = response.message;
									this.requestSuccess = true;
									setTimeout(() => {
										this.loading = false;
										this.resetForm();
										this.activeModal.close(response.data);
									}, 2000);
								},
								err => {
									console.error('SA.recruiter.share.component - sendLink', err);
									this.loading = false;
									this.feedback = 'Failed to send Link';
									this.requestFailed = true;
								}
							);
					}

				}

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
