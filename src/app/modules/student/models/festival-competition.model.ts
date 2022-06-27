export class FestivalCompetitionModel {

	_id: string;
	event: string;
	state?: string;
	school_grade?: string;
	date_performed?: string;
	composition_id: string;
	composition_title: string;
	family: string;
	instrument: any;
	composers: string[];
	rating?: string;
	judge?: string;
	judges_comments?: string;
	event_name?: string;
	show?: string;
	type: string;
	section: string;
	chair: string;
	placement: string;
	video_url?: string;
	comments?: string;

	constructor (data) {
		Object.assign(this, data);
	}

}