import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserModel } from '../../models/user.model';
import { PremierProgramService } from '../../services/premier-program.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-premier-program-search',
	templateUrl: './premier-program-search.component.html'
})

export class PremierProgramSearchComponent implements OnInit {

	public user = new UserModel({});

	form: FormGroup;
	school: any;
	subjects: any;
	styles: any[];
	searchResults: any[];
	savedPremierProgramsList: any[];
	total: number;
	page: number;
	pageSize: number;
	savingPremierProgramId = '';
	feedback = '';
	loading = false;
	submitAttempted = false;
	requestFailed = false;
	showFPP = false;

	groupArr: any;
	userType: string;

	constructor(
		private premierProgramService: PremierProgramService,
		// private modalService: NgbModal,
		public userService: UserService
	) {
		this.form = new FormGroup({
			subject: new FormControl(''),
			style: new FormControl(''),
			school: new FormControl(''),
			// person: new FormControl(''),
			// url: new FormControl(''),
			// position: new FormControl(''),
			// notes: new FormControl(''),
			// year: new FormControl('')
		});
		this.premierProgramService
			.getPremierProgramsSubjects()
			.subscribe(
				(response: any) => {
					this.subjects = response.data;
				},
				err => {
					console.error('SA.premier-programs-search.component - getPremierProgramsSubjects', err);
				}
			);
		this.premierProgramService
			.getPremierProgramsStyles()
			.subscribe(
				(response: any) => {
					this.styles = response.data;
				},
				err => {
					console.error('SA.premier-programs-search.component - getPremierProgramsStyles', err);
				}
			);
		this.page = 1;
		this.pageSize = 500;
		this.total = 0;

		if (this.userService.currentUser.role == 'Teacher') {
			this.userType = 'teacher'
		} else if (this.userService.currentUser.role == 'Recruiter') {
			this.userType = 'recruiter'
		} else if (this.userService.currentUser.role == 'Parent') {
			this.userType = 'parent'
		} else {
			this.userType = 'student'
		}
	}

	ngOnInit() {
		this.getProfile();
	}

	showFPPChanged(e) {
		if (!e) {
			this.getProfile();
		}
	}

	getProfile() {
		this.userService
			.getUserProfile(
				this.userService.currentUser._id
			)
			.subscribe((response: any) => {
				this.savedPremierProgramsList = (response.data.saved_premier_programs ? response.data.saved_premier_programs : []);
			});
	}

	get formModel() {
		return {
			subject: this.form.get('subject').value,
			style: this.form.get('style').value,
			school: this.form.get('school').value,
			// person: this.form.get('person').value,
			// url: this.form.get('url').value,
			// position: this.form.get('position').value,
			// notes: this.form.get('notes').value,
			// year: this.form.get('year').value
		};
	}

	resetForm() {
		this.form.reset({
			subject: '',
			style: '',
			school: ''
		});
		this.submitAttempted = false;
	}

	// validMinCriteria(fm: any) {
	// 	let count = 0;

	// 	if (fm.subject) {count++;}
	// 	if (fm.style) {count++;}
	// 	if (fm.school) {count++;}

	// 	return count > 0 ? true : false;
	// }

	submitForm() {
		console.log('form submitted - ', this.formModel);
		this.requestFailed = false;
		this.feedback = '';

		// 	if (!this.validMinCriteria(this.formModel)) {
		// 		this.requestFailed = true;
		// 		this.feedback = 'Please select at least one criteria to be able to see results.';
		// 		this.loading = false;
		// 		return;
		// 	}

		this.loading = true;
		this.premierProgramService
			.search(
				this.formModel,
				this.page,
				this.pageSize
			)
			.subscribe(
				(response: any) => {
					this.searchResults = response.data;

					// interesing group by method....
					this.groupArr = this.searchResults.reduce((r, { school }) => {
						if (!r.some(o => o.school == school)) {
							r.push({
								school,
								groupItem: this.searchResults
									.filter(v => v.school === school)
							});
						}
						return r;
					}, []); //  console.log(this.groupArr);

					this.total = response.total || response.data.length;
					this.savingPremierProgramId = '';
					this.loading = false;
				},
				err => {
					this.loading = false;
				}
			);
	}

	inSPPList(id: string) {
		let response = false;
		if (this.savedPremierProgramsList.length) {
			response = this.savedPremierProgramsList.find(pp => pp._id === id)
				? true
				: false;
		}

		return response;
	}

	isSavingPremierProgram(id: string) {
		return this.savingPremierProgramId === id;
	}

	savePremierProgram(pp: any) { // console.log('savePremierProgram - pp ', pp );
		this.savingPremierProgramId = pp._id;
		this.premierProgramService
			.savePremierProgram(this.userService.currentUser._id, {
				_id: pp._id,
				subject: pp.subject,
				style: pp.style,
				school: pp.school,
				person: pp.person,
				url: pp.url,
				position: pp.position,
				notes: pp.notes,
				year: pp.year
			})
			.subscribe(
				(response: any) => { // console.log('savePremierProgram - response.data ', response.data );
					this.savedPremierProgramsList = (response.data.saved_premier_programs ? response.data.saved_premier_programs : []);
				},
				err => {
					console.error('SA.premier-program.search.component - savePremierProgram', err);
				}
			);
	}

}
