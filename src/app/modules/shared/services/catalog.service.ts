import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Catalog } from './../../student/models/catalog.model';
import { UserService } from './user.service';

@Injectable()

export class CatalogService {

	private apiURL: string;

	constructor(
		private http: HttpClient,
		private userService: UserService
	) {
		this.apiURL = environment.apiUrl + environment.apiPath;
	}

	getCompositions(term: string) { console.log('Catalog Service - Compositions (A)');
		
		const httpOptions = {
			params: { title: term },
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						`${this.apiURL}/catalog/compositions`,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}

	getCompositionById(id: string) { console.log('Catalog Service - Compositions By ID (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						`${this.apiURL}/catalog/${id}`,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}

	getCatalogsByInstrument(instrument: string) { console.log('Catalog Service - Catalog By Instrument (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.get(
						`${this.apiURL}/catalog/instrument/${instrument}`,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);

	}

	getCatalogsByType(type: string) { console.log('Catalog Service - Catalog By Type (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		// we are making decission of instrument type AND which catalog (table) TYPE to hit - band-chours/show choir-opera
		const group1 = ['Small Ensemble', 'Six or More', 'Sextet', 'Quintet', 'Quartet', 'Trio', 'Choir'];
		const group2 = ['Ensemble'];
		const group3 = ['Orchestra'];
		const group4 = ['Mixed', 'Chorus'];
		const group5 = ['Musical Theatre / Opera', 'Musical Theatre', 'Opera'];

		if (group1.indexOf(type) > -1) { // small ensembles
			return this.http
						.get(
							this.apiURL + '/catalog/group/smallensembles/',
							httpOptions
						)
		} else if (group2.indexOf(type) > -1) { // ensembles
			return this.http
						.get(
							this.apiURL + '/catalog/group/ensembles/',
							httpOptions
						)
		} else if (group3.indexOf(type) > -1) { // ensembles
			return this.http
						.get(
							this.apiURL + '/catalog/group/orchestra/',
							httpOptions
						)
		} else if (group4.indexOf(type) > -1) { // ensembles
			return this.http
						.get(
							this.apiURL + '/catalog/group/chorus/',
							httpOptions
						)
		} else if (group5.indexOf(type) > -1) { // musical theater
			return this.http
						.get(
							this.apiURL + '/catalog2/',
							httpOptions
						)
		} else { // solo
			return this.http
						.get(
							this.apiURL + '/catalog/group/solos/',
							httpOptions
						)
		}

	}

	getCatalogsByTypeInstrument(type: string, instrument: string) { console.log('Catalog Service - Catalog By Type & Instrument (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		// we are making decission of instrument type AND which catalog (table) TYPE to hit - band-chours/show choir-opera
		const group1 = ['Small Ensemble', 'Six or More', 'Sextet', 'Quintet', 'Quartet', 'Trio', 'Choir'];

		if (group1.indexOf(type) > -1) { // console.log( group1.indexOf(type) );
			return this.http
						.get(
							this.apiURL + '/catalog/group/smallensembles/' + instrument,
							httpOptions
						);
		} else { // console.log( 'Found... Solo' );// solo
			return this.http
						.get(
							this.apiURL + '/catalog/instrument/' + instrument,
							httpOptions
						);
		}

	}

	addNewCatalog(catalogItem: Catalog) { console.log('Catalog Service - New Compositions (A)');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': this.userService.token
			})
		};

		return this.http
					.post(
						this.apiURL + '/catalog',
						catalogItem,
						httpOptions
					)
					.pipe(
						catchError(this.handleError)
					);
	}

	search(searchData: any, page: number, pageSize: number) { console.log('Catalog Service - Search');
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				// 'Authorization': this.userService.token
			})
		};
		
		return this.http
					.post(
						this.apiURL + '/catalog/search?page=' + page + '&count=' + pageSize,
						searchData,
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
				`body was: ${error.error}`);
		}
		// return an observable with a user-facing error message
		// return throwError('Something bad happened; please try again later.');

		return throwError(error);
	}

}