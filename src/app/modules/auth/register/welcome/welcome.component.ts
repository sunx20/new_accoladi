import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../../../../modules/shared/shared.module';

@Component({
	selector: 'app-welcome',
	templateUrl: './welcome.component.html'
})

export class WelcomeComponent implements OnInit {

	public role: string;

	trialp = 0;
	plan = '';
	amount = '';
	startDate = '';
	nStudents = '';
	firstName = '';
	lastName = '';

	constructor(
		public activatedRoute: ActivatedRoute,
		public userService: UserService
	) {
		this.role = '';
	}

	ngOnInit() {
		if (this.userService.currentUser) {
			this.firstName = this.userService.currentUser.first_name;
			this.lastName = this.userService.currentUser.last_name;
			this.role = this.userService.currentUser.role.toLowerCase();
		} else {
			this.activatedRoute
				.params
				.subscribe(
					(params: Params) => {
						if (params.role) {
							this.role = params.role;
						}
					}
				);
		}

		this.activatedRoute
			.queryParams
			.subscribe(
				params => {
					this.plan = params.plan;
					this.trialp = params.trialp;
					this.amount = params.amount;
					this.startDate = params.sd;
					this.nStudents = params.ns;
				}
			);
	}

}
