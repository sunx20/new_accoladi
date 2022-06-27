
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { VideoPlayerModalComponent } from '../../video-player/video-player.component';

@Component({
	selector: 'app-judge-nsd-subgrid',
	templateUrl: './judge-nsd-subgrid.component.html',
	styleUrls: ['./judge-nsd-subgrid.component.css']
})

export class JudgeNsdSubgridComponent implements OnInit {

	/**
	 * The category for which details are displayed
	 */
	@Input() public category;

	public view: Observable<GridDataResult>;
	public skip = 0;
	data: any = []

	constructor(
		private modalService: NgbModal,
		// private service: ProductsService
	) { }

	public ngOnInit(): void {

		this.category.performances.forEach(element => {
			this.data.push(element)
		});

		this.category.musical_theater.forEach(element => {
			this.data.push(element)
		});

		this.category.audition.forEach(element => {
			this.data.push(element)
		});

		this.view = this.data;
		// this.view = this.service;
		/*load products for the given category*/
		//  this.service.queryForCategory(this.category, { skip: this.skip, take: 5 });
	}

	public pageChange({ skip, take }: PageChangeEvent): void {
		this.skip = skip;
		//  this.service.queryForCategory(this.category, { skip, take });
	}

	playVideo(video: string) {
		let modalRef = this.modalService.open(VideoPlayerModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.video = video;
	}

}