import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'app-payment',
	templateUrl: './payment.component.html'
})

export class PaymentComponent implements OnInit {

	response: any = null;

	constructor(
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit() {
		this.activatedRoute
			.params
			.subscribe(
				(params: Params) => {
					if (params.response) {
						this.response = params.response;
					}
				}
			);
	}
}
