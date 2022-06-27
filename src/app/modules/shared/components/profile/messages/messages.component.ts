import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Params } from "@angular/router";

import { StudentService } from "../../../../student/services/student.service";
import {
	UserModel,
	MessagesService,
	EnterConversationModalComponent,
	DeleteConversationModalComponent,
	UserService
} from "../../../../shared/shared.module";
import { TeacherService } from "../../../../teacher/services/teacher.service";
import { last } from "rxjs/operators";

@Component({
	selector: "app-student-messages",
	templateUrl: "./messages.component.html"
})
export class StudentMessagesComponent implements OnInit {
	student: UserModel;
	conversations = [];
	messageThreads: any[];
	messageThreadsForParent: any[];
	loadingMessages = false;
	notificationCollegeName = "";
	isNewNotification: boolean = false;
	constructor(
		private modalService: NgbModal,
		private messagesService: MessagesService,
		private studentService: StudentService,
		private route: ActivatedRoute,
		private userService: UserService,
		private teacherService: TeacherService
	) { }

	ngOnInit() {
		this.getMyProfile();
		this.getNotification();
	}

	getMyProfile() {
		this.studentService.getMyProfile().subscribe(
			(response: any) => {
				this.student = response.data;
				this.getThreads();
				this.handleRouteParams();
			},
			err => {
				console.error("Unable to get student profile", err);
			}
		);
	}

	handleRouteParams() {
		this.route.params.subscribe((params: Params) => {
			if (params["recipient"]) {
				this.newMessage(params["recipient"]);
			}
		});
	}

	newMessage(recipient_id: string = "") {
		const modalRef = this.modalService.open(
			EnterConversationModalComponent,
			{
				size: "lg"
			}
		);

		modalRef.componentInstance.user_id = this.student._id;
		if (recipient_id) {
			modalRef.componentInstance.recipient_id = recipient_id;
		}

		modalRef.result.then(
			() => {
				this.getThreads();
			},
			reason => {
				this.getThreads();
			}
		);
	}
	oppositePersonId: any;
	enterConversation(mt: any) {
		const modalRef = this.modalService.open(
			EnterConversationModalComponent,
			{
				size: "lg"
			}
		);

		mt.user_ids.forEach(element => {
			if (element._id == this.student._id) {
			} else {
				this.oppositePersonId = element._id;
			}
		});

		modalRef.componentInstance.user_id = this.student._id;
		modalRef.componentInstance.thread_id = mt._id;
		modalRef.componentInstance.oppositePersonId = this.oppositePersonId;

		modalRef.result.then(
			conversations => {
				this.getThreads();
				this.conversations = conversations;
			},
			reason => {
				this.getThreads();
			}
		);
	}

	deleteConversation(mtid: string) {
		const modalRef = this.modalService.open(
			DeleteConversationModalComponent
		);

		modalRef.componentInstance.user_id = this.student._id;
		modalRef.componentInstance.thread_id = mtid;

		modalRef.result.then(
			conversations => {
				this.getThreads();
				this.conversations = conversations;
			},
			reason => {
				this.getThreads();
			}
		);
	}

	getThreads() {
		this.loadingMessages = true;
		this.messagesService
			.getUserMessageThreads(this.student._id)
			.subscribe((response: any) => {
				this.loadingMessages = false;
				this.messageThreads = response.data;
			});

		this.messagesService
			.getMessageThreadsForParent(this.student._id)
			.subscribe((response: any) => {
				this.messageThreadsForParent = response.data;
			});
	}

	getOPUsername(mt: any) {
		return mt.user_ids
			.filter((u: any) => u._id !== this.student._id)
			.map((u: any) => u.username)[0];
	}

	getNotification() {
		if (this.userService.currentUser.role == "Student") {
			this.studentService
				.getCollagesViewed(this.userService.currentUser._id)
				.subscribe(res => {
					if (res.data.length > 0) {
						if (res.data.slice(-1).pop().college && res.data.slice(-1).pop().college.name) {
							this.notificationCollegeName = res.data.slice(-1).pop().college.name
							this.isNewNotification = true;
						}else {
							console.log("viewers college information not found!")
						}
					}

				});

		} else if (this.userService.currentUser.role == "Teacher") {
			// for teacher
			this.teacherService
				.getCollagesViewed(this.userService.currentUser._id)
				.subscribe(res => {
					if (res.data.length > 0) {
						if (res.data.slice(-1).pop().college && res.data.slice(-1).pop().college.name) {
							this.notificationCollegeName = res.data.slice(-1).pop().college.name
							this.isNewNotification = true;
						}else {
							console.log("viewers college information not found!")
						}
					}

				});
		}
	}
}
