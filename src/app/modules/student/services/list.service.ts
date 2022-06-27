import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
//import { UserService } from '../../shared/services/user.service';

@Injectable({
	providedIn: 'root'
})

export class ListService {

	private apiURL: string;

	constructor(
		private http: HttpClient,
		//private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	getFamiliesList() {
		return this.http
					.get<any[]>(
						this.apiURL + '/lists/families'
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getStudySubjects() {
		return this.http
					.get<any[]>(
						this.apiURL + '/lists/study-subjects'
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getGrades() {
		return this.http
					.get<any[]>(
						this.apiURL + '/lists/grades'
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getTalentTypes() {
		return this.http
					.get<any[]>(
						this.apiURL + '/lists/talent-types'
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getMusicalTheaterTypes() {
		return this.http
					.get<any[]>(
						this.apiURL + '/lists/musical-theater-types'
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getPerformanceCategories() {
		return this.http
					.get<any[]>(
						this.apiURL + '/lists/performance-categories'
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getEnsembles() {
		return this.http
					.get<any[]>(
						this.apiURL + '/lists/ensembles'
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getOrchestraCategories() {
		return this.http
					.get<any[]>(
						this.apiURL + '/lists/orchestra-categories'
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getChorusCategories() {
		return this.http
					.get<any[]>(
						this.apiURL + '/lists/chorus-categories'
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getEvents() {
		return this.http
					.get<any[]>(
						this.apiURL + '/lists/events'
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getFestivalRatings() {
		return this.http
					.get<any[]>(
						this.apiURL + '/lists/festival-ratings'
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getCompetitionPlacements() {
		return this.http
					.get<any[]>(
						this.apiURL + '/lists/competition-placements'
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getScholarshipAppliesToList() {
		return this.http
					.get<any[]>(
						this.apiURL + '/lists/scholarship-applies-to'
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getScholarshipTypes() {
		return this.http
					.get<any[]>(
						this.apiURL + '/lists/scholarship-types'
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