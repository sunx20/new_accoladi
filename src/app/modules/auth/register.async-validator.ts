import { AbstractControl, ValidationErrors } from '@angular/forms';

import { Observable } from 'rxjs/Rx';
import { get } from 'lodash';
import { UserService } from '../shared/shared.module';

export class ValidateEmailNotTaken {
	
	static createValidator(userService: UserService) {
		return (control: AbstractControl): Observable<ValidationErrors> => {
			return Observable.timer(500).switchMap(() => {
				return userService
					.checkEmailNotTaken(control.value)
					.map((res: any) => {
						return res.data.length < 1
							? null
							: { emailTaken: true };
					});
			});
		};
	}
	
}

export class ValidatePasswordsMatch {
	
	static createValidator() {
		return (control: AbstractControl) => {
			const thisPassword = control.value;
			const otherPassword = get(control, 'root.controls.password.value'); // console.log('thisPassword:', thisPassword); // console.log('otherPasssword:', otherPassword);

			if (!thisPassword || !otherPassword) {
				return null;
			}

			if (thisPassword !== otherPassword) {
				console.log('Passwords do not match');
				return { mismatchedPasswords: true };
			} else {
				console.log('Passwords match');
				return null;
			}
		};
	}

}
