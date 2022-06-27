import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddTalentModalComponent } from './add-talent-modal/add-talent-modal.component';
import { UpdateTalentModalComponent } from './update-talent-modal/update-talent-modal.component';
import { DeleteTalentModalComponent } from './delete-talent-modal/delete-talent-modal.component';

import { UserModel, UserService } from '../../../../shared/shared.module';
import { TalentService } from '../../../../student/services/talent.service';

@Component({
	selector: 'app-talent',
	templateUrl: './talent.component.html'
})

export class TalentComponent implements OnInit {

	@Input() student: UserModel;

	talents:any;
	isTalentsCollapsed = false;
	studentId:string;

	constructor(
		private modalService: NgbModal,
		private userService:UserService,
		private talentService:TalentService
	) {}

	ngOnInit() {
		if (!this.student) {
			this.studentId = this.userService.currentUser._id;
			this.talentService
				.getAllStudentTalents(
					this.studentId
				)
				.subscribe(
					(response: any) => {
						this.talents = response.data.talents;
					}
				);
		} else {
			this.studentId = this.student._id;
			this.talents = this.student.talents;
		}
	}

	addTalent() {
		const modalRef = this.modalService.open(AddTalentModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.result.then(
			user => {
				this.talents =user.talents;
			},
			reason => {}
		);

	}

	updateTalent(stid: string) {
		const modalRef = this.modalService.open(UpdateTalentModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.talent_id = stid;
		modalRef.result.then(
			user => {
				this.talents =user.talents;
			},
			reason => {}
		);
	}

	removeTalent(stid: string) {
		const modalRef = this.modalService.open(DeleteTalentModalComponent);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.talent_id = stid;
		modalRef.result.then(
			user => {
				this.talents =user.talents;
			},
			reason => {}
		);
	}

}
