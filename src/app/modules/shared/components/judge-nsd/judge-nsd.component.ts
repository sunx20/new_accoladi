import { Component, OnInit, ViewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';

import { Observable } from 'rxjs';

import { RecruiterService } from '../../../recruiter/services/recruiter.service';
import { SigningDayService } from '../../../student/services/signing-day.service';

import { StudentProfileModalComponent } from '../../../recruiter/share/student-profile-modal.component';
import { JudgeNsdKeyboardComponent } from './judge-nsd-keyboard/judge-nsd-keyboard.component';
import { JudgeNsdMusicalTheaterComponent } from './judge-nsd-musical-theater/judge-nsd-musical-theater.component';
import { JudgeNsdVoiceComponent } from './judge-nsd-voice/judge-nsd-voice.component';
import { JudgeNsdWindStringComponent } from './judge-nsd-wind-string/judge-nsd-wind-string.component';
import { JudgeNsdGeneralComponent } from './judge-nsd-general/judge-nsd-general.component';

@Component({
	selector: 'app-judge-nsd',
	templateUrl: './judge-nsd.component.html',
	styleUrls: ['./judge-nsd.component.css']
})

export class JudgeNSDComponent implements OnInit {

	public view: Observable<GridDataResult>;
	public sort: Array<SortDescriptor> = [];
	public pageSize = 10;
	public skip = 0;
	gridData: any = [];
	recruiter: any = [];
	emptyGrid: boolean = false;

	// For Angular 8
	// @ViewChild(GridComponent, { static: true })
	// public grid: GridComponent;

	@ViewChild(GridComponent) grid: GridComponent;

	constructor(
		private recruiterService: RecruiterService,
		private modalService: NgbModal,
		private sdService: SigningDayService
	) { }
		

	public ngOnInit(): void {
		// Bind directly to the service as it is a Subject
		//this.view = //this.service;
		this.sdService
			.getAllStudent()
			.subscribe(
				(response: any) => {
					// this.data=response.data;

					this.gridData = response.data;
					response.data.forEach((item, index) => {
						item.index = index + 1;
						item.fullname = item.student_id.first_name + " " + item.student_id.last_name
					});

					this.view = response.data;
					for (let i = 0; i < this.gridData.length; i++) {
						this.grid.expandRow(i);
					}
				},
				err => {

				}
			);


		// Fetch the data with the initial state
		this.loadData();
	}

	public dataStateChange({ skip, take, sort }: DataStateChangeEvent): void {
		// Save the current state of the Grid component
		this.skip = skip;
		this.pageSize = take;
		this.sort = sort;

		// Reload the data with the new state
		this.loadData();


		// Expand the first row initially
		this.grid.expandRow(0);
	}

	private loadData(): void {
		//this.service.query({ skip: this.skip, take: this.pageSize, sort: this.sort });
	}

	modalProfile(student_id: string) {
		const modalRef = this.modalService.open(StudentProfileModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = student_id;
		modalRef.componentInstance.recruiter_id = this.recruiter._id;
		modalRef.result.then(() => { }, reason => { });
	}

	judgeNsdWindStringStudent(student_id: string, year: number, student_name: string, dataItem: any) {
		const modalRef = this.modalService.open(JudgeNsdGeneralComponent/*JudgeNsdWindStringComponent*/, {
			windowClass: 'modal-big'
		});

		modalRef.componentInstance.student_id = student_id;
		modalRef.componentInstance.student_name = student_name;
		modalRef.componentInstance.year = year;
		modalRef.componentInstance.dataItem = dataItem;
		modalRef.result.then(() => { }, reason => { });
	}

	judgNsdVoiceStudent(student_id: string, year: number, student_name: string, dataItem: any) {
		const modalRef = this.modalService.open(JudgeNsdGeneralComponent/*JudgeNsdVoiceComponent*/, {
			windowClass: 'modal-big'
		});

		modalRef.componentInstance.student_id = student_id;
		modalRef.componentInstance.student_name = student_name;
		modalRef.componentInstance.year = year;
		modalRef.componentInstance.dataItem = dataItem;
		modalRef.result.then(() => { }, reason => { });
	}

	judgNsdMusicalTheaterStudent(student_id: string, year: number, student_name: string, dataItem: any) {
		const modalRef = this.modalService.open(JudgeNsdGeneralComponent/*JudgeNsdMusicalTheaterComponent*/, {
			windowClass: 'modal-big'
		});

		modalRef.componentInstance.student_id = student_id;
		modalRef.componentInstance.student_name = student_name;
		modalRef.componentInstance.year = year;
		modalRef.componentInstance.dataItem = dataItem;
		modalRef.result.then(() => { }, reason => { });
	}

	judgNsdKeyboardStudent(student_id: string, year: number, student_name: string, dataItem: any) {
		const modalRef = this.modalService.open(JudgeNsdGeneralComponent/*JudgeNsdKeyboardComponent*/, {
			windowClass: 'modal-big'
		});

		modalRef.componentInstance.student_id = student_id;
		modalRef.componentInstance.student_name = student_name;
		modalRef.componentInstance.year = year;
		modalRef.componentInstance.dataItem = dataItem;
		modalRef.result.then(() => { }, reason => { });
	}

	judgNsdGeneralStudent(student_id: string, year: number, student_name: string, dataItem: any) {
		const modalRef = this.modalService.open(JudgeNsdGeneralComponent/*JudgeNsdKeyboardComponent*/, {
			windowClass: 'modal-big'
		});

		modalRef.componentInstance.student_id = student_id;
		modalRef.componentInstance.student_name = student_name;
		modalRef.componentInstance.year = year;
		modalRef.componentInstance.dataItem = dataItem;
		modalRef.result.then(() => { }, reason => { });
	}

	judgeStudentCategory(dataItem) { console.log('Judge Student Category', dataItem, this.emptyGrid);
		if ( !dataItem.audition || dataItem.audition.length == 0) {
			this.emptyGrid = true;
		} else {
			this.emptyGrid = false;
		}
		if (!this.emptyGrid) {
			if (dataItem.area.group == 'Performance') {
				if (dataItem.area.sub_group == 'Keyboard') {
					this.judgNsdKeyboardStudent(
						dataItem.student_id._id, 
						dataItem.year, 
						dataItem.student_id.first_name + ' ' + dataItem.student_id.last_name, 
						dataItem
					)
				} else if (dataItem.area.sub_group == 'Vocal') {
					this.judgNsdVoiceStudent(
						dataItem.student_id._id, 
						dataItem.year, 
						dataItem.student_id.first_name + ' ' + dataItem.student_id.last_name, 
						dataItem
					)
				} else if (dataItem.area.sub_group == 'Wind') {
					this.judgeNsdWindStringStudent(
						dataItem.student_id._id, 
						dataItem.year, 
						dataItem.student_id.first_name + ' ' + dataItem.student_id.last_name, 
						dataItem
					)
				} else if (dataItem.area.sub_group == 'String') {
					this.judgeNsdWindStringStudent(
						dataItem.student_id._id, 
						dataItem.year, 
						dataItem.student_id.first_name + ' ' + dataItem.student_id.last_name, 
						dataItem
					)
				} else {
					this.judgNsdGeneralStudent(
						dataItem.student_id._id, 
						dataItem.year, 
						dataItem.student_id.first_name + ' ' + dataItem.student_id.last_name, 
						dataItem
					)
				}
			} else if (dataItem.area.group == 'Production') {
				if (dataItem.area.sub_group == 'Musical Theater') {
					this.judgNsdMusicalTheaterStudent(
						dataItem.student_id._id, 
						dataItem.year, 
						dataItem.student_id.first_name + ' ' + dataItem.student_id.last_name, 
						dataItem
					)
				} else {
					this.judgNsdGeneralStudent(
						dataItem.student_id._id, 
						dataItem.year, 
						dataItem.student_id.first_name + ' ' + dataItem.student_id.last_name, 
						dataItem
					)
				}
			} else if (dataItem.area.group == 'Ministry') {
				this.judgNsdGeneralStudent(
					dataItem.student_id._id, 
					dataItem.year, 
					dataItem.student_id.first_name + ' ' + dataItem.student_id.last_name, 
					dataItem
				)
			} else {
				this.judgNsdGeneralStudent(
					dataItem.student_id._id, 
					dataItem.year, 
					dataItem.student_id.first_name + ' ' + dataItem.student_id.last_name, 
					dataItem
				)
			}

		}

	}

	public ngAfterViewInit(): void {
		this.gridData;
		// Expand all first rows initially
		// for(let i = 0; i <  6; i++) {
		//   this.grid.expandRow(i);
		// }
	}

}