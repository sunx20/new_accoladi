import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SummerEnrichmentService } from '../../../../../student/services/summer-enrichment.service';
import { SummerEnrichmentModel } from '../../../../../student/models/summer-enrichment.model';
import { UserModel } from '../../../../../shared/shared.module';

@Component({
	selector: 'app-delete-summer-enrichment-modal',
	templateUrl: './delete-summer-enrichment-modal.component.html'
})

export class DeleteSummerEnrichmentModalComponent {

	@Input() student_id: string;
	@Input() seid: string;

	student = new UserModel({});
	model = new SummerEnrichmentModel({});
	loading = false;
	requestFailed = false;
	requestSuccess = false;
	feedback = '';

	constructor(
		private seService: SummerEnrichmentService,
		public activeModal: NgbActiveModal
	) {}

	delete() {
		this.requestFailed = this.requestSuccess = false;
		this.loading = true;
		this.seService
			.deleteStudentSummerEnrichment(this.student_id, this.seid)
			.subscribe(
				(response: any) => {
					this.feedback = 'Summer enrichment information deleted';
					this.requestSuccess = true;
					this.loading = false;
					setTimeout(() => {
						this.activeModal.close(response.data);
					}, 2000);
				},
				err => {
					console.error(
						'SA.student.student.component - remove summer enrichment item',
						err
					);
					this.feedback =
						'Unable to delete summer enrichment information';
					this.requestFailed = true;
					this.loading = false;
				}
			);
	}

	close() {
		this.activeModal.dismiss('Cross click');
	}
}
