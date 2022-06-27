import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserService } from '../../../modules/shared/shared.module';

@Injectable()

export class MusicalClassService {

	private apiURL: string;

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	getStudentMCs(sid: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/' + sid + '/musical-classes',
						httpOptions
					).pipe(
						catchError(this.handleError)
					);
	}

	createStudentMCs(sid: string, musical_classes: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		// POST api/students/:sid/musical-classes/create
		return this.http
					.post(
						this.apiURL + '/students/' + sid + '/musical-classes/create',
						musical_classes,
						httpOptions
					).pipe(
						catchError(this.handleError)
					);
	}

	updateStudentMCs(sid: string, musical_classes: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.put(
						this.apiURL + '/students/' + sid + '/musical-classes/update',
						musical_classes,
						httpOptions
					).pipe(
						catchError(this.handleError)
					);
	}

	deleteStudentMCs(sid: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.delete(
						this.apiURL + '/students/' + sid + '/musical-classes/delete',
						httpOptions
					).pipe(
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
		return throwError(
			'Something bad happened; please try again later.'
		);
	}
	
}