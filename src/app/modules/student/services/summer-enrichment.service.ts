import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserService } from '../../../modules/shared/shared.module';

@Injectable()

export class SummerEnrichmentService {

	private apiURL: string;

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	getAllStudentSummerEnrichments(sid: string) { console.log('Summer Enrichment Service - All Student (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		// GET api/students/:sid/summer-enrichments
		return this.http
					.get(
						this.apiURL + '/students/' + sid + '/summer-enrichments',
						httpOptions
					).pipe(
						catchError(this.handleError)
					);
	}

	getStudentSummerEnrichmentById(sid: string, pid: string) { console.log('Summer Enrichment Service - Student Enrichment By ID (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		// GET api/students/:sid/summer-enrichments/:pid
		return this.http
					.get(
						this.apiURL + '/students/' + sid + '/summer-enrichments/' + pid,
						httpOptions
					).pipe(
						catchError(this.handleError)
					);
	}

	createStudentSummerEnrichment(sid: string, summerEnrichment: any) { console.log('Summer Enrichment Service - Add Student Enrichment (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		// POST api/students/:sid/summer-enrichments/create
		return this.http
					.post(
						this.apiURL + '/students/' + sid + '/summer-enrichments/create',
						summerEnrichment,
						httpOptions
					).pipe(
						catchError(this.handleError)
					);
	}

	updateStudentSummerEnrichment(sid: string, summerEnrichment: any) { console.log('Summer Enrichment Service - Update Student Enrichment (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		// PUT api/students/:sid/summer-enrichments/:pid/update
		return this.http
					.put(
						this.apiURL + '/students/' + sid + '/summer-enrichments/' + summerEnrichment._id + '/update',
						summerEnrichment,
						httpOptions
					).pipe(
						catchError(this.handleError)
					);
	}

	deleteStudentSummerEnrichment(sid: string, pid: string) { console.log('Summer Enrichment Service - Remove Student Enrichment (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		// DELETE api/students/:sid/summer-enrichments/:pid/delete
		return this.http
					.delete(
						this.apiURL + '/students/' + sid + '/summer-enrichments/' + pid + '/delete',
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
		return throwError(
			'Something bad happened; please try again later.'
		);
	}

}