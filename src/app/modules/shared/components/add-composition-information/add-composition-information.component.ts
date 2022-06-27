import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CatalogService } from '../../services/catalog.service';
import { TalentService } from '../../../student/services/talent.service';
import {ListService} from '../../../student/services/list.service';

import { Catalog } from '../../../student/models/catalog.model';

@Component({
	selector: 'app-add-composition-information',
	templateUrl: './add-composition-information.component.html',
	styleUrls: ['./add-composition-information.component.css']
})

export class AddCompositionInformationComponent implements OnInit {

	@Output() savedComposition = new EventEmitter<any>();

	families: string[] = [];
	instruments: any[] = [];
	CategoryList = [];
	GradeList = [];
	instrumentTypeList = [];

	public compositionForm = new FormGroup({
		name: new FormControl('', Validators.required),
		composer: new FormControl('', Validators.required),
		publisher: new FormControl(''),
		instrument: new FormControl(''),
		family: new FormControl(''),
		category: new FormControl(''),
		for: new FormControl(''),
		gradelevel: new FormControl('')
	});

	constructor(
		public catalogService: CatalogService,
		private talentService: TalentService,
		public activeModal: NgbActiveModal,
		private listService:ListService
	) { }

	ngOnInit() {

		this.listService
			.getPerformanceCategories()
			.subscribe(
				(response: any) => {
					this.CategoryList = response.data;
				},
				err => {
					console.error('SA.add-composition-information.component - getPerformanceCategories', err);
				}
			);

		this.listService
			.getTalentTypes()
			.subscribe(
				(response: any) => {
					this.instrumentTypeList = response.data;
				},
				err => {
					console.error('SA.add-composition-information.component - getTalentTypes', err);
				}
			);

		this.listService
			.getFamiliesList()
			.subscribe(
				(response: any) => {
					this.families = response.data;
				},
				err => {
					console.error('SA.add-composition-information.component - getFamiliesList', err);
				}
			);

		this.listService
			.getGrades()
			.subscribe(
				(response: any) => {
					this.GradeList = response.data;
				},
				err => {
					console.error('SA.add-composition-information.component - getGrades', err);
				}
			);

		this.respondToFamilyChange();
	}

	saveComposition(composition) {
		const catalog: Catalog = {
			title: composition.name,
			composers: [composition.composer],
			publisher: {
				name: composition.publisher,
			},
			instrument: {
				name: composition.instrument,
				group: composition.category,
				type: composition.for
			},
			meta: {
				uil: {
					grade: Number(composition.gradelevel)
				}
			}
		};

		this.catalogService.addNewCatalog(catalog).subscribe(
			res => {
				const result: any = res;
				this.savedComposition.emit(result.data)
			},
			error => {
				console.log(error);
			}, () => {
				this.activeModal.close();
			}
		);
	}

	respondToFamilyChange() {
		this.compositionForm
			.get(
				'family'
			)
			.valueChanges
			.subscribe(
				val => {
					this.talentService
						.getTalentByFamily(
							val
						)
						.subscribe(
							(response: any) => {
								this.instruments = response.data;
								if (!this.instruments.find(i => i.name === this.compositionForm.get('instrument').value)) {
									this.compositionForm.get('instrument').setValue('');
								}
							}
						);
				}
			);
	}

	close() {
		this.activeModal.close();
	}

}
