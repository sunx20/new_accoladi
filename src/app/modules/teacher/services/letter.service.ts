import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { UserService } from '../../shared/shared.module';

@Injectable()

export class TeacherLetterService {

	private apiURL: string;

	constructor(
		private http: HttpClient, 
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	getLetter(id: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};
		return this.http
				.get(
					this.apiURL + '/letters/' + id,
					httpOptions
				)
				.pipe(
					catchError(this.handleError)
				);
	}

	getStudentRequests(teacher_id: string, student_id: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
				.get(
					this.apiURL + '/letters/teachers/' + teacher_id + '/students/' + student_id,
					httpOptions
				)
				.pipe(
					catchError(this.handleError)
				);
	}

	sendReferralLetter(teacher_id: string, letter_id: string, referral: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		//  /api/letters/teachers/:tid/students-referral/:id/send
		return this.http
					.post(
						this.apiURL + '/letters/teachers/' + teacher_id + 'students-referral/' + letter_id + '/send',
						referral,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getPrefills() {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/letters/prefill',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getTeacherLetters(teacher_id: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/letters/teachers/' + teacher_id,
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