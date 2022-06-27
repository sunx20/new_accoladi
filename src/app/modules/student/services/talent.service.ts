import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserService } from '../../shared/services/user.service';

@Injectable()

export class TalentService {

	private apiURL: string;
	private httpOptions: any;
	private httpOptionsNoToken: any;

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
		this.httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};
		this.httpOptionsNoToken = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
	}

	getTalentList() {
		return this.http
					.get<any[]>(
						this.apiURL + '/instruments'
					).pipe(
						catchError(this.handleError)
					);
	}

	getTalentByFamily(family: string): Observable<any[]> {
		return this.http
					.get<any[]>(
						this.apiURL + '/instruments/family/?name=' + family
					).pipe(
						catchError(this.handleError)
					);
	}

	getAllStudentTalents(sid: string) {
		return this.http
					.get(
						this.apiURL + '/students/' + sid + '/talents',
						this.httpOptions
					).pipe(
						catchError(this.handleError)
					);
	}

	getStudentTalentById(sid: string, psid: string) {
		return this.http
					.get(
						this.apiURL + '/students/' + sid + '/talents/' + psid,
						this.httpOptions
					).pipe(
						catchError(this.handleError)
					);
	}

	createStudentTalent(sid: string, pstudy: any) {		
		return this.http
					.post(
						this.apiURL + '/students/' + sid + '/talents/create',
						pstudy,
						this.httpOptionsNoToken
					).pipe(
						catchError(this.handleError)
					);
	}

	updateStudentTalent(sid: string, pstudy: any) {
		return this.http
					.put(
						this.apiURL + '/students/' + sid + '/talents/' + pstudy._id + '/update',
						pstudy,
						this.httpOptions
					).pipe(
						catchError(this.handleError)
					);
	}

	deleteStudentTalent(sid: string, psid: string) {
		return this.http
					.delete(
						this.apiURL + '/students/' + sid + '/talents/' + psid + '/delete',
						this.httpOptions
					).pipe(
						catchError(this.handleError)
					);
	}

	getTalent() {
		return this.http
					.get(
						this.apiURL + '/catalog/instruments',
						this.httpOptionsNoToken
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	checkTalentNotTaken(talent: string): any {
		return this.http
					.get(
						this.apiURL + '/users/' + this.userService.currentUser._id + '/talent/' + talent,
						this.httpOptions
					).pipe(
						catchError(this.handleError)
					);
	}

	checkTalentInRange(insrument: string): any {
		return this.http
					.get(
						this.apiURL + '/instruments/?name=' + insrument,
						this.httpOptions
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