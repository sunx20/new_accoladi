import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";

import { throwError, Subject } from "rxjs";
import { catchError } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { UserService } from '../../shared/services/user.service';

@Injectable({
	providedIn: 'root'
})

export class RecruiterService {

	private apiURL: string;
	eventSubscription = new Subject();

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	getMyProfile() {
		const httpOptions = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + "/users/" + this.userService.currentUser._id,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getStudentsWithIntroductionLetters(recruiter_id: string, count = 0) {
		const httpOptions = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				'Authorization': this.userService.token
			})
		};

		let requestUrl = this.apiURL + "/recruiter/" + recruiter_id + "/students/introletter";

		if (count) requestUrl = requestUrl + "?count=" + count;

		return this.http
					.get(
						requestUrl,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getStudentsWithReferenceLetters(recruiter_id: string, count = 0) {
		const httpOptions = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				'Authorization': this.userService.token
			})
		};

		let requestUrl = this.apiURL + "/recruiter/" + recruiter_id + "/students/referenceletter/";

		if (count) requestUrl = requestUrl + "?count=" + count;

		return this.http
					.get(
						requestUrl, 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	postStudentSearch(newSearchData: any, page = 1, pageSize = 50) {
		const httpOptions = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + "/recruiter/search?page=" + page + "&count=" + pageSize,
						JSON.stringify(newSearchData),
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	postDanceSearch(newSearchData: any, page = 1, pageSize = 10) {
		const httpOptions = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
					
						this.apiURL + "/recruiter/search/dance/?page=" + page + "&count=" + pageSize,
						newSearchData,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getStudentProfile(student_id: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + "/recruiter/student/profile/" + student_id,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	sendEvent(event: any) {
		this.eventSubscription.next(event);
	}

	recruiterViewedProfile(viewedDetails: any, type: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				'Authorization': this.userService.token
			})
		};
		
		let url = this.apiURL + "/students/studentprofileinteractions/" + type
		
		return this.http
					.post(
						url, 
						viewedDetails, 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error("An error occurred:", error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(
				`Backend returned code ${error.status}, ` +
				`body was: ${error.error}`
			);
		}
		// return an observable with a user-facing error message
		return throwError("Something bad happened; please try again later.");
	}

}
