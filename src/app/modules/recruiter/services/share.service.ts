import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserService } from '../../shared/services/user.service';

@Injectable()

export class ShareService {

	private apiURL: string;
	eventSubscription = new Subject();

	constructor(
		private http: HttpClient, 
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	sendLink(recruiter_id: string, share: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/recruiter/' + recruiter_id + '/share',
						{ ...share, ui_url: environment.uiUrl },
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	sendLinkbByStudent(student_id: string, share: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/students/' + student_id + '/share',  
						{ ...share, ui_url: environment.uiUrl },
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	sendLinkbByTeacher(student_id: string, share: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/teachers/' + student_id + '/share', 
						{ ...share, ui_url: environment.uiUrl },
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
