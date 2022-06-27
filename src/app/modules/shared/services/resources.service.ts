import { Injectable } from '@angular/core';
import {
	HttpClient,
	HttpHeaders,
	HttpErrorResponse
} from '@angular/common/http';

import { catchError, retry } from 'rxjs/operators';
import { of, Observable, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

	private apiURL: string;

 	constructor(
		private http: HttpClient, 
		private userService: UserService
	) { 
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	getMusicHistoryGuides() {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/resources/music-history/list', 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	addMusicGuide(guide: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/resources/music-history/add',
						guide,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getMusicalTerms() {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: this.userService.token,
				'userrole':this.userService.currentUser['role']
			})
		};

		return this.http
					.get(
						this.apiURL + '/resources/musical-term/list', 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	addMusicalTerm(term:any){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/resources/musical-term/add',
						term,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}
	
	updateMusicTerm(term_id:string,term: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: this.userService.token
			})
		};

		return this.http
					.put(
						this.apiURL + '/resources/musical-term/' + term_id + '/update',
						term,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	removeMusicTerm(term_id){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: this.userService.token
			})
		};

		return this.http
					.delete(
						this.apiURL + '/resources/musical-term/' + term_id + '/delete',
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