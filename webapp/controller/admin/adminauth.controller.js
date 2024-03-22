sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
	"sap/m/MessageToast",
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
    "sap/ui/unified/DateTypeRange",
	"sap/ui/core/date/UI5Date",
    'sap/ui/model/json/JSONModel',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, MessageToast, Fragment, Filter, FilterOperator, JSONModel, UI5Date) {
        "use strict";

        return Controller.extend("gatepassapp.controller.admin.adminauth", {
            onInit: function () {

                this.NavScreenModel = new sap.ui.model.json.JSONModel({
                    Datas : [
                    {ScreenName:"General Purchase", ScreenId:"GE3"},
                    {ScreenName:"Sales Return", ScreenId:"GE4"},
                    {ScreenName:"STO Goods Receipt", ScreenId:"GE5"}
                    ]	
                    });
                this.getView().setModel(this.NavScreenModel, "NavScreenModel");

                this.SelectedScreenDatas = [];

                
                this.myData =  []
                this.MAINDATA =  []

                this.JSonModel001 = new sap.ui.model.json.JSONModel({
                    Datas:this.MAINDATA
                });

                this.getView().setModel(this.JSonModel001, "ScreenModel");

                this.JSonModelINWARD = new sap.ui.model.json.JSONModel({
                    Datas:{}
                });
                this.getView().setModel(this.JSonModelINWARD, "JSonModelINWARD");

                // JsonModel For Transactional Apps
                    this.JSonModelGE3 = new sap.ui.model.json.JSONModel({
                        Datas:{}
                    });
                    this.getView().setModel(this.JSonModelGE3, "JSonModelGE3");

                    this.JSonModelGE4 = new sap.ui.model.json.JSONModel({
                        Datas:{}
                    });
                    this.getView().setModel(this.JSonModelGE4, "JSonModelGE4");

                    this.JSonModelGE5 = new sap.ui.model.json.JSONModel({
                        Datas:{}
                    });
                    this.getView().setModel(this.JSonModelGE5, "JSonModelGE5");

                    this.JSonModelGE21 = new sap.ui.model.json.JSONModel({
                        Datas:{}
                    });
                    this.getView().setModel(this.JSonModelGE21, "JSonModelGE21");

                    this.JSonModelGE8 = new sap.ui.model.json.JSONModel({
                        Datas:{}
                    });
                    this.getView().setModel(this.JSonModelGE8, "JSonModelGE8");

                    this.JSonModelGE9 = new sap.ui.model.json.JSONModel({
                        Datas:{}
                    });
                    this.getView().setModel(this.JSonModelGE9, "JSonModelGE9");

                    this.JSonModelGE10 = new sap.ui.model.json.JSONModel({
                        Datas:{}
                    });
                    this.getView().setModel(this.JSonModelGE10, "JSonModelGE10");

                    this.JSonModelGE11 = new sap.ui.model.json.JSONModel({
                        Datas:{}
                    });
                    this.getView().setModel(this.JSonModelGE11, "JSonModelGE11");

                    this.JSonModelGE15 = new sap.ui.model.json.JSONModel({
                        Datas:{}
                    });
                    this.getView().setModel(this.JSonModelGE15, "JSonModelGE15");

                    this.JSonModelGE16 = new sap.ui.model.json.JSONModel({
                        Datas:{}
                    });
                    this.getView().setModel(this.JSonModelGE16, "JSonModelGE16");

                // JsonModel For Transactional Apps

                // ----Start For Current Date -----
                var today = new Date();
                this.todayDateTime = new Date().toLocaleString().replace(',','');
                var dd = '' + today.getDate();
                var mm = '' + (today.getMonth() + 1); //January is 0!
                if (mm.length < 2) {
                    mm = '0' + mm;
                }
                if (dd.length < 2) {
                    dd = '0' + dd;
                }
                var yyyy = today.getFullYear();
                this.CurrentDate = dd + '-' + mm + '-' + yyyy;
                this.CurrentDatepost = today;
            // ----Start For Current Date -----
                
            },

            OnBusinessUerSuggest:function(oEvent){
                sap.ui.core.BusyIndicator.show();
                var oItem = oEvent.getParameter("selectedItem");
                var GetKey = oItem ? oItem.getKey() : "";
                var GetValue = oItem ? oItem.getText() : "";

                    // Do something with key and text values
                    console.log( oItem);
                    console.log("Selected Key:", GetKey);
                    console.log("Selected Text:", GetValue);
                
                this.byId("id_business_user_name_h").setValue(GetValue);
                this.byId("id_business_user_id_h").setValue(GetKey);
                this.getView().byId("id_heder_select_name").setVisible(true)
                this.getView().byId("id_heder_select_name").setText(GetValue)
                
                var oFilter1 = new sap.ui.model.Filter("UserId", sap.ui.model.FilterOperator.EQ, GetKey);
                var oModel1 = this.getView().getModel("YY1_ZGE_GATEPASS_USER_TABL_CDS");
                
                var oFilters1 = [oFilter1];
                var that = this;
                
                oModel1.read("/YY1_MODULE_NAV_TAB_ZGE_GATEPAS", {
                    filters: oFilters1,
                    success: function (oData) {
                        
                        var aItems = oData.results; 
                        if(aItems.length > 0){
                            that.MAINDATA = []

                            that.getView().byId("id_activate_user").setVisible(false);
                            that.getView().byId("id_deactivate_user").setVisible(true);
                            that.getView().byId("id_activate_user_text").setVisible(false);
                            that.getView().byId("id_deactivate_user_text").setVisible(true);

                                that.getView().byId("id_save").setVisible(false);
                                that.getView().byId("id_add_assign_screen").setVisible(true);
                                that.getView().byId("iconTabBar").setVisible(true);
                                that.getView().byId("id_cancel").setVisible(false);

                            that.JSonModel001 = new sap.ui.model.json.JSONModel({
                                Datas: aItems
                            });
                            that.getView().setModel(that.JSonModel001, "ScreenModel");
                           console.log(that.JSonModel001);

                            for(let k=0; k < aItems.length; k++){
                                if(aItems[k].ScreenId === "GE2" && aItems[k].Status === "true"){
                                    that.getView().byId("GE2_INWARD").setVisible(true)
                                    that.getView().byId("GE2_INWARD_PANEL01").setVisible(true)
                                    that.getView().byId("GE2_INWARD_PANEL02").setVisible(true)
                                    that.getView().byId("GE2_INWARD_PANEL03").setVisible(true)
                                    that.getView().byId("GE2_INWARD_PANEL04").setVisible(true)
                                    that.getView().byId("GE2_INWARD_PANEL05").setVisible(true)
                                }else if(aItems[k].ScreenId === "GE2" && aItems[k].Status === "false"){
                                    that.getView().byId("GE2_INWARD").setVisible(false)
                                    that.getView().byId("GE2_INWARD_PANEL01").setVisible(false)
                                    that.getView().byId("GE2_INWARD_PANEL02").setVisible(false)
                                    that.getView().byId("GE2_INWARD_PANEL03").setVisible(false)
                                    that.getView().byId("GE2_INWARD_PANEL04").setVisible(false)
                                    that.getView().byId("GE2_INWARD_PANEL05").setVisible(false)
                                }
                            }

                        for(let i=0; i < aItems.length; i++){
                                if(aItems[i].ScreenId === "GE7" && aItems[i].Status === "true"){
                                    that.getView().byId("GE7_OUTWARD").setVisible(true)
                                    that.getView().byId("GE7_OUTWARD_PANEL01").setVisible(true)
                                    that.getView().byId("GE7_OUTWARD_PANEL02").setVisible(true)
                                    that.getView().byId("GE7_OUTWARD_PANEL03").setVisible(true)
                                    that.getView().byId("GE7_OUTWARD_PANEL04").setVisible(true)
                                    that.getView().byId("GE7_OUTWARD_PANEL05").setVisible(true)
                                }else if(aItems[i].ScreenId === "GE7" && aItems[i].Status === "false"){
                                    that.getView().byId("GE7_OUTWARD").setVisible(false)
                                    that.getView().byId("GE7_OUTWARD_PANEL01").setVisible(false)
                                    that.getView().byId("GE7_OUTWARD_PANEL02").setVisible(false)
                                    that.getView().byId("GE7_OUTWARD_PANEL03").setVisible(false)
                                    that.getView().byId("GE7_OUTWARD_PANEL04").setVisible(false)
                                    that.getView().byId("GE7_OUTWARD_PANEL05").setVisible(false)
                                }
                            }

                        for(let r=0; r < aItems.length; r++){
                                if(aItems[r].ScreenId === "GE14" && aItems[r].Status === "true"){
                                    that.getView().byId("GE14_RGP_NRGP").setVisible(true)
                                    that.getView().byId("GE14_RGP_NRGP_PANEL01").setVisible(true)
                                    that.getView().byId("GE14_RGP_NRGP_PANEL02").setVisible(true)
                                    that.getView().byId("GE14_RGP_NRGP_PANEL03").setVisible(true)
                                    that.getView().byId("GE14_RGP_NRGP_PANEL04").setVisible(true)
                                    that.getView().byId("GE14_RGP_NRGP_PANEL05").setVisible(true)
                                }else if(aItems[r].ScreenId === "GE14" && aItems[r].Status === "false"){
                                    that.getView().byId("GE14_RGP_NRGP").setVisible(false)
                                    that.getView().byId("GE14_RGP_NRGP_PANEL01").setVisible(false)
                                    that.getView().byId("GE14_RGP_NRGP_PANEL02").setVisible(false)
                                    that.getView().byId("GE14_RGP_NRGP_PANEL03").setVisible(false)
                                    that.getView().byId("GE14_RGP_NRGP_PANEL04").setVisible(false)
                                    that.getView().byId("GE14_RGP_NRGP_PANEL05").setVisible(false)
                                }
                            }
                           sap.ui.core.BusyIndicator.hide();
                        }
                        else{

                            that.getView().byId("id_activate_user").setVisible(true);
                            that.getView().byId("id_deactivate_user").setVisible(false);
                            that.getView().byId("id_activate_user_text").setVisible(true);
                            that.getView().byId("id_deactivate_user_text").setVisible(false);

                            that.getView().byId("GE2_INWARD").setVisible(false)
                            that.getView().byId("GE2_INWARD_PANEL01").setVisible(false)
                            that.getView().byId("GE2_INWARD_PANEL02").setVisible(false)
                            that.getView().byId("GE2_INWARD_PANEL03").setVisible(false)
                            that.getView().byId("GE2_INWARD_PANEL04").setVisible(false)
                            that.getView().byId("GE2_INWARD_PANEL05").setVisible(false)
                            that.getView().byId("GE7_OUTWARD").setVisible(false)
                            that.getView().byId("GE7_OUTWARD_PANEL01").setVisible(false)
                            that.getView().byId("GE7_OUTWARD_PANEL02").setVisible(false)
                            that.getView().byId("GE7_OUTWARD_PANEL03").setVisible(false)
                            that.getView().byId("GE7_OUTWARD_PANEL04").setVisible(false)
                            that.getView().byId("GE7_OUTWARD_PANEL05").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP_PANEL01").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP_PANEL02").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP_PANEL03").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP_PANEL04").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP_PANEL05").setVisible(false)

                            that.getView().byId("id_save").setVisible(false);
                            that.getView().byId("id_add_assign_screen").setVisible(false);
                            that.getView().byId("iconTabBar").setVisible(true);
                            that.getView().byId("id_cancel").setVisible(false);

                            sap.ui.core.BusyIndicator.hide();
                        }
                    },
                    error: function (oError) {
                        console.error("Error reading data: ", oError);
                    }
                    
                })

                let TRansArray = ["GE3" ,"GE4" ,"GE5" ,"GE21", "GE6" ,"GE8" ,"GE9" ,"GE10", "GE11", "GE13", "GE15", "GE16", "GE17", "GE18", "GE19"]
                let TRansINWARD = ["GE3" ,"GE4" ,"GE5" ,"GE21", "GE6"]
                let TRansOUTWARD = ["GE8" ,"GE9" ,"GE10", "GE11", "GE13"]
                let TRansRGPNRGP = ["GE15", "GE16", "GE17", "GE18", "GE19"]
                
                oModel1.read("/YY1_TRANSACTIONAL_APP_ASSIGN_Z", {
                    filters: oFilters1,
                    success: function (oData) {
                        
                        let Odatass = oData.results; 
                        console.log("Odatass:::Odatass:::", Odatass)
                        // if(Odatass.length > 0){

                            // for (let i = 0; i < Odatass.length; i++){
                                
                                // if(Odatass[i].ModuleCode === "GE2"){
                                    that.JSonModelINWARD = new sap.ui.model.json.JSONModel({
                                        Datas:Odatass
                                    });
                                    that.getView().setModel(that.JSonModelINWARD, "JSonModelINWARD");
                                    console.log("that.JSonModelINWARD:", that.JSonModelINWARD)
                                    // for (let k=0; k <TRansINWARD.length; k++){
                                    //     let TRansINW = TRansINWARD[k];
                                    //     let IDDD = that.getView().byId("idswitch"+TRansINWARD[k]);
                                    //         IDDD.setState(/^true$/i.test(Odatass[i][TRansINWARD[k]]))
                                    //     var oCustomData = new sap.ui.core.CustomData({
                                    //         key: TRansINWARD[k], 
                                    //         value: Odatass[i].SAP_UUID 
                                    //     });
                                    //         IDDD.addCustomData(oCustomData);
                                    // }
                                // }

                                // if(Odatass[i].ModuleCode === "GE7"){
                                //     for (let r=0; r <TRansOUTWARD.length; r++){
                                //         // console.log("OdatassGE7:", Odatass[i])

                                //         let IDDD = that.getView().byId("idswitch"+TRansOUTWARD[r]);
                                //         IDDD.setState(/^true$/i.test(Odatass[i][TRansOUTWARD[r]]));
                                //         var oCustomData = new sap.ui.core.CustomData({
                                //             key: TRansOUTWARD[r], 
                                //             value: Odatass[i].SAP_UUID 
                                //         });
                                //             IDDD.addCustomData(oCustomData);
                                //     }
                                // }
                                
                                // if(Odatass[i].ModuleCode === "GE14"){
                                //     for (let u=0; u <TRansRGPNRGP.length; u++){
                                //         // console.log("OdatassGE14:", Odatass[i])

                                //         let IDDD = that.getView().byId("idswitch"+TRansRGPNRGP[u]);
                                //             IDDD.setState(/^true$/i.test(Odatass[i][TRansRGPNRGP[u]]))
                                //         var oCustomData = new sap.ui.core.CustomData({
                                //             key: TRansRGPNRGP[u], 
                                //             value: Odatass[i].SAP_UUID 
                                //         });
                                //             IDDD.addCustomData(oCustomData);
                                //     }
                                // }
                                
                            // }

                           sap.ui.core.BusyIndicator.hide();
                        // }
                        
                    },
                    error: function (oError) {
                        console.error("Error reading data: ", oError);
                    }
                });
                
                // For Mandatory Fields
                oModel1.read("/YY1_MANDATORY_FIELD_ASSIGN_ZGE", {
                    filters: oFilters1,
                    success: function (oData) {
                        
                        let Odatass = oData.results; 
                        console.log("Odatass:::Odatass:::", Odatass)
                        if(Odatass.length > 0){

                            for (let i = 0; i < Odatass.length; i++){
                                
                                if(Odatass[i].AppId === "GE3"){
                                    that.JSonModelGE3 = new sap.ui.model.json.JSONModel({
                                        Datas:Odatass[i]
                                    });
                                    that.getView().setModel(that.JSonModelGE3, "JSonModelGE3");
                                    console.log("that.JSonModelGE3:", that.JSonModelGE3)
                                }

                                else if(Odatass[i].AppId === "GE4"){
                                    that.JSonModelGE4 = new sap.ui.model.json.JSONModel({
                                        Datas:Odatass[i]
                                    });
                                    that.getView().setModel(that.JSonModelGE4, "JSonModelGE4");
                                    console.log("that.JSonModelGE4:", that.JSonModelGE4)
                                }

                                else if(Odatass[i].AppId === "GE5"){
                                    that.JSonModelGE5 = new sap.ui.model.json.JSONModel({
                                        Datas:Odatass[i]
                                    });
                                    that.getView().setModel(that.JSonModelGE5, "JSonModelGE5");
                                    console.log("that.JSonModelGE5:", that.JSonModelGE5)
                                }

                                else if(Odatass[i].AppId === "GE21"){
                                    that.JSonModelGE21 = new sap.ui.model.json.JSONModel({
                                        Datas:Odatass[i]
                                    });
                                    that.getView().setModel(that.JSonModelGE21, "JSonModelGE21");
                                    console.log("that.JSonModelGE21:", that.JSonModelGE21)
                                }

                                else if(Odatass[i].AppId === "GE8"){
                                    that.JSonModelGE8 = new sap.ui.model.json.JSONModel({
                                        Datas:Odatass[i]
                                    });
                                    that.getView().setModel(that.JSonModelGE8, "JSonModelGE8");
                                    console.log("that.JSonModelGE8:", that.JSonModelGE8)
                                }

                                else if(Odatass[i].AppId === "GE9"){
                                    that.JSonModelGE9 = new sap.ui.model.json.JSONModel({
                                        Datas:Odatass[i]
                                    });
                                    that.getView().setModel(that.JSonModelGE9, "JSonModelGE9");
                                    console.log("that.JSonModelGE9:", that.JSonModelGE9)
                                }

                                else if(Odatass[i].AppId === "GE10"){
                                    that.JSonModelGE10 = new sap.ui.model.json.JSONModel({
                                        Datas:Odatass[i]
                                    });
                                    that.getView().setModel(that.JSonModelGE10, "JSonModelGE10");
                                    console.log("that.JSonModelGE10:", that.JSonModelGE10)
                                }

                                else if(Odatass[i].AppId === "GE11"){
                                    that.JSonModelGE11 = new sap.ui.model.json.JSONModel({
                                        Datas:Odatass[i]
                                    });
                                    that.getView().setModel(that.JSonModelGE11, "JSonModelGE11");
                                    console.log("that.JSonModelGE11:", that.JSonModelGE11)
                                }

                                else if(Odatass[i].AppId === "GE15"){
                                    that.JSonModelGE15 = new sap.ui.model.json.JSONModel({
                                        Datas:Odatass[i]
                                    });
                                    that.getView().setModel(that.JSonModelGE15, "JSonModelGE15");
                                    console.log("that.JSonModelGE15:", that.JSonModelGE15)
                                }

                                else if(Odatass[i].AppId === "GE16"){
                                    that.JSonModelGE16 = new sap.ui.model.json.JSONModel({
                                        Datas:Odatass[i]
                                    });
                                    that.getView().setModel(that.JSonModelGE16, "JSonModelGE16");
                                    console.log("that.JSonModelGE16:", that.JSonModelGE16)
                                }

                            }

                           sap.ui.core.BusyIndicator.hide();
                        }
                        
                    },
                    error: function (oError) {
                        console.error("Error reading data: ", oError);
                    }
                    
                })

            },
            OnAddScreen:function(oEvent){

                let UserId = this.getView().byId("id_business_user_id_h").getValue();

                var oFilter1 = new sap.ui.model.Filter("UserId", sap.ui.model.FilterOperator.EQ, UserId);
                        var oModel1 = this.getView().getModel("YY1_ZGE_GATEPASS_USER_TABL_CDS");
                        
                        var oFilters1 = [oFilter1];
                        var that = this;
                        
                        oModel1.read("/YY1_MODULE_NAV_TAB_ZGE_GATEPAS", {
                            filters: oFilters1,
                            success: function (oData) {
                                
                                var aItems = oData.results; 
                                if(aItems.length > 0){
                                    that.MAINDATA = []
        
                                    that.JSonModel001 = new sap.ui.model.json.JSONModel({
                                        Datas: aItems
                                    });
                                    that.getView().setModel(that.JSonModel001, "ScreenModel");
                                }
                            },
                            error: function (oError) {
                                console.error("Error reading data: ", oError);
                            }
                            
                        })

                console.log("this.JSonModel001", this.JSonModel001)
                if(!this._dialog_addmainscreen){
                    this._dialog_addmainscreen = sap.ui.xmlfragment(this.getView().getId("AddAssignMain_dialog"), "gatepassapp.view.admin.fragment.addmainscreen", this);
                    this.getView().addDependent(this._dialog_addmainscreen);
                }

                this._dialog_addmainscreen.open()
            },

            
            OnBusinessUserFragOpen:function(oEvent){
                console.log("Working")
                if(!this._dialog_businessuser){
                    this._dialog_businessuser = sap.ui.xmlfragment(this.getView().getId("BusinessUser_dialog"), "gatepassapp.view.admin.fragment.businessuser", this);
                    this.getView().addDependent(this._dialog_businessuser);
                }

                this._dialog_businessuser.open()
            },

            OnBusinessUserSearch:function(oEvent){
                let sValue = oEvent.getParameter("value");
                let oFilter = new Filter("PersonFullName", FilterOperator.Contains, sValue);
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },

            OnBusinessUserSelect:function(oEvent){
                sap.ui.core.BusyIndicator.show();
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);

                let aContexts = oEvent.getParameter("selectedContexts");
                let value1,value2; 

                if(aContexts === undefined){
                    console.log("No Item Present");
                    sap.ui.core.BusyIndicator.hide();
                }else{
                    if (aContexts && aContexts.length) {

                        aContexts.map(function (oContext) {
                            value1 = oContext.getObject().PersonFullName;
                            value2 = oContext.getObject().UserID;
                            return;
                        });
                        this.byId("id_select_user_name_h").setValue(value1);
                        this.byId("id_business_user_name_h").setValue(value1);
                        this.byId("id_business_user_id_h").setValue(value2);
                        this.getView().byId("id_heder_select_name").setVisible(true)
                        this.getView().byId("id_heder_select_name").setText(value1)


                        var oFilter1 = new sap.ui.model.Filter("UserId", sap.ui.model.FilterOperator.EQ, value2);
                        var oModel1 = this.getView().getModel("YY1_ZGE_GATEPASS_USER_TABL_CDS");
                        
                        var oFilters1 = [oFilter1];
                        var that = this;
                        
                        oModel1.read("/YY1_MODULE_NAV_TAB_ZGE_GATEPAS", {
                            filters: oFilters1,
                            success: function (oData) {
                                
                                var aItems = oData.results; 
                                if(aItems.length > 0){
                                    that.MAINDATA = []
        
                                    that.getView().byId("id_activate_user").setVisible(false);
                                    that.getView().byId("id_deactivate_user").setVisible(true);
                                    that.getView().byId("id_activate_user_text").setVisible(false);
                                    that.getView().byId("id_deactivate_user_text").setVisible(true);
        
                                        that.getView().byId("id_save").setVisible(false);
                                        that.getView().byId("id_add_assign_screen").setVisible(true);
                                        that.getView().byId("iconTabBar").setVisible(true);
                                        that.getView().byId("id_cancel").setVisible(false);
        
                                    that.JSonModel001 = new sap.ui.model.json.JSONModel({
                                        Datas: aItems
                                    });
                                    that.getView().setModel(that.JSonModel001, "ScreenModel");
                                   console.log(that.JSonModel001);

                                    for(let k=0; k < aItems.length; k++){
                                        if(aItems[k].ScreenId === "GE2" && aItems[k].Status === "true"){
                                            that.getView().byId("GE2_INWARD").setVisible(true)
                                            that.getView().byId("GE2_INWARD_PANEL01").setVisible(true)
                                            that.getView().byId("GE2_INWARD_PANEL02").setVisible(true)
                                            that.getView().byId("GE2_INWARD_PANEL03").setVisible(true)
                                            that.getView().byId("GE2_INWARD_PANEL04").setVisible(true)
                                            that.getView().byId("GE2_INWARD_PANEL05").setVisible(true)
                                        }else if(aItems[k].ScreenId === "GE2" && aItems[k].Status === "false"){
                                            that.getView().byId("GE2_INWARD").setVisible(false)
                                            that.getView().byId("GE2_INWARD_PANEL01").setVisible(false)
                                            that.getView().byId("GE2_INWARD_PANEL02").setVisible(false)
                                            that.getView().byId("GE2_INWARD_PANEL03").setVisible(false)
                                            that.getView().byId("GE2_INWARD_PANEL04").setVisible(false)
                                            that.getView().byId("GE2_INWARD_PANEL05").setVisible(false)
                                        }
                                    }
        
                                for(let i=0; i < aItems.length; i++){
                                        if(aItems[i].ScreenId === "GE7" && aItems[i].Status === "true"){
                                            that.getView().byId("GE7_OUTWARD").setVisible(true)
                                            that.getView().byId("GE7_OUTWARD_PANEL01").setVisible(true)
                                            that.getView().byId("GE7_OUTWARD_PANEL02").setVisible(true)
                                            that.getView().byId("GE7_OUTWARD_PANEL03").setVisible(true)
                                            that.getView().byId("GE7_OUTWARD_PANEL04").setVisible(true)
                                            that.getView().byId("GE7_OUTWARD_PANEL05").setVisible(true)
                                        }else if(aItems[i].ScreenId === "GE7" && aItems[i].Status === "false"){
                                            that.getView().byId("GE7_OUTWARD").setVisible(false)
                                            that.getView().byId("GE7_OUTWARD_PANEL01").setVisible(false)
                                            that.getView().byId("GE7_OUTWARD_PANEL02").setVisible(false)
                                            that.getView().byId("GE7_OUTWARD_PANEL03").setVisible(false)
                                            that.getView().byId("GE7_OUTWARD_PANEL04").setVisible(false)
                                            that.getView().byId("GE7_OUTWARD_PANEL05").setVisible(false)
                                        }
                                    }
        
                                for(let r=0; r < aItems.length; r++){
                                        if(aItems[r].ScreenId === "GE14" && aItems[r].Status === "true"){
                                            that.getView().byId("GE14_RGP_NRGP").setVisible(true)
                                            that.getView().byId("GE14_RGP_NRGP_PANEL01").setVisible(true)
                                            that.getView().byId("GE14_RGP_NRGP_PANEL02").setVisible(true)
                                            that.getView().byId("GE14_RGP_NRGP_PANEL03").setVisible(true)
                                            that.getView().byId("GE14_RGP_NRGP_PANEL04").setVisible(true)
                                            that.getView().byId("GE14_RGP_NRGP_PANEL05").setVisible(true)
                                        }else if(aItems[r].ScreenId === "GE14" && aItems[r].Status === "false"){
                                            that.getView().byId("GE14_RGP_NRGP").setVisible(false)
                                            that.getView().byId("GE14_RGP_NRGP_PANEL01").setVisible(false)
                                            that.getView().byId("GE14_RGP_NRGP_PANEL02").setVisible(false)
                                            that.getView().byId("GE14_RGP_NRGP_PANEL03").setVisible(false)
                                            that.getView().byId("GE14_RGP_NRGP_PANEL04").setVisible(false)
                                            that.getView().byId("GE14_RGP_NRGP_PANEL05").setVisible(false)
                                        }
                                    }
                                   sap.ui.core.BusyIndicator.hide();
                                }
                                else{
        
                                    that.getView().byId("id_activate_user").setVisible(true);
                                    that.getView().byId("id_deactivate_user").setVisible(false);
                                    that.getView().byId("id_activate_user_text").setVisible(true);
                                    that.getView().byId("id_deactivate_user_text").setVisible(false);

                                    that.getView().byId("GE2_INWARD").setVisible(false)
                                    that.getView().byId("GE2_INWARD_PANEL01").setVisible(false)
                                    that.getView().byId("GE2_INWARD_PANEL02").setVisible(false)
                                    that.getView().byId("GE2_INWARD_PANEL03").setVisible(false)
                                    that.getView().byId("GE2_INWARD_PANEL04").setVisible(false)
                                    that.getView().byId("GE2_INWARD_PANEL05").setVisible(false)
                                    that.getView().byId("GE7_OUTWARD").setVisible(false)
                                    that.getView().byId("GE7_OUTWARD_PANEL01").setVisible(false)
                                    that.getView().byId("GE7_OUTWARD_PANEL02").setVisible(false)
                                    that.getView().byId("GE7_OUTWARD_PANEL03").setVisible(false)
                                    that.getView().byId("GE7_OUTWARD_PANEL04").setVisible(false)
                                    that.getView().byId("GE7_OUTWARD_PANEL05").setVisible(false)
                                    that.getView().byId("GE14_RGP_NRGP").setVisible(false)
                                    that.getView().byId("GE14_RGP_NRGP_PANEL01").setVisible(false)
                                    that.getView().byId("GE14_RGP_NRGP_PANEL02").setVisible(false)
                                    that.getView().byId("GE14_RGP_NRGP_PANEL03").setVisible(false)
                                    that.getView().byId("GE14_RGP_NRGP_PANEL04").setVisible(false)
                                    that.getView().byId("GE14_RGP_NRGP_PANEL05").setVisible(false)
        
                                    that.getView().byId("id_save").setVisible(false);
                                    that.getView().byId("id_add_assign_screen").setVisible(false);
                                    that.getView().byId("iconTabBar").setVisible(true);
                                    that.getView().byId("id_cancel").setVisible(false);

                                    sap.ui.core.BusyIndicator.hide();
                                }
                            },
                            error: function (oError) {
                                console.error("Error reading data: ", oError);
                            }
                            
                        })

                        let TRansArray = ["GE3" ,"GE4" ,"GE5" ,"GE21", "GE6" ,"GE8" ,"GE9" ,"GE10", "GE11", "GE13", "GE15", "GE16", "GE17", "GE18", "GE19"]
                        let TRansINWARD = ["GE3" ,"GE4" ,"GE5" ,"GE21", "GE6"]
                        let TRansOUTWARD = ["GE8" ,"GE9" ,"GE10", "GE11", "GE13"]
                        let TRansRGPNRGP = ["GE15", "GE16", "GE17", "GE18", "GE19"]
                        
                          
                        oModel1.read("/YY1_TRANSACTIONAL_APP_ASSIGN_Z", {
                            filters: oFilters1,
                            success: function (oData) {
                                
                                let Odatass = oData.results; 
                                console.log("Odatass:::Odatass:::", Odatass)
                                // if(Odatass.length > 0){
        
                                    // for (let i = 0; i < Odatass.length; i++){
                                        
                                        // if(Odatass[i].ModuleCode === "GE2"){
                                            that.JSonModelINWARD = new sap.ui.model.json.JSONModel({
                                                Datas:Odatass
                                            });
                                            that.getView().setModel(that.JSonModelINWARD, "JSonModelINWARD");
                                            console.log("that.JSonModelINWARD:", that.JSonModelINWARD)
                                            // for (let k=0; k <TRansINWARD.length; k++){
                                            //     let TRansINW = TRansINWARD[k];
                                            //     let IDDD = that.getView().byId("idswitch"+TRansINWARD[k]);
                                            //         IDDD.setState(/^true$/i.test(Odatass[i][TRansINWARD[k]]))
                                            //     var oCustomData = new sap.ui.core.CustomData({
                                            //         key: TRansINWARD[k], 
                                            //         value: Odatass[i].SAP_UUID 
                                            //     });
                                            //         IDDD.addCustomData(oCustomData);
                                            // }
                                        // }

                                        // if(Odatass[i].ModuleCode === "GE7"){
                                        //     for (let r=0; r <TRansOUTWARD.length; r++){
                                        //         // console.log("OdatassGE7:", Odatass[i])

                                        //         let IDDD = that.getView().byId("idswitch"+TRansOUTWARD[r]);
                                        //         IDDD.setState(/^true$/i.test(Odatass[i][TRansOUTWARD[r]]));
                                        //         var oCustomData = new sap.ui.core.CustomData({
                                        //             key: TRansOUTWARD[r], 
                                        //             value: Odatass[i].SAP_UUID 
                                        //         });
                                        //             IDDD.addCustomData(oCustomData);
                                        //     }
                                        // }
                                        
                                        // if(Odatass[i].ModuleCode === "GE14"){
                                        //     for (let u=0; u <TRansRGPNRGP.length; u++){
                                        //         // console.log("OdatassGE14:", Odatass[i])

                                        //         let IDDD = that.getView().byId("idswitch"+TRansRGPNRGP[u]);
                                        //             IDDD.setState(/^true$/i.test(Odatass[i][TRansRGPNRGP[u]]))
                                        //         var oCustomData = new sap.ui.core.CustomData({
                                        //             key: TRansRGPNRGP[u], 
                                        //             value: Odatass[i].SAP_UUID 
                                        //         });
                                        //             IDDD.addCustomData(oCustomData);
                                        //     }
                                        // }
                                        
                                    // }

                                   sap.ui.core.BusyIndicator.hide();
                                // }
                                
                            },
                            error: function (oError) {
                                console.error("Error reading data: ", oError);
                            }
                            
                        })
        
                    }
                }
            },

            OnCheckBoxSelect:function(oEvent){
                var oCheckBox = oEvent.getSource();
                var varValue = oCheckBox.getSelected().getText();
                console.log(varValue);
                var aDatas = this.NavScreenModel.getProperty("/Datas");
                var aMatches = [];
                aDatas.forEach(function(oItem) {
                    if (oItem.ScreenName === varValue) {
                        aMatches.push(oItem);
                    }
                });

                if (aMatches.length > 0) {
                    console.log("Matched values for " + varValue + ":");
                    aMatches.forEach(function(oMatch) {
                        this.SelectedScreenDatas.push({"Id":oMatch.ScreenId, "Name":oMatch.ScreenName})
                    });
                } else {
                    console.log(varValue + " not found in the model.");
                }
            },
            
            OnFRagClose: function() {

                sap.ui.core.BusyIndicator.show();

                var oTable = this.getView().byId("TableIDD");
                var aItems = oTable.getItems();

                this.MAINDATA = [];

                var oTable = this.getView().byId("TableIDD"); // Replace "TableIDD" with the actual ID of your table
                var aItems = oTable.getItems(); // Get an array of all items in the table
                
                for (var i = 0; i < aItems.length; i++) {
                        let ScreenName = oTable.getItems()[i].getCells()[0].getText();
                        let ScreenCode = oTable.getItems()[i].getCells()[1].getText();
                        let Status = (oTable.getItems()[i].getCells()[2].getState()).toString();   
                        let ID = oTable.getItems()[i].getCells()[3].getText();   
                        let SAP_UUID = oTable.getItems()[i].getCells()[4].getValue();   

                        this.MAINDATA.push({ "SAP_UUID": SAP_UUID, "ID": ID, "Status": Status, "ScreenCode":ScreenCode, "ScreenName":ScreenName});
                };

                this.JSonModel001 = new sap.ui.model.json.JSONModel({
                    Datas: this.MAINDATA 
                });
                this.getView().setModel(this.JSonModel001, "ScreenModel");
                
                console.log("Updated this.JSonModel001:", this.JSonModel001);

                let GetUserId = this.getView().byId("id_business_user_id_h").getValue();

                var oFilter1 = new sap.ui.model.Filter("UserId", sap.ui.model.FilterOperator.EQ, GetUserId);
                var oModel1 = this.getView().getModel("YY1_ZGE_GATEPASS_USER_TABL_CDS");
                
                var oFilters1 = [oFilter1];
                var that = this;

                    oModel1.read("/YY1_TRANSACTIONAL_APP_ASSIGN_Z", {
                        filters: oFilters1,
                        success: function (oData) {
                            
                            let Odatass = oData.results; 
                            console.log("Odatass:::Odatass:::", Odatass)

                            that.JSonModelINWARD = new sap.ui.model.json.JSONModel({
                                Datas:Odatass
                            });
                            that.getView().setModel(that.JSonModelINWARD, "JSonModelINWARD");
                            console.log("that.JSonModelINWARD:", that.JSonModelINWARD)

                            sap.ui.core.BusyIndicator.hide();
                            
                        },
                        error: function (oError) {
                            console.error("Error reading data: ", oError);
                        }
                        
                    })
            
                
                this._dialog_addmainscreen.close()
            },
            
            OnActivateUser:function(){
                sap.ui.core.BusyIndicator.show();
                let UserID = this.getView().byId("id_business_user_id_h").getValue();
                let UserName = this.getView().byId("id_business_user_name_h").getValue();

                let MandatoryListData = []
                let TransAppList = [];
                let ModuleList = [];
                let UserEntry = {};

                let ModuleTab =[{"ID":"1" ,"ScreenName":"INWARD", "ScreenId":"GE2"},
                                {"ID":"2" ,"ScreenName":"OUTWARD", "ScreenId":"GE7"},
                                {"ID":"3" ,"ScreenName":"RGP_NRGP", "ScreenId":"GE14"},
                                {"ID":"4" ,"ScreenName":"GATECLOSE", "ScreenId":"GE22"},
                                {"ID":"5" ,"ScreenName":"VEHICLEDETAILS", "ScreenId":"GE23"},
                                {"ID":"6" ,"ScreenName":"APPROVE", "ScreenId":"GE25"}]

                let TransAppTotal = [
                                {"TransScreenId":"GE1", "ModuleId":"GE1", "ModuleName":"Home"},
                                {"TransScreenId":"GE2", "ModuleId":"GE2", "ModuleName":"INWARD"},
                                {"TransScreenId":"GE3", "ModuleId":"GE2", "ModuleName":"INWARD"},
                                {"TransScreenId":"GE4", "ModuleId":"GE2", "ModuleName":"INWARD"},
                                {"TransScreenId":"GE5", "ModuleId":"GE2", "ModuleName":"INWARD"},
                                {"TransScreenId":"GE6", "ModuleId":"GE2", "ModuleName":"INWARD"},
                                {"TransScreenId":"GE7", "ModuleId":"GE7", "ModuleName":"OUTWARD"},
                                {"TransScreenId":"GE8", "ModuleId":"GE7", "ModuleName":"OUTWARD"},
                                {"TransScreenId":"GE9", "ModuleId":"GE7", "ModuleName":"OUTWARD"},
                                {"TransScreenId":"GE10", "ModuleId":"GE7", "ModuleName":"OUTWARD"},
                                {"TransScreenId":"GE11", "ModuleId":"GE7", "ModuleName":"OUTWARD"},
                                {"TransScreenId":"GE12", "ModuleId":"GE7", "ModuleName":"OUTWARD"},
                                {"TransScreenId":"GE13", "ModuleId":"GE7", "ModuleName":"OUTWARD"},
                                {"TransScreenId":"GE14", "ModuleId":"GE14", "ModuleName":"RGP_NRGP"},
                                {"TransScreenId":"GE15", "ModuleId":"GE14", "ModuleName":"RGP_NRGP"},
                                {"TransScreenId":"GE16", "ModuleId":"GE14", "ModuleName":"RGP_NRGP"},
                                {"TransScreenId":"GE17", "ModuleId":"GE14", "ModuleName":"RGP_NRGP"},
                                {"TransScreenId":"GE18", "ModuleId":"GE14", "ModuleName":"RGP_NRGP"},
                                {"TransScreenId":"GE19", "ModuleId":"GE14", "ModuleName":"RGP_NRGP"},
                                {"TransScreenId":"GE20", "ModuleId":"GE14", "ModuleName":"RGP_NRGP"},
                                {"TransScreenId":"GE21", "ModuleId":"GE2", "ModuleName":"INWARD"},
                                {"TransScreenId":"GE22", "ModuleId":"GE22", "ModuleName":"GATECLOSE"},
                                {"TransScreenId":"GE23", "ModuleId":"GE23", "ModuleName":"VEHICLEDETAILS"},
                                {"TransScreenId":"GE24", "ModuleId":"", "ModuleName":""},
                                {"TransScreenId":"GE25", "ModuleId":"GE25", "ModuleName":"APPROVE"},
                                ];
                
                    for (let i=0; i < ModuleTab.length; i++){
                        ModuleList.push({
                            UserId:UserID,
                            UserName:UserName,
                            UserStatus:"active",
                            ScreenId:ModuleTab[i].ScreenId,
                            ScreenName:ModuleTab[i].ScreenName,
                            Status:"false",
                            ID:ModuleTab[i].ID,
                            PostingDate:this.CurrentDatepost,
                        });

                    }

                    for(let i=0; i< TransAppTotal.length; i++){
                        MandatoryListData.push({            
                            ReferenceDocument:"false",
                            ReferenceDocumentType:"false",
                            Plant:"false",
                            Supplier:"false",
                            SupplierType:"false",
                            Customer:"false",
                            CustomerType:"false",
                            EWayBill:"false",
                            GateEntryDate:"false",
                            VehicleType:"false",
                            VehicleNo:"false",
                            InvoiceNo:"false",
                            InvoiceDate:"false",
                            Transporter:"false",
                            TransporterMode:"false",
                            LRNo:"false",
                            LRDate:"false",
                            GrossWeight:"false",
                            TareWeight:"false",
                            NetWeight:"false",
                            Remarks:"false",
                            PurchaseOrderNo:"false",
                            DeliveryDocumentNo:"false",
                            SalesReturnNo:"false",
                            CustomerReturnNo:"false",
                            UserId:UserID,
                            UserName:UserName,
                            UserStatus:"active",
                            ModuleId:TransAppTotal[i].ModuleId,
                            ModuleName:TransAppTotal[i].ModuleName,
                            ModuleStatus:"active",
                            AppId:TransAppTotal[i].TransScreenId,
                            AppName:"",
                            AppStatus:"active",
                            Status:"false",
                            PostingDate:this.CurrentDatepost,
                            NoOfPackages:"false",
                            Requestor:"false",
                            defaultapprove:"false",
                            ChallanNo:"false",
                            ChallanDate:null,
                            })
                    }

                    TransAppList.push({
                        GE1:"false",
                        GE2:"false",
                        GE3:"false",
                        GE4:"false",
                        GE5:"false",
                        GE6:"false",
                        GE7:"false",
                        GE8:"false",
                        GE9:"false",
                        GE10:"false",
                        GE11:"false",
                        GE12:"false",
                        GE13:"false",
                        GE14:"false",
                        GE15:"false",
                        GE16:"false",
                        GE17:"false",
                        GE18:"false",
                        GE19:"false",
                        GE20:"false",
                        GE21:"false",
                        GE22:"false",
                        GE23:"false",
                        GE24:"false",
                        GE25:"false",
                        UserId:UserID,
                        UserName:UserName,
                        UserStatus:"active",
                        ModuleCode:"GE2",
                        ModuleName:"GE2",
                        ModuleStatus:"active",
                        PostingDate:this.CurrentDatepost,
                        })

                    UserEntry.UserId = UserID;
                    UserEntry.UserName = UserName;
                    UserEntry.Status = "active";
                    UserEntry.to_MODULE_NAV_TAB = ModuleList;
                    UserEntry.to_TRANSACTIONAL_APP_ASSIGN = TransAppList;
                    UserEntry.to_MANDATORY_FIELD_ASSIGN = MandatoryListData;

                    console.log("UserEntry:", UserEntry)

                    var oModel = this.getView().getModel("YY1_ZGE_GATEPASS_USER_TABL_CDS");
                    var that = this;
            
                    oModel.create("/YY1_ZGE_GATEPASS_USER_TABL", UserEntry, {
                        success: function(oData, oResponse) {
                            console.log("oData;", oData);
                            MessageBox.show(UserName+" ("+UserID+" ) activated...")

                            that.getView().byId("id_activate_user").setVisible(false);
                            that.getView().byId("id_deactivate_user").setVisible(true);
                            that.getView().byId("id_activate_user_text").setVisible(false);
                            that.getView().byId("id_deactivate_user_text").setVisible(true);

                            that.getView().byId("id_save").setVisible(false);
                            that.getView().byId("id_add_assign_screen").setVisible(true);
                            that.getView().byId("iconTabBar").setVisible(true);
                            that.getView().byId("id_cancel").setVisible(false);

                            // that.JSonModel001 = new sap.ui.model.json.JSONModel({
                            //     Datas: aItems
                            // });
                            // that.getView().setModel(that.JSonModel001, "ScreenModel");
                            
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function(oError) {
                            console.error("Error creating data:", oError);
                            MessageBox.show("Error...")

                            that.getView().byId("id_activate_user").setVisible(true);
                            that.getView().byId("id_deactivate_user").setVisible(false);
                            that.getView().byId("id_activate_user_text").setVisible(true);
                            that.getView().byId("id_deactivate_user_text").setVisible(false);

                            that.getView().byId("id_save").setVisible(false);
                            that.getView().byId("id_add_assign_screen").setVisible(false);
                            that.getView().byId("iconTabBar").setVisible(true);
                            that.getView().byId("id_cancel").setVisible(false);

                            that.getView().byId("GE2_INWARD").setVisible(false)
                            that.getView().byId("GE2_INWARD_PANEL01").setVisible(false)
                            that.getView().byId("GE2_INWARD_PANEL02").setVisible(false)
                            that.getView().byId("GE2_INWARD_PANEL03").setVisible(false)
                            that.getView().byId("GE2_INWARD_PANEL04").setVisible(false)
                            that.getView().byId("GE2_INWARD_PANEL05").setVisible(false)
                            that.getView().byId("GE7_OUTWARD").setVisible(false)
                            that.getView().byId("GE7_OUTWARD_PANEL01").setVisible(false)
                            that.getView().byId("GE7_OUTWARD_PANEL02").setVisible(false)
                            that.getView().byId("GE7_OUTWARD_PANEL03").setVisible(false)
                            that.getView().byId("GE7_OUTWARD_PANEL04").setVisible(false)
                            that.getView().byId("GE7_OUTWARD_PANEL05").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP_PANEL01").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP_PANEL02").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP_PANEL03").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP_PANEL04").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP_PANEL05").setVisible(false)

                            sap.ui.core.BusyIndicator.hide();
                        }
                    });

            }, 

            OnSwtichChangeModule:function(oEvent){

                sap.ui.core.BusyIndicator.show();

                // Get the Switch control that triggered the event
                var oSwitch = oEvent.getSource();

                // Get the new state of the Switch control
                var bState = (oSwitch.getState()).toString();

                // Get the parent ColumnListItem of the Switch control
                var oColumnListItem = oSwitch.getParent();

                // Get the cells within the ColumnListItem
                var aCells = oColumnListItem.getCells();

                // Access the text values from the cells
                var sScreenName = aCells[0].getText(); // Assuming the ScreenName is in the first cell
                var sScreenId = aCells[1].getText(); // Assuming the ScreenName is in the first cell
                var GetSAPUUID = aCells[4].getValue(); // Assuming the ScreenCode is in the second cell

                // Log the values
                console.log("ScreenName:", sScreenName);
                console.log("GetSAPUUID:", GetSAPUUID);
                console.log("bState:", bState);
                console.log("sScreenId:", sScreenId);

                let ModuleData = {
                    Status: bState
                };

                var that = this;

                var oModel_Module = this.getView().getModel("YY1_ZGE_GATEPASS_USER_TABL_CDS");
                oModel_Module.setHeaders({
                    "X-Requested-With": "X",
                    "Content-Type": "application/json"
                });

                oModel_Module.update("/YY1_MODULE_NAV_TAB_ZGE_GATEPAS(guid'" + GetSAPUUID + "')", ModuleData, {
                    success: function(data) {
                    console.log("Item Updated:", data);

                        if(sScreenId === "GE2" && bState === "true"){
                            that.getView().byId("GE2_INWARD").setVisible(true)
                            that.getView().byId("GE2_INWARD_PANEL01").setVisible(true)
                            that.getView().byId("GE2_INWARD_PANEL02").setVisible(true)
                            that.getView().byId("GE2_INWARD_PANEL03").setVisible(true)
                            that.getView().byId("GE2_INWARD_PANEL04").setVisible(true)
                            that.getView().byId("GE2_INWARD_PANEL05").setVisible(true)
                        }else if(sScreenId === "GE2" && bState === "false"){
                            that.getView().byId("GE2_INWARD").setVisible(false)
                            that.getView().byId("GE2_INWARD_PANEL01").setVisible(false)
                            that.getView().byId("GE2_INWARD_PANEL02").setVisible(false)
                            that.getView().byId("GE2_INWARD_PANEL03").setVisible(false)
                            that.getView().byId("GE2_INWARD_PANEL04").setVisible(false)
                            that.getView().byId("GE2_INWARD_PANEL05").setVisible(false)
                        }

                        if(sScreenId === "GE7" && bState === "true"){
                            that.getView().byId("GE7_OUTWARD").setVisible(true)
                            that.getView().byId("GE7_OUTWARD_PANEL01").setVisible(true)
                            that.getView().byId("GE7_OUTWARD_PANEL02").setVisible(true)
                            that.getView().byId("GE7_OUTWARD_PANEL03").setVisible(true)
                            that.getView().byId("GE7_OUTWARD_PANEL04").setVisible(true)
                            that.getView().byId("GE7_OUTWARD_PANEL05").setVisible(true)
                        }else if(sScreenId === "GE7" && bState === "false"){
                            that.getView().byId("GE7_OUTWARD").setVisible(false)
                            that.getView().byId("GE7_OUTWARD_PANEL01").setVisible(false)
                            that.getView().byId("GE7_OUTWARD_PANEL02").setVisible(false)
                            that.getView().byId("GE7_OUTWARD_PANEL03").setVisible(false)
                            that.getView().byId("GE7_OUTWARD_PANEL04").setVisible(false)
                            that.getView().byId("GE7_OUTWARD_PANEL05").setVisible(false)
                        }

                        if(sScreenId === "GE14" && bState === "true"){
                            that.getView().byId("GE14_RGP_NRGP").setVisible(true)
                            that.getView().byId("GE14_RGP_NRGP_PANEL01").setVisible(true)
                            that.getView().byId("GE14_RGP_NRGP_PANEL02").setVisible(true)
                            that.getView().byId("GE14_RGP_NRGP_PANEL03").setVisible(true)
                            that.getView().byId("GE14_RGP_NRGP_PANEL04").setVisible(true)
                            that.getView().byId("GE14_RGP_NRGP_PANEL05").setVisible(true)
                        }else if(sScreenId === "GE14" && bState === "false"){
                            that.getView().byId("GE14_RGP_NRGP").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP_PANEL01").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP_PANEL02").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP_PANEL03").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP_PANEL04").setVisible(false)
                            that.getView().byId("GE14_RGP_NRGP_PANEL05").setVisible(false)
                        }

                    sap.ui.core.BusyIndicator.hide();
                    },
                    error: function(error) {
                    console.error("Error updating item:", error);
                    sap.ui.core.BusyIndicator.hide();
                    }
                });
                
            },

            
            OnTRansAppSwitch : function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                try {
                    var GetState = (oEvent.getParameter("state")).toString();
                    var oSwitch = oEvent.getSource();
                    var aCustomData = oSwitch.getCustomData();
                    let GetTransAppCode = (aCustomData[0].getKey()).toString();
                    let GetSAPUUID = (aCustomData[0].getValue()).toString();
    
                    console.log("GetKey:", GetTransAppCode)
                    console.log("GetValue:", GetSAPUUID)
                    console.log("GetState:", GetState)

                    let ModuleData = {}
                        ModuleData[GetTransAppCode] = GetState;
                    console.log("ModuleData;",ModuleData)
                    var that = this;

                    var oModel_Module = that.getView().getModel("YY1_ZGE_GATEPASS_USER_TABL_CDS");
                    oModel_Module.setHeaders({
                        "X-Requested-With": "X",
                        "Content-Type": "application/json"
                    });

                    oModel_Module.update("/YY1_TRANSACTIONAL_APP_ASSIGN_Z(guid'" + GetSAPUUID + "')", ModuleData, {
                        success: function(data) {
                        console.log("Item Updated:", data);
                        sap.ui.core.BusyIndicator.hide();
                        },
                        error: function(error) {
                        console.error("Error updating item:", error);
                        sap.ui.core.BusyIndicator.hide();
                        }
                    });

                }
                catch(err){
                    console.log("err:", err)
                    sap.ui.core.BusyIndicator.hide();
                }

            },

            
            OnCheckBoxSelect : function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                try {
                    var oCheckBox = oEvent.getSource();
                    var oCheckBoxStatus = (oCheckBox.getSelected()).toString();
                    var aCustomData = oCheckBox.getCustomData();
                    let GetTransAppCode = (aCustomData[0].getKey()).toString();
                    let GetSAPUUID = (aCustomData[0].getValue()).toString();
    
                    console.log("GetKey:", GetTransAppCode)
                    console.log("GetValue:", GetSAPUUID)
                    console.log("GetState:", oCheckBoxStatus)

                    let ModuleData = {}
                        ModuleData[GetTransAppCode] = oCheckBoxStatus;
                    console.log("ModuleData;",ModuleData)
                    var that = this;

                    var oModel_Module = that.getView().getModel("YY1_ZGE_GATEPASS_USER_TABL_CDS");
                    oModel_Module.setHeaders({
                        "X-Requested-With": "X",
                        "Content-Type": "application/json"
                    });

                    oModel_Module.update("/YY1_MANDATORY_FIELD_ASSIGN_ZGE(guid'" + GetSAPUUID + "')", ModuleData, {
                        success: function(data) {
                        console.log("Item Updated:", data);
                        sap.ui.core.BusyIndicator.hide();
                        },
                        error: function(error) {
                        console.error("Error updating item:", error);
                        sap.ui.core.BusyIndicator.hide();
                        }
                    });

                }
                catch(err){
                    console.log("err:", err)
                    sap.ui.core.BusyIndicator.hide();
                }

            },


            
            OnCancel:function(){
                console.log("this.JSonModel001:",this.JSonModel001);

            },

        });
    });
