import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ScholarshipDetailsModalComponent } from './scholarship-details-modal/scholarship-details-modal.component';
import { UserModel } from '../../models/user.model';
import { LocationService } from '../../services/location.service';
import { ScholarshipService } from '../../services/scholarship.service';
import { UserService } from '../../services/user.service';
import { ListService } from '../../../student/services/list.service';

@Component({
	selector: 'app-scholarship-search',
	templateUrl: './scholarship-search.component.html'
})

export class ScholarshipSearchComponent implements OnInit {

	public user = new UserModel({});
	form: FormGroup;
	loading = false;
	submitAttempted = false;
	states: any[];
	types: any[];
	applies_to: any[];
	searchResults: any[];
	total: number;
	page: number;
	pageSize: number;
	savingScholarshipId = '';
	savedScholarshipsList: any[];
	feedback = '';
	requestFailed = false;
	showFS = false;
	isListsLoaded: boolean = false;

	constructor(
		private locationService: LocationService,
		private scholarshipService: ScholarshipService,
		private modalService: NgbModal,
		public userService: UserService,
		public fb: FormBuilder,
		public listService: ListService
	) {
		this.form = new FormGroup({
			name: new FormControl(''),
			type: new FormControl(''),
			organization: new FormControl(''),
			state: new FormControl(''),
			appliesTo: this.fb.group([])
		});

		this.savedScholarshipsList = [];
		this.states = this.locationService.getStates();
		this.types = [ ];

		this.page = 1;
		this.pageSize = 20;
		this.total = 0;

		this.listService.getScholarshipAppliesToList()
			.subscribe(
				(response: any) => {
					this.applies_to = response.data;

					const appliesToFormGroup = new FormGroup({});
					this.applies_to.forEach(item => {
						const control: FormControl = new FormControl(item)
						control.setValue(false);
						appliesToFormGroup.addControl(item, control)
					});

					this.form.setControl('appliesTo', appliesToFormGroup)
					this.isListsLoaded = true;
				},
				err => {
					console.error('SA.scholarship-search.component - getScholarshipAppliesToList', err);
				}
			);

			this.listService.getScholarshipTypes()
			.subscribe(
				(response: any) => {
					this.types = response.data;
				},
				err => {
					console.error('SA.scholarship-search.component - getScholarshipTypes', err);
				}
			);

	}

	ngOnInit() {
		this.getProfile();
	}

	get formModel() {
		return {
			name: this.form.get('name').value,
			type: this.form.get('type').value,
			organization: this.form.get('organization').value,
			state: this.form.get('state').value,
			appliesTo: this.form.get('appliesTo').value
		};
	}

	resetForm() {
		this.form.reset({
			state: '',
			type: ''
		});
		this.submitAttempted = false;
	}

	showFSChanged(e) {
		if (!e) {
			this.getProfile();
		}
	}

	getProfile() {
		this.userService
			.getUserProfile(this.userService.currentUser._id)
			.subscribe((response: any) => {
				this.savedScholarshipsList = response.data.saved_scholarships;
			});
	}

	validMinCriteria(fm: any) {
		let count = 0;

		if (fm.name) { count++; }
		if (fm.type) { count++; }
		if (fm.organization) { count++; }
		if (fm.state) { count++; }

		if (fm.appliesTo) {
			const values = Object.values(fm.appliesTo);
			const keys = Object.keys(fm.appliesTo);
			for (let i = 0; i < values.length; i++) {
				if ( values[i] === true) {
					count++;
				}
			}
		}

		return count > 0 ? true : false;
	}

	onCheckAppliesTo(name: string, event: any) {
	}

	submitForm() {
		console.log('form submitted - ', this.formModel);
		this.requestFailed = false;
		this.feedback = '';

		if (!this.validMinCriteria(this.formModel)) {
			this.requestFailed = true;
			this.feedback = 'Please select at least one criteria to be able to see results.';
			this.loading = false;
			return;
		}

		this.loading = true;

		this.scholarshipService
			.search(
				this.formModel,
				this.page,
				this.pageSize
			)
			.subscribe(
				(response: any) => {
					this.searchResults = response.data;
					this.total = response.total || response.data.length;
					this.savingScholarshipId = '';
					this.loading = false;
				},
				err => {
					this.loading = false;
				}
			);
	}

	pageChange($event: any) {
		this.page = $event;
		this.submitForm();
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
					this.savedScholarshipsList = response.data.saved_scholarships;
				},
				err => {
					console.error('SA.scholarship.search.component - saveScholarship', err);
				}
			);
	}

	viewDetails(scholarship_id: string) {
		const modalRef = this.modalService.open(
			ScholarshipDetailsModalComponent,
			{
				size: 'lg'
			}
		);

		modalRef.componentInstance.scholarship_id = scholarship_id;
		modalRef.result.then(() => { }, reason => { });
	}

}