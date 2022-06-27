import { Component } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EulaModalComponent } from '../eula/eula.component';
import { environment } from '../../../../../environments/environment';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['../public/public.component.css','./footer.component.css']
})

export class FooterComponent {

	label: String = '';
	title: String = '';
	copywrite: String = '';
	build: String = '';

	constructor(
		private modalService: NgbModal
	) {
		this.label = environment.label;
		this.title = environment.title;
		this.copywrite = environment.copywrite;
		this.build = environment.build;
	}

	openEulaModal() {
		const modalRef = this.modalService
							 .open(
								EulaModalComponent, 
								{ size: 'lg' }
							 );

		modalRef.result
				.then((result) => {
					console.log(result);
				}).catch((error) => {
					console.log(error);
				});
	}

}