/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"iven_user_master/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
