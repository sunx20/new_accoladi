import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'app-teachers',
	templateUrl: './teachers.component.html',
	styleUrls: ['./public.component.css']
})

export class TeachersComponent {

	constructor(
		private modalService: NgbModal
	) { }
	
	openCommitmentTeacher(content2) {
		this.modalService.open(content2, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
	}

}