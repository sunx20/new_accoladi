export interface StudentProfileInteraction{

	student_id: any;
	searcher_id: any;
	searcher_school_id?: any;
	actions ?:  {
		rated ?:  boolean;
		saved ?:  boolean;
		shared ?:  boolean;
		commented ?:  boolean;
		viewed ?:number
	};

}