import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../../models/user.model';
import { LocationService } from '../../../services/location.service';
import { ScholarshipService } from '../../../services/scholarship.service';
import { UserService } from '../../../services/user.service';


@Component({
	selector: 'app-scholarship-saved',
	templateUrl: './scholarship-saved.component.html'
})

export class ScholarshipSavedComponent implements OnInit {

	public user = new UserModel({});
	savedScholarshipsList: any[] = [];
	states: any[];

	constructor(
		private scholarshipService: ScholarshipService,
		private userService: UserService,
		private locationService: LocationService,
	) {
		this.states = this.locationService.getStates();
	}

	ngOnInit() {
		this.userService
			.getUserProfile(this.userService.currentUser._id)
			.subscribe((response: any) => {
				this.savedScholarshipsList = response.data.saved_scholarships;
			});
	}

	extractState(s: any) {
		const abbr =
			s && s.organization && s.organization.address
				? s.organization.address.state
				: '';

		if (abbr) {
			return this.states
				.filter(s => s.abbr === abbr)
				.map(s => s.name)
				.pop();
		}

		return '';
	}

	extractType(s: any) {
		return s && s.type
			? s.type
				.map(t => {
					switch (t) {
						case 'M':
							return 'Music';
						case 'D':
							return 'Dance';
						case 'T':
							return 'Theater';
						case 'G':
							return 'General';
						default:
					}
				})
				.join(', ')
			: '';
	}
	
	remove(id: string) {
		this.scholarshipService
			.removeSavedScholarship(this.userService.currentUser._id, id)
			.subscribe((response: any) => {
				this.savedScholarshipsList = response.data.saved_scholarships;
			});
	} 
	
}
