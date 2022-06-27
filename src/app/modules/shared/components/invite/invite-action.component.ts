import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { InviteService } from '../../services/invite.service';

@Component({
	selector: 'app-invite-action',
	templateUrl: './invite-action.component.html',
	styleUrls: ['./invite-action.component.css']
})

export class InviteActionComponent implements OnInit {

	key: string;
	failed = false;
	success = false;
	checking = false;
	sender = '';

	constructor(
		private activatedRoute: ActivatedRoute,
		private inviteService: InviteService
	) {
		this.key = '';
	}

	ngOnInit() {
		this.activatedRoute
			.params
			.subscribe(
				(params: Params) => {
					if (params.key) {
						this.key = params['key'];
						this.checkInvitation(this.key);
					}
				}
			);
	}

	checkInvitation(key: string) {
		this.checking = true;
		this.inviteService
			.getInvitation(
				key
			)
			.subscribe(
				(response: any) => {
					this.checking = false;
					if (response.status == 'success') {
						this.sender = response.data.sender;
						this.success = true;
					} else {
						this.failed = true;
					}
				}
			);
	}
	
}
