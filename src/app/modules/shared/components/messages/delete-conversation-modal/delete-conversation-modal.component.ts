import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MessagesService } from '../../../services/messages.service';


@Component({
	selector: 'app-delete-conversation-modal',
	templateUrl: './delete-conversation-modal.component.html'
})

export class DeleteConversationModalComponent {

	@Input() user_id: string;
	@Input() thread_id: string;

	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';

	constructor(
		private messagesService: MessagesService,
		public activeModal: NgbActiveModal,
	) {

	}

	delete() {
		this.requestFailed = this.requestSuccess = false;
		this.loading = true;
		this.messagesService.deleteConversation(this.user_id, this.thread_id)
			.subscribe(
				(response: any) => {
					this.feedback = 'Conversation deleted';
					this.requestSuccess = true;
					
					this.loading = false;
					setTimeout(() => {
						this.activeModal.close(response.data);
					}, 2000);
				},
				err => {
					this.feedback = 'Unable to delete conversation';
					this.requestFailed = true;
					this.loading = false;
				}
			);
	}


	close() {
		this.activeModal.dismiss('Cross click');
	}

}
