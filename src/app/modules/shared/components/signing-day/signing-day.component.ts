import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SigningDayService } from '../../../student/services/signing-day.service';
import { UserService } from '../../services/user.service';

import { VideoPlayerModalComponent } from '../video-player/video-player.component';
import { SigningDayAlertComponent } from './signing-day-alert/signing-day-alert.component';
import { SigningDayMusicalTheatreComponent } from './signing-day-musical-theatre/signing-day-musical-theatre.component';
import { SigningDayPerformanceComponent } from './signing-day-performance/signing-day-performance.component';
import { SigningDayAuditionComponent } from './signing-day-audition/signing-day-audition.component';


@Component({
	selector: 'app-signing-day',
	templateUrl: './signing-day.component.html',
})

export class SigningDayComponent implements OnInit {

	data: any;

	constructor(
		private modalService: NgbModal,
		private nsdService: SigningDayService,
		private userService: UserService
	) {
	}

	ngOnInit() {
		this.getArea();
	}

	getArea() {
		this.nsdService
			.getNsdStudent(this.userService.currentUser._id)
			.subscribe(
				(response: any) => {
					this.data = response.data;
				},
				err => {}
			);
	}

	onDeletePerformance(event) {
	}

	Open(event, type) {

		if (type === 'Song') {
			this.openPerformancePopup(event, type);
		} else if (type === 'Monologue') {
			this.openMusicalTheatrePopup(event, type);
		} else if (type === 'Dance') {
			this.openMusicalTheatrePopup(event, type);
		} else if (type === 'Audition') {
			this.openAuditionPopup(event, type);
		}

	}

	addPerformance(event, type) {

		const group = event.area.group;
		const subGroup = event.area.sub_group;

		if (group === 'Performance') {

			if (subGroup === 'Vocal') {

				if (event.performances.length === 3) {
					this.onAlertPopup();
				} else {
					this.Open(event, type)
				}

			} else {

				if (event.performances.length === 2) {
					this.onAlertPopup();
				} else {
					this.Open(event, type)
				}

			}

		} else {

			let danceCount: number = 0;
			let songCount: number = 0;
			let MonologueCount: number = 0;

			if (event.musical_theater !== undefined) {
				event.musical_theater.forEach(element => {

					if (element.type === 'Dance') {
						danceCount = danceCount + 1;
					}

					if (element.type === 'Monologue') {
						MonologueCount = MonologueCount + 1;
					}

				});
			}

			if (event.performances !== undefined) {
				event.performances.forEach(element => {

					if (element.type === 'Piece') {
						songCount = songCount + 1;
					}

					if (element.type === 'Song') {
						songCount = songCount + 1;
					}

				});
			}

			if (type === 'Monologue') {
				if (MonologueCount === 1) {
					this.onAlertPopup();
				} else {
					this.Open(event, type);
				}
			}

			if (type === 'Dance') {
				if (danceCount === 2) {
					this.onAlertPopup();
				} else {
					this.Open(event, type);
				}
			}

			if (type === 'Song') {
				if (songCount === 2) {
					this.onAlertPopup();
				} else {
					this.Open(event, type);
				}
			}

		}

	}
	
	addAudition(event, type) {

		const group = event.area.group;
		const subGroup = event.area.sub_group;

		this.Open(event, type);

	}

	onAlertPopup() {

		const modalRef = this.modalService.open(SigningDayAlertComponent, { size: 'lg' });
		modalRef.result.then(
			user => {
				this.getArea();
			},
			reason => { }
		);

	}

	onDelete( id, audId, audType ) {

		this.nsdService
			.deleteNSDStudentAuditionItem( id, audId, audType )
			.subscribe(
				(response: any) => {
					this.getArea();
				},
				err => {}
			);

	}

	playVideo(video: string) {

		const modalRef = this.modalService.open(VideoPlayerModalComponent, { size: 'lg' });
		modalRef.componentInstance.video = video;

	}

	openMusicalTheatrePopup(event, type) {

		const modalRef = this.modalService.open(SigningDayMusicalTheatreComponent, { size: 'lg' });
		modalRef.componentInstance.value = event;
		modalRef.componentInstance.type = type;
		modalRef.result.then(
			user => {
				this.getArea();
			},
			reason => { }
		);

	}

	openPerformancePopup(event, type) {

		const modalRef = this.modalService.open(SigningDayPerformanceComponent, { size: 'lg' });
		modalRef.componentInstance.value = event;
		modalRef.componentInstance.type = type;
		modalRef.result.then(
			user => {
				this.getArea();
			},
			reason => { }
		);

	}

	openAuditionPopup(event, type) {

		const modalRef = this.modalService.open(SigningDayAuditionComponent, { size: 'lg' });
			modalRef.componentInstance.value = event;
			modalRef.componentInstance.type = type;
			modalRef.result.then(
				user => {
					this.getArea();
				},
				reason => { }
			);

	}

}