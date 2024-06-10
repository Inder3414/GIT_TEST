sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.ibspl.employeemanagement.controller.App", {
        onInit: function() {
          var oRouter = this.getOwnerComponent().getRouter().getRoute("AppView");
			    oRouter.attachPatternMatched(this.handleRouteMatched, this);
        },
        handleRouteMatched: function (oEvent) {
			
          var that = this;
    
          var router = sap.ui.core.UIComponent.getRouterFor(that);
          that.getOwnerComponent().getModel().metadataLoaded(true).then(
            function () {
                  router.navTo("RouteEmp_Management_Master"); 
                
            }).catch(function (error) {
            router.navTo("RouteNotFound");
          });
        }
      });
    }
  );
  