import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { UserService } from './user.service';

@Injectable()

export class PremierProgramService {

	private apiURL: string;
	eventSubscription = new Subject();

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	search(searchData: any, page: number, pageSize: number) { console.log('Premier Program Service - Search (A)')
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/premier-programs/search?page=' + page + '&count=' + pageSize,
						searchData,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getPremierProgramById(premier_program_id: string) { console.log('Premier Program Service - Program By ID (A)')
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/premier-programs/' + premier_program_id,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getPremierProgramsSubjects() { console.log('Premier Program Service - Program By Subject (A)')
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/premier-programs/subjects',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getPremierProgramsStyles() { console.log('Premier Program Service - Program Styles (A)')
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/premier-programs/styles',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getSavedPremierPrograms(student_id: string) { console.log('Premier Program Service - Saved Programs (A)')
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/' + student_id + '/saved-premier-programs',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	savePremierProgram(student_id: string, premier_programs: any) { console.log('Premier Program Service - Save Program (A)')
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/students/' + student_id + '/saved-premier-programs/add',
						premier_programs,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	removeSavedPremierProgram(student_id: string, ppid: string) { console.log('Premier Program Service - Remove Saved program (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.delete(
						this.apiURL + '/students/' + student_id + '/saved-premier-programs/' + ppid + '/delete',
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