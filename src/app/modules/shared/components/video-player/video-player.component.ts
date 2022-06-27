import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-video-player',
	templateUrl: './video-player.component.html'
})

export class VideoPlayerModalComponent implements OnInit {

	@Input() video: string;

	embeded_video: string;
	isNotembedeVideo: boolean=false;

	constructor(
		public sanitizer: DomSanitizer,
		public activeModal: NgbActiveModal
	) {}

	validateYouTubeUrl() {
		let url =this.video.trim();
		if (url != undefined || url != '') {
			let regExpYouTube = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
			let regExpVimeo = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/
			let matchYouTube = url.match(regExpYouTube);
			let matchVimeo = url.match(regExpVimeo);
				
			if (matchYouTube || matchVimeo) {
				if (url.includes("youtu")) {
					this.embeded_video = 'https://www.youtube.com/embed/' + matchYouTube[5];
				} else {
					this.embeded_video = 'https://player.vimeo.com/video/' +  matchVimeo[4] ;
				}
			
				this.isNotembedeVideo = false;
			} else {
				this.isNotembedeVideo = true;
				this.embeded_video = '';
			}
		} else {
			this.isNotembedeVideo = true;
		}
	}

	ngOnInit() {	
		if (this.video && !this.embeded_video) {
			this.validateYouTubeUrl();
		}
	}

	ngOnChanges() {
		this.embeded_video = '';
		if (this.video && !this.embeded_video) {
			this.validateYouTubeUrl();
		}
	}

	closeEmbeddedVideo() {
		//this.embeded_video = null;
		this.activeModal.close();
	}
}
