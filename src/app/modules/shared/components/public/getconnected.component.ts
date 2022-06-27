import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-getconnected',
	templateUrl: './getconnected.component.html',
	styleUrls: ['./public.component.css']
})

export class GetConnectedComponent {

	constructor(
		private modalService: NgbModal
	) { }


	openCommitmentStudent(content1) {
		this.modalService.open(content1, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
	}

	openCommitmentTeacher(content2) {
		this.modalService.open(content2, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
	}

	openCommitmentRecruiter(content3) {
		this.modalService.open(content3, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
	}

}