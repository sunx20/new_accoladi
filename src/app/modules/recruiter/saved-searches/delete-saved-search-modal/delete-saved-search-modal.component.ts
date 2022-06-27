import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SavedSearchService } from '../../services/saved-search.service';

@Component({
	selector: 'app-delete-saved-search-modal',
	templateUrl: './delete-saved-search-modal.component.html'
})

export class DeleteSavedSearchModalComponent {

	@Input() recruiter_id: string;
	@Input() sid: string;

	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';

	constructor(
		private rssService: SavedSearchService,
		public activeModal: NgbActiveModal
	) {}

	delete() {
		this.requestFailed = this.requestSuccess = false;
		this.loading = true;
		this.rssService
			.removeSavedSearch(
				this.recruiter_id, 
				this.sid
			)
			.subscribe(
				(response: any) => {
					this.feedback = 'Saved search deleted';
					this.requestSuccess = true;
					this.loading = false;
					setTimeout(() => {
						this.activeModal.close(response.data);
					}, 2000);
				},
				err => {
					console.error( 'SA.education.component - remove saved search', err );
					this.feedback = 'Unable to delete saved search';
					this.requestFailed = true;
					this.loading = false;
				}
			);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}
	
}
