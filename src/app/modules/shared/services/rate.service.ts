import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, Subject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { environment } from './../../../../environments/environment';
import { UserService } from './user.service';

@Injectable()

export class RatingService {

	private apiURL: string;
	eventSubscription = new Subject();

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	rateStudent(recruiter_id: string, student_id: string, rating: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/recruiter/' + recruiter_id + '/rating/' + student_id + '/save',
						rating,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getRating(recruiter_id: string, student_id: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/recruiter/' + recruiter_id + '/rating/' + student_id,
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