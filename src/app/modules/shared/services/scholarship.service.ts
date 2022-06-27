import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { UserService } from './user.service';

@Injectable()

export class ScholarshipService {

	private apiURL: string;
	eventSubscription = new Subject();

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	search(searchData: any, page: number, pageSize: number) { console.log('Scholarship Service - Search (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/scholarships/search?page=' + page + '&count=' + pageSize,
						searchData,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getScholarshipById(scholarship_id: string) { console.log('Scholarship Service - Scholarship By ID (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/scholarships/' + scholarship_id,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getScholarshipByName(scholarship: string) { console.log('Scholarship Service - Scholarship By Name (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/scholarships/' + scholarship,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}
	
	getScholarshipListByState(state: string) { console.log('Scholarship Service - Scholarship By State (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};

		return this.http
					.get(
						this.apiURL + '/scholarships/state/' + state,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}
	
	getScholarshipByStateAndName(state: string, name:string) { console.log('Scholarship Service - Scholarship By State & Name');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};

		return this.http
					.get(
						this.apiURL + '/scholarships/state/' + state + '/' + name,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getSavedScholarships(student_id: string) { console.log('Scholarship Service - Saved Scholarship (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/' + student_id + '/saved-scholarships',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	saveScholarship(student_id: string, scholarship: any) { console.log('Scholarship Service - Save Scholarship (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/students/' + student_id + '/saved-scholarships/add',
						scholarship,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	removeSavedScholarship(student_id: string, ssid: string) { console.log('Scholarship Service - Remove Saved Scholarship (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.delete(
						this.apiURL + '/students/' + student_id + '/saved-scholarships/' + ssid + '/delete',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}


	sendEvent(event: any) {
		this.eventSubscription.next(event);
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