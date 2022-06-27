import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { UserModel } from '../../models/user.model';

import { ScholarshipService } from '../../services/scholarship.service';
import { UserService } from '../../services/user.service';


@Component({
	selector: 'app-scholarships',
	templateUrl: './scholarships.component.html',
	styleUrls: ['./scholarships.component.css']
})

export class ScholarshipsComponent implements OnInit {

	public user = new UserModel({});

	savedScholarshipsList: any[];
	scholarshipList: any[];
	scholarship = {};
	savingScholarshipId = '';
	feedback = '';
	talent = '';
	country = '';
	state = '';
	name = '';
	loading = false;
	requestFailed = false;
	showFS = false;
	isListsLoaded: boolean = false;
	showScholarship: boolean = false;
	showScholarshipList: boolean = false;

	constructor(
		private scholarshipService: ScholarshipService,
		public userService: UserService,
		private route: ActivatedRoute
	) {
		this.savedScholarshipsList = [];
	}

	ngOnInit() {
		this.getProfile();
		this.route
			.params
			.subscribe((params: Params) => {
			
				if (params['state'] && params['name']) {
					this.showScholarship = true;
					this.state = params['state'];
					this.name = params['name'];
					this.scholarshipService
					.getScholarshipByStateAndName(this.state, this.name)
					.subscribe(
						(response: any) => {
							this.scholarship = response.data;
						},
						err => {
							console.error('SA.scholarships.component', err);
						}
					);
				} else if (params['state']) {
					this.showScholarshipList = true;
					this.state = params['state'];
					this.scholarshipService
					.getScholarshipListByState(this.state)
					.subscribe(
						(response: any) => {
							this.scholarshipList = response.data;
						},
						err => {
							console.error('SA.scholarships.component', err);
						}
					);
				}
				
			});
	}

	showFSChanged(e) {
		if (!e) {
			this.getProfile();
		}
	}

	getProfile() {
		if ( this.userService.currentUser !== null ) {
			this.userService
				.getUserProfile(this.userService.currentUser._id)
				.subscribe((response: any) => {
					this.user = response.data;
				});
		}
	}

	inSSList(id: string) {
		let response = false;
		
		if (this.savedScholarshipsList.length > 0) {
			response = this.savedScholarshipsList.find(s => s._id === id)
				? true
				: false;
		}

		return response;
	}

	isSavingScholarship(id: string) {
		return this.savingScholarshipId === id;
	}

	saveScholarship(s: any) {
		this.savingScholarshipId = s._id;
		this.scholarshipService
			.saveScholarship(this.userService.currentUser._id, {
				_id: s._id,
				name: s.name,
				type: s.type,
				organization: s.organization,
				deadline: s.deadline
			})
			.subscribe(
				(response: any) => {
					this.savedScholarshipsList =
						response.data.saved_scholarships;
				},
				err => {
					console.error('SA.scholarship.search.component - saveScholarship', err);
				}
			);
	}

	sortTable(n) {
		var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
		table = document.getElementById("scholarshipStateList");
		switching = true;
		dir = "asc";
		while (switching) {
			switching = false;
			rows = table.rows;
			for (i = 1; i < (rows.length - 1); i++) {
				shouldSwitch = false;
				x = rows[i].getElementsByTagName("TD")[n];
				y = rows[i + 1].getElementsByTagName("TD")[n];
				if (dir == "asc") {
					if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
						shouldSwitch = true;
						break;
					}
				} else if (dir == "desc") {
					if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
						shouldSwitch = true;
						break;
					}
				}
			}
			if (shouldSwitch) {
				rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
				switching = true;
				switchcount ++;
			} else {
				if (switchcount == 0 && dir == "asc") {
					dir = "desc";
					switching = true;
				}
			}
		}
	}

}