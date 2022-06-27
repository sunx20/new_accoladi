import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'app-recruiters',
	templateUrl: './recruiters.component.html',
	styleUrls: ['./public.component.css']
})

export class RecruitersComponent {

	constructor(
		private modalService: NgbModal
	) { }

	openCommitmentRecruiter(content3) {
		this.modalService.open(content3, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
	}

}