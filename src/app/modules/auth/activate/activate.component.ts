import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
	selector: 'app-activate',
	templateUrl: './activate.component.html'
})

export class ActivateComponent implements OnInit {

	feedback: string;
	key: string;
	loading = false;
	activationSuccess = false;
	activationFailed = false;

	constructor(
		private authService: AuthService,
		private activatedRoute: ActivatedRoute
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
						this.activateUser(this.key);
					}
				}
			);
	}

	activateUser(key) {
		this.authService
			.activateUser(
				key
			)
			.subscribe(
				data => {
					this.activationSuccess = true;
				},
				err => {
					this.activationFailed = true;
					console.error('SA.home.welcome.component - activateUser', err);
				}
			);
	}
	
}
