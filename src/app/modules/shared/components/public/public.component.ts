import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbCarouselConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'app-public',
	templateUrl: './public.component.html',
	styleUrls: ['./public.component.css']
})

export class PublicComponent implements OnInit  {

	@ViewChild('notice') modalContent: TemplateRef<any>;

	constructor(
		private modalService: NgbModal,
		private config: NgbCarouselConfig
	) {
		config.interval = 0;
		config.pauseOnHover= true;
	}

	ngOnInit() {
		this.openNotice(this.modalContent);
	}

	openNotice(notice) {
		if (typeof Storage !== 'undefined') {
			if (!localStorage.getItem('notice')) {
				this.modalService.open(notice, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
			}
			localStorage.setItem('notice', 'true');
		}
	}

	openFeaturedStudent1(student) {
		this.modalService.open(student, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
	}

	openFeaturedStudent2(student) {
		this.modalService.open(student, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
	}

	openFeaturedStudent3(student) {
		this.modalService.open(student, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
	}

	openFeaturedSchool(school) {
		this.modalService.open(school, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
	}

	openFeaturedProgram(program) {
		this.modalService.open(program, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
	}

}