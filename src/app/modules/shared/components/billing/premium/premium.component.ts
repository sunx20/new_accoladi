import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';

import { UserModel } from '../../../models/user.model';

import { UserService } from '../../../services/user.service';
import { PaymentService } from '../../../services/payment.service';
import { StudentService } from '../../../../../modules/student/services/student.service';
import { StripePayComponent } from '../stripe-pay/stripe-pay.component';

@Component({
	selector: 'app-premium',
	templateUrl: './premium.component.html'
})

export class PremiumComponent implements OnInit {

	@Input() parent_id: string;
	@Input() student_id: string;
	@Output() close: EventEmitter<any> = new EventEmitter();

	handlerM: any;
	handlerY: any;
	processingM: boolean;
	processingQ: boolean;
	processingS: boolean;
	processingY: boolean;
	processingL: boolean;
	loggedin: boolean;
	student: UserModel = null;
	current_subscription: any;
	processing = false;

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
		private studentService: StudentService,
		private userService: UserService,
		private paymentService: PaymentService,
		private modalService: NgbModal,
		private router: Router
	) {
		this.current_subscription = null;
		this.processingM = this.processingQ = this.processingS = this.processingY = this.processingL = false;
	}

	ngOnInit() {
		if (this.userService.currentUser) {
			let sid = null;
			if (this.student_id) {
				sid = this.student_id;
			} else {
				sid = this.userService.currentUser._id;
			}

			this.loggedin = true;
			this.studentService
				.getStudentById(
					sid
				)
				.subscribe(
					(response: any) => {
						this.student = response.data;
					},
					err => {
						console.error( 'SA.student.student.component - getUser', err );
					}
				);

			this.paymentService
				.getCurrentSubscription(
					sid
					)
				.subscribe(
					(response: any) => {
						this.current_subscription = response.data;
					}
				);

		} else {
			this.loggedin = false;
		}

		this.paymentService
			.getPlans()
			.subscribe(
				(response: any) => { //console.log('Getting Subscription Plans...',response.data);
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

	handleMonthlySubscription() { //console.log('handleMonthlySubscription...',this);
		if (this.loggedin) {
			this.processingM = true;
			this.openStripePay(
				this.monthlyPrice,
				'Monthly2',
				this.trialpm
			);
		} else {
			this.router.navigate(['/login']);
		}
	}

	handleQuarterlySubscription() { //console.log('handleQuarterlySubscription...',this);
		if (this.loggedin) {
			this.processingQ = true;
			this.openStripePay(
				this.quarterlyPrice,
				'Quarterly2',
				this.trialpq
			);
		} else {
			this.router.navigate(['/login']);
		}
	}

	handleSemiannualSubscription() { //console.log('handleSemiannualSubscription...',this);
		if (this.loggedin) {
			this.processingS = true;
			this.openStripePay(
				this.semiannualPrice,
				'Semiannual2',
				this.trialps
			);
		} else {
			this.router.navigate(['/login']);
		}
	}

	handleYearlySubscription() { //console.log('handleYearlySubscription...',this);
		if (this.loggedin) {
			this.processingY = true;
			this.openStripePay(
				this.yearlyPrice,
				'Yearly2',
				this.trialpy
			);
		} else {
			this.router.navigate(['/login']);
		}
	}

	handleLifetimeSubscription() { //console.log('handleLifetimeSubscription...',this);
		if (this.loggedin) {
			this.processingL = true;
			this.openStripePay(
				this.lifetimePrice,
				'Lifetime2',
				0
			);
		} else {
			this.router.navigate(['/login']);
		}
	}

	openStripePay(amount: number, plan: string, trialp: number) {  //console.log({'openStripePay':[amount,plan,trialp]});
		const modalRef = this.modalService
							 .open(
								 StripePayComponent, 
								 { size: 'lg' }
							);

		modalRef.componentInstance.amount = amount;
		modalRef.componentInstance.email = this.userService.currentUser.email;
		modalRef.componentInstance.plan = plan;
		modalRef.componentInstance.trialp = trialp;
		modalRef.componentInstance.nStudents = 1;
		modalRef.componentInstance.startDate = moment()
												.add(trialp, 'd')
												.format('MMM Do, YYYY');

		modalRef.result
				.then(
					(result: any) => { //console.log({'modalRef':result});
						this.processing = true;
						this.paymentService
							.processPayment(
								this.student._id,
								result.token,
								plan,
								this.parent_id,
								result.coupon,
							)
							.subscribe(
								(response: any) => {
									this.processing = false;
									if (this.parent_id) {
										this.close.emit('');
									} else {
										if (localStorage.getItem('welcome_seen') === 'no') {
											localStorage.removeItem('welcome_seen');

											this.router.navigate(
												[
													'/welcome/' + this.userService.currentUser.role.toLowerCase()
												],
												{
													queryParams: {
														plan,
														amount: amount / 100,
														ns: 1,
														sd: moment()
															.add(trialp, 'd')
															.format('MMM Do, YYYY'),
														trialp
													}
												}
											);
										} else {
											this.router.navigate([ '/' + this.userService.currentUser.role.toLowerCase() + '/settings']);
										}
									}
								}
							);
					},
					reason => {}
				);
	}

}
