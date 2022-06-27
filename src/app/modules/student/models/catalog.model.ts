export interface Catalog{
	title: string;
	composers: string[];
	suggested_grade_levels?: string[];
	videolink?: any;
	instrument: {
		name: string;
		group?: string;
		type?: string;
		family?: string;
	};
	publisher: {
		name: string;
		collection?: string;
		sku?: any;
	};
	meta: {
		smart_music?: string;
		uil: {
			code?: any;
			event_name?: string;
			grade: number;
			spec?: any;

		}
	};
}