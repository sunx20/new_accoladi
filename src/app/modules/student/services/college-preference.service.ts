import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserService } from '../../../modules/shared/services/user.service';

const preference_majors = [
	,
	'Associate of Science in Audio Technology',
	'Associate of Science in Instrumental Repair',
	'Associate of Science in Stagecraft Technology',
	'Bachelor of Fine Arts Studies',
	'Bachelor of Science in Music Business',
	'Bachelor of Science in Recording Arts',
	'Bachelor of Science in Music Education',
	'Bachelor of Science in Music Therapy',
	'Bachelor of Science in Music Business Marketing',
	'Bachelor of Science in Electronic Music',
	'Bachelor of Arts in Music',
	'Bachelor of Music in Performance',
	'Bachelor of Music in Commercial Music',
	'Bachelor of Music in Composition',
	'Bachelor of Music in Jazz Studies – Instrumental',
	'Bachelor of Music in Jazz Studies – Vocal',
	'Bachelor of Music in Music Education – Band',
	'Bachelor of Music in Music Education – Orchestra',
	'Bachelor of Music in Music Education – Choral',
	'Bachelor of Music in Music Education – General',
	'Bachelor of Music in Music Theory',
	'Bachelor of Music in Music History',
	'Bachelor of Music in Musicology',
	'Bachelor of Music in Ethnomusicology',
	'Bachelor of Music in Musical Theater',
	'Bachelor of Music in Church Music',
	'Masters of Science in Entertainment Business',
	'Masters of Music in Music History and Literature',
	'Masters of Music in Early Performance Practices',
	'Masters of Music in Performance',
	'Masters of Music in Chamber Music',
	'Masters of Music in Composition',
	'Masters of Music in Music Theory',
	'Masters of Music in Jazz Studies',
	'Masters of Music in Musical Theater',
	'Masters of Music in Church Music',
	'Masters of Music in Conducting – Choral',
	'Masters of Music in Conducting – Instrumental',
	'Masters of Music in Conducting – Opera',
	'Masters of Music in Sacred Music Literature',
	'Masters of Music in Piano Accompanying',
	'Masters of Music in Music Education – Bands',
	'Masters of Music in Music Education – Orchestra',
	'Masters of Music in Music Education – Choral',
	'Masters of Music in Music Education – General Music',
	'Masters of Music in Musicology',
	'Masters of Music in Ethnomusicology',
	'Masters of Music in Piano Pedagogy',
	'Masters of Music in Theory Pedagogy',
	'Masters of Music in Collaborative Arts',
	'Masters of Fine Arts in Arts Administration',
	'Other'
];

const preference_ensembles = [
	'Wind Ensemble',
	'Symphonic Band',
	'Marching Band (Football Season)',
	'Pep Band (Basketball Season)',
	'Jazz Ensemble (Wind Instrumental)',
	'Dixieland Band',
	'Flute Choir',
	'Woodwind Choir',
	'Brass Choir',
	'Percussion Ensemble',
	'Steel Drum Band',
	'Recorder Ensemble',
	'Chamber Ensemble (Instrumental)',
	'Symphonic Orchestra',
	'String Ensemble',
	'Chorale',
	'Men’s Chorale',
	'Women’s Chorale',
	'Chamber Chorale',
	'Show Choir',
	'Jazz Ensemble (Vocal)',
	'Madrigal Singers',
	'Opera Chorus',
	'Rock Band',
	'Musical Theater Chorus',
	'Chapel Choir',
	'Praise and Worship Ensemble',
	'Handbell Choir'
];

const preference_military = [
	'U.S. Army Bands',
	'U.S. Army Reserve Bands',
	'U.S. Army National Guard Bands',
	'U.S. Marine Bands',
	'U.S. Marine Reserve Bands',
	'U.S. Navy Reserve Bands',
	'U.S. Navy Bands',
	'U.S. Coast Guard Band',
	'U.S. Air Force Bands',
	'U.S. Air National Guard Bands'
];

@Injectable()

export class CollegePreferenceService {

	private apiURL: string;

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	getAllStudentCPs(sid: string) {
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

	updateStudentCP(sid: string, cp: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};
		
		return this.http
					.put(
						this.apiURL + '/students/' + sid + '/college-preferences/update',
						cp,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);	
	}

	updateStudentInterested(sid: string, cp: any){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/students/' + sid + '/student_interested_in/update',
						cp,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getStudentFaculty(sid: string, search: string) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						this.apiURL + '/students/' + sid + '/college-preferences/faculty?search=' + search,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	getCollegeMajors(): any {
		return preference_majors;
	}

	getCollegeEnsembles(): any {
		return preference_ensembles;
	}

	getCollegeMilitaryEnsembles(): any {
		return preference_military;
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