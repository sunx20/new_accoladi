import { Directive, HostListener } from '@angular/core';

@Directive({
	selector: '[appDisableDoubleClick]'
})

export class DisableDoubleClickDirective {

	constructor() { }

	@HostListener('click', ['$event'])
	clickEvent(event) {
		event.srcElement.setAttribute('disabled', true);
		setTimeout(function () {
			event.srcElement.removeAttribute('disabled');
		}, 1000);
	}

}