import { Component, OnInit, ViewChildren, QueryList, Directive, PipeTransform } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EnterConversationModalComponent, UserModel, NgbdSortableHeader, SortEvent } from '../../../modules/shared/shared.module';
import { RecruiterService } from '../services/recruiter.service';
import { SavedStudentsService } from '../services/saved-students.service';
import { ShareModalComponent } from '../share/share-modal.component';
import { StudentProfileModalComponent } from '../share/student-profile-modal.component';

import { DecimalPipe } from '@angular/common';

@Component({
	selector: 'app-saved-students',
	templateUrl: './saved-students.component.html'
})

export class SavedStudentsComponent implements OnInit {

	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

	public filterSelectedValue;
	recruiter = new UserModel({});
	savedStudentsList: any[];
	totalSavedStudents: number;
	removingStudentId = '';
	page: number;
	pageSize: number;

	constructor(
		private recruiterService: RecruiterService,
		public recruiterSSTService: SavedStudentsService,
		private modalService: NgbModal,
		public decimalPipe: DecimalPipe
	) {
		this.savedStudentsList = [];
		this.page = 1;
		this.pageSize = 10;
		this.totalSavedStudents = 0;
	}

	ngOnInit() {
		this.getMyProfile();
	}

	getMyProfile() {
		this.recruiterService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.recruiter = response.data;
					this.getSavedStudents();
				},
				err => {
					console.error(err);
				}
			);
	}

	pageChange($event: any) {
		this.getSavedStudents();
	}

	getSavedStudents() {
		this.recruiterSSTService
			.getSavedStudents(
				this.recruiter._id, 
				this.pageSize, 
				this.page
			)
			.subscribe(
				(response: any) => {
					this.savedStudentsList = response.data.map((s: any) => {
						return {
							...s,
							first_name: s && s.user_id ? s.user_id.first_name : '',
							state: s && s.user_id ? s.user_id.address.state : '',
							graduation_year: s && s.user_id && s.user_id.graduation_year ? s.user_id.graduation_year.toString() : '',
						};
					});
					this.removingStudentId = '';
					this.totalSavedStudents = response.total;
				},
				err => {
					console.error(err);
				}
			);
	}

	removeSaved(student_id: string) {
		this.removingStudentId = student_id;
		this.recruiterSSTService
			.removeStudentFromSaved(
				student_id
			)
			.subscribe(
				(response: any) => {
					this.getSavedStudents();
				},
				err => {
					console.error(err);
				}
			);
	}

	isRemovingStudent(sid: string) {
		return this.removingStudentId === sid;
	}

	modalProfile(student_id: string) {
		const modalRef = this.modalService
							 .open(
								 StudentProfileModalComponent, 
								 { size: 'lg' }
							 );
		modalRef.componentInstance.student_id = student_id;
		modalRef.componentInstance.recruiter_id = this.recruiter._id;
		modalRef.result
				.then(() => { }, reason => { });
	}

	sendMessage(recipient_id: string) { // this.router.navigate(['/messages', student_id]);
		const modalRef = this.modalService
							 .open(
								 EnterConversationModalComponent, 
								 { size: 'lg' }
							 );
		modalRef.componentInstance.user_id = this.recruiter._id;
		if (recipient_id) {
			modalRef.componentInstance.recipient_id = recipient_id;
		}
		modalRef.result
				.then(
					() => {
						// this.getThreads();
					},
					reason => {
						// this.getThreads();
					}
				);
	}

	onSort({ column, direction }: SortEvent) {
		// resetting other headers
		this.headers.forEach(header => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});

		this.savedStudentsList.sort((a, b) => {
			return direction === 'asc'
				? a[column] > b[column]
					? 1
					: -1
				: a[column] > b[column]
					? -1
					: 1;
		});
	}

	shareStudent(student_id: string) {
		const modalRef = this.modalService	
							 .open(
								 ShareModalComponent, 
								 { size: 'lg' }
								);
		modalRef.componentInstance.student_id = student_id;
		modalRef.componentInstance.recruiter_id = this.recruiter._id;
		modalRef.result
				.then(() => { }, reason => { });
	}

	sortFields(selectedField) {

		switch (selectedField) {
			case 'first_name':
				// this.savedStudentsList.sort((a, b) => (a.selectedField > b.selectedField) ? 1 : -1)
				this.savedStudentsList.sort(function (a, b) {
					const nameA = a.first_name.toLowerCase(), nameB = b.first_name.toLowerCase();
					if (nameA < nameB) {// sort string ascending
						return -1;
					}

					if (nameA > nameB) {
						return 1;
					}
					return 0; // default return value (no sorting)
				});
				break;

			case 'state':
				this.savedStudentsList.sort(function (a, b) {
					const nameA = a.state.toLowerCase(), nameB = b.state.toLowerCase();
					if (nameA < nameB) {// sort string ascending
						return -1;
					}

					if (nameA > nameB) {
						return 1;
					}
					return 0; // default return value (no sorting)
				});
				break;

			case 'instrument':
				this.savedStudentsList.sort(function (a, b) {
					const nameA = a.user_id.honors_awards[0].instrument.toLowerCase(), nameB = b.user_id.honors_awards[0].instrument.toLowerCase();
					if (nameA < nameB) {// sort string ascending
						return -1;
					}

					if (nameA > nameB) {
						return 1;
					}
					return 0; // default return value (no sorting)
				});
				break;

			default:
				break;
		}

	}

	filterFields(selectedFields) {
		this.filterSelectedValue = selectedFields;
	}

	filterValue(filterValue) {
		if (filterValue) {
			this.savedStudentsList = this.transform(this.savedStudentsList, filterValue)
		} else {
			this.getSavedStudents()
		}
	}

	transform(list: any[], filterText: string): any {
		console.log(list);
		return list
				? list.filter(item => {
						return item.first_name.search(new RegExp(filterText, 'i')) > -1 || item.state.search(new RegExp(filterText, 'i')) > -1 || item.user_id.talents.filter(i => { return i.talent.search(new RegExp(filterText, 'i')) > -1 }).length > 0
					})
				: [];
	}

}