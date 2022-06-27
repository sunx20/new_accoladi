// ********************************************************************
// pureChat Code
// ********************************************************************
window.purechatApi = {
	l: [],
	t: [],
	on: function () {
		this.l.push(arguments);
	}
};

(function () {
	var done = false;
	var script = document.createElement('script');
		script.async = true;
		script.type = 'text/javascript';
		script.src = 'https://app.purechat.com/VisitorWidget/WidgetScript';
	document.getElementsByTagName('HEAD').item(0).appendChild(script);
	script.onreadystatechange = script.onload = function (e) {

		if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
			var w = new PCWidget({
				c: '3c04e91a-2d16-46b4-a25f-eab0492a5e01',
				f: true
			});
			done = true;
		}

	};
})();
// ********************************************************************