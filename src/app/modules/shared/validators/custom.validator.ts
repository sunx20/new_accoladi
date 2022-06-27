import { FormArray, FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';

import { Observable, of } from 'rxjs';
import {
	switchMap,
	map,
	debounceTime,
	distinctUntilChanged,
	filter
} from 'rxjs/operators';

import { UserService } from '../services/user.service';

export class CustomValidators {
	static multipleCheckboxRequireOne(fa: FormArray) {
		let valid = false;

		for (let x = 0; x < fa.length; ++x) {
			if (fa.at(x).value) {
				valid = true;
				break;
			}
		}

		return valid
			? null
			: { multipleCheckboxRequireOne: true };
	}

	static checkPasswords(group: FormGroup) {
		const password = group.controls.password.value;
		const confirm_password = group.controls.confirm_password.value;

		return password === confirm_password ? null : { mismatch: true };
	}
}

export class ValidateEmailNotTaken {
	static createValidator(userService: UserService) {
		return (control: AbstractControl): Observable<ValidationErrors> => {
			return of(control.value).pipe(
				debounceTime(1000),
				distinctUntilChanged(),
				filter(term => term.length > 2),
				switchMap(() => {
					return userService.checkEmailNotTaken(control.value).pipe(
						map((res: any) => {
							if (res && res.data && res.data.length < 1) {
								return null;
							} else {
								return { emailTaken: true };
							}
						})
					);
				})
			);
		};
	}
}
