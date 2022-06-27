import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { timeout } from 'rxjs/operators';

@Injectable()

export class GlobalErrorHandlerInterceptor implements HttpInterceptor {

	constructor(
		private toastrService: ToastrService
	) {

	}

	intercept(request: HttpRequest<any>, next: HttpHandler) {

		return next.handle(request).pipe(
			timeout(10000), // Set request timeout to 10 seconds

			//Validate content-type of the response
			map((event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {
					const contentType = event.headers.get('Content-type');

					//Validate the JSON Response if the content-type is application/json
					if (contentType.includes('application/json')) {
						if (event.body.data) {
							if (this.IsJson(JSON.stringify(event.body.data)) == false) {
								this.DisplayToastr();
							}
						}
					}

				}
				return event;
			}),

			catchError((error: HttpErrorResponse) => {

				setTimeout(() => {

					if (error.error != undefined) {
						if (error.error.message.includes('User not found')) {

						} else {
							this.DisplayToastr();
						}
					} else {
						this.DisplayToastr();
					}
				}, 0);

				return throwError(error);
			})
		);
	}

	DisplayToastr() {
		this.toastrService.error('', `There seems to be a problem communication with the server - Please try again in a few minutes.
		If the problem persists, please take a screen shot and email it to support@Accoladi.com.
		We apologize for the inconvenience, and appreciate your help in resolving this issue.`);
	}

	IsJson(myString) {
		try {
			JSON.parse(myString);
		}
		catch (err) {
			return false;
		}
		return true;
	}

}