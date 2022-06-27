import { DecimalPipe } from '@angular/common';
import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EnterConversationModalComponent, NgbdSortableHeader, SortEvent, UserModel } from '../../shared/shared.module';
import { RecruiterService } from '../services/recruiter.service';
import { StudentsInterestedInService } from '../services/students-interested-in.service';
import { ShareModalComponent } from '../share/share-modal.component';
import { StudentProfileModalComponent } from '../share/student-profile-modal.component';

@Component({
	selector: 'app-student-interested-in',
	templateUrl: './student-interested-in.component.html'
})

export class StudentInterestedInComponent implements OnInit {

	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

	activeUser = new UserModel({});
	facultyForList: any[] = [];
	studentsInterestedInList: any[] = [];
	selectedItem: any;
	activeTab = 1;
	page: number;
	pageSize: number;
	totalCount: number = 0;
	noRecordFoundLabel = 'No Record Found';

	constructor(
		private recruiterService: RecruiterService,
		private stdInterestedInService: StudentsInterestedInService,
		private modalService: NgbModal,
		public decimalPipe: DecimalPipe
	) {
		this.pageSize = 10;
		this.page = 1;
	}

	ngOnInit() {
		this.getUserProfile();
	}

	getUserProfile() {
		this.recruiterService
			.getMyProfile()
			.subscribe(
				(res: any) => {
					if (res.status === 'success') {
						this.activeUser = res.data;
						if (res.data['faculty_for'] && res.data['faculty_for'].length > 0) {
							this.facultyForList = JSON.parse(JSON.stringify(res.data['faculty_for']));
							this.selectedItem = res.data['faculty_for'][0];
							this.getStudentsInterestedIn(res.data['faculty_for'][0]);
						}
					}
				},
				err => {
					console.log(err)
				}
			);
	}

	getStudentsInterestedIn(params: any) {
		this.studentsInterestedInList = [];
		this.noRecordFoundLabel = 'Loading...';
		this.stdInterestedInService
			.getStudentsInterestedIn(
				params.id, 
				this.pageSize, 
				this.page
			)
			.subscribe(
				(res: any) => {
					if (res.status === 'success') {
						this.studentsInterestedInList = res.data;
						this.noRecordFoundLabel = 'No Record Found';
						this.totalCount = res.total;
					}
				},
				err => {
					this.noRecordFoundLabel = 'No Record Found';
					console.error(err);
				}
			);
	}

	onTabChange(event) {
		console.log(event);
	}

	onSelectTab(item: any) {
		this.selectedItem = item;
		this.getStudentsInterestedIn(item);
	}

	pageChange($event: any) {
		if ($event) {
			this.getStudentsInterestedIn(this.selectedItem);
		}
	}

	modalProfile(student_id: string) {
		const modalRef = this.modalService
							 .open(
								 StudentProfileModalComponent, 
								 { size: 'lg' }
							 );
		modalRef.componentInstance.student_id = student_id;
		modalRef.componentInstance.recruiter_id = this.activeUser._id;
		modalRef.result.then(() => { }, reason => { });
	}

	sendMessage(recipient_id: string) { 
		const modalRef = this.modalService
							 .open(
								 EnterConversationModalComponent, 
								 { size: 'lg' }
							 );
		modalRef.componentInstance.user_id = this.activeUser._id;
		if (recipient_id) {
			modalRef.componentInstance.recipient_id = recipient_id;
		}
		modalRef.result.then(
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
		this.headers
			.forEach(header => {
				if (header.sortable !== column) {
					header.direction = '';
				}
			});

		this.studentsInterestedInList.sort((a, b) => {
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
		modalRef.componentInstance.recruiter_id = this.activeUser._id;
		modalRef.result.then(() => { }, reason => { });
	}

	sortFields(selectedField) {

		switch (selectedField) {
			case 'first_name':
				// this.savedStudentsList.sort((a, b) => (a.selectedField > b.selectedField) ? 1 : -1)
				this.studentsInterestedInList
					.sort(function (a, b) {
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
				this.studentsInterestedInList
					.sort(function (a, b) {
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
				this.studentsInterestedInList
					.sort(function (a, b) {
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

}
