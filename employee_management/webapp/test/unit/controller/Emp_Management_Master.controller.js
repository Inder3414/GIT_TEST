/*global QUnit*/

sap.ui.define([
	"comibspl/employee_management/controller/Emp_Management_Master.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Emp_Management_Master Controller");

	QUnit.test("I should test the Emp_Management_Master controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
