export class MusicalTheaterModel {
	_id: string;
	show: string;
	role: string;
	piece?: string;
	school_grade?: string;
	date_performed?: string;
	// composition_id: string;
	// composition_title: string;
	// instrument: any;
	// composers: string[];
	family: string;
	instrument: string;
	type: string;
	video_url?: string;
	comments?: string;

	constructor (data) {
		Object.assign(this, data);
	}

}