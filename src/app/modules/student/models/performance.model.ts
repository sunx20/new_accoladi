export class PerformanceModel {

	_id: string;
	type: string = '';
	school_grade?: string;
	date_performed?: string;
	composition_id: string;
	composition_title: string;
	family: string = '';
	instrument: string = '';
	composers: string[];
	section: string;
	chair: string;
	video_url?: string;
	comments?: string;

	constructor (data) {
		Object.assign(this, data);
	}

}