sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("gatepassapp.controller.App", {
        onInit: function() {
          this.NavBarVal = "0";
          this.oSplitApp = this.getView().byId("splitApp");

        },

        
        onAfterRendering: function(){
          var oSplitApp = this.getView().byId("splitApp");
          oSplitApp.getAggregation("_navMaster").addStyleClass("masterStyleAfter");
        },

        OnClick:function(){
          var oSideNavigation = this.byId("sideNavigation");
          var bExpanded = oSideNavigation.getExpanded();
        
          console.log("oSideNavigation", oSideNavigation)
          console.log("bExpanded", bExpanded)

          if(bExpanded === true){
            var oSplitApp = this.getView().byId("splitApp");
            oSplitApp.getAggregation("_navMaster").removeStyleClass("masterStyleAfter");
            oSplitApp.getAggregation("_navMaster").addStyleClass("masterStyle");
            this.getView().byId("SideBarHeaderLogo").setVisible(false);
            this.getView().byId("SideBarHeaderCName").setVisible(false);
          }

          else if(bExpanded === false){
            var oSplitApp = this.getView().byId("splitApp");
            oSplitApp.getAggregation("_navMaster").addStyleClass("masterStyleAfter");
            oSplitApp.getAggregation("_navMaster").removeStyleClass("masterStyle");
            this.getView().byId("SideBarHeaderLogo").setVisible(true);
            this.getView().byId("SideBarHeaderCName").setVisible(true);
          }

          oSideNavigation.setExpanded(!bExpanded);
        },

        OnNavBtn: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("item");
          var sKey = oSelectedItem.getKey();
          var sText = oSelectedItem.getText();
      
          // // Now, you can use sKey and sText as needed
          console.log("Selected Key:", sKey);
          console.log("Selected Text:", sText);
      
          // var sItemTitle = oEvent.getSource().getTitle();
          var sDetailViewName = "gatepassapp.view." + sKey;

          // Destroy the current detail page
          var oDetailPage = this.oSplitApp.getDetailPages()[0];
          if (oDetailPage) {
            oDetailPage.destroy();
          }

          // Create and set the new detail page
          var oNewDetailPage = sap.ui.xmlview({
            viewName: sDetailViewName
          });

          this.oSplitApp.addDetailPage(oNewDetailPage);
          this.oSplitApp.toDetail(oNewDetailPage);
      },  

      });
    }
  );
  