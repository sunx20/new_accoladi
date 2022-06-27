import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ResourcesService } from '../../services/resources.service';
import { UserService } from '../../services/user.service';


@Component({
	selector: 'app-musical-terms',
	templateUrl: './musical-terms.component.html',
})

export class MusicalTermsComponent implements OnInit {

	form: FormGroup
	musicalTerms = [];
	searchTerm = ''
	filterLetter = '';
	isRecruiter: boolean = false;
	tempTermData;

	alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

	constructor(
		public resourceService: ResourcesService, 
		public userSevice: UserService, 
		private modalService: NgbModal
	) {

		this.form = new FormGroup({
			term: new FormControl('', Validators.required),
			definition: new FormControl('', Validators.required),
			video_url: new FormControl('', Validators.required),
			publish: new FormControl(''),
		});

	}

	ngOnInit() {
		if (this.userSevice.currentUser.role == "Recruiter") { 
			this.isRecruiter = true 
		}
		this.resourceService
			.getMusicalTerms()
			.pipe()
			.subscribe((res: any) => {
			this.musicalTerms = res.data
		})
	}

	get searchResults() {
		if (this.musicalTerms.length > 0) {
			this.musicalTerms.sort((a, b) => a.term.localeCompare(b.term));
			if (this.searchTerm && this.searchTerm != '') {
				this.filterLetter = ''
				return this.searchMusicalTermsBy(this.searchTerm)
			}
			else {
				return this.categoriseBy(this.filterLetter)
			}
		}
	}

	get formModel() {
		return {
			term: this.form.get('term').value,
			definition: this.form.get('definition').value,
			video_url: this.form.get('video_url').value,
			publish: this.form.get('publish').value,
		};
	}

	updateFormData(item) {
		this.form.patchValue({
			term: item.term,
			definition: item.definition,
			video_url: item.video_url,
			publish: item.publish
		})
	}

	searchMusicalTermsBy(term) {
		return this.musicalTerms.filter(item => item.term.toLowerCase().includes(term.toLowerCase()))
	}

	categoriseBy(letter) {
		if (letter && letter != '' && letter != 'all') {
			return this.musicalTerms.filter(item => item.term[0].toLowerCase().includes(letter.toLowerCase()))
		}
		else if (letter == 'all') {
			this.filterLetter = 'all'
			return this.musicalTerms.sort((a, b) => a.term.localeCompare(b.term));
		}
		else {
			this.filterLetter = "A"
			return this.categoriseBy(this.filterLetter)
		}
	}

	playVideo(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
	}

	edit(term, item) {
		this.tempTermData = item;
		this.updateFormData(item);
		this.modalService.open(term, { ariaLabelledBy: 'modal-basic-title', centered: true })
			.result
			.then((result) => {
				if (result == 'save') {
					if (this.form.valid) {
						this.resourceService.updateMusicTerm(this.tempTermData._id, this.formModel)
							.subscribe((res) => {
								this.tempTermData.term = this.formModel.term
								this.tempTermData.definition = this.formModel.definition
								this.tempTermData.video_url = this.formModel.video_url
								this.tempTermData.publish = this.formModel.publish
							})
					}
					else {

						alert("invalid submision")
					}
				}
			}, (reason) => { });
	}

	delete(term) {
		let isConfirmed = confirm("Are you sure you want to delete ? ")
		if (isConfirmed) {
			this.resourceService.removeMusicTerm(term._id).subscribe((res) => {
				this.musicalTerms.splice(this.musicalTerms.findIndex(item => item._id == term._id), 1)
			})
		}
	}

}
