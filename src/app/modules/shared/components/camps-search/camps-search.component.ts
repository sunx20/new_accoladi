import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { DataStateChangeEvent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';

import { Observable } from 'rxjs/Rx';

import { UserModel } from '../../models/user.model';
import { CampSearchService } from '../../../student/services/camp-search.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-camps-search',
	templateUrl: './camps-search.component.html',
	styleUrls: ['./camps-search.component.css']
})

export class CampsSearchComponent implements OnInit {

	public user = new UserModel({});
	public view: Observable<GridDataResult>;
	public gridState: State = {
		sort: [],
		skip: 0,
		take: 10,
	};
	public defaultItem: {
		text: string,
		value: number
	} = {
			text: 'SELECT',
			value: null
		}
	public ageGroupList: Array<{ text: string, value: number }> = [
		{ text: 'Middle School', value: 1 },
		{ text: 'High School', value: 2 },
		{ text: 'Adult', value: 3 }
	];
	public disciplineList: Array<{ text: string, value: number }> = [
		{ text: 'Band', value: 1 },
		{ text: 'Jazz', value: 2 },
		{ text: 'Orchestra', value: 3 },
		{ text: 'Keyboard', value: 4 },
		{ text: 'Strings', value: 5 },
		{ text: 'Vocal', value: 6 },
		{ text: 'Instrumental', value: 7 },
		{ text: 'Musical Theater', value: 8 },
		{ text: 'General Music/ Other', value: 9 }
	];
	public priceList: Array<{ text: string, value: number }> = [
		{ text: 'Unavailble/Null', value: 1 },
		{ text: '$0-500', value: 2 },
		{ text: '$500-1000', value: 3 },
		{ text: '$1000-3000', value: 4 },
		{ text: '$3000-5000', value: 5 },
		{ text: '$5000-10,000', value: 6 },
	];
	public SessionList: Array<{ text: string, value: number }> = [
		{ text: '1', value: 1 },
		{ text: '2', value: 2 },
		{ text: '3', value: 3 },
		{ text: '4', value: 4 },
		{ text: '5', value: 5 },
		{ text: '6', value: 6 },
		{ text: '7', value: 7 },
		{ text: '8', value: 8 },
	];
	profileForm = new FormGroup({
		state: new FormControl(''),
		price: new FormControl(),
		ageGroup: new FormControl(null),
		discipline: new FormControl(null),
		length: new FormControl(null),
	});
	data: any;
	rawData: any;
	ageGroup: any;
	discipline: any;
	loading = false;
	loggedin: boolean = false;

	constructor(
		private campSearchService: CampSearchService,
		public userService: UserService
	) { }

	ngOnInit() {
		if ( this.userService.currentUser ) {
			this.loggedin = true;
			this.campSearchService
				.getCamps()
				.subscribe(
					(response: any) => {
						this.rawData = response.data;
						this.data = response.data;
						console.log(response.data)
						//	this.view = Observable.of(this.data).map(data => process(data, this.gridState));
					},
					err => { }
				);
		}
	}

	public pageChange(event: PageChangeEvent): void {
		this.gridState.skip = event.skip;
		this.view = Observable.of(this.data).map(data => process(data, this.gridState));
	}

	public dataStateChange(state: DataStateChangeEvent): void {
		this.gridState = state;
		this.view = Observable.of(this.data).map(data => process(data, this.gridState));
	}

	ageGroupChange(event) {
		this.ageGroup = event;
	}

	disciplineChange(event) {
		this.discipline = event;
	}

	onSearch(loading = true) {
		this.data = this.rawData;

		if (loading) {
			this.loading = true;
		}

		if (this.data !== undefined) {
			if (this.profileForm.value.price !== null) {
				this.onCostPerSession();
			}

			if (this.ageGroup !== undefined && this.ageGroup.length!=0) {
				this.onAgeGroup();
			}

			if (this.discipline !== undefined && this.discipline.length!=0) {
				this.onDiscipline();
			}

			if (this.profileForm.value.length !== null) {
				let checkAvailable = this.data.filter(x => x.weeks === this.profileForm.value.length.text);
				this.data = checkAvailable;
			}

			if (this.profileForm.value.state !== '') {
				let upperState = this.profileForm.value.state.toUpperCase()
				let checkstate = this.data.filter(x => x.address.state === upperState);
				this.data = checkstate;
			}

			this.view = Observable.of(this.data).map(data => process(data, this.gridState));
		}
	}

	onAgeGroup() {
		if (this.ageGroup !== undefined) {
			let agaGroupList: any = [];
			this.ageGroup.forEach(group => {
				if (group.text === 'Middle School') {
					this.data.forEach(element => {
						if (element.middle_school === true) {
							agaGroupList.push(element);
						}
					});
				} else if (group.text === 'High School') {
					this.data.forEach(element => {
						if (element.high_school === true) {
							agaGroupList.push(element);
						}
					});
				} else if (group.text === 'Adult') {
					this.data.forEach(element => {
						if (element.over_18 === true) {
							agaGroupList.push(element);
						}
					});
				}
			});

			let removeDuplication: any = []
			agaGroupList.forEach(element => {
				let count = agaGroupList.filter(x => x._id === element._id);
				if (count.length === this.ageGroup.length) {
					let checkAvailable = removeDuplication.filter(x => x._id === element._id);
					if (checkAvailable.length === 0) {
						removeDuplication.push(element);
					}
				}
			});
			this.data = removeDuplication;
		}
	}

	onDiscipline() {
		let disciplineList: any = []
		this.data.forEach(element => {
			this.discipline.forEach(item => {
				let check = element.ensembles.includes(item.text)
				if (check === true) {
					let checkAvailable = disciplineList.filter(x => x._id === element._id);
					if (checkAvailable.length === 0) {
						disciplineList.push(element)
					}
				}
			});
		});
		this.data = disciplineList;
	}

	onCostPerSession() {

		let tempValue: any = [];
		switch (this.profileForm.value.price.text) {
			case 'Unavailble/Null':
				this.data.forEach(element => {
					if (element.cost_per_session === '' || element.cost_per_session == null) {
						tempValue.push(element);
					}
				});
				break;
			case '$0-500':
				this.data.forEach(element => {
					if (element.cost_per_session !== '') {
						if (element.cost_per_session >= 0 && element.cost_per_session <= 500) {
							tempValue.push(element);
						}
					}
				});
				break;
			case '$500-1000':
				this.data.forEach(element => {
					if (element.cost_per_session >= 500 && element.cost_per_session <= 1000) {
						tempValue.push(element);
					}
				});
				break;
			case '$1000-3000':
				this.data.forEach(element => {
					if (element.cost_per_session >= 1000 && element.cost_per_session <= 3000) {
						tempValue.push(element);
					}
				});
				break;
			case '$3000-5000':
				this.data.forEach(element => {
					if (element.cost_per_session >= 3000 && element.cost_per_session <= 5000) {
						tempValue.push(element);
					}
				});
				break;
			case '$5000-10,000':
				this.data.forEach(element => {
					if (element.cost_per_session >= 5000 && element.cost_per_session <= 10000) {
						tempValue.push(element);
					}
				});
				break;
		}
		this.data = tempValue;
	}

	resetForm() {
		let emptyData: any = [];
		this.ageGroup=undefined;
		this.discipline=undefined;
		this.loading = false;
		this.profileForm.controls.state.setValue('');
		this.profileForm.controls.price.setValue(null);
		this.profileForm.controls.ageGroup.setValue(null);
		this.profileForm.controls.discipline.setValue(null);
		this.profileForm.controls.length.setValue(null);
		this.view = Observable.of(emptyData).map(data => process(data, this.gridState));
	}

}