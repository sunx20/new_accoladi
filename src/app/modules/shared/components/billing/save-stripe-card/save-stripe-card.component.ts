import {
	Component,
	OnInit,
	AfterViewInit,
	ViewChild,
	ElementRef
} from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PaymentService } from '../../../services/payment.service';
import { UserService } from '../../../services/user.service';

@Component({
	selector: 'app-save-stripe-card',
	templateUrl: './save-stripe-card.component.html',
	styleUrls: ['./save-stripe-card.component.css']
})

export class SaveStripeCardComponent implements OnInit, AfterViewInit {

	@ViewChild('stripeContainer') stripeContainer: ElementRef;

	cardCvc: any ;
	cardExpiry: any ;
	cardNumber: any ;
	api_key: string; // replace me
	role = '';
	card: any;
	stripe: any;
	token: string;
	elements: any;
	form: any;
	resetButton: any;
	error_message = '';
	errorvisible: boolean = false;
	paymentRequestAvailable: boolean = false;

	constructor(
		private paymentService: PaymentService,
		public userService: UserService,
		public activeModal: NgbActiveModal
	) {
		this.api_key = this.paymentService.getKey();
	}

	ngOnInit() {
		this.role = this.userService.currentUser.role.toLowerCase();
	}

	ngAfterViewInit() {
		this.form = this.stripeContainer.nativeElement.querySelector('form');
		this.resetButton = this.stripeContainer.nativeElement.querySelector( 'a.reset' );
		this.stripe = Stripe(this.api_key);
		this.elements = this.stripe.elements({	locale: 'en' });

		/**
		 * Card Elements
		 */
		this.cardNumber = this.elements.create('cardNumber', { /*hidePostalCode: true*/ });
		this.cardNumber.mount('#sa-stripe-save-card');

		this.cardExpiry = this.elements.create('cardExpiry');
		this.cardExpiry.mount('#sa-stripe-card-expiry')

		this.cardCvc = this.elements.create('cardCvc');
		this.cardCvc.mount('#sa-stripe-card-cvc');

		this.card = {
			number : null,
			exp_month: null,
			exp_year: null,
			cvc: null,
		  };
		
		this.cardNumber.on('change', event => {
			this.cardOnChange(event);
		});

		this.form.addEventListener('submit', e => {
			e.preventDefault(); // this needs to be here, not in onSubmit for some reason.
			this.onSubmit(e);
		});
	} 

	cardOnChange(event) {
		var savedErrors = {};
		// console.log('card.on change()');
		if (event.error) {
			//o error.classList.add('visible');
			this.errorvisible = true;
			savedErrors[0] = event.error.message;
			//o errorMessage.innerText = event.error.message;
			this.error_message = event.error.message;
			// console.log('displaying', this.error_message);
		} else {
			savedErrors[0] = null;
			// Loop over the saved errors and find the first one, if any.
			var nextError = Object.keys(savedErrors)
									.sort()
									.reduce((maybeFoundError, key) => {
										return maybeFoundError || savedErrors[key];
									}, null);

			if (nextError) {
				// Now that they've fixed the current error, show another one.
				//o errorMessage.innerText = nextError;
				// console.log('displaying', nextError);
				this.error_message = nextError;
			} else {
				// The user fixed the last error; no more errors.
				//o error.classList.remove('visible');
				this.errorvisible = false;
			}
		}
	}

	onSubmit(e) {
		let name = this.form.querySelector('#sa-stripe-save-name');
		let address1 = this.form.querySelector('#sa-stripe-save-address');
		let city = this.form.querySelector('#sa-stripe-save-city');
		let state = this.form.querySelector('#sa-stripe-save-state');
		let zip = this.form.querySelector('#sa-stripe-save-zip');

		let additionalData = {
			name: name ? name.value : undefined,
			address_line1: address1 ? address1.value : undefined,
			address_city: city ? city.value : undefined,
			address_state: state ? state.value : undefined,
			address_zip: zip ? zip.value : undefined
		};

		// Inform the user if there was an error.
		var errorElement = document.getElementById('card-errors');
		errorElement.textContent = '';
		if (this.form.checkValidity() === true) {
			this.disableInputs();
			this.stripe
				.createToken(
					this.cardNumber, 
					additionalData
				)
				.then(
					result => {
						if (result.error) {
							errorElement.textContent = result.error.message;

							this.form.classList.add('was-validated');
							// Otherwise, un-disable inputs.
							this.enableInputs();
						} else {
							//o example.classList.add('submitting');
							this.stripeContainer
								.nativeElement
								.classList
								.add(
									'submitting'
								);

							if (result.token) {
								// If we received a token, show the token ID.
								//o example.querySelector('.token').innerText = result.token.id;
								this.token = result.token.id;
								// Stop loading!
								//o example.classList.remove('submitting');
								this.stripeContainer
									.nativeElement
									.classList
									.remove(
										'submitting'
									);
								this.stripeContainer
									.nativeElement
									.classList
									.add(
										'submitted'
									);

								this.activeModal
									.close(result.token);
							}
						}
					}
				);
		} else {
			e.preventDefault();
			e.stopPropagation();
			this.form.classList.add('was-validated');
		}
	}

	onReset(e) {
		e.preventDefault();

		// // Resetting the form (instead of setting the value to `''` for each input)
		// // helps us clear webkit autofill styles.
		this.form.reset();
		// Clear each Element.
		this.card.clear();

		// // Reset error state as well.
		// error.classList.remove('visible');
		this.errorvisible = false;

		// // Resetting the form does not un-disable inputs, so we need to do it separately:
		this.enableInputs();
		this.stripeContainer
			.nativeElement
			.classList
			.remove(
				'submitted'
			);
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

}
