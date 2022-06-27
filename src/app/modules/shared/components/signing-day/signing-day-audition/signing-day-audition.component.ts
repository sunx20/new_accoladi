
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { SigningDayService } from '../../../../student/services/signing-day.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';

@Component({
	selector: 'app-signing-day-audition',
	templateUrl: './signing-day-audition.component.html',
	styleUrls: ['./signing-day-audition.component.css']
})

export class SigningDayAuditionComponent implements OnInit {

	@Input() value: any;
	@Input() type: any;
	
	form: FormGroup;
	submitAttempted = false;
	searchingCompositions = false;
	noResult = false;
	searchFailed = false;
	auditionList: any = []
	showRequired: boolean = false;
	group: any;
	subGroup: any;
	typeName: any;
	showVideo: boolean = true;
	submitBtn: boolean = true;
	videoUrl: any;
	types: any;

	constructor(
		private userService: UserService, 
		private sdService: SigningDayService, 
		public activeModal: NgbActiveModal, 
	) {
		this.form = new FormGroup({
			performed: new FormControl('', [Validators.required]),
			composer: new FormControl('', [Validators.required]),
			video_url: new FormControl('', [Validators.required]),
			instrument: new FormControl(''),
			company: new FormControl(''),
			show: new FormControl(''),
			role: new FormControl(''),
			type: new FormControl(''),
			comments: new FormControl('')
		});
		this.types = [
			'Variation',
			'Solo',
			'Combo',
			'Chorus',
			'Other'
		];
	}

	ngOnInit() {
		this.subGroup = this.value.area.sub_group;
		this.group = this.value.area.group;
	}

	close() {
		this.activeModal.close();
	}

	save() {

		if (this.submitBtn == true) {
			this.submitBtn = false;

			let data = {
				id: this.value._id,
				studentId: this.userService.currentUser._id,
				data: {
					performed:  this.form.value.performed,
					composer:  this.form.value.composer,
					video_url:  this.form.value.video_url,
					instrument:  this.form.value.instrument,
					company:  this.form.value.company,
					show:  this.form.value.show,
					role:  this.form.value.role,
					type:  this.form.value.type,
					comments: this.form.value.comments,
					aud_type: 'Audition'
				}
			}

			this.sdService
				.addAudition(data)
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

	getVideoUrl(url: any) {
		this.videoUrl = url;
	}

	isFieldInvalid(fieldName: string) {
		const field = this.form.get(fieldName);

		return field.invalid && (field.touched || this.submitAttempted);
	}

}