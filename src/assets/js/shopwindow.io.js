var url = window.location.href;
if ( url === 'http://members.scholarshipauditions.com' ) {
	// ********************************************************************
	// Shopwindow DATASYNC
	// ********************************************************************
	(function () {
		var didLoad = false;
		var script = document.createElement("script");
			script.setAttribute("type", "text/javascript");
			script.setAttribute("src", "//scholarshipauditions.shopwindow.io/siteintegrator/loadsitemodules/app.js");
			script.async = true;
		var link = document.createElement("link");
			link.setAttribute("rel", "stylesheet");
			link.setAttribute("type", "text/css");
			link.setAttribute("href", "//scholarshipauditions.shopwindow.io/siteintegrator/loadsitemodules/app.css");
			link.setAttribute("data-componentizedpage", "1");
		function loadSM() {
			if (didLoad) {
				return;
			}
			didLoad = true;
			document.body.appendChild(script);
			document.body.appendChild(link);
		};
		if (window.addEventListener) window.addEventListener("load", loadSM, false);
		else if (window.attachEvent) window.attachEvent("onload", loadSM);
	})();
	// ********************************************************************
};