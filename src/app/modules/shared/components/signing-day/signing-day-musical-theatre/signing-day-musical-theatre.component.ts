import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SigningDayService } from '../../../../student/services/signing-day.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { CatalogService } from '../../../services/catalog.service';

@Component({
	selector: 'signing-day-musical-theatre',
	templateUrl: './signing-day-musical-theatre.component.html',
	styleUrls: ['./signing-day-musical-theatre.component.css']
})

export class SigningDayMusicalTheatreComponent implements OnInit {

	@Input() value: any;
	@Input() type: any;

	form: FormGroup;
	loading = false;
	submitAttempted = false;
	showVideo: boolean = true;
	submitBtn: boolean = true;
	videoUrl: any;
	dance_types: any;

	constructor(
		private modalService: NgbModal,
		private catalogService: CatalogService,
		private userService: UserService,
		private nsdService: SigningDayService,
		public activeModal: NgbActiveModal
	) {
		this.dance_types = [
			'Variation',
			'Solo',
			'Combo',
			'Chorus',
			'Other'
		];
	}

	ngOnInit() {
		if (this.type === 'Dance') {
			this.form = new FormGroup({
				piecePerformed: new FormControl('', [Validators.required]),
				dance_type: new FormControl('', [Validators.required]),
				company: new FormControl(''),
				show: new FormControl(''),
				role: new FormControl(''),
				video: new FormControl('', [Validators.required]),
			});
		} else {
			this.form = new FormGroup({
				piecePerformed: new FormControl('', [Validators.required]),
				dance_type: new FormControl(''),
				company: new FormControl(''),
				show: new FormControl(''),
				role: new FormControl(''),
				video: new FormControl('', [Validators.required]),
			});
		}
	}

	close() {
		this.activeModal.close();
	}

	onAdd() {

		if (this.submitBtn === true) {
			this.submitBtn = false;
			let mc;
			let mt;
			if (this.type === 'Dance') {

				mc = {
					piece: this.form.value.piecePerformed,
					company: this.form.value.company,
					dance_type: this.form.value.dance_type,
					show: this.form.value.show,
					role: this.form.value.role,
					video_url: this.form.value.video,
					type: this.type
				};

				mt = {
					id: this.value._id,
					studentId: this.userService.currentUser._id,
					dance: mc
				};

				this.nsdService
					.addDance(mt)
					.subscribe(
						(response: any) => {
							setTimeout(() => {
								this.submitBtn = true;
								this.activeModal.close();
							}, 2000);
						},
						err => { }
					);

			} else if (this.type === 'Monologue') {

				mc = {
					piece: null,
					company: null,
					dance_type: null,
					show: this.form.value.show,
					role: this.form.value.role,
					video_url: this.form.value.video,
					type: this.type
				};

				mt = {
					id: this.value._id,
					studentId: this.userService.currentUser._id,
					musical_theater: mc
				}

				this.nsdService
					.addMusicalTheatre(mt)
					.subscribe(
						(response: any) => {
							setTimeout(() => {
								this.submitBtn = true;
								this.activeModal.close();
							}, 2000);
						},
						err => { }
					);

			}
		}

	}

	isFieldInvalid(fieldName: string) {
		const field = this.form.get(fieldName);
		return field.invalid && (field.touched || this.submitAttempted);
	}

	getVideoUrl(url: any) {
		this.videoUrl = url;
	}

}
