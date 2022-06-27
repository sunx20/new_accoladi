import { Component, Input, OnInit } from '@angular/core';

import { UserModel, PaymentService } from '../../shared/shared.module';
import { StudentModel } from '../../student/models/student.model';
import { ParentService } from '../services/parent.service';

@Component({
	selector: 'app-parent-billing',
	templateUrl: './billing.component.html'
})

export class ParentBillingComponent implements OnInit {

	@Input() parent: UserModel;

	students: StudentModel[];
	subscriptions: any[];
	cancel_processing = '';

	constructor(
		private parentService: ParentService,
		private paymentService: PaymentService
	) {}

	ngOnInit() {
		this.getStudents();
		this.getSubscriptions();
	}

	getStudents() {
		this.parentService
			.getUserStudents()
			.subscribe(
				(response: any) => {
					this.students = response.data;
				},
				err => {
					console.error(
						'SA.parent.sponsorship.component - getUserStudents',
						err
					);
				}
			);
	}

	getSubscriptions() {
		this.paymentService
			.getParentHistory(
				this.parent._id
			)
			.subscribe(
				(response: any) => {
					this.subscriptions = response.data;
					console.log(this.subscriptions);
				}
			);
	}

	cancelSubscription(sid: string, sub_id: string, type: string) {
		this.cancel_processing = sid;
		this.paymentService
			.cancelSubscription(
				sid, 
				sub_id, 
				type
			)
			.subscribe(
				(response: any) => {
					this.cancel_processing = '';
					this.getSubscriptions();
				}
			);
	}
	
}
