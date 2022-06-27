import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EnterConversationModalComponent } from './enter-conversation-modal/enter-conversation-modal.component';
import { DeleteConversationModalComponent } from './delete-conversation-modal/delete-conversation-modal.component';

import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';

import { MessagesService } from '../../services/messages.service';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.css']
})

export class MessagesComponent implements OnInit {

	user: UserModel;
	conversations = [];
	messageThreads: any[];
	messageThreadsForParent: any[];
	loadingMessages = false;
	showNewMessageBtn: boolean = false;
	oppositePersonId: any;

	constructor(
		private modalService: NgbModal,
		private messagesService: MessagesService,
		private userService: UserService,
		private route: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.getMyProfile();
	}

	handleRouteParams() {
		this.route.params.subscribe((params: Params) => {
			if (params['recipient']) {
				this.newMessage(params['recipient']);
			}
		});
	}

	getMyProfile() {
		this.userService.getUserProfile(this.userService.currentUser._id)
			.subscribe(
				(response: any) => {
					this.user = response.data;
					this.getThreads();
					this.handleRouteParams();
					this.showNewMessageBtn = true;
				},
				err => {
					console.error('Unable to get user profile', err);
				}
			);
	}

	newMessage(recipient_id: string = '') {
		const modalRef = this.modalService.open(EnterConversationModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.user_id = this.user._id;

		if (recipient_id) {
			modalRef.componentInstance.recipient_id = recipient_id;
		}

		modalRef.result.then(() => {
			this.getThreads();
		}, (reason) => {
			this.getThreads();
		});
	}

	enterConversation(mt: any) {
		const modalRef = this.modalService.open(EnterConversationModalComponent, {
			size: 'lg'
		});

		mt.user_ids.forEach(element => {
			if (element._id == this.user._id) {

			}
			else {
				this.oppositePersonId = element._id;
			}
		});
		modalRef.componentInstance.user_id = this.user._id;
		modalRef.componentInstance.thread_id = mt._id;
		modalRef.componentInstance.oppositePersonId = this.oppositePersonId;
		modalRef.result.then((conversations) => {
			this.getThreads();
			this.conversations = conversations;
		}, (reason) => {
			this.getThreads();
		});
	}

	deleteConversation(mtid: string) {
		const modalRef = this.modalService.open(DeleteConversationModalComponent);

		modalRef.componentInstance.user_id = this.user._id;
		modalRef.componentInstance.thread_id = mtid;

		modalRef.result.then((conversations) => {
			this.getThreads();
			this.conversations = conversations;
		}, (reason) => {
			this.getThreads();
		});

	}

	getThreads() {
		this.loadingMessages = true;
		this.messagesService.getUserMessageThreads(this.user._id)
			.subscribe(
				(response: any) => {
					this.loadingMessages = false;
					this.messageThreads = response.data;
				});

		this.messagesService.getMessageThreadsForParent(this.user._id)
			.subscribe(
				(response: any) => {
					this.messageThreadsForParent = response.data;
				});
	}

	getOPUsername(mt: any) {
		return mt.user_ids
			.filter((u: any) => u._id !== this.user._id)
			.map((u: any) => u.username)[0];
	}

}
