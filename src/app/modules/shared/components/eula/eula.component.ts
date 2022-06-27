import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-eula',
	templateUrl: './eula.component.html'
})

export class EulaModalComponent {

	constructor(
		public activeModal: NgbActiveModal
	) { }


	close() {
		this.activeModal.dismiss('Cross click');
	}

}
