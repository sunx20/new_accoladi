import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'app-soar',
	templateUrl: './soar.component.html',
	styleUrls: ['./public.component.css']
})

export class SoarComponent {

	constructor(
		private modalService: NgbModal
	) { }

}