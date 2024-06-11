sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/ibspl/employeemanagement/model/formatter",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, formatter, MessageBox) {
        "use strict";
        var context;

        return Controller.extend("com.ibspl.employeemanagement.controller.Emp_Management_NewEntry", {
            formatter: formatter,
            onInit: function () {
                debugger
                context = this;
                this.oModel = context.getOwnerComponent().getModel();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                context.oPModel = this.getOwnerComponent().getModel("PropertyModel");
                oRouter.getRoute("RouteEmp_Management_NewEntry").attachMatched(this._onRouteMatched, this);
                this.readProjectAndTaskMaster();
                var oMinDate = new Date('03/25/2024')
                context.getView().byId("Id_TimeSheetDate").setMinDate(oMinDate);
                var oMaxDate = new Date();
                context.getView().byId("Id_TimeSheetDate").setMaxDate(oMaxDate);
                context.oPModel.setProperty("/SubmitBtn", false);
            },
            _onRouteMatched : function(){

                if(context.getOwnerComponent().getModel("EmployeeDetails") === undefined){
                    context.onBack();
                }

            }, 

            onBack: function (oEvent) {

            this.clearFormDetails();

            context.getView().setModel(new JSONModel([]), "TimeSheetEntries");
            context.oPModel.setProperty("/SubmitBtn", false);


                var oRouter = context.getOwnerComponent().getRouter();
                oRouter.navTo("RouteEmp_Management_Master");

                


                
            },

            readEmployeeEntries: function () {
                var oModel;
                context.oModel.read("/EMP_TIMESHEET_ENTRY", {

                    success: function (Data, response) {
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

            readProjectAndTaskMaster: function () {
                var oProjectModel, aProjectDetails = [], oProjectandTaskDetails, aProjectandTaskDetails;
                context.oModel.read("/EMP_PROJECT_TASK_MASTER", {

                    success: function (Data, response) {

                        aProjectandTaskDetails =  structuredClone(Data);

                        oProjectandTaskDetails = new JSONModel(aProjectandTaskDetails);
                        context.getView().setModel(oProjectandTaskDetails, "ProjectTaskDetails");

                        aProjectDetails = Data.results;
                       
                        for (let i = 0; i < aProjectDetails.length; i++) {
                            for (let j = i + 1; j < Data.results.length; j++) {
                                if (aProjectDetails[i].PROJECT_ID === Data.results[j].PROJECT_ID) {
                                    aProjectDetails.splice(j, 1);
                                    Data.results.splice(j, 1);
                                    j--;
                                }
                            }

                        }
                        oProjectModel = new JSONModel(aProjectDetails);
                        context.getView().setModel(oProjectModel, "ProjectDetails");

                    },
                    error: function (error) {
                        // BusyIndicator.hide();
                        // MessageBox.warning("Error while reading StatusMaster data"

                        MessageBox.error(error.responseText);
                    }
                });
            },

            SampleCreate: function () {
                var oPayload = {
                    "SR_NO": 23,
                    "EMPLOYEE_ID": 2121,
                    "EMPLOYEE_NAME": "INDERSINGH",
                    "DATE": new Date(),
                    "START_TIME": 'PT9H0M0S',
                    "END_TIME": "PT13H30M21S",
                    "BREAK_TIME": "PT18H30M00S",
                    "PROJECT_ID": 10011,
                    "TASK_ID": 1,
                    "STATUS": 1
                }

                context.oModel.create("/EMP_TIMESHEET_ENTRY", oPayload, {
                    type: 'POST',
                    success: function (Data, response) {
                        debugger
                    },
                    error: function (error) {
                        // BusyIndicator.hide();
                        // MessageBox.warning("Error while reading StatusMaster data"

                        MessageBox.error(error.responseText);
                    }
                });
            },
            onProjectSelection: function (oEvent) {
                var aTaskDetails = [], oTaskModel;
                var sSelectedKey = parseInt(oEvent.getSource().getSelectedKey(), 10);
                var aProjectTaskDetails = context.getView().getModel("ProjectTaskDetails").getData().results;

                for (let i = 0; i < aProjectTaskDetails.length; i++) {
                    if (sSelectedKey === aProjectTaskDetails[i].PROJECT_ID) {
                        aTaskDetails.push(aProjectTaskDetails[i]);
                    }
                }

                oTaskModel = new JSONModel(aTaskDetails);
                context.getView().setModel(oTaskModel, "TaskDetails");
            },

            //Validations
            TimeFormatCheckLiv : function(oEvent){
                var sValue = oEvent.getSource().getValue();
                var sHours = sValue.split(':')[0];
                var sMinutes = sValue.split(':')[1];
                var sSeconds = sValue.split(':')[2]; 
                var sTimeString = sValue.split(':')[3];

                if(sHours > 12){
                    sTimeString = sHours + sMinutes + sSeconds;
                    oEvent.getSource().setValue("");
                } else if(sMinutes > 59){
                    sMinutes = '06'
                    sTimeString = sHours + sMinutes + sSeconds;
                    oEvent.getSource().setValue(sTimeString);
                    
                } else if(sSeconds > 59){
                    sSeconds = '06'
                    sTimeString = sHours + sMinutes + sSeconds;
                    oEvent.getSource().setValue(sTimeString);
                } 
            },
            handleDateChange: function (oEvent) {
                var oText = this.byId("textResult"),
                    oDP = oEvent.getSource(),
                    sValue = oEvent.getParameter("value"),
                    bValid = oEvent.getParameter("valid");
    
                if (bValid) {
                    oDP.setValueState(sap.ui.core.ValueState.None);
                } else {
                    oDP.setValueState(sap.ui.core.ValueState.Error);
                }
            },

          

            AddTimeSheetDetails : function(){

                var aTimeSheetDetails = [];
                var sProjectId = this.getView().byId("Id_ProjectName").getSelectedKey();
                var sTaskId = this.getView().byId("Id_TaskName").getSelectedKey();
                var sDate = this.getView().byId("Id_TimeSheetDate").getValue();
                var StartTime = this.getView().byId("Id_StartTime").getValue();
                var BreakTime = this.getView().byId("Id_BreakTime").getValue();
                var EndTime = this.getView().byId("Id_EndTime").getValue();
                var sRemark = this.getView().byId("Id_Remark").getValue();
                var bFlag = false;
                var oEmployeeDetails = context.getOwnerComponent().getModel("EmployeeDetails").getData();
                

                if(context.getView().getModel("TimeSheetEntries") !== undefined){
                    aTimeSheetDetails = context.getView().getModel("TimeSheetEntries").getData();
                } else {
                    aTimeSheetDetails = []
                }  

                if(sProjectId !== undefined && sProjectId !== null && sProjectId !== ''){
                    this.getView().byId("Id_ProjectName").setValueState(sap.ui.core.ValueState.None)
                    
                } else {
                    bFlag = true;
                    this.getView().byId("Id_ProjectName").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please select a Project");
                }

                if(sTaskId !== undefined && sTaskId !== null && sTaskId !== ''){
                    this.getView().byId("Id_TaskName").setValueState(sap.ui.core.ValueState.None)
                    
                } else {
                    bFlag = true;
                    this.getView().byId("Id_TaskName").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please select a Task");
                }

                if(sDate !== undefined && sDate !== null && sDate !== '' && this.getView().byId("Id_TimeSheetDate").isValidValue() === true){
                    this.getView().byId("Id_TimeSheetDate").setValueState(sap.ui.core.ValueState.None)
                    
                } else {
                    bFlag = true;
                    this.getView().byId("Id_TimeSheetDate").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please select a Date");
                }

                if(StartTime !== undefined && StartTime !== null && StartTime !== ''){
                    
                    this.getView().byId("Id_StartTime").setValueState(sap.ui.core.ValueState.None);
                    
                } else {
                    bFlag = true;
                    this.getView().byId("Id_StartTime").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please select Start Time");
                }

                if(BreakTime !== undefined && BreakTime !== null && BreakTime !== ''){
                    this.getView().byId("Id_BreakTime").setValueState(sap.ui.core.ValueState.None);
                } else {
                    
                    bFlag = true;
                    this.getView().byId("Id_BreakTime").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please select Break Time");
                }

                if(EndTime !== undefined && EndTime !== null && EndTime !== ''){
                    this.getView().byId("Id_EndTime").setValueState(sap.ui.core.ValueState.None);
                } else {
                    bFlag = true;
                    this.getView().byId("Id_EndTime").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please select End Time");
                    
                }

                if(sRemark !== undefined && sRemark !== null && sRemark !== '' && sRemark.trim() !== ''){
                    this.getView().byId("Id_Remark").setValueState(sap.ui.core.ValueState.None);
                } else {
                    
                    bFlag = true;
                    this.getView().byId("Id_Remark").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter the remark");
                }

                if(bFlag === false){
                    var Payload = {
                        "EMPLOYEE_ID": oEmployeeDetails.EMPLOYEE_CODE,
                        "EMPLOYEE_NAME": oEmployeeDetails.EMPLOYEE_NAME,
                        "DATE": new Date(sDate),
                        "START_TIME": StartTime,
                        "END_TIME": EndTime,
                        "BREAK_TIME": BreakTime,
                        "PROJECT_ID": parseInt(sProjectId, 10),
                        "PROJECT_NAME": this.getView().byId("Id_ProjectName").getValue(),
                        "TASK_NAME": this.getView().byId("Id_TaskName").getValue(),
                        "TASK_ID": parseInt(sTaskId, 10),
                        "EMPLOYEE_REMARK": sRemark.trim(),
                        "STATUS": 1
                    }
                    aTimeSheetDetails.push(Payload);
                    var oModel = new JSONModel(aTimeSheetDetails);
                    context.getView().setModel(oModel, "TimeSheetEntries");

                    context.clearFormDetails();
                }

                if(context.getView().getModel("TimeSheetEntries") !== undefined && context.getView().getModel("TimeSheetEntries").getData().length > 0){
                    context.oPModel.setProperty("/SubmitBtn", true);
                } else {
                    context.oPModel.setProperty("/SubmitBtn", false);
                }
            
            },

            SampleCreateTask: function () {
                var oPayload = {
                    "PROJECT_ID": 10011,
                    "PROJECT_NAME": "CROMPTON",
                    "TASK_ID": 1,
                    "TASK_NAME": "Making UI Responsive"
                }

                context.oModel.create("/EMP_PROJECT_TASK_MASTER", oPayload, {
                    type: 'POST',
                    success: function (Data, response) {
                        debugger
                    },
                    error: function (error) {
                        // BusyIndicator.hide();
                        // MessageBox.warning("Error while reading StatusMaster data"

                        MessageBox.error(error.responseText);
                    }
                });
            },
            onDelete : function(oEvent){
                var iIndex = parseInt(oEvent.getSource().getBindingContext("TimeSheetEntries").sPath.split("/")[1], 10)
                var aTimeSheetDetails = context.getView().getModel("TimeSheetEntries").getData();
                aTimeSheetDetails.splice(iIndex, 1);
                context.getView().setModel(new JSONModel(aTimeSheetDetails), "TimeSheetEntries");
                if(aTimeSheetDetails.length === 0){
                    context.oPModel.setProperty("/SubmitBtn", false);
                } else {
                    context.oPModel.setProperty("/SubmitBtn", true);

                }

            },
            clearFormDetails : function(){

                this.getView().byId("Id_ProjectName").setSelectedKey(null);
                this.getView().byId("Id_ProjectName").setValue(null);
                this.getView().byId("Id_TaskName").setValue(null);
                this.getView().byId("Id_TaskName").setSelectedKey(null);
                this.getView().byId("Id_TimeSheetDate").setValue(null);
                this.getView().byId("Id_StartTime").setValue(null);
                this.getView().byId("Id_BreakTime").setValue(null);
                this.getView().byId("Id_EndTime").setValue(null);
                this.getView().byId("Id_Remark").setValue(null);

                this.getView().byId("Id_ProjectName").setValueState(sap.ui.core.ValueState.None);
                this.getView().byId("Id_TaskName").setValueState(sap.ui.core.ValueState.None);
                this.getView().byId("Id_TimeSheetDate").setValueState(sap.ui.core.ValueState.None);
                this.getView().byId("Id_StartTime").setValueState(sap.ui.core.ValueState.None);
                this.getView().byId("Id_BreakTime").setValueState(sap.ui.core.ValueState.None);
                this.getView().byId("Id_EndTime").setValueState(sap.ui.core.ValueState.None);
                this.getView().byId("Id_Remark").setValueState(sap.ui.core.ValueState.None);

            },
            convertTimeFormat : function(timeString){
                var sPeriod = timeString.slice(-2);
                var iHours = parseInt(timeString.split(":")[0]);

                if(sPeriod === 'PM'){
                    iHours += 12
                }

                var sFinalString = 'PT' + iHours + 'H' + timeString.split(":")[1] + 'M' + timeString.split(":")[2].slice(0,2) + 'S';
                sFinalString = sFinalString.split(" ")[0];

                return sFinalString;

            },
            onCancel : function(){
                context.clearFormDetails();
            },

            onSubmit : function(){

                var aTimeSheetDetails = context.getView().getModel("TimeSheetEntries").getData();
                var iNoOfRecords = 0;

                for (var i = 0; i < aTimeSheetDetails.length; i++){

                delete aTimeSheetDetails[i].PROJECT_NAME;
                delete aTimeSheetDetails[i].TASK_NAME;
                aTimeSheetDetails[i].DATE = context.convertDate(aTimeSheetDetails[i].DATE);
                if(aTimeSheetDetails[i].START_TIME.split(":").length > 1){
                    aTimeSheetDetails[i].START_TIME = context.convertTimeFormat(aTimeSheetDetails[i].START_TIME);
                    aTimeSheetDetails[i].BREAK_TIME = context.convertTimeFormat(aTimeSheetDetails[i].BREAK_TIME);
                    aTimeSheetDetails[i].END_TIME = context.convertTimeFormat(aTimeSheetDetails[i].END_TIME);
                }
                

                context.oModel.create("/EMP_TIMESHEET_ENTRY", aTimeSheetDetails[i], {
                    type: 'POST',
                    success: function (Data, response) {
                        iNoOfRecords ++;
                        if(aTimeSheetDetails.length === iNoOfRecords){
                            MessageBox.success(" No. of Timesheet entries has been added : " + iNoOfRecords, {
                                actions: [MessageBox.Action.OK],
                                onClose: function (oAction) {
                                    if (oAction === "OK") {
                                        context.onBack();
                                    }
    
                                }
                            });
                       }
                    },
                    error: function (error) {
                        // BusyIndicator.hide();
                        // MessageBox.warning("Error while reading StatusMaster data"

                        MessageBox.error(error.responseText);
                    }
                });
                
            }

            },
            convertDate : function(sDate){
                var oDate = new Date(sDate);
                var sDay = oDate.getDay();
                var sMonth = oDate.getMonth() + 1;
                var sYear = oDate.getFullYear();

                var FinalDate = sDay + '/' + sMonth + '/' + sYear + " " + " 5:30";
                FinalDate = new Date(FinalDate);

                return FinalDate;


            },

            NewTest: function(){
                
            }

        });
    });
