export class SummerEnrichmentModel {

	_id: string;
	event: string;
	started: string;
	ended: string;
	primary: string;
	institution?: any;
	family: string;
	instrument: string;
	city?: string;
	state?: string;
	country?: string;
	secondary: string;
	ensemble?: string;
	role?: string;
	conductor: string;
	director: string;
	section?: string;
	chair?: string;
	video_url?: string;
	comments?: string;

	constructor (data) {
		Object.assign(this, data);
	}

}
/*
primary: [
	'Keyboard',
	'Colarbrative Keyboard',
	'Band',
	'Orchestra',
	'Jazz Band',
	'Music Theory',
	'Musical Theater',
	'Opera',
	'Chorus',
	'Jazz Vocals',
	'Song Writing',
	'Composition',
	'Show Chior',
	'Drum Corps'
]

secondary: [
	--primary--
	,'Solo Performance Technique'
]

ensemble: [
	--primary--
]
 */