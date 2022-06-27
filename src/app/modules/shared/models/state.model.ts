export class StateModel {

	_id: string;
	name: string;
	abbr: string;
	country: string;

	constructor (data) {
		Object.assign(this, data);
	}

}