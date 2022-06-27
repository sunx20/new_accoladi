import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'app-judge-modal-nsd',
	templateUrl: './judge-modal.component.html'
})

export class JudgeModalComponent implements OnInit {

	constructor(
		public activeModal: NgbActiveModal
	) { 

	}

	ngOnInit() {
	}

	
	close() {
		this.activeModal.dismiss('Cross click');
	}

}