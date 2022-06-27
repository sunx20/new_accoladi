import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { UserService } from '../../../modules/shared/services/user.service';

@Injectable()

export class TeacherService {

	private apiURL: string;

	constructor(
		private http: HttpClient, 
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
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
						this.apiURL + '/teachers/' + this.userService.currentUser._id,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getUserStudents() {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/teachers/' + this.userService.currentUser._id + '/students',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	addStudent(teacher_id: string, student: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		// POST api/teachers/:pid/students/:sid/create
		return this.http
					.post(
						this.apiURL + '/teachers/' + teacher_id + '/students/create',
						{
							...student,
							ui_url: environment.uiUrl
						},
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	updateStudent(teacher_id: string, student: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		// PUT api/teachers/:pid/students/:sid/update
		return this.http
					.put(
						this.apiURL + '/teachers/' + teacher_id + '/students/' + student._id + '/update',
						student,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	deleteStudent(teacher_id: string, student_id: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		// DELETE api/teachers/:sid/students/:pid/delete
		return this.http
					.delete(
						this.apiURL + '/teachers/' + teacher_id + '/students/' + student_id + '/delete',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getCollagesViewCount(tid: any): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/teachers/' + tid + '/teacherprofileinteractions',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getCollagesViewed(tid: any): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/teachers/' + tid + 'teacherprofileinteractions/details',
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}
	
	getTeacherSearchCount(tid: any): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/teachers/teachersearchappearances/' + tid,
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