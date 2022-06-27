import { Component, OnInit, Input, EventEmitter, Output  } from '@angular/core';
import { Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';

import { UserService, PaymentService, StripePayComponent } from '../../../../modules/shared/shared.module';

@Component({
	selector: 'app-upgrade-student-modal',
	templateUrl: './upgrade-student-modal.component.html'
})

export class UpgradeStudentModalComponent implements OnInit {

	@Input() currentStudent: any;
	@Output() addSuscription = new EventEmitter();
	@Output() closeSubscription = new EventEmitter();

	selected = 'Monthly';
	handler: any;
	processing: boolean;

	plans = [];
	trialpm = 0;
	trialpq = 0;
	trialps = 0;
	trialpy = 0;
	monthlyPrice = 0;
	quarterlyPrice = 0;
	semiannualPrice = 0;
	yearlyPrice = 0;
	lifetimePrice = 0;

	amount: number;
	feedback = '';
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	upgradeCanceled= false;

	constructor(
		public activeModal: NgbActiveModal,
		private userService: UserService,
		private paymentService: PaymentService,
		private modalService: NgbModal,
		private router: Router
	) {
		this.processing = false;
	}

	ngOnInit() {
		this.paymentService
			.getPlans()
			.subscribe(
				(response: any) => {
					console.log('Getting Subscription Plans...');
					this.plans = response.data;
					this.trialpm = this.plans.find(p => p.nickname === 'Monthly2').trial_period_days;
					this.trialpq = this.plans.find(p => p.nickname === 'Quarterly2').trial_period_days;
					this.trialps = this.plans.find(p => p.nickname === 'Semiannual2').trial_period_days;
					this.trialpy = this.plans.find(p => p.nickname === 'Yearly2').trial_period_days;
					this.monthlyPrice = this.plans.find(p => p.nickname === 'Monthly2').amount;
					this.quarterlyPrice = this.plans.find(p => p.nickname === 'Quarterly2').amount;
					this.semiannualPrice = this.plans.find(p => p.nickname === 'Semiannual2').amount;
					this.yearlyPrice = this.plans.find(p => p.nickname === 'Yearly2').amount;
					this.lifetimePrice = this.plans.find(p => p.nickname === 'Lifetime2').amount;
					this.amount = this.lifetimePrice;
				}
			);
	}

	selectMonthlySubscription() {
		this.selected = 'Monthly';
		this.amount = this.monthlyPrice;
	}

	selectQuarterlySubscription() {
		this.selected = 'Quarterly';
		this.amount = this.quarterlyPrice;
	}

	selectSemiannualSubscription() {
		this.selected = 'Semiannual';
		this.amount = this.semiannualPrice;
	}

	selectYearlySubscription() {
		this.selected = 'Yearly';
		this.amount = this.yearlyPrice ;
	}

	selectLifetimeSubscription() {
		this.selected = 'Lifetime';
		this.amount = this.lifetimePrice;
	}

	upgradeNewStudent() {
		if (this.userService.currentUser) {

			this.paymentService
				.getDefaultCard(
					this.userService.currentUser._id
				)
				.subscribe(
					(card: any) => {
						if (!card.data) {
							this.openStripePay(this.selected);
						} else {
							this.paymentService.addStudentPayment(this.currentStudent.student_id, this.selected, this.userService.currentUser._id).subscribe(
								(response: any) => {
									this.addSuscription.emit(response.data);
									this.loading = false;
									this.feedback = 'Payment added successfully';
									this.requestSuccess = true;
									setTimeout(() => {
										this.addSuscription.emit(response.data);
										this.activeModal.close();
									}, 2000);
								},
								reason => { });
						}
					}
				);

		} else {
			this.router.navigate(['/login']);
			this.closeSubscription.emit(this.requestFailed);
		}
	}

	openStripePay(plan: string) {

		const modalRef = this.modalService
							 .open(
								 StripePayComponent, 
								 {
									size: 'lg',
									backdrop: 'static',
									keyboard: false
								}
							 );

		modalRef.componentInstance.email = this.userService.currentUser.email;
		modalRef.componentInstance.plan = plan;
		modalRef.componentInstance.startDate = moment()
												.add(7, 'd')
												.format('MMM Do, YYYY');
		modalRef.componentInstance.amount = this.amount;

		modalRef.result
				.then(
					(result: any) => {
						this.paymentService
							.saveDefaultCard(
								this.userService.currentUser._id, 
								result.token
							)
							.subscribe(
								(response: any) => {
									if (response.data) {
										this.paymentService
											.addStudentPayment(
												this.currentStudent._id,
												this.selected,
												this.userService.currentUser._id
											)
											.subscribe(
												(response: any) => {
													this.loading = false;
													this.feedback = 'Your card saved as default payment method and payment added successfully';
													this.requestSuccess = true;
													setTimeout(() => {
														this.addSuscription.emit(response.data);
														this.activeModal.close();
													}, 2000);
												},
												error => {
													this.feedback = 'Error occured';
													this.requestFailed = true;
												}
											);
									}
								}
							);
					},
					reason => { }
		);
	}

	close() {
		this.activeModal.dismiss('Cross click');
		this.upgradeCanceled = true;
		this.closeSubscription.emit(this.upgradeCanceled);
	}

}
