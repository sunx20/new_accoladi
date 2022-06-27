import { Component, Input, OnInit  } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../modules/auth/auth.service';
// import { UserService } from '../shared/services/user.service';

import { UserModel, UserService, VideoPlayerModalComponent } from '../shared/shared.module';
// import { TalentService } from './services/talent.service';
// import { PersonalStatementService } from './services/personal-statement.service';
// import { EducationSchoolService } from './services/education-school.service';
// import { PrivateStudyService } from './services/private-study.service';
// import { MasterClassService } from './services/master-class.service';
// import { SummerEnrichmentService } from './services/summer-enrichment.service';
// import { MusicalTheaterService } from './services/musical-theater.service';
// import { DanceService } from './services/dance.service';
// import { HonorAwardService } from './services/honor-award.service';
// import { FestivalCompetitionService } from './services/festival-competition.service';

import { FestivalCompetitionModel } from './models/festival-competition.model';
import { HonorAwardModel } from './models/honor-award.model';
import { MusicalTheaterModel } from './models/musical-theater.model';
import { DanceModel } from './models/dance.model';
import { SummerEnrichmentModel } from './models/summer-enrichment.model';
import { PrivateStudyModel } from './models/private-study.model';

import { AddTalentModalComponent } from '../shared/components/profile/talent/add-talent-modal/add-talent-modal.component';
import { UpdateTalentModalComponent } from '../shared/components/profile/talent/update-talent-modal/update-talent-modal.component';
import { DeleteTalentModalComponent } from '../shared/components/profile/talent/delete-talent-modal/delete-talent-modal.component';

import { UpdateStudentAccountModalComponent } from '../shared/components/profile/account/update-student-account-modal/update-student-account-modal.component';
import { UpdatePSModalComponent } from '../shared/components/education/personal-statement/update-personal-statement-modal/update-personal-statement-modal.component';

import { AddESModalComponent } from '../shared/components/education/education-school/add-education-school-modal/add-education-school-modal.component';
import { UpdateESModalComponent } from '../shared/components/education/education-school/update-education-school-modal/update-education-school-modal.component';
import { DeleteESModalComponent } from '../shared/components/education/education-school/delete-education-school-modal/delete-education-school-modal.component';

import { AddHonorAwardModalComponent } from '../shared/components/performance/honor-award/add-honor-award-modal/add-honor-award-modal.component';
import { UpdateHonorAwardModalComponent } from '../shared/components/performance/honor-award/update-honor-award-modal/update-honor-award-modal.component';
import { DeleteHonorAwardModalComponent } from '../shared/components/performance/honor-award/delete-honor-award-modal/delete-honor-award-modal.component';

import { AddFCModalComponent } from '../shared/components/performance/festival-competition/add-festival-competition-modal/add-festival-competition-modal.component';
import { UpdateFCModalComponent } from '../shared/components/performance/festival-competition/update-festival-competition-modal/update-festival-competition-modal.component';
import { DeleteFCModalComponent } from '../shared/components/performance/festival-competition/delete-festival-competition-modal/delete-festival-competition-modal.component';

import { AddPrivateStudyModalComponent } from '../shared/components/performance/private-study/add-private-study-modal/add-private-study-modal.component';
import { UpdatePrivateStudyModalComponent } from '../shared/components/performance/private-study/update-private-study-modal/update-private-study-modal.component';
import { DeletePrivateStudyModalComponent } from '../shared/components/performance/private-study/delete-private-study-modal/delete-private-study-modal.component';

import { AddMasterClassModalComponent } from '../shared/components/education/master-class/add-master-class-modal/add-master-class-modal.component';
import { UpdateMasterClassModalComponent } from '../shared/components/education/master-class/update-master-class-modal/update-master-class-modal.component';
import { DeleteMasterClassModalComponent } from '../shared/components/education/master-class/delete-master-class-modal/delete-master-class-modal.component';

import { AddSummerEnrichmentModalComponent } from '../shared/components/performance/summer-enrichment/add-summer-enrichment-modal/add-summer-enrichment-modal.component';
import { UpdateSummerEnrichmentModalComponent } from '../shared/components/performance/summer-enrichment/update-summer-enrichment-modal/update-summer-enrichment-modal.component';
import { DeleteSummerEnrichmentModalComponent } from '../shared/components/performance/summer-enrichment/delete-summer-enrichment-modal/delete-summer-enrichment-modal.component';

import { AddMusicalTheaterModalComponent } from '../shared/components/performance/musical-theater/add-musical-theater-modal/add-musical-theater-modal.component';
import { UpdateMusicalTheaterModalComponent } from '../shared/components/performance/musical-theater/update-musical-theater-modal/update-musical-theater-modal.component';
import { DeleteMusicalTheaterModalComponent } from '../shared/components/performance/musical-theater/delete-musical-theater-modal/delete-musical-theater-modal.component';

import { AddDanceModelComponent } from '../shared/components/performance/dance/add-dance-model/add-dance-model.component';
import { UpdateDanceModelComponent } from '../shared/components/performance/dance/update-dance-model/update-dance-model.component';
import { DeleteDanceModelComponent } from '../shared/components/performance/dance/delete-dance-model/delete-dance-model.component';



@Component({
	selector: 'app-student',
	templateUrl: './student2.component.html',
	styleUrls: ['../shared/components/public/public.component.css','./student.component.css']
})

export class StudentComponent implements OnInit {

	@Input() user: UserModel;

	showSidebar = false;
	paid: any;
	displayMessage: boolean;
	
	talents: any;
	isTalentsCollapsed: boolean = false;
	studentId: string;
	
	dob: String = '';
	months: string[];

	personal_statement_button_text: String = '';
	personal_statement: string;
	
	education: any;
	master_classes: any;
	honors_awards: HonorAwardModel[] = [];
	festivals_competitions: FestivalCompetitionModel[] = [];
	private_studies: PrivateStudyModel[] = [];
	summer_enrichments: SummerEnrichmentModel[] = [];
	musical_theater: MusicalTheaterModel[] = [];
	dance: DanceModel[] = [];

	constructor(
		private modalService: NgbModal,
		private authService: AuthService,
		private router: Router,
		private userService: UserService,
		// private talentService: TalentService,
		// private honorAwardService: HonorAwardService,
		// private festivalCompetitionService: FestivalCompetitionService,
		// private privateStudyService: PrivateStudyService,
		// private personalStatementService: PersonalStatementService,
		// private educationSchoolService: EducationSchoolService,
		// private masterClassService: MasterClassService,
		// private summerEnrichmentService: SummerEnrichmentService,
		// private musicalTheaterService: MusicalTheaterService,
		// private danceService: DanceService
	) {console.log('STUDENT COMPONENT CONSTRUCTOR');
		this.months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		]; 
	}

	ngOnInit() {console.log('STUDENT COMPONENT INIT');
		
		if (this.userService.currentUser.role === 'Teacher') {
			this.displayMessage = false;
		}
		
		if ( this.userService.currentUser.role !== 'Student') {
			this.authService.logout();
			this.router.navigate(['/login']);
		}

		this.userService
			.sidebarSubject
			.subscribe(
				(response: any) => {
					this.showSidebar = response === 'true';
				}
			);

		this.paid = false;
		this.userService
			.getUserProfile(//getUserAccount
				this.userService.currentUser._id
			)
			.subscribe(
				(result: any) => { 
					console.log({'result.data':result.data});

					this.paid = result.data.meta.dates.paid_thru;
					this.user = result.data;
					this.studentId = result.data._id;
					this.setDOB();

					if ( new Date() < new Date(this.paid) ) {
						this.displayMessage = false; // console.log('paid? = yes' );
					} else {
						if ( this.userService.currentUser.role === 'Teacher' ) {
							this.displayMessage = false;
						} else {
							this.displayMessage = true; // console.log('paid? = No');
						}
					}

					// Talents
					// this.talentService
					// 	.getAllStudentTalents(
					// 		this.studentId
					// 	)
					// 	.subscribe(
					// 		(response: any) => {
					// 			this.talents = response.data.talents;
					// 		}
					// 	);
					this.talents = ( result.data.talents ? result.data.talents : [] );

					// Personal Statement
					// this.personalStatementService
					// 	.getStudentPS(
					// 		this.studentId
					// 	)
					// 	.subscribe(
					// 		(response: any) => {
					// 			this.personal_statement = response.data.personal_statement;
					// 		}
					// 	);
					this.personal_statement = result.data.personal_statement;
					if ( result.data.personal_statement && this.personal_statement.length ) {
						this.personal_statement_button_text = 'Update Statement';
					} else {
						this.personal_statement_button_text = 'Add Statement';
					}

					this.education = ( result.data.education ? result.data.education : [] );
					this.honors_awards = ( result.data.honors_awards ? result.data.honors_awards : [] );
					this.festivals_competitions = ( result.data.festivals_competitions ? result.data.festivals_competitions : [] );
					this.private_studies = ( result.data.private_studies ? result.data.private_studies : [] );
					this.master_classes = ( result.data.master_classes ? result.data.master_classes : [] );
					this.summer_enrichments = ( result.data.summer_enrichments ? result.data.summer_enrichments : [] );
					this.musical_theater = ( result.data.musical_theater ? result.data.musical_theater : [] );
					this.dance = ( result.data.dance ? result.data.dance : [] );
				}
			);

	}
	
	playVideo(video: string) {
		let modalRef = this.modalService.open(VideoPlayerModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.video = video;
	}

	/*
		TALENT / DECIPLINE
	*/ 
	addTalent() {
		const modalRef = this.modalService.open(AddTalentModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.result.then(
			user => {
				this.talents = user.talents;
			},
			reason => {}
		);

	}

	updateTalent(stid: string) {
		const modalRef = this.modalService.open(UpdateTalentModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.talent_id = stid;
		modalRef.result.then(
			user => {
				this.talents = user.talents;
			},
			reason => {}
		);
	}

	removeTalent(stid: string) {
		const modalRef = this.modalService.open(DeleteTalentModalComponent);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.talent_id = stid;
		modalRef.result.then(
			user => {
				this.talents = user.talents;
			},
			reason => {}
		);
	}



	/*
		LOCATION /ADDRESS / ACCOUNT
	*/ 
	updateStudentAI(msg = '') {
		const modalRef = this.modalService.open(UpdateStudentAccountModalComponent, { size: 'lg' });
		modalRef.componentInstance.student_id = this.user._id;
		modalRef.componentInstance.msg = msg;
		modalRef.result.then((user) => {
			this.userService
				.getUserProfile( this.user._id )
				.subscribe((response: any) => {
				this.user = response.data;
				this.setDOB();
			});
		}, (reason) => {
		});
	}
	

	setDOB() {
		this.dob = '';
		if (this.user && this.user.dob) {
			if (this.user.dob.month) {
				this.dob = this.dob + this.months[this.user.dob.month - 1] + ' ';
			}
			if (this.user.dob.day) {
				this.dob = this.dob + this.user.dob.day.toLocaleString() + ', ';
			}
			if (this.user.dob.year) {
				this.dob = this.dob + this.user.dob.year.toLocaleString();
			}
		}
	}


	

	/*
		PERSONAL STATEMENT
	*/
	updateStudentPS() {
		let modalRef = this.modalService
							.open(
								UpdatePSModalComponent, 
								{ size: 'lg' }
							);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.result
				.then(
					user => {
						this.personal_statement = user.personal_statement;
					},
					reason => { }
				);
	}



	/*
		EDUCATION - SCHOOL
	*/ 
	addStudentES() {
		let modalRef = this.modalService.open(AddESModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.result
				.then(
					user => {
						this.education = user.education;
					},
					reason => { }
				);
	}

	updateStudentES(esid: string) {
		let modalRef = this.modalService.open(UpdateESModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.esid = esid;
		modalRef.result
				.then(
				user => {
					this.education = user.education;
				},
				reason => { }
			);
	}

	removeStudentES(esid: string) {
		let modalRef = this.modalService.open(DeleteESModalComponent);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.esid = esid;
		modalRef.result
				.then(
					user => {
						this.education = user.education;
					},
					reason => { }
				);
	}


	/*
		HONORS
	*/ 
	addStudentHA() {
		let modalRef = this.modalService.open(AddHonorAwardModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;

		modalRef.result.then(
			user => {
				this.honors_awards = user.honors_awards;
			},
			reason => { }
		);
	}

	updateStudentHA(haid: string) {
		let modalRef = this.modalService.open(UpdateHonorAwardModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.haid = haid;

		modalRef.result.then(
			user => {
				this.honors_awards = user.honors_awards;
			},
			reason => { }
		);
	}

	removeStudentHA(haid: string) {
		let modalRef = this.modalService.open(DeleteHonorAwardModalComponent);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.haid = haid;

		modalRef.result.then(
			user => {
				this.honors_awards = user.honors_awards;
			},
			reason => { }
		);
	}


	/*
		FESTIVAL
	*/ 
	addStudentFC() {
		let modalRef = this.modalService.open(AddFCModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;

		modalRef.result.then(
			user => {
				this.festivals_competitions = user.festivals_competitions;
			},
			reason => { }
		);
	}

	updateStudentFC(fcid: string) {
		let modalRef = this.modalService.open(UpdateFCModalComponent, {
			size: 'lg'
		});
		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.fcid = fcid;

		modalRef.result.then(
			user => {
				this.festivals_competitions = user.festivals_competitions;
			},
			reason => { }
		);
	}

	removeStudentFC(fcid: string) {
		let modalRef = this.modalService.open(DeleteFCModalComponent);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.fcid = fcid;

		modalRef.result.then(
			user => {
				this.festivals_competitions = user.festivals_competitions;
			},
			reason => { }
		);
	}


	/*
		PRIVATE STUDIES
	*/
	addStudentPrivateStudy() {
		const modalRef = this.modalService.open(AddPrivateStudyModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.result.then(
			user => {
				this.private_studies = user.private_studies;
			},
			reason => { }
		);
	}

	updateStudentPrivateStudy(psid: string) {
		const modalRef = this.modalService.open(UpdatePrivateStudyModalComponent, {
			size: 'lg'
		});

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.psid = psid;
		modalRef.result.then(
			user => {
				this.private_studies = user.private_studies;
			},
			reason => { }
		);
	}

	removeStudentPrivateStudy(psid: string) {
		const modalRef = this.modalService.open(DeletePrivateStudyModalComponent);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.psid = psid;
		modalRef.result.then(
			user => {
				this.private_studies = user.private_studies;
			},
			reason => { }
		);
	}


	/*
		MASTER CLASSES
	*/
	addStudentMC() {
		let modalRef = this.modalService
							.open(
								AddMasterClassModalComponent, 
								{ size: 'lg' }
							);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.result
				.then(
					user => {
						this.master_classes = user.master_classes;
					},
					reason => { }
				);
	}

	updateStudentMC(mcid: string) {
		let modalRef = this.modalService
							.open(
								UpdateMasterClassModalComponent, 
								{ size: 'lg' }
							);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.mcid = mcid;
		modalRef.result
				.then(
					user => {
						this.master_classes = user.master_classes;
					},
					reason => { }
				);
	}

	removeStudentMC(mcid: string) {
		let modalRef = this.modalService
							.open(
								DeleteMasterClassModalComponent
							);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.mcid = mcid;
		modalRef.result
				.then(
					user => {
						this.master_classes = user.master_classes;
					},
					reason => { }
				);
	}

	/*
		SUMMER ENRICHMENT
	*/
	addStudentSummerEnrichment() {
		let modalRef = this.modalService.open(
			AddSummerEnrichmentModalComponent,
			{ size: 'lg' }
		);

		modalRef.componentInstance.student_id = this.studentId;

		modalRef.result.then(
			user => {
				this.summer_enrichments = user.summer_enrichments;
			},
			reason => { }
		);
	}

	updateStudentSummerEnrichment(seid: string) {
		let modalRef = this.modalService.open(
			UpdateSummerEnrichmentModalComponent,
			{ size: 'lg' }
		);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.seid = seid;

		modalRef.result.then(
			user => {
				this.summer_enrichments = user.summer_enrichments;
			},
			reason => { }
		);
	}

	removeStudentSummerEnrichment(seid: string) {
		let modalRef = this.modalService.open(DeleteSummerEnrichmentModalComponent);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.seid = seid;

		modalRef.result.then(
			user => {
				this.summer_enrichments = user.summer_enrichments;
			},
			reason => { }
		);
	}

	/*
		MUSICAL THEATER
	*/
	addStudentMT() {
		let modalRef = this.modalService.open(AddMusicalTheaterModalComponent, { size: 'lg' });

		modalRef.componentInstance.student_id = this.studentId;

		modalRef.result.then((user) => {
			this.musical_theater = user.musical_theater;
		}, (reason) => {

		});
	}

	updateStudentMT(mtid: string) {
		let modalRef = this.modalService.open(UpdateMusicalTheaterModalComponent, { size: 'lg' });

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.mtid = mtid;

		modalRef.result.then((user) => {
			this.musical_theater = user.musical_theater;
		}, (reason) => {

		});
	}

	removeStudentMT(mtid: string) {
		let modalRef = this.modalService.open(DeleteMusicalTheaterModalComponent);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.mtid = mtid;

		modalRef.result.then((user) => {
			this.musical_theater = user.musical_theater;
		}, (reason) => {

		});

	}


	/*
		DANCE
	*/
	addStudentDance() {
		let modalRef = this.modalService.open(AddDanceModelComponent, { size: 'lg' });

		modalRef.componentInstance.student_id = this.studentId;

		modalRef.result.then((user) => {
			this.dance = user.dance;
		}, (reason) => {

		});

	}

	updateStudentDance(danceid: string) {
		let modalRef = this.modalService.open(UpdateDanceModelComponent, { size: 'lg' });

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.danceid = danceid;

		modalRef.result.then((user) => {
			this.dance = user.dance;
		}, (reason) => {

		});

	}

	removeStudentDance(danceid: string) {
		let modalRef = this.modalService.open(DeleteDanceModelComponent);

		modalRef.componentInstance.student_id = this.studentId;
		modalRef.componentInstance.danceid = danceid;

		modalRef.result.then((user) => {
			this.dance = user.dance;
		}, (reason) => {

		});

	}

}