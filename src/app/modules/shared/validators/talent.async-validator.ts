import { AbstractControl, ValidationErrors } from '@angular/forms';

import { Observable } from 'rxjs/Rx';

import { TalentService } from '../../student/services/talent.service';

export class ValidateTalentNotTaken {
	static createValidator(talentService: TalentService) {
		return (control: AbstractControl): Observable<ValidationErrors> => {
			return Observable.timer(500).switchMap(() => {
				return talentService
					.checkTalentNotTaken(control.value)
					.map((res: any) => {
						// console.log( 'Validating Talent Not Taken' );
						// some logic to return boolean of; did it pass a test or not?
						// console.log( control, res );
						return res.data.length < 1
							? null
							: { talentTaken: true };
					});
			});
		};
	}
}

export class ValidateTalentInRange {
	static createValidator(talent: any, talentService: TalentService) {
		return (control: AbstractControl): Observable<ValidationErrors> => {
			return Observable.timer(500).switchMap(() => {
				return talentService.checkTalentInRange(talent).map(res => {
					// console.log( 'Validating Talent In Correct Range '+ talent );
					// some logic to return boolean of; did it pass a test or not?
					// console.log( 'res from check range', res,  control.value );
					return res.length < 1 ? null : { outOfRange: true };
				});
			});
		};
	}
}
