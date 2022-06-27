import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserService } from '../../../modules/shared/services/user.service';

@Injectable()

export class StudentService {

	private apiURL: string;

	constructor(
		private http: HttpClient, 
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	getAllStudents() {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: this.userService.token
			})
		};

		// GET api/students
		return this.http
					.get(
						this.apiURL + '/students', 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getMyProfile() {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/' + this.userService.currentUser._id,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getStudentById(sid: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		// GET api/students/:sid
		return this.http
					.get(
						this.apiURL + '/students/' + sid, 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	createStudent(student: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		// POST api/students/create
		return this.http
					.post(
						this.apiURL + '/users/create',
						student, 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	updateStudentAccount(student: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		// PUT api/students/:sid/account/update
		return this.http
					.put(
						this.apiURL + '/users/' + student._id + '/account/update',
						student,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	deleteStudent(sid: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		// DELETE api/students/:sid/delete
		return this.http
					.delete(
						this.apiURL + '/users/' + sid + '/delete', 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getStudentParents(sid: string): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/' + sid + '/parents/',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getStudentSponsors(sid: string): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/' + sid + '/sponsors/', 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getStudentTeachers(sid: string): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/' + sid + '/educators', 
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getStudentHonors(sid: string): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/' + sid + '/honors-awards',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getStudentSummerEnrichments(sid: string): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/' + sid + '/summer-enrichments',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getCollagesViewCount(st_id: any): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/studentprofileinteractions/' + st_id,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getStudentSearchCount(st_id: any): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/studentsearchappearance/' + st_id,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getStudentCollegePrefs(sid: string): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/' + sid + '/college-preferences',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getStudentVideos(sid: any): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/' + sid + '/performance-vids',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getStudentCurrentEd(sid: any): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/' + sid + '/education-current',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getCollagesViewed(st_id: any): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/studentprofileinteractions/' + st_id + '/details',
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
		return throwError('Something bad happened; please try again later.');
	}

}