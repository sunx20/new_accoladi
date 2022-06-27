import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserService } from '../../../modules/shared/shared.module';

@Injectable()

export class SavedSearchService {

	private apiURL: string;

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	/*
	GET /api/recruiter/:rid/searches/saved/
	POST /api/recruiter/:rid /searches/save/
	DELETE /api/recruiter/:rid/searches/:sid/remove-saved/
	*/

	getSavedSearches(recruiter_id: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/recruiter/' + recruiter_id + '/searches/saved/',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	postSavedSearch(recruiter_id: string, searchData: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/recruiter/' + recruiter_id + '/searches/save/',
						searchData,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	removeSavedSearch(recruiter_id: string, search_id: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.delete(
						this.apiURL + '/recruiter/' + recruiter_id + '/searches/' + search_id + '/remove_saved',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error( 'An error occurred:', error.error.message );
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(
				`Backend returned code ${error.status}, ` +
					`body was: ${error.error}`
			);
		}
		// return an observable with a user-facing error message
		return throwError( 'Something bad happened; please try again later.' );
	}

}
