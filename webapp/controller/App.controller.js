sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/IconPool"
    ],
    function(BaseController, IconPool) {
      "use strict";
  
      return BaseController.extend("gatepassapp.controller.App", {
        onInit: function() {

          this.NavBarVal = "0";
          this.oSplitApp = this.getView().byId("splitApp");

          var b = [];
          var c = {};
          //Fiori Theme font family and URI
          var t = {
            fontFamily: "SAP-icons-TNT",
            fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
          };
            //Registering to the icon pool
            IconPool.registerFont(t);
            b.push(IconPool.fontLoaded("SAP-icons-TNT"));
            c["SAP-icons-TNT"] = t;
            //SAP Business Suite Theme font family and URI
            var B = {
              fontFamily: "BusinessSuiteInAppSymbols",
              fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
            };
            //Registering to the icon pool
            IconPool.registerFont(B);
            b.push(IconPool.fontLoaded("BusinessSuiteInAppSymbols"));
            c["BusinessSuiteInAppSymbols"] = B;


            // In Below Model for Module List 
              this.JSonModelTransApp = new sap.ui.model.json.JSONModel({
                  Datas:[]
              });
              this.getView().setModel(this.JSonModelTransApp, "JSonModelTransApp");

              // // Get Session User  
              //     var userInfoService = sap.ushell.Container.getService("UserInfo");
              //     var userName = userInfoService.getUser().getFullName();
              //     console.log("getId:" , userInfoService.getUser().getId());
              //     console.log("User Name: " + userName);
              // // Get Session User  
        },

        onBeforeRendering :function(){
          sap.ui.core.BusyIndicator.show();
          let model001 = this.getView().getModel("YY1_ZGE_GATEPASS_ATU_CDS");
          let model002 = this.getView().getModel("YY1_ZGE_GATEPASS_USER_TABL_CDS");
          
          var that = this;
          model001.read("/YY1_ZGE_GATEPASS_ATU", {
            success: function (oData1, oRespons) { 
                // console.log("oDataoData:", oData1.results);
                // console.log("oData[0].UserId",oData1.results[0].UserId);
                // console.log("oData[0].UserName",oData1.results[0].UserName);

          let FilterData = new sap.ui.model.Filter("UserId", sap.ui.model.FilterOperator.EQ, oData1.results[0].UserId)

            model002.read("/YY1_ZGE_GATEPASS_USER_TABL", {
                filters:[FilterData],
                success: function (oData, oRespons) {
                    // console.log(oData);
                    let aItems = oData.results;

                    if(aItems.length > 0 && aItems[0].Status === "active"){
                      
                      var sDetailViewName = "gatepassapp.view.Home" ;
                      that.getView().byId("sideNavigation").setVisible(true);
          
                      // Destroy the current detail page
                      var oDetailPage = that.oSplitApp.getDetailPages()[0];
                      if (oDetailPage) {
                        oDetailPage.destroy();
                      }
            
                      // Create and set the new detail page
                      var oNewDetailPage = sap.ui.xmlview({
                        viewName: sDetailViewName
                      });
            
                      that.oSplitApp.addDetailPage(oNewDetailPage);
                      that.oSplitApp.toDetail(oNewDetailPage);

                      // In Below Module list JsonModel
                        model002.read("/YY1_MODULE_NAV_TAB_ZGE_GATEPAS", {
                          filters:[FilterData],
                          success: function (oDataModule1, oRespons) {
                              let oDataModule = oDataModule1.results;
                              console.log("oDataModule:", oDataModule);

                              for(let k=0; k < oDataModule.length; k++){

                                try{
                                  // console.log("oDataModule[k].ScreenId:", oDataModule[k].ScreenId);
                                  console.log("oDataModule[k].Status:", oDataModule[k].Status);
                                  that.getView().byId(""+oDataModule[k].ScreenId+"").setVisible(JSON.parse(oDataModule[k].Status));
                                }
                                catch(err){
                                  // console.log("err:", err);
                                  // continue;
                                }

                              }

                                // In Below Module list JsonModel
                                model002.read("/YY1_TRANSACTIONAL_APP_ASSIGN_Z", {
                                  filters:[FilterData],
                                  success: function (oDataModule2, oRespons) {
                                      let oDataModule02 = oDataModule2.results;
                                      // console.log("oDataModule02:", oDataModule02);

                                        try{
                                            // In Below Model for Module List 
                                            that.JSonModelTransApp = new sap.ui.model.json.JSONModel({
                                                Datas:oDataModule02
                                            });
                                            that.getView().setModel(that.JSonModelTransApp, "JSonModelTransApp");
                                            // console.log("that.JSonModelTransApp:", that.JSonModelTransApp);
                                      }
                                        catch(err){
                                          // console.log("err:", err);
                                          // continue;
                                        }
                                      sap.ui.core.BusyIndicator.hide();
                                  },
                                  error: function(error) {
                                    // console.log("Error", error);
                                    sap.ui.core.BusyIndicator.hide();
                                  }
                                });
                                    // sap.ui.core.BusyIndicator.hide();
                                },
                                error: function(error) {
                                  // console.log("Error", error);
                                  sap.ui.core.BusyIndicator.hide();
                                  }
                              });     
            
                    }else{
                      sap.ui.core.BusyIndicator.hide();
                      sap.m.MessageBox.show(
                        "You don't have authorozation. Please check with your admin.", {
                          icon: MessageBox.Icon.INFORMATION,
                          title: "Authorization Error...",
                        }
                      );
                      var sDetailViewName = "gatepassapp.view.Error";
                      that.getView().byId("sideNavigation").setVisible(false);
          
                      // Destroy the current detail page
                      var oDetailPage = that.oSplitApp.getDetailPages()[0];
                      if (oDetailPage) {
                        oDetailPage.destroy();
                      }
            
                      // Create and set the new detail page
                      var oNewDetailPage = sap.ui.xmlview({
                        viewName: sDetailViewName
                      });
            
                      that.oSplitApp.addDetailPage(oNewDetailPage);
                      that.oSplitApp.toDetail(oNewDetailPage);  

            
                    }
          
                }
              });

          }
        });
        },

        
        onAfterRendering: function(){
          var oSplitApp = this.getView().byId("splitApp");
          oSplitApp.getAggregation("_navMaster").addStyleClass("masterStyleAfter");
        },

        OnClick:function(){
          var oSideNavigation = this.byId("sideNavigation");
          var bExpanded = oSideNavigation.getExpanded();
        
          // console.log("oSideNavigation", oSideNavigation)
          // console.log("bExpanded", bExpanded)

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
          // console.log("Selected Key:", sKey);
          // console.log("Selected Text:", sText);
      
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
      
      OnExpandItems:function(oEvent){

        if(oEvent.getParameter("item").getExpanded() === false){
          oEvent.getParameter("item").setExpanded(true);
        }
        else{
          oEvent.getParameter("item").setExpanded(false);
        }
        
      },

      });
    }
  );
  