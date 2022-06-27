import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { UserService } from './user.service';

@Injectable()

export class CollegeService {

	private apiURL: string;

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	getCollegeListByState(state: string) { console.log('College Service - College List');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
				//Authorization: this.userService.token
			})
		};
		
		return this.http
					.get(
						this.apiURL + '/colleges/state/' + state, 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getCollegeByName( state: string, college: string ) { console.log('College Service - College By Name');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};

		return this.http
					.get(
						this.apiURL + '/colleges/state/' + state + '/' + college,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getCollegeById(college_id: string) { console.log('College Service - College By ID (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/colleges/' + college_id, 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	searchColleges(searchData: any, page, pageSize) { console.log('College Service - Search (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/colleges/search?page=' + page + '&count=' + pageSize,
						searchData,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getCollegeListByKeyword(search: string) { console.log('College Service - College By Keyword (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};

		return this.http
					.get(
						this.apiURL + '/colleges/search?word=' + search, 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getFacultyListByKeyword(search: string, college_id: string) { console.log('College Service - Faculty List By Keyword (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/colleges/faculty?word=' + search, 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getSavedColleges(student_id: string) { console.log('College Service - Saved College List (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/' + student_id + '/saved-colleges',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	saveCollege(student_id: string, college: any) { console.log('College Service - Save College (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/students/' + student_id + '/saved-colleges/add',
						college,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	removeSavedCollege(student_id: string, scid: string) { console.log('College Service - Remove Saved College (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: this.userService.token
			})
		};

		return this.http
					.delete(
						this.apiURL + '/students/' + student_id + '/saved-colleges/' + scid + '/delete',
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