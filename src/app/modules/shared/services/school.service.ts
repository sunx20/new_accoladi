import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { UserService } from './user.service';

@Injectable()

export class SchoolService {

	private apiURL: string;

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	getSchoolListByState(state: string) { console.log('School Service - Schools By State');
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				// 'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/schools/state/' + state, 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}
	
	getSchoolById(school_id: string) { console.log('School Service - School By ID (A)');
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/schools/' + school_id, 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	createNewSchool(school: any) { console.log('School Service - New School');
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				//'Authorization': this.userService.token
			})
		};
		// POST api/school
		return this.http
					.post(
						this.apiURL + '/schools', school, 
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