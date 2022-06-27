import { Component, OnInit } from "@angular/core";
import { StudentService } from "../../../student/services/student.service";
import { TeacherService } from "../../../teacher/services/teacher.service";
import { UserService } from '../../services/user.service';

@Component({
	selector: "app-viewed-collages",
	templateUrl: "./viewed-collages.component.html"
})
export class ViewedCollagesComponent implements OnInit {
	viewedColleges: Array<viewer> = [];
	constructor(
		private userService: UserService,
		private studentService: StudentService,
		private teacherService: TeacherService
	) { }

	ngOnInit() {
		this.getViewers();
	}

	getViewers() {
		// for student
		if (this.userService.currentUser.role == "Student") {
			this.studentService
				.getCollagesViewed(this.userService.currentUser._id)
				.subscribe(res => {
					this.mapCollegesToViewers(res.data);
				});
		} else if (this.userService.currentUser.role == "Teacher") {
			// for teacher
			this.teacherService
				.getCollagesViewed(this.userService.currentUser._id)
				.subscribe(res => {
					this.mapCollegesToViewers(res.data);
				});
		}
	}
	mapCollegesToViewers(data: []) {
		if (data.length > 0) {
			let college: viewer;
			data.forEach((viewerDetails: any) => {
				if (viewerDetails.college && viewerDetails.college.name) {
					college = {
						dateViewed: viewerDetails.dateViewed,
						name: viewerDetails.college.name,
						state: viewerDetails.college.address.state ? viewerDetails.college.address.state : '-',
						url: viewerDetails.college.url ? viewerDetails.college.url : '#'
					};
					this.viewedColleges.push(college);
				}
			});
		}
	}
}

class viewer {
	dateViewed: string;
	name: string;
	state: string;
	url: string;
}
