import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-premium-modal',
	templateUrl: './premium-modal.component.html'
})

export class PremiumModalComponent {

	@Input() parent_id: string;
	@Input() student_id: string;

	constructor(
		public activeModal: NgbActiveModal
	) { }

}