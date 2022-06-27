import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { GlobalErrorHandlerInterceptor } from './global-error-handler-interceptor';

export const httpInterceptProviders = [
	{ 
		provide: HTTP_INTERCEPTORS, 
		useClass: GlobalErrorHandlerInterceptor, 
		multi: true 
	}
];