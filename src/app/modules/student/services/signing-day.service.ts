import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserService } from '../../../modules/shared/services/user.service';

@Injectable()

export class SigningDayService {

	private apiURL: string;

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	addPerformance(perfomance) {

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/signing_day/performance/',
						perfomance,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}

	addMusicalTheatre(perfomance) {

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/signing_day/musical_theatre/',
						perfomance,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}

	addDance(perfomance) {

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/signing_day/dance/',
						perfomance,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}
	
	addAudition(data) {

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/signing_day/audition/',
						data,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}

	getNsdStudent(studentId) {

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/signing_day/student/' + studentId,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}

	deleteNSAGroup(id, studentId, group) {

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.delete(
						this.apiURL + '/signing_day/delete_group/' + id + '/' + group,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}

	deleteNSDStudentAuditionItem( id, audId, audType ) {

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.delete(
						this.apiURL + '/signing_day/studentAuditionItem/' + id + '/' + audId + '/' + audType,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}

	saveJudgeNsdVoice(body) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/signing_day/judgeNsdVoice/', body, httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getAllStudent() {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/signing_day/allStudents/', httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	private handleError(error: HttpErrorResponse) {

		if (error.error instanceof ErrorEvent) { // A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else { // The backend returned an unsuccessful response code.
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