export class SavedSearchModel {

	_id: string;

	recruiter_id: string;
	label: string;
	category: string;
	form_criteria: string;

	constructor(data: any) {
		Object.assign(this, data);
	}
}
