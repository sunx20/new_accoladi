export class EducationModel {
	_id: string;
	school_id: string;
	name: string;
	city: string;
	state: string;
	attended_from?: string; // Date
	attended_to?: string; // Date
	current: boolean;
	// courses?: Course[];

	constructor (data) {
		Object.assign(this, data);
	}

}