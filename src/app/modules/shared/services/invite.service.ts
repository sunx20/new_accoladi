import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserService } from './user.service';

@Injectable()

export class InviteService {

	private apiURL: string;

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	getInvitation(key: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};

		return this.http
					.get(
						this.apiURL + '/users/invite/' + key,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getExistInvitation(key: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};

		return this.http
					.get(
						this.apiURL + '/users/inviteExist/' + key,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	sendInvitation(user: any, invite: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/users/' + user._id + '/invite',
						{ ...invite, ui_url: environment.uiUrl },
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	acceptInvitation(key: any,invitee:any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/users/' + key + '/' + invitee + '/acceptInvitation',
						{ ui_url: environment.uiUrl },
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	declineInvitation(id: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/users/' + id + '/declineInvitation',
						{ ui_url: environment.uiUrl },
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
				`body was: ${error.error}`);
		}
		// return an observable with a user-facing error message
		return throwError(
			'Something bad happened; please try again later.');
	}

}
