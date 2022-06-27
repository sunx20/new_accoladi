import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserService } from './user.service';

@Injectable()

export class PaymentService {

	private apiURL: string;

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	getCurrentSubscription(sid: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/payments/students/' + sid + '/current_subscription/',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	updatePaidThruDate(sid: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/payments/students/' + sid + '/update_paid_thru/',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	processPayment(sid: string, token: any, plan: string, parent_id: string, coupon: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/payments/students/' + sid + '/membership/',
						{ token: token.id, plan, parent_id,coupon },
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getHistory(sid: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/payments/students/' + sid + '/history/',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getParentHistory(pid: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/payments/parents/' + pid + '/history',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	cancelSubscription(sid: string, subid: string, type: string = 'i') {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/payments/students/' + sid + '/cancel_subscription/' + subid + '/type/' + type,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getKey() {
		return environment.stripeKey;
	}

	saveDefaultCard(pid: string, token: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/payments/parents/' + pid + '/savecard',
						{ token: token.id },
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getDefaultCard(pid: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/payments/parents/' + pid + '/getdefaultcard',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	addStudentPayment(sid: string, plan: string, parent_id: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/payments/students/' + sid + '/getmembership/',
						{ plan, parent_id },
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	validateCoupon(cid) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/payments/validateCoupons/' + cid,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getPlans() {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/payments/plans',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(
				`Backend returned code ${error.status}, ` +
				`body was: ${error.error}`
			);
		}
		// return an observable with a user-facing error message
		return throwError('Something bad happened; please try again later.');
	}

}