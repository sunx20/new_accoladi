export class RecruiterSearchModel {

	_id: string;
	type: string;
	composition1_id: string;
	composition2_id: string;
	composition3_id: string;
	instrument: any;
	event: string;
	section: string;
	chair: string;
	state: string;
	// city: string;

	constructor (data) {
		Object.assign(this, data);
	}

}