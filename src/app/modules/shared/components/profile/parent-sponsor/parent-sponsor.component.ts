import { Component, OnInit  } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StudentService } from '../../../../student/services/student.service';
import { UserModel } from '../../../shared.module';
import { InviteModalComponent } from './invite/invite-modal.component';

@Component({
	selector: 'app-student-parent-sponsor',
	templateUrl: './parent-sponsor.component.html'
})

export class ParentSponsorComponent implements OnInit {

	student: UserModel;
	studentParents: any[];
	studentSponsors: any[];

	constructor(
		private modalService: NgbModal,
		private studentService: StudentService
	) {}

	ngOnInit() {
		this.studentService
			.getMyProfile()
			.subscribe(
				(response: any) => {
					this.student = response.data;
					this.studentService
						.getStudentParents(
							this.student._id
						)
						.subscribe(
							(response: any) => {
								this.studentParents = response.data;
							}
						);
					this.studentService
						.getStudentSponsors(
							this.student._id
						)
						.subscribe(
							(response: any) => {
								this.studentSponsors = response.data;
							}
						);
				}
			);
	}

	invite() {
		const modalRef = this.modalService
							 .open(
								 InviteModalComponent, 
								 { size: 'lg' }
							);

		modalRef.componentInstance.student_id = this.student._id;

		modalRef.result
				.then(
					data => {
						console.log(data);
					},
					reason => {}
				);
	}

}
