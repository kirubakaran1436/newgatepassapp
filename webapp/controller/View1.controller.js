sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/m/SplitApp",
  "sap/m/Page",
  "sap/m/Button"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, SplitApp, Page, Button) {
        "use strict";

        return Controller.extend("gatepassapp.controller.View1", {
            onInit: function () {
                // Initialize the SplitApp
                // this.oSplitApp = this.getView().byId("app");
                // this.bFullScreen = false; // Initial state is not full screen
            },
    
            // onToggleFullScreen: function () {
            //     this.bFullScreen = !this.bFullScreen;
    
            //     if (this.bFullScreen) {
            //         // Switch to full-screen mode
            //         this.oSplitApp.setMode(sap.m.SplitAppMode.HideMode);
            //     } else {
            //         // Switch back to standard mode
            //         this.oSplitApp.setMode(sap.m.SplitAppMode.StretchCompressMode);
            //     }
            // }

            onToggleFullScreen: function() {
                var oSplitApp = this.getView().byId("splitApp");
                var oDetailPage = this.getView().byId("detailPage");
          
                // Check if the detail page is currently part of the split app
                if (oSplitApp.indexOfDetailPage(oDetailPage) === -1) {
                  // Remove the detail page from the split app
                  oSplitApp.addDetailPage(oDetailPage);
                } else {
                  // Remove the detail page from the split app
                  oSplitApp.removeDetailPage(oDetailPage);
                }
              }

        });
    });
