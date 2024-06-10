sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/ibspl/employeemanagement/model/formatter",
    "sap/ui/core/Fragment",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, formatter, Fragment) {
        "use strict";
        var context;

        return Controller.extend("com.ibspl.employeemanagement.controller.Emp_Management_Master", {
            formatter: formatter,
            onInit: function () {
                context = this;
                this.oModel = context.getOwnerComponent().getModel();
                context.oPModel = this.getOwnerComponent().getModel("PropertyModel");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var oEmployeeDetails = {
                    "EMPLOYEE_CODE": 2121,
                    "EMPLOYEE_NAME": 'INDERSINGH CHOUHAN'
                }
                 
                context.getOwnerComponent().setModel(new JSONModel(oEmployeeDetails),"EmployeeDetails")
                oRouter.getRoute("RouteEmp_Management_Master").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function () {
                context.readEmployeeEntries();
            },

            readEmployeeEntries: function () {
                var oModel;
                var iEmployeeId = context.getOwnerComponent().getModel("EmployeeDetails").getData().EMPLOYEE_CODE;
                var filter = new sap.ui.model.Filter("EMPLOYEE_ID", "EQ", iEmployeeId);
                context.oModel.read("/EMP_TIMESHEET_ENTRY", {
                    filters : [filter],
                    urlParameters: {
                        $expand: ["PROJECT_TASK_MASTER_REF", "STATUS_MASTER_REF"]
                    },
                    
                    success: function (Data, response) {

                        context.oPModel.setProperty("/headerText", "TimeSheet Entries " + "(" + Data.results.length + ")");
                        
                        // var oTreeTableDetails = context.formatTreeData(Data);
                        oModel = new JSONModel(Data);
                        context.getView().setModel(oModel, "EmployeeEntries");

                    },
                    error: function (error) {
                        // BusyIndicator.hide();
                        // MessageBox.warning("Error while reading StatusMaster data"

                        MessageBox.error(error.responseText);
                    }
                });
            },
            onCreateNewEntry: function (oEvent) {
                var iEmployeeId = context.getOwnerComponent().getModel("EmployeeDetails").getData().EMPLOYEE_CODE;
                var oRouter = context.getOwnerComponent().getRouter();
                oRouter.navTo("RouteEmp_Management_NewEntry",{
                    "EMPLOYEE_ID" : iEmployeeId
                });
            },
            onLinkPress : function(oEvent){
            
                var oButton = oEvent.getSource();
                var oProjectDetails = oEvent.getSource().getBindingContext("EmployeeEntries").getObject().PROJECT_TASK_MASTER_REF;
                oProjectDetails.results[0].EMPLOYEE_REMARK = oEvent.getSource().getBindingContext("EmployeeEntries").getObject().EMPLOYEE_REMARK;
                var oModel = new JSONModel(oProjectDetails.results[0]);
                context.getView().setModel(oModel, "ProjectDetails");
                
                if (!this._pPopover) {
					this._pPopover = Fragment.load({
						id: context.getView().getId(),
						name: "com.ibspl.employeemanagement.view.fragment.projectDetails",
						controller: this
					}).then(function (oPopover) {
						context.getView().addDependent(oPopover);
						return oPopover;
					});
				}
				this._pPopover.then(function (oPopover) {
					oPopover.setPlacement("PreferredTopOrFlip");
					oPopover.openBy(oButton);
				});

            },

            onClose: function (oEvent) {
                this.byId("myPopover").close();
            },

            formatTreeData: function (Data) {
                var oTreeNode = {
                    node: []
                };

                var oTreeNodeSub = {
                    node: []
                }
                var nodecheck = false;

                for (var i = 0; i < Data.results.length; i++) {
                    if (i !== Data.results.length - 1) {
                        nodecheck = false;
                        for (let j = i + 1; j < Data.results.length; j++) {
                            if (Data.results[i].EMPLOYEE_ID === Data.results[j].EMPLOYEE_ID) {

                                Data.results[i].PROJECT_TASK_MASTER_REF.results = Data.results[i].PROJECT_TASK_MASTER_REF.results.concat(Data.results[j].PROJECT_TASK_MASTER_REF.results);
                                Data.results.splice(j,1);
                                nodecheck = true;
                            }
                            
                        }
                    }
                    oTreeNodeSub.EMPLOYEE_ID = Data.results[i].EMPLOYEE_ID;
                    oTreeNodeSub.EMPLOYEE_NAME = Data.results[i].EMPLOYEE_NAME;
                    oTreeNodeSub.DATE = Data.results[i].DATE;
                    oTreeNodeSub.START_TIME = Data.results[i].START_TIME;
                    oTreeNodeSub.BREAK_TIME = Data.results[i].BREAK_TIME;
                    oTreeNodeSub.END_TIME = Data.results[i].END_TIME;
                    oTreeNodeSub.EMPLOYEE_REMARK = Data.results[i].EMPLOYEE_REMARK;
                    oTreeNodeSub.STATUS = Data.results[i].STATUS;
                    oTreeNodeSub.node = Data.results[i].PROJECT_TASK_MASTER_REF.results;
                    oTreeNode.node.push(Object.assign({}, oTreeNodeSub));
                }

                return oTreeNode;
            },

            crossAppNavigation: function(oEvent){
                var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation"); 

                var hrefForProductDisplay = oCrossAppNav.toExternal({
                    target : { semanticObject : "iVenReport", action : "Display" }
                  }); 
            },
             
            crossAppNavigationtoUsers: function(oEvent){
                var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation"); 

                var hrefForProductDisplay = oCrossAppNav.toExternal({
                    target : { semanticObject : "User_Master", action : "Display" }
                  }); 
            },
        });
    });
