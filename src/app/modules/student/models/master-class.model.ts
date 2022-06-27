export class MasterClassModel {

	_id: string;
	instructor: string;
	// talent: any;
	family: string;
	instrument: string;
	subject: string;
	subject2?: string;
	started: string;
	ended: string;
	hours: number;
	critiqued: string;
	institution?: any;
	city?: string;
	state?: string;
	country?: string;
	video_url?: string;
	comments?: string;
	dates: {
		started: string;
		ended: string;
	};
	location:{
		city: string;
		state: string;
		country: string;
	}

	constructor (data) {
		Object.assign(this, data);
	}

}
