export class ShareModel {

	email: string;
	link: string;
	additionalMsg: string;

	constructor (data) {
		Object.assign(this, data);
	}

}