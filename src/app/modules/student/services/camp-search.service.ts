import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserService } from '../../../modules/shared/services/user.service';

@Injectable()

export class CampSearchService {

	private apiURL: string;

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	getCamps(): Observable<any> { console.log('Camps Service - Camp list (A)');

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/camp/get/getCamps/',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}
	
	search(searchData: any, page: number, pageSize: number) { console.log('Camps Service - Search');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				// 'Authorization': this.userService.token
			})
		};
		
		return this.http
					.post(
						this.apiURL + '/camp/search?page=' + page + '&count=' + pageSize,
						searchData,
						httpOptions
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