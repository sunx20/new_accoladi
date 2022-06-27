import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';
import { concat } from 'rxjs';

import { UserService } from '../../../shared/services/user.service';
import { PaymentService } from '../../../shared/services/payment.service';
import { StripePayComponent } from '../../../shared/components/billing/stripe-pay/stripe-pay.component';


@Component({
	selector: 'app-bulk-upgrade-modal',
	templateUrl: './bulk-upgrade-modal.component.html'
})

export class BulkUpgradeModalComponent implements OnInit {

	@Input() students: any[];
	
	selected = '';
	handler: any;
	processing: boolean;
	targeted_students: any[] = [];

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
				}
			);
	}

	selectMonthlySubscription() {
		this.selected = 'Monthly';
	}

	selectQuarterlySubscription() {
		this.selected = 'Quarterly';
	}

	selectSemiannualSubscription() {
		this.selected = 'Semiannual';
	}

	selectYearlySubscription() {
		this.selected = 'Yearly';
	}

	selectLifetimeSubscription() {
		this.selected = 'Lifetime';
	}

	isAllChecked() {
		return this.students.every(_ => _.state);
	}

	isAnyChecked() {
		return this.students.some(_ => _.state);
	}

	checkAll(e: any) {
		this.students.forEach(x => (x.state = e.target.checked));
	}

	nStudents() {
		let n = 0;
		n = this.students.filter(s => s.state).map(s => s._id).length;
		return n;
	}

	amountStudents() {
		if (this.selected === 'Monthly2') {
			return (this.nStudents() * this.monthlyPrice) / 100;
		} else if (this.selected === 'Quarterly2') {
			return (this.nStudents() * this.quarterlyPrice) / 100;
		} else if (this.selected === 'Semiannual2') {
			return (this.nStudents() * this.semiannualPrice) / 100;
		} else if (this.selected === 'Yearly2') {
			return (this.nStudents() * this.yearlyPrice) / 100;
		} else {
			return (this.nStudents() * this.lifetimePrice) / 100;
		}
	}

	bulkUpgrade() {
		this.targeted_students = this.students
			.filter(s => s.state)
			.map(s => s._id);

		this.paymentService
			.getDefaultCard(
				this.userService.currentUser._id
			)
			.subscribe(
				(card: any) => {
					if (card.data) {
						const obs$ = this.targeted_students.map(t => {
							return this.paymentService.addStudentPayment(
								t,
								this.selected,
								this.userService.currentUser._id
							);
						});

						this.activeModal.close({
							obs: concat(...obs$),
							total: this.targeted_students.length
						});
					} else {
						this.handleSubscription();
					}
				}
			);
	}

	handleSubscription() {
		if (this.userService.currentUser) {
			if (this.selected === 'Monthly2') {
				this.openStripePay(
					this.monthlyPrice,
					'Monthly2',
					this.trialpm
				);
			} else if (this.selected === 'Quarterly2') {
				this.openStripePay(
					this.monthlyPrice,
					'Quarterly2',
					this.trialpm
				);
			} else if (this.selected === 'Semiannual2') {
				this.openStripePay(
					this.monthlyPrice,
					'Semiannual2',
					this.trialpm
				);
			} else if (this.selected === 'Yearly2') {
				this.openStripePay(
					this.monthlyPrice,
					'Yearly2',
					this.trialpm
				);
			} else {
				this.openStripePay(
					this.yearlyPrice,
					'Lifetime',
					this.trialpy
				);
			}
		} else {
			this.router.navigate(['/login']);
		}
	}

	openStripePay(amount: number, plan: string, trialp: number) {
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
		modalRef.componentInstance.amount = amount * this.targeted_students.length;
		modalRef.componentInstance.plan = plan;
		modalRef.componentInstance.trialp = trialp;
		modalRef.componentInstance.nStudents = this.nStudents();
		modalRef.componentInstance.startDate = moment()
												.add(trialp, 'd')
												.format('MMM Do, YYYY');

		modalRef.result
				.then(
					(result: any) => {

						this.paymentService
							.saveDefaultCard(
								this.userService.currentUser._id, 
								result.token
							)
							.subscribe( (response: any) => {

							const obs$ = this.targeted_students.map(t => {
								return this.paymentService.processPayment(
									t,
									result.token,
									this.selected,
									this.userService.currentUser._id,result.coupon
								);
							});

							this.activeModal.close({
								obs: concat(...obs$),
								total: this.targeted_students.length
							});

						});

					},
					reason => { }
				);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

}
