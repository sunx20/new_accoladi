import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MessagesService } from '../../../services/messages.service';
import { UserService } from '../../../services/user.service';

import { MessageFormModel } from '../../../models/message.model';
import { UserModel } from '../../../models/user.model';
import { StudentProfileInteraction } from '../../../../recruiter/models/student-profile-visit';
import { RecruiterService } from '../../../../recruiter/services/recruiter.service';
import { TeacherService } from '../../../../teacher/services/teacher.service';
@Component({
	selector: 'app-enter-conversation-modal',
	templateUrl: './enter-conversation-modal.component.html',
	styleUrls: ['./enter-conversation-modal.component.css']
})
export class EnterConversationModalComponent implements OnInit {

	@ViewChild('scrollBottom') private myScrollContainer: ElementRef;

	@Input() user_id: string;
	@Input() thread_id: string;
	@Input() recipient_id: string;
	@Input() oppositePersonId: string;

	user = new UserModel({});
	model = new MessageFormModel({});
	searchingUsers = false;
	searchFailed = false;
	currentThread: any[];
	currentThreadMsgs: any[];
	userMessageRecipients: any[];
	priorities: string[];
	receiverUsername: string = '';
	form: FormGroup;
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';

	constructor(
		private userService: UserService,
		private messagesService: MessagesService,
		public activeModal: NgbActiveModal,
		public recruiterService: RecruiterService,
		public teacherService: TeacherService
	) {

		this.form = new FormGroup({
			thread: new FormControl(''),
			to: new FormControl(''),
			priority: new FormControl(''),
			msg: new FormControl('', [Validators.required]),
		});

		this.currentThread = [];
		this.currentThreadMsgs = [];
		this.priorities = ['High', 'Normal', 'Low'];
		this.userMessageRecipients = [];
	}

	ngOnInit() {

		if (this.recipient_id) {
			this.userService.getUserProfile(this.recipient_id)
				.subscribe((response: any) => {
					this.userMessageRecipients.push({
						_id: this.recipient_id,
						first_name: response.data.first_name,
						last_name: response.data.last_name,
						username: response.data.username
					});

					this.form.get('to').setValue(this.recipient_id);
					this.form.get('to').disable();
				});

		} else if (this.userService.currentUser.role == 'Teacher') {
			this.teacherService.getUserStudents().subscribe((response: any) =>{
				response.data.forEach(element =>{
					this.userMessageRecipients.push({
						_id: element._id,
						first_name: element.first_name,
						last_name: element.last_name,
						username: element.username
					})
				})
			})

		} else {

			this.messagesService.getRecipientsByUser(this.user_id)
				.subscribe((response: any) => {
					console.log(response);
					this.userMessageRecipients = response.data;
				});

		}

		if (this.thread_id) {
			this.getThread(this.thread_id);
		}

	}

	scrollToBottom(): void {
		try {
			this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
		} catch (err) { }
	}

	getThread(thread_id: string, msgCount: number = 50) {
		this.messagesService.getUserThreadById(this.user_id, thread_id, msgCount)
			.subscribe(
				(response: any) => {
					console.log(response);
					this.currentThread = response.thread;
					this.currentThreadMsgs = response.data;
					this.form.get('thread').setValue(thread_id);

					this.receiverUsername = response.thread
						.user_ids
						.filter(u => u._id !== this.user_id)
						.map(u => u.username ? u.username : 'Anonymous')
						.join(', ');

					setTimeout(() => this.scrollToBottom(), 100);

				});
	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			thread: this.form.get('thread').value || '',
			to: this.form.get('to').value,
			priority: this.form.get('priority').value,
			msg: this.form.get('msg').value,
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

	closeModal() {
		this.activeModal.close('reload');
	}

	submitForm() {
		if (!this.loading) {
			this.loading = true;
			this.submitAttempted = true;
			this.requestFailed = this.requestSuccess = false;

			if (this.form.valid) {
				this.messagesService.sendMessage(this.user_id, new MessageFormModel(this.formModel))
					.subscribe(
						(response: any) => {
							this.loading = false;
							this.getThread(response.data.thread_id)

							if (this.recipient_id == undefined) {
								this.recipient_id = this.formModel.to
							}

							if (this.recipient_id == "") {
								this.recipient_id = this.oppositePersonId;
							}
							let viewProfileLog: StudentProfileInteraction = {
								student_id: this.recipient_id,
								searcher_id: this.user_id,
								actions: {
									rated: true
								}
							}
							this.form.get('msg').setValue("");
							this.recruiterService.recruiterViewedProfile(viewProfileLog, "commented").subscribe(
								res => {

									console.log(res);
								},
								error => {
									console.log(error);
								}
							)
						},
						err => {
							this.loading = false;
							this.feedback = 'Failed to send message';
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