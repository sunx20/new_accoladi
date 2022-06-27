import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserModel } from '../../../modules/shared/shared.module';
import { DeleteSavedSearchModalComponent } from './delete-saved-search-modal/delete-saved-search-modal.component';
import { ViewCriteriaModalComponent } from './view-criteria-modal/view-criteria-modal.component';
import { RecruiterService } from '../services/recruiter.service';
import { SavedSearchService } from '../services/saved-search.service';

@Component({
	selector: 'app-saved-searches',
	templateUrl: './saved-searches.component.html'
})

export class SavedSearchesComponent implements OnInit {

	public recruiter = new UserModel({});
	savedSearchesList: any[] = [];

	constructor(
		private recruiterService: RecruiterService,
		private rssService: SavedSearchService,
		private modalService: NgbModal,
		private router: Router
	) {}

	ngOnInit() {
		this.recruiterService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.recruiter = response.data;
					this.rssService
						.getSavedSearches(this.recruiter._id)
						.subscribe((response: any) => {
							this.savedSearchesList = response.data;
						});
				},
				err => {
					console.error( 'SA.recruiter.saved-searches.component - getUser', err );
				}
			);
	}

	viewCriteria(saved_search: any) {
		let modalRef = this.modalService
							.open(
								ViewCriteriaModalComponent, 
								{ size: 'lg' }
							);
		modalRef.componentInstance.saved_search = saved_search;
		modalRef.result
				.then(() => {}, reason => {});
	}

	rerunSearch(saved_search: any) {
		this.router.navigate(['/recruiter/search/talent']);
		setTimeout(() => {
			this.recruiterService.sendEvent({
				type: 'rerun-recruiter-saved-search',
				data: saved_search
			});
		}, 1000);
	}

	remove(sid: string) {
		let modalRef = this.modalService
							.open(
								DeleteSavedSearchModalComponent
							);
		modalRef.componentInstance.recruiter_id = this.recruiter._id;
		modalRef.componentInstance.sid = sid;
		modalRef.result
				.then(
					updatedList => {
						this.savedSearchesList = updatedList;
					},
					reason => {}
				);
	}

}
