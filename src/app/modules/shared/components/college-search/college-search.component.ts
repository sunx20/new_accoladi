import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { LocationService } from '../../services/location.service';
import { CollegeService } from '../../services/college.service';
import { UserService } from '../../services/user.service';
import { CollegePreferenceService } from '../../../../modules/student/services/college-preference.service';
import { CollegeDetailsModalComponent } from './college-details-modal/college-details-modal.component';

@Component({
	selector: 'app-college-search',
	templateUrl: './college-search.component.html'
})

export class CollegeSearchComponent implements OnInit {

	form: FormGroup;
	states: any[];
	cities: any[];
	types: any[];
	savedCollegesList: any[];
	searchResults: any[];
	total: number = 0;
	page: number;
	pageSize: number;
	user: any;
	userType: string;
	savingCollegeId = '';
	feedback = '';
	requestFailed = false;
	showCS = false;
	loading = false;
	submitAttempted = false;

	constructor(
		private locationService: LocationService,
		private collegeService: CollegeService,
		public userService: UserService,
		private cpService: CollegePreferenceService,
		private modalService: NgbModal
	) {
		this.form = new FormGroup({
			name: new FormControl(''),
			city: new FormControl(''),
			state: new FormControl(''),
			type: new FormControl('')
		});

		this.savedCollegesList = [];
		this.states = this.locationService.getStates();
		this.cities = [];
		this.types = [
			{
				label: 'HBCU',
				value: 'hbc'
			},
			{
				label: 'Public',
				value: 'public'
			},
			{
				label: 'Private',
				value: 'private'
			},
			{
				label: 'Non Profit',
				value: 'non_profit'
			}
		];

		this.page = 1;
		this.pageSize = 20;
		this.total = 0;
		
		if ( this.userService.currentUser === null ) {
			this.userType = 'guest'
		} else {
			if (this.userService.currentUser.role === 'Teacher') {
				this.userType = 'teacher'
			} else if (this.userService.currentUser.role === 'Student') {
				this.userType = 'student'
			} else if (this.userService.currentUser.role === 'Recruiter') {
				this.userType = 'recruiter'
			} else if (this.userService.currentUser.role === 'Parent') {
				this.userType = 'parent'
			}
		}
	}

	ngOnInit() {
		if ( this.userType !== 'guest' ) {
			this.getProfile();
		}
	}

	get formModel() {
		return {
			name: this.form.get('name').value,
			city: this.form.get('city').value,
			state: this.form.get('state').value,
			type: this.form.get('type').value
		};
	}

	showCSChanged(e) {
		if (!e) {
			this.getProfile();
		}
	}

	getProfile() {
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

	resetForm() {
		this.form.reset({
			state: '',
			type: ''
		});
		this.submitAttempted = false;
	}

	validMinCriteria(fm: any) {
		let count = 0;

		if (fm.name) { count++; }
		if (fm.type) { count++; }
		if (fm.organization) { count++; }
		if (fm.state) { count++; }

		return count > 0 ? true : false;
	}

	submitForm(loading = true) {
		this.requestFailed = false;
		this.feedback = '';

		if (!this.validMinCriteria(this.formModel)) {
			this.loading = false;
			this.requestFailed = true;
			this.feedback = 'Please select at least one criteria to be able to see results.';
			return;
		}

		if (loading) {
			this.loading = true;
		}

		this.collegeService
			.searchColleges(
				this.formModel, 
				this.page, 
				this.pageSize
			)
			.subscribe(
				(response: any) => {
					this.searchResults = response.data;
					this.total = response.total || response.data.length;
					this.savingCollegeId = '';
					this.loading = false;
				},
				err => {
					this.loading = false;
					console.error(err);
				}
			);
	}

	pageChange($event: any) {
		this.page = $event;
		this.submitForm();
	}

	extractState(s) {
		const abbr = s && s.address ? s.address.state : '';

		if (abbr) {
			return this.states
				.filter(s => s.abbr === abbr)
				.map(s => s.name)
				.pop();
		}

		return '';
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
		collegeP.colleges.push({ _id, name:name});
		this.cpService
			.updateStudentCP(
				this.user._id, 
				collegeP
			)
			.subscribe(
				(response: any) => {
					this.submitForm(false);
				},
				err => {
					console.error('SA.college.search.component - saveCollege', err);
				}
			);
	}

	viewDetails(college_id: string) {
		const modalRef = this.modalService
							 .open(
								 CollegeDetailsModalComponent, 
								 { size: 'lg' } 
							 );

		modalRef.componentInstance.college_id = college_id;
		modalRef.result
				.then(() => { }, reason => { });
	}

}