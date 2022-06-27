export class InviteModel {

	type: string; // friend, parent, sponsor
	email: string;
	additionalMsg: string;

	constructor (data) {
		Object.assign(this, data);
	}

}