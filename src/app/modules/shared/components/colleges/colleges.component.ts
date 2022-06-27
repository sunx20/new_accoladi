import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { UserModel } from '../../models/user.model';

import { CollegeService } from '../../services/college.service';
import { CollegePreferenceService } from '../../../../modules/student/services/college-preference.service';
import { UserService } from '../../services/user.service';


@Component({
	selector: 'app-colleges',
	templateUrl: './colleges.component.html',
	styleUrls: ['./colleges.component.css']
})

export class CollegesComponent implements OnInit {

	public user = new UserModel({});

	savedCollegesList: any[];
	collegeList: any[];
	college = {};
	savingCollegeId = '';
	feedback = '';
	talent = '';
	country = '';
	state = '';
	name = '';
	loading = false;
	requestFailed = false;
	showFS = false;
	isListsLoaded: boolean = false;
	showCollege: boolean = false;
	showCollegeList: boolean = false;

	constructor(
		private collegeService: CollegeService,
		private cpService: CollegePreferenceService,
		public userService: UserService,
		private route: ActivatedRoute
	) {
		this.savedCollegesList = [];
	}

	ngOnInit() {
		this.getProfile();
		this.route
			.params
			.subscribe(
				(params: Params) => {
					if (params['state'] && params['name']) {
						this.showCollege = true;
						this.state = params['state'];
						this.name = params['name'];
						this.collegeService
							.getCollegeByName(
								this.state,
								this.name
							)
							.subscribe( 
								(response: any) => {
									this.college = response.data;
								},
								err => {
									console.error('SA.colleges.component', err);
								}
							);
					} else if (params['state']) {
						this.showCollegeList = true;
						this.state = params['state'];
						this.collegeService
							.getCollegeListByState(
								this.state
							)
							.subscribe( 
								(response: any) => {
									this.collegeList = response.data;
									console.log(this.collegeList);
								},
								err => {
									console.error('SA.colleges.component', err);
								}
							);
					}
				}
			);
	}

	showCSChanged(e) {
		if (!e) {
			this.getProfile();
		}
	}

	getProfile() {
		if ( this.userService.currentUser !== null ) {
			this.userService
				.getUserProfile(
					this.userService.currentUser._id
				)
				.subscribe(
					(response: any) => {
						this.user = response.data;
						this.savedCollegesList = response.data.saved_colleges;
					}
				);
		}
	}

	inCPList(id: string) {
		const n = this.user
						.college_pref
						.colleges
						.map((c: any) => c._id)
						.includes(id);
		return n;
	}

	isSavingCollege(id: string) {
		return this.savingCollegeId == id;
	}

	saveCollege(_id: string, name: string) {
		this.savingCollegeId = _id;
		const collegeP: any = this.user.college_pref;
		collegeP.colleges.push({ _id, name });

		this.cpService
			.updateStudentCP(
				this.user._id, 
				collegeP
			)
			.subscribe( 
				(response: any) => {
					// this.submitForm(false);
				},
				err => {
					console.error('SA.colleges.component - saveCollege', err);
				}
			);
	}

	sortTable(n) {
		var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
		table = document.getElementById('collegeStateList');
		switching = true;
		dir = 'asc';
		while (switching) {
			switching = false;
			rows = table.rows;
			for (i = 1; i < (rows.length - 1); i++) {
				shouldSwitch = false;
				x = rows[i].getElementsByTagName('TD')[n];
				y = rows[i + 1].getElementsByTagName('TD')[n];
				if (dir == 'asc') {
					if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
						shouldSwitch = true;
						break;
					}
				} else if (dir == 'desc') {
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