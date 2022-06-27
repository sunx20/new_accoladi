export class DanceModel {
	_id: string;
	piece: string;
	type?: string;
	style?: string;
	company?: string;
	show?: string;
	role?: string;
	performed_at?: string;
	school_grade?: string;
	video_url?: string;
	comments?: string;

	constructor (data) {
		Object.assign(this, data);
	}

}