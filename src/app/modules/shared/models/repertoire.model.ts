export class RepertoireModel {

	_id: string;
	title: string;
	instrument: any;
	composers: string[];

	constructor (data) {
		Object.assign(this, data);
	}

}