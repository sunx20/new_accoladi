import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { TalentService } from '../../../../modules/student/services/talent.service';
import { CatalogService } from '../../services/catalog.service';

@Component({
	selector: 'app-repertoire-search',
	templateUrl: './repertoire-search.component.html',
	styleUrls: ['./repertoire-search.component.css']
})

export class RepertoireSearchComponent implements OnInit {

	searchForm: FormGroup;
	searchResults: any[] = [];
	instrumentList: any[] = [];
	gradeLevelList: any[] = [];
	total: number;
	page: number;
	pageSize: number;
	feedback: String = '';
	requestFailed: Boolean = false;
	loading: Boolean = false;
	submitAttempted: boolean = false;

	constructor(
		private fb: FormBuilder,
		private talentService: TalentService,
		private catalogService: CatalogService,
	) {
		this.initializeForm();
		this.page = 1;
		this.pageSize = 20;
		this.total = 0;
	}

	ngOnInit() {
		this.getInitialData();
	}
	
	get formModel() {
		return {
			instrument: this.searchForm.get('instrument').value,
			gradeLevel: this.searchForm.get('gradeLevel').value,
			composer: this.searchForm.get('composer').value,
			composition: this.searchForm.get('composition').value,
			collection: this.searchForm.get('collection').value,
			publisher: this.searchForm.get('publisher').value,
			sku: this.searchForm.get('sku').value
		};
	}
	
	getInitialData() {
		this.gradeLevelList = [
			{ id: '6', name: '6th' },
			{ id: '7', name: '7th' },
			{ id: '8', name: '8th' },
			{ id: '9', name: '9th' },
			{ id: '10', name: '10th' },
			{ id: '11', name: '11th' },
			{ id: '12', name: '12th' },
		];

		this.talentService.getTalentList().subscribe((response: any) => {
			if (response.status === 'success') {
				this.instrumentList = this.groupBy(response.data, 'family');
			}
		});
	}

	groupBy(data: any[], filedName: string) {
		let group = data.reduce((r, a) => {
			r[a[filedName]] = [...r[a[filedName]] || [], a];
			return r;
		}, {});
		return group;
	}

	onSubmitForm() {
		console.log('form submitted - ', this.searchForm);
		this.requestFailed = false;
		this.feedback = '';
				
		if (!this.validateForm(this.formModel)) {
			this.requestFailed = true;
			this.feedback = 'Please select at least one criteria to be able to see results.';
			this.loading = false;
			return;
		}

		this.loading = true;
		//this.page = 1;

		this.catalogService
			.search(
				this.searchForm.value,
				this.page,
				this.pageSize
			)
			.subscribe((response: any) => {
				this.searchResults = JSON.parse(JSON.stringify(response.data));
				this.total = response.total || response.data.length;
				this.loading = false;
			},
				(err: any) => {
					this.loading = false;
				}
			);
	}

	validateForm(frm: any): boolean {
		let count = 0;
	
		if (frm.instrument) { count++; }
		if (frm.gradeLevel) { count++; }
		if (frm.composer) { count++; }
		if (frm.composition) { count++; }
		if (frm.collection) { count++; }
		if (frm.publisher) { count++; }
		if (frm.sku) { count++; }

		return count > 0;
	}

	pageChange($event: any) {
		this.page = $event;
		this.onSubmitForm();
	}

	private initializeForm() {
		this.searchForm = this.fb.group({
			instrument: '',
			gradeLevel: '',
			composer: '',
			composition: '',
			collection: '',
			publisher: '',
			sku: '',
		})
	}

	onResetForm() {
		this.searchForm.reset();
	}

}
