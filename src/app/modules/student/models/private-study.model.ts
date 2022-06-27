export class PrivateStudyModel {

	_id: string;
	instructor: string;
	institution?: string;
	family: string;
	instrument: string;
	subject: string;
	started: string;
	ended: string;
	hours: number;
	critiqued: string;
	video_url?: string;
	comments?: string;
	dates: {
		started: string;
		ended: string;
	};
	constructor (data) {
		Object.assign(this, data);
	}

}