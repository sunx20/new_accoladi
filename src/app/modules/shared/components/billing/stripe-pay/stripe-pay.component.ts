import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PaymentService } from '../../../services/payment.service';
import { UserService } from '../../../services/user.service';

@Component({
	selector: 'stripe-pay',
	templateUrl: './stripe-pay.component.html',
	styleUrls: ['./stripe-pay.component.css']
})

export class StripePayComponent implements OnInit, AfterViewInit {

	@ViewChild('stripeContainer') stripeContainer: ElementRef;

	@Input() email: string;
	@Input() plan: string;
	@Input() amount: number;
	@Input() trialp: number;
	@Input() nStudents: number;
	@Input() startDate: string;

	api_key: string; // replace me
	card: any;
	stripe: any;
	token: string;
	elements: any;
	form: any;
	cardCvc: any;
	cardExpiry: any;
	cardNumber: any;
	couponCode: any;
	resetButton: any;
	role = '';
	error_message = '';
	errorMessage: string = '';
	successMessage: string = '';
	successShow: boolean = false;
	errorShow: boolean = false;	
	errorvisible: boolean = false;
	paymentRequestAvailable: boolean = false;

	constructor(
		private paymentService: PaymentService,
		public userService: UserService,
		public activeModal: NgbActiveModal
	) {
		this.api_key = this.paymentService
						   .getKey();
	}

	ngOnInit() {
		this.role = this.userService
						.currentUser
						.role
						.toLowerCase();
	}

	ngAfterViewInit() {
		this.form = this.stripeContainer
						.nativeElement
						.querySelector('form'); //console.log(this.form);

		const email = this.form.querySelector('#sa-stripe-two-email');
			  email.value = this.email;
			  email.disabled = true;

		this.resetButton = this.stripeContainer
							   .nativeElement
							   .querySelector( 'a.reset' );
		// console.log(this.resetButton);
		// this.error = this.form.querySelector('.error');
		// console.log(this.error);
		// this.errorMessage = this.error.querySelector('.message');
		// console.log(this.errorMessage);

		this.stripe = Stripe(this.api_key); // use your test publishable key
		this.elements = this.stripe.elements({ locale: 'en' });

		/**
		 * Card Elements
		 */
		this.cardNumber = this.elements.create('cardNumber', { /*hidePostalCode: true*/ });
		this.cardNumber.mount('#sa-stripe-two-card');

		this.cardExpiry = this.elements.create('cardExpiry');
		this.cardExpiry.mount('#sa-stripe-two-card-expiry')

		this.cardCvc = this.elements.create('cardCvc');
		this.cardCvc.mount('#sa-stripe-two-card-cvc');

		this.card = {
			number: null,
			exp_month: null,
			exp_year: null,
			cvc: null,
		};

		const   paymentRequest = this.stripe.paymentRequest({
									country: 'US',
									currency: 'usd',
									total: {
										amount: this.amount,
										label: 'Total'
									},
									requestShipping: true,
									requestPayerName: true,
									requestPayerEmail: true,
									shippingOptions: [
										{
											id: 'free-shipping',
											label: 'Free shipping',
											detail: '',
											amount: 0
										}
									]
								});

				paymentRequest.on('token', result => {
					// console.log('paymentRequest.on(\'token\')');
					this.token = result.token.id;
					this.stripeContainer
						.nativeElement
						.classList
						.add('submitted');
					result.complete('success');
				});

		const paymentRequestElement = this.elements.create(
			'paymentRequestButton',
			{
				paymentRequest: paymentRequest,
				style: {
					paymentRequestButton: {
						theme: 'light'
					}
				}
			}
		);

		// canMakePayment returns true if your browser has saved your payment information
		// (think: google wallet or apple pay)
		paymentRequest.canMakePayment().then(result => {
			if (result) {
				this.paymentRequestAvailable = true;
				paymentRequestElement.mount('#sa-stripe-two-paymentRequest');
			}
		});

		this.cardNumber.on('change', event => {
			this.cardOnChange(event);
		});

		this.form.addEventListener('submit', e => {
			e.preventDefault(); // this needs to be here, not in onSubmit for some reason.
			this.onSubmit(e);
		});
	}

