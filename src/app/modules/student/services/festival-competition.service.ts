import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserService } from '../../../modules/shared/shared.module';

@Injectable()

export class FestivalCompetitionService {

	private apiURL: string;

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	getAllStudentFCs(sid: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/' + sid + '/festivals-competitions',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getStudentFCById(sid: string, fcid: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/' + sid + '/festivals-competitions/' + fcid,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	createStudentFC(sid: string, performance: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/students/' + sid + '/festivals-competitions/create',
						performance,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	updateStudentFC(sid: string, performance: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.put(
						this.apiURL + '/students/' + sid + '/festivals-competitions/' + performance._id + '/update',
						performance,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	deleteStudentFC(sid: string, fcid: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.delete(
						this.apiURL + '/students/' + sid + '/festivals-competitions/' + fcid + '/delete',
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
		return throwError(
			'Something bad happened; please try again later.'
		);
	}

}