import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserModel } from '../models/user.model';

@Injectable({
	providedIn: 'root'
})

export class UserService {

	private apiURL: string;
	private localdebug: boolean = false;
	sidebarSubject = new Subject();

	constructor(
		private http: HttpClient
	) {
		console.log('USER SERVICE CONSTRUCTOR');
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	get token() {
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> get token', localStorage.getItem('id_token') );
		}
		return localStorage.getItem('id_token');
	}

	get user() {
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> get user', localStorage.getItem('user') );
		}
		return localStorage.getItem('user');
	}

	get currentUser() {
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> get currentUser', JSON.parse(this.user) );
		}
		return JSON.parse(this.user);
	}

	get sidebar() {
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> get sidebar', localStorage.getItem('sidebar') );
		}
		return localStorage.getItem('sidebar');
	}

	set sidebar(value) {
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> set sidebar', {next:this.sidebarSubject.next(value),setItem:localStorage.setItem('sidebar', value)} );
		}
		this.sidebarSubject.next(value);
		localStorage.setItem('sidebar', value);
	}

	getUserProfile(id: string): Observable<UserModel> {
		
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> getUserProfile', {id:id} );
		}

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.token
			})
		};

		return this.http
					.get<any>(
						this.apiURL + '/users/' + id, 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}

	updateUserAccount(user: any) {
		
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> updateUserAccount', {user:user} );
		}
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				//'Authorization': this.token
			})
		};

		// PUT api/users/:uid/account/update
		return this.http
					.put(
						this.apiURL + '/users/' + user._id + '/account/update',
						user,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}

	updateUserDemographics(id: string, demographics: any) {
		
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> updateUserDemographics', {id:id,demographics:demographics} );
		}
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.token
			})
		};

		// PUT api/users/:uid/demographics
		return this.http
					.put(
						this.apiURL + '/users/' + id + '/demographics',
						demographics,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}

	updateUserAddress(id: any, user: any) {
		
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> updateUserAddress', {id:id,user:user} );
		}
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				//'Authorization': this.token
			})
		};

		// PUT api/users/:uid/address
		return this.http
					.put(
						this.apiURL + '/users/' + id + '/address',
						user,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}

	updateUserPhone(id: any,user: any) {
		
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> updateUserPhone', {id:id,user:user} );
		}
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				//'Authorization': this.token
			})
		};

		// PUT api/users/:uid/address/update
		return this.http
					.put(
						this.apiURL + '/users/' + id + '/phone/update',
						user,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}

	updateUserParent(user: any) {
		
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> updateUserParent', {user:user} );
		}
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				//'Authorization': this.token
			})
		};

		// PUT api/users/:uid/address/update
		return this.http
					.post(
						this.apiURL + '/users/' + user._id + '/parent/update',
						{
							...user,
							ui_url: environment.uiUrl
						},
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	addPromoCode(user: any) {
		
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> addPromoCode', {user:user} );
		}
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				//'Authorization': this.token
			})
		};

		// PUT api/users/:uid/address/update
		return this.http
					.post(
						this.apiURL + '/users/' + user._id + '/promo/add',
						user,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}

	getUserAccount(user: any) {
		
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> getUserAccount', {user:user} );
		}
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/users/' + user + '/account',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	editUserInformation(data: any) {
		
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> editUserInformation', {data:data} );
		}
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.token
			})
		};

		return this.http
					.put(
						this.apiURL + '/users/' + data._id + '/password/update',
						data,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}

	checkEmailNotTaken(email: string) {
		
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> checkEmailNotTaken', {email:email} );
		}
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};

		return this.http
					.get<any>(
						this.apiURL + '/users/?email=' + email, 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	uploadProfileImage(file: File, userId): Observable<any> {
		
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> uploadProfileImage', {file:file,userId:userId} );
		}
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Authorization': this.token
			})
		};

		const formData: FormData = new FormData();
		formData.append('Image', file, file.name);

		const url = this.apiURL + '/imageupload/userprofileimage/' + userId;
		return this.http
					.post(
						url, 
						formData, 
						httpOptions
					);

	}

	sideNavigation(id, role) {
		
		if ( this.localdebug ) {
			console.log( 'USER.SERVICE -> sideNavigation', {id:id,role:role} );
		}
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.token
			})
		};

		const url = this.apiURL + '/users/' + id + '/sidebar/' + role;
		return this.http
					.get(
						url, 
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
		// return throwError('Something bad happened; please try again later.');

		return throwError(error);

	}

}