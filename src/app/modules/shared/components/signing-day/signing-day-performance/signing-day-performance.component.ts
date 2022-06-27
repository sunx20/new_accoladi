
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SigningDayService } from '../../../../student/services/signing-day.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap, filter } from 'rxjs/operators';
import { CatalogService } from '../../../services/catalog.service';
import { AddCompositionInformationComponent } from '../../add-composition-information/add-composition-information.component';

@Component({
	selector: 'app-signing-day-performance',
	templateUrl: './signing-day-performance.component.html',
	styleUrls: ['./signing-day-performance.component.css']
})

export class SigningDayPerformanceComponent implements OnInit {

	@Input() value: any;
	@Input() type: any;
	
	form: FormGroup;
	submitAttempted = false;
	searchingCompositions = false;
	noResult = false;
	searchFailed = false;
	perfomanceList: any = []
	showRequired: boolean = false;
	group: any;
	subGroup: any;
	typeName: any;
	showVideo: boolean = true;
	submitBtn: boolean = true;
	videoUrl: any;

	constructor(
		private modalService: NgbModal, 
		private catalogService: CatalogService, 
		private userService: UserService, 
		private sdService: SigningDayService, 
		public activeModal: NgbActiveModal, 
	) {
		this.form = new FormGroup({
			performed: new FormControl('', [Validators.required]),
			composer: new FormControl('', [Validators.required]),
			url: new FormControl('', [Validators.required]),
			composition_id: new FormControl(""),
			instrument: new FormControl(""),
			family: new FormControl(""),
			type: new FormControl("")
		});
	}

	ngOnInit() {

		this.subGroup = this.value.area.sub_group;
		this.group = this.value.area.group;

		if (this.group == "Performance") {
			if (this.subGroup == "Vocal") {
				this.typeName = "Song"
			} else {
				this.typeName = "Piece"
			}
		} else {
			this.typeName = "Song"
		}

		if (this.value.area.sub_group == "Vocal") {
			this.showRequired = true;
		} else {
			this.showRequired = false;
		}

	}

	close() {
		this.activeModal.close();
	}

	searchCompositions = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			filter(term => term.length > 2),
			tap(() => this.searchingCompositions = true),
			switchMap(term => this.catalogService.getCompositions(term).pipe(
				map((res: any) => {
					res.data.length < 1
						? this.noResult = true
						: this.noResult = false
					return res.data;
				}),
				tap(() => this.searchFailed = false),
				catchError(() => {
					this.searchFailed = true;
					return of([]);
				}))
			),
			tap(() => {
				this.searchingCompositions = false;
			})
		)

	formatMatches = (item: any) => {
		if (!item) {
			return '';
		}

		const composers = item.composers && item.composers.length > 0
			? ' / ' + item.composers.join(', ')
			: '';
		const inst_group = item.instrument && item.instrument.group
			? ' / ' + item.instrument.group
			: '';
		const inst_name = item.instrument && item.instrument.name
			? ' / ' + item.instrument.name
			: '';
		const second_line = inst_group && inst_name
			? '\n' + inst_group + inst_name
			: '';
		const name = item.title + composers + second_line;

		return name;
	}

	save() {

		if (this.submitBtn == true) {
			this.submitBtn = false;
			let perfomance = {
				id: this.value._id,
				studentId: this.userService.currentUser._id,
				perfomanceList: {
					composition_id: this.form.value.performed._id,
					composition_title: this.form.value.performed.title,
					composers: [this.form.value.composer],
					video_url: this.form.value.url,
					type: this.typeName
				}
			}

			this.sdService
				.addPerformance(perfomance)
				.subscribe(
					(response: any) => {
						setTimeout(() => {
							this.submitBtn = true;
							this.activeModal.close();
						}, 2000);
					},
					err => {
					}
				);
		}

	}

	componsion() {
		this.modalService.hasOpenModals();
		const modalRef = this.modalService.open(AddCompositionInformationComponent);
		modalRef.componentInstance.savedComposition.subscribe(($e) => {
			this.setAddedComposition($e);
		});
	}

	setAddedComposition = (e: any) => {
		const item = e;
		this.form.get('composition_id').setValue(item._id);
		this.form.get('instrument').setValue(item.instrument.name);
		this.form.get('family').setValue(item.instrument.family);
		this.form.get('type').setValue(item.instrument.type);
		this.form.get('performed').setValue(item);
		this.form.get('composer').setValue(item.composers[0]);
	}

	selectedComposition = (e: any) => {
		const item = e.item;
		this.form.get('composition_id').setValue(item._id);
		this.form.get('instrument').setValue(item.instrument.name);
		this.form.get('family').setValue(item.instrument.family);
		this.form.get('type').setValue(item.instrument.type);
		this.form.get('performed').setValue(item);
		this.form.get('composer').setValue(item.composers[0]);
	};

	getVideoUrl(url: any) {
		this.videoUrl = url;
	}

	isFieldInvalid(fieldName: string) {
		const field = this.form.get(fieldName);

		return field.invalid && (field.touched || this.submitAttempted);
	}

}