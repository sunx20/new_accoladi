import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CollegeService } from '../../../services/college.service';
import { UserModel } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { LocationService } from '../../../services/location.service';

@Component({
	selector: 'app-college-saved',
	templateUrl: './college-saved.component.html'
})

export class CollegeSavedComponent implements OnInit {

	public user = new UserModel({});
	savedCollegesList: any[] = [];
	states: any[];

	constructor(
		private collegeService: CollegeService,
		private modalService: NgbModal,
		private userService: UserService,
		private locationService: LocationService,
		private router: Router
	) {
		this.states = this.locationService.getStates();
	}

	ngOnInit() {
		this.userService
			.getUserProfile(
				this.userService.currentUser._id
			)
			.subscribe(
				(response: any) => {
					this.savedCollegesList = response.data.saved_colleges;
				}
			);
	}

	extractState(s: any) {
		const abbr = s && s.organization && s.organization.address
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

	remove(id: string) {
		this.collegeService
			.removeSavedCollege(
				this.userService.currentUser._id, 
				id
			)
			.subscribe(
				(response: any) => {
					this.savedCollegesList = response.data.saved_colleges;
				}
			);
	}

}