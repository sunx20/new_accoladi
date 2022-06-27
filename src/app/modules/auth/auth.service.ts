import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';

import { tokenNotExpired } from 'angular2-jwt';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RegisterModel } from './models/register.model';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})

export class AuthService {

	private apiURL: string;
	private uiURL: string;
	loginSubscription = new Subject();

	constructor(
		private http: HttpClient
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
		this.uiURL = environment.uiUrl;
	}

	register(rm: RegisterModel) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};

		// POST api/users/register
		return this.http
				.post(
					this.apiURL + '/users/register',
					{
						...rm,
						ui_url: this.uiURL
					},
					httpOptions
				)
				.pipe(
					catchError(this.handleError)
				);
	}

	login(data: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};

		// POST api/users/authenticate
		return this.http
					.post(
						this.apiURL + '/users/authenticate',
						data,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	logout() {
		// keep some data
		const keepHomeData = localStorage.getItem('studentHomeTour');
		const keepProfileData = localStorage.getItem('studentProfileTour');
		localStorage.clear();
		localStorage.setItem('studentHomeTour', keepHomeData);
		localStorage.setItem('studentProfileTour', keepProfileData);
		this.loginSubscription.next(false);
	}

	recoverPassword(data: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};

		data.ui_url = this.uiURL;
		// POST api/users/forgot
		return this.http
				.post(
					this.apiURL + '/users/forgot',
					data,
					httpOptions
				)
				.pipe(
					catchError(this.handleError)
				);
	}

	resetPassword(data: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};

		// POST api/users/reset
		return this.http
					.post(
						this.apiURL + '/users/reset',
						data,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	saveToStorage(data: any) {
		this.loginSubscription.next(true);
		localStorage.setItem('id_token', data.token);
		localStorage.setItem('user', JSON.stringify(data.user));
	}

	isLoggedIn() {
		const loggedin =
			localStorage.getItem('user') &&
				localStorage.getItem('id_token') &&
				tokenNotExpired('id_token')
				? true
				: false;
		return loggedin;
	}

	activateUser(key: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};

		return this.http
					.get(
						this.apiURL + '/activate/' + key,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	private handleError(error: HttpErrorResponse) {
		console.log(error);
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
		// return throwError('Something bad happened; please try again later.');
		return throwError(error);
	}

}