	cardOnChange(event) { //console.log('cardOnChange');
		const savedErrors = {};
		
		if (event.error) {
			this.errorvisible = true;
			savedErrors[0] = event.error.message;
			this.error_message = event.error.message;
			// console.log('displaying', this.error_message);
		} else {
			savedErrors[0] = null;

			// Loop over the saved errors and find the first one, if any.
			const nextError = Object.keys(savedErrors)
				.sort()
				.reduce((maybeFoundError, key) => {
					return maybeFoundError || savedErrors[key];
				}, null);

			if (nextError) {
				// Now that they've fixed the current error, show another one.
				// console.log('displaying', nextError);
				this.error_message = nextError;
			} else {
				// The user fixed the last error; no more errors.
				this.errorvisible = false;
			}
		}
	}

	onSubmit(e) {
		const name = this.form.querySelector('#sa-stripe-two-name');
		const address1 = this.form.querySelector('#sa-stripe-two-address');
		const city = this.form.querySelector('#sa-stripe-two-city');
		const state = this.form.querySelector('#sa-stripe-two-state');
		const zip = this.form.querySelector('#sa-stripe-two-zip');
		const additionalData = {
			name: name ? name.value : undefined,
			address_line1: address1 ? address1.value : undefined,
			address_city: city ? city.value : undefined,
			address_state: state ? state.value : undefined,
			address_zip: zip ? zip.value : undefined
		};

		// Inform the user if there was an error.
		const errorElement = document.getElementById('card-errors');
		errorElement.textContent = '';
		if (this.form.checkValidity() === true) {
			this.disableInputs();

			this.stripe.createToken(this.cardNumber, additionalData).then(result => { //console.log( 'createToken', this.cardNumber, additionalData );
				if (result.error) {
					errorElement.textContent = result.error.message;

					this.form.classList.add('was-validated');
					// Otherwise, un-disable inputs.
					this.enableInputs();
				} else {
					this.stripeContainer.nativeElement.classList.add(
						'submitting'
					);

					if (result.token) { //console.log('result.token',result.token);
						// If we received a token, show the token ID.
						this.token = result.token.id;
						
						// Stop loading!
						this.stripeContainer.nativeElement.classList.remove(
							'submitting'
						);
						this.stripeContainer.nativeElement.classList.add(
							'submitted'
						);
						const coupon = this.form.querySelector('#sa-stripe-two-coupon');
						const couponData = {
							coupon: coupon ? coupon.value : undefined
						};
						let resultObject:any=[];
						resultObject.token=result.token;
						resultObject.coupon=couponData.coupon;
						this.activeModal.close(resultObject);
					}
				}
			});
		} else {
			e.preventDefault();
			e.stopPropagation();
			this.form.classList.add('was-validated');
		}
	}

	onReset(e) {
		e.preventDefault();

		// Resetting the form (instead of setting the value to `''` for each input)
		// helps us clear webkit autofill styles.
		this.form.reset();
		// Clear each Element.
		// this.card.clear();
		this.cardNumber.clear();
		this.cardExpiry.clear();
		this.cardCvc.clear();

		this.errorShow = false;
		this.successShow = false;
		
		// this.form.querySelector('#sa-stripe-two-card-cvc').clear();
		// Reset error state as well.
		// error.classList.remove('visible');
		this.errorvisible = false;

		// // Resetting the form does not un-disable inputs, so we need to do it separately:
		this.enableInputs();
		this.stripeContainer.nativeElement.classList.remove('submitted');

		const email = this.form
						  .querySelector('#sa-stripe-two-email');
			  email.value = this.email;
	}

	enableInputs() {
		Array.prototype.forEach.call(
			this.form.querySelectorAll("input[type='text'], input[type='tel']"),
			input => {
				input.removeAttribute('disabled');
			}
		);
	}

	disableInputs() {
		Array.prototype.forEach.call(
			this.form.querySelectorAll("input[type='text'], input[type='tel']"),
			input => {
				input.setAttribute('disabled', 'true');
			}
		);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}

	focusOutCoupon() {
		this.errorMessage="";
		this.errorShow=false;
		this.successMessage="";
		this.successShow=false;

		const coupon = this.form.querySelector('#sa-stripe-two-coupon');
		const couponData = {
			coupon: coupon ? coupon.value : undefined
		};
		this.paymentService
				.validateCoupon(couponData.coupon)
				.subscribe((response: any) => {
					if (response.data.valid == true) {
						this.successMessage="Coupon is valid";
						this.successShow=true;
					} else {
						this.errorShow=true;
						this.errorMessage=response.data.message
						setTimeout(()=>{ 
							const coupon = this.form.querySelector('#sa-stripe-two-coupon');
							coupon.value = "";
							this.errorMessage="";
							this.errorShow=false;
					   },3000);
					}

				});
	}

}
