import { TalentModel } from '../../../modules/student/models/talent.model';
import { EducationModel } from '../../../modules/student/models/education.model';
import { PerformanceModel } from '../../../modules/student/models/performance.model';
import { HonorAwardModel } from '../../../modules/student/models/honor-award.model';
import { FestivalCompetitionModel } from '../../../modules/student/models/festival-competition.model';
import { MusicalTheaterModel } from '../../../modules/student/models/musical-theater.model';
import { PrivateStudyModel } from '../../../modules/student/models/private-study.model';
import { MasterClassModel } from '../../../modules/student/models/master-class.model';
import { SummerEnrichmentModel } from '../../../modules/student/models/summer-enrichment.model';
import { MusicalClassModel } from '../../../modules/student/models/musical-class.model';
import { ScholasticModel } from '../../../modules/student/models/scholastic.model';
import { RepertoireModel } from './repertoire.model';
import { AddressModel } from './address.model';
import { PhoneModel } from './phone.model';
import { DanceModel } from '../../student/models/dance.model';

export class UserModel {
	_id: string;
	first_name: string;
	middle_name?: string;
	last_name: string;
	username: string;
	email: string;
	password?: string;
	role: string;
	dob: {
		year: number,
		month: number,
		day: number
	};
	graduation_year: number;
	demographics: {
		sex?: string;
		ethnicity?: string;
	};
	personal_statement?: string;
	citizenship: string;
	address = new AddressModel({});
	phone = new PhoneModel({});
	talents: TalentModel[] = [];
	repertoire: RepertoireModel[] = [];
	education: EducationModel[] = [];
	performances: PerformanceModel[] = [];
	honors_awards: HonorAwardModel[] = [];
	festivals_competitions: FestivalCompetitionModel[] = [];
	musical_theater: MusicalTheaterModel[] = [];
	dance:DanceModel[]=[];
	private_studies: PrivateStudyModel[] = [];
	master_classes: MasterClassModel[] = [];
	musical_classes: string[] = [];
	summer_enrichments: SummerEnrichmentModel[] = [];
	scholastics: ScholasticModel;
	introduction: {
		statement: string,
		video_url: string
	};
	college_pref: {
		colleges: any[],
		majors: any[],
		ensembles: any[],
		military: any[],
		state: string
	};
	parents: any[];
	sponsor: any[];
	letters: any[];
	saved_scholarships: any[];
	meta: any;
	membership: any;
	profile_imageurl: string;

	constructor(data) {
		const __data = data;
		if (data.address) {
			this.address = new AddressModel(data.address);
		}
		if (data.phone) {
			this.phone = new PhoneModel(data.phone);
		}
		if (data.talents) {
			data.talents.forEach(talent => {
				this.talents.push(new TalentModel(talent));
			});
		}
		// if (data.repertoire) {
		// 	data.repertoire.forEach(piece => {
		// 		this.repertoire.push(new RepertoireModel(piece));
		// 	});
		// 	// delete __data.repertoire;
		// }
		if (data.education) {
			data.education.forEach(school => {
				this.education.push(new EducationModel(school));
			});
		}
		if (data.performance) {
			data.performance.forEach(perform => {
				this.performances.push(new PerformanceModel(perform));
			});
		}
		if (data.honors_awards) {
			data.honors_awards.forEach(perform => {
				this.honors_awards.push(new HonorAwardModel(perform));
			});
		}
		if (data.festivals_competitions) {
			data.festivals_competitions.forEach(perform => {
				this.festivals_competitions.push(new FestivalCompetitionModel(perform));
			});
		}
		if (data.musical_theater) {
			data.musical_theater.forEach(perform => {
				this.musical_theater.push(new MusicalTheaterModel(perform));
			});
		}
		if (data.private_studies) {
			data.private_studies.forEach(perform => {
				this.private_studies.push(new PrivateStudyModel(perform));
			});
		}
		Object.assign(this, __data);
	}

}