import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserService } from '../../../modules/shared/shared.module';

@Injectable()

export class StudentsInterestedInService {

	private apiURL: string;
	sortColumn: any;
	sortDirection: any;
	httpOptions = {};

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
		}
	}

	// saveStudent(student_id: string) {
	//     return this.http
	//         .post(
	//             this.apiURL + '/recruiter/' + this.userService.currentUser._id + '/students/interested_in',
	//             { student_id },
	//             this.httpOptions
	//         )
	//         .pipe(catchError(this.handleError));
	// }

	// removeStudentFromSaved(student_id: string) {
	//     return this.http
	//         .delete(
	//             this.apiURL + '/recruiter/' + this.userService.currentUser._id + '/students/' + student_id + '/remove-saved',
	//             this.httpOptions
	//         )
	//         .pipe(catchError(this.handleError));
	// }

	getStudentsInterestedIn(recruiter_id: string, count = 10, page = 1) {
		let requestUrl = this.apiURL + '/recruiter/' + recruiter_id + '/students/interested_in';
			requestUrl += '?count=' + count;
			requestUrl += '&page=' + page;

		return this.http
					.get(
						requestUrl, 
						this.httpOptions
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
		return throwError('Something bad happened; please try again later.');
	}

}
