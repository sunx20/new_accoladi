import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { GeneralPerformanceService } from '../../../../../student/services/general-performance.service';
import { PerformanceModel } from '../../../../../student/models/performance.model';
import { UserModel } from '../../../../../../modules/shared/shared.module';
@Component({
	selector: 'app-delete-performance-modal',
	templateUrl: './delete-performance-modal.component.html'
})

export class DeletePerformanceModalComponent {

	@Input() student_id: string;
	@Input() performance_id: string;

	student = new UserModel({});
	model = new PerformanceModel({});
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';

	constructor(
		private gpService: GeneralPerformanceService,
		public activeModal: NgbActiveModal
	) {}

	delete() {
		this.requestFailed = this.requestSuccess = false;
		this.loading = true;
		this.gpService
			.deleteStudentPerformance(
				this.student_id, 
				this.performance_id
			)
			.subscribe(
				(response: any) => {
					this.feedback = 'Performance information deleted';
					this.requestSuccess = true;
					this.loading = false;
					setTimeout(() => {
						this.activeModal.close(response.data);
					}, 2000);
				},
				err => {
					console.error( 'SA.student.student.component - remove performance item', err );
					this.feedback = 'Unable to delete performance information';
					this.requestFailed = true;
					this.loading = false;
				}
			);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}
	
}
