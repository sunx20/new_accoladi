import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SavedSearchModel } from '../../models/saved-search.model';
import { SavedSearchService } from '../../services/saved-search.service';

@Component({
	selector: 'app-create-search-modal',
	templateUrl: './create-search-modal.component.html'
})

export class CreateSearchModalComponent implements OnInit {

	@Input() recruiter_id: string;
	@Input() form_criteria: string;

	model = new SavedSearchModel({});
	form: FormGroup;
	submitAttempted = false;
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';

	constructor(
		private rssService: SavedSearchService,
		private activeModal: NgbActiveModal
	) {
		this.form = new FormGroup({
			label: new FormControl('', [Validators.required]),
			category: new FormControl('')
		});
	}

	ngOnInit() {

	}

	get formDisabled() {
		return this.loading === true;
	}

	get formModel() {
		return {
			recruiter_id: this.recruiter_id,
			label: this.form.get('label').value,
			category: this.form.get('category').value,
			form_criteria: this.form_criteria
		};
	}

	resetForm() {
		this.form.reset();
		this.submitAttempted = false;
	}

	displayFieldCss(field: string) {
		return {
			'has-error': this.isFieldInvalid(field),
			'has-feedback': this.isFieldInvalid(field)
		};
	}

	submitForm() {
		this.loading = true;
		this.submitAttempted = true;
		this.requestFailed = this.requestSuccess = false;

		if (this.form.valid) {
			this.rssService
				.postSavedSearch(
					this.recruiter_id,
					new SavedSearchModel(this.formModel)
				)
				.subscribe(
					(response: any) => {
						this.loading = false;
						this.feedback = 'Search criteria saved';
						this.form.reset();
						this.requestSuccess = true;
						this.submitAttempted = false;
						setTimeout(() => {
							this.activeModal.close();
						}, 2000);
					},
					err => {
						console.error(
							'SA.collegePreference.update-college-preference-form.component - addCollegePreference',
							err
						);
						this.loading = false;
						this.feedback = 'Unable to save this search';
						this.requestFailed = true;
					}
				);
		} else {
			this.validateAllFormFields(this.form);
			this.loading = false;
			this.submitAttempted = false;
		}
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	isFieldInvalid(fieldName: string) {
		const field = this.form.get(fieldName);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}
	
}
