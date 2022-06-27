import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'app-zzz',
	templateUrl: './zzz.component.html',
	styleUrls: ['./public.component.css'],
	// encapsulation: ViewEncapsulation.None
})

export class ZzzComponent {

	constructor(
		private modalService: NgbModal
	) { }

	openVideo(vid) {
		this.modalService.open(vid, { 
			size: 'lg', 
			ariaLabelledBy: 'modal-basic-title', 
			centered: true 
		});
	}

}