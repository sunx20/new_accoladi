import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserService } from './user.service';

@Injectable()

export class MessagesService {

	private apiURL: string;

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	sendMessage(user_id: string, message: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/messages/' + user_id,
						{ ...message, ui_url: environment.uiUrl },
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getUserThreadById(user_id: string, thread_id: string, count: number) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/messages/' + user_id + '/thread/' + thread_id + '?count=' + count,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getUserMessageThreads(user_id: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/messages/' + user_id, 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getUserLatestMessages(user_id: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/messages/' + user_id + '/latest/', 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getMessageThreadsForParent(user_id: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/messages/parent/' + user_id,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getRecipientsByUser(user_id: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		// api/messages/{{user_id}}/available-recipients
		return this.http
					.get(
						this.apiURL + '/messages/' + user_id + '/available-recipients',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	deleteConversation(user_id: string, thread_id: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.delete(
						this.apiURL + '/messages/' + user_id + '/thread/' + thread_id + '/delete',
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