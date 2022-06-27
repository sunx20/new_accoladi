import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PaymentService } from '../../services/payment.service';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user.model';

@Component({
	selector: 'app-billing',
	templateUrl: './billing.component.html'
})

export class BillingComponent implements OnInit {

	subscriptions: any[] = [];
	user: UserModel = null;
	current_subscription: any = null;

	constructor(
		private paymentService: PaymentService,
		private userService: UserService,
		private router: Router
	) {}

	ngOnInit() {
		this.userService
			.getUserProfile(
				this.userService.currentUser._id
			)
			.subscribe(
				(response: any) => {
					this.user = response.data;
				},
				err => {
					console.error( 'SA.student.student.component - getUser', err );
				}
			);

		this.paymentService
			.getCurrentSubscription(
				this.userService.currentUser._id
			)
			.subscribe((response: any) => {
				this.current_subscription = response.data;
			});

		this.paymentService
			.getHistory(
				this.userService.currentUser._id
			)
			.subscribe((response: any) => {
				this.subscriptions = response.data;
			});

		if ( !['Student'].includes(this.userService.currentUser.role) ) {
			this.router.navigate(['/dashboard/']);
		}

	}

}
