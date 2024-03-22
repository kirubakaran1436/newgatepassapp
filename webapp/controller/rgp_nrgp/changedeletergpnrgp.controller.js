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

        return Controller.extend("gatepassapp.controller.rgp_nrgp.changedeletergpnrgp", {
            onInit: function () {

            },

            OnRGPNRGPSuggest:function(oEvent){
                sap.ui.core.BusyIndicator.show();
                var oItem = oEvent.getParameter("selectedItem");
                var GetKey = oItem ? oItem.getKey() : "";
                var GetValue = oItem ? oItem.getText() : "";

                // Do something with key and text values
                console.log( oItem);
                console.log("Selected Key:", GetKey);
                console.log("Selected Text:", GetValue);
                
                var filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, GetKey);
                var model0 = this.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                var that = this;
                model0.read("/YY1_ZRGP_NRGP_HEAD", {
                    filters: [filter], 
                    success: function (ODat, oRespons) {
                        var value11 = ODat.results[0];  
                        var SAPUIID = value11.SAP_UUID;
                        var Status = value11.Status;
                        var RGPNRGPl = value11.GatePassType;
                        var NRStatus = value11.NRStatus;
                        var SAP_CreatedDateTime = value11.SAP_CreatedDateTime;

                        var GateType = value11.GateType;
                        console.log("GateType", GateType)
                        if (GateType === "With Code") {
                            console.log("Setting 'With Code'");
                            that.getView().byId("RB3-1").setSelected(true);
                            that.getView().byId("RB3-2").setSelected(false);
                            that.getView().byId("id_product_i1").setWidth("11rem");
                            that.getView().byId("id_productname_i1").setVisible(true);
                            that.getView().byId("id_productname_i2").setVisible(false);
                            that.getView().byId("id_quantity_i1").setVisible(true);
                            that.getView().byId("id_quantity_i2").setVisible(false);
                            that.getView().byId("id_uom_i1").setVisible(true);
                            that.getView().byId("id_uom_i2").setVisible(false);
                            // that.getView().byId("id_value_i1").setVisible(true);
                            // that.getView().byId("id_value_i2").setVisible(false);
                            
                        } else if (GateType === "Without Code") {
                            console.log("Setting 'Without Code'");
                            that.getView().byId("RB3-1").setSelected(false);
                            that.getView().byId("RB3-2").setSelected(true);
                            that.getView().byId("id_product_i1").setWidth("0rem");
                            that.getView().byId("id_productname_i1").setVisible(false);
                            that.getView().byId("id_productname_i2").setVisible(true);
                            that.getView().byId("id_quantity_i1").setVisible(false);
                            that.getView().byId("id_quantity_i2").setVisible(true);
                            that.getView().byId("id_uom_i1").setVisible(false);
                            that.getView().byId("id_uom_i2").setVisible(true);
                            // that.getView().byId("id_value_i1").setVisible(false);
                            // that.getView().byId("id_value_i2").setVisible(true);
                        }

                        var rgpSelectBox = that.getView().byId("id_rgpnrgp_h");
                        var transporttype = that.getView().byId("id_transporttype_h");
                        var vehicletype = that.getView().byId("id_vehicletype_h");

                        if(RGPNRGPl === "RGP"){
                            that.getView().byId("id_duedate_visible").setWidth("11rem")
                            that.getView().byId("id_dispatchdate_visible").setWidth(".1rem")
                            rgpSelectBox.setSelectedKey("RGP");
                            
                        }else if(RGPNRGPl === "NRGP"){
                            that.getView().byId("id_dispatchdate_visible").setWidth("11rem")
                            that.getView().byId("id_duedate_visible").setWidth(".1rem")
                            rgpSelectBox.setSelectedKey("NRGP");
                        }

                        that.getView().byId("id_gateentrystatus").setText(Status);
                        that.getView().byId("id_gateentrystatus").setVisible(true);

                        if(Status === "created"){
                            if(NRStatus === ""){
                                that.getView().byId("id_gateentrystatus").setStatus("Success");
                                that.getView().byId("id_update_button").setVisible(true);
                                that.getView().byId("id_reject_button").setVisible(true);
    
                                that.getView().byId("DeleteIndicId").setVisible(false); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(true); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(true); 
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);
                            }else{
                                that.getView().byId("id_gateentrystatus").setStatus("Error");
                                that.getView().byId("id_update_button").setVisible(false);
                                that.getView().byId("id_reject_button").setVisible(false);
                                that.getView().byId("DeleteIndicId").setVisible(false); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false); 
                            }

                        }else if(Status === "deleted") {
                            that.getView().byId("id_gateentrystatus").setStatus("Error");
                            that.getView().byId("id_update_button").setVisible(false);
                            that.getView().byId("id_reject_button").setVisible(false);

                            that.getView().byId("DeleteIndicId").setVisible(true); 
                            that.getView().byId("id_update_button").setVisible(false); 
                            that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                            that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false); 
                            that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(true); 
                            that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(true); 

                        }else if(Status === "approved"){
                            that.getView().byId("id_gateentrystatus").setStatus("Success");
                            that.getView().byId("id_update_button").setVisible(false);
                            that.getView().byId("id_reject_button").setVisible(false);
                            that.getView().byId("DeleteIndicId").setVisible(false); 
                            that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                            that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false); 

                        }else if(Status === "rejected" || Status === "completed" || Status === "closed" || NRStatus !== ""){
                            that.getView().byId("id_gateentrystatus").setStatus("Error");
                            that.getView().byId("id_update_button").setVisible(false);
                            that.getView().byId("id_reject_button").setVisible(false);
                            that.getView().byId("DeleteIndicId").setVisible(false); 
                            that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                            that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false); 

                        }


                        that.getView().byId("id_sapuuid_h").setValue(value11.SAP_UUID);
                        that.getView().byId("id_plantcode_h").setValue(value11.PlantCode);
                        that.getView().byId("id_plantname_h").setValue(value11.PlantName);
                        that.getView().byId("id_suppliercode_h").setValue(value11.SupplierCode);
                        that.getView().byId("id_suppliername_h").setValue(value11.SupplierName);
                        that.getView().byId("id_customercode_h").setValue(value11.CustomerCode);
                        that.getView().byId("id_customername_h").setValue(value11.CustomerName);
                        that.getView().byId("id_requestor_h").setValue(value11.Requestor);
                        that.getView().byId("id_valueininr_h").setValue(value11.ValueInINR);
                        that.getView().byId("id_purchasematerialdoc_h").setValue(value11.ReferenceDocumentNo);
                        that.getView().byId("id_vehicleno_h").setValue(value11.VehicleNo);
                        that.getView().byId("id_remark_h").setValue(value11.Remarks);  
                        that.getView().byId("id_tablestatus_h").setValue(value11.GateType);  
                        that.getView().byId("id_gatepassdate_h").setValue(value11.SAP_CreatedDateTime);  
                        transporttype.setSelectedKey(value11.TransporterMode); 
                        vehicletype.setSelectedKey(value11.VehicleType); 
                        
                        // if(Status === "deleted"){
                        //     that.getView().byId("DeleteIndicId").setVisible(true); 
                        //     that.getView().byId("id_update_button").setVisible(false); 
                        //     that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                        //     that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false); 
                        //     that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(true); 
                        //     that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(true); 
                        // }else{
                        //     that.getView().byId("DeleteIndicId").setVisible(false); 
                        //     that.getView().byId("id_update_button").setVisible(true); 
                        //     that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(true); 
                        //     that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(true); 
                        //     that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
                        //     that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);
                        // }

                        model0.read("/YY1_ZRGP_NRGP_HEAD(guid'" + SAPUIID + "')/to_ITEMS", {
                            success: function (oData) {
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                data: oData.results
                            });
                            that.getView().setModel(oJSONModel, "JModel");
                            sap.ui.core.BusyIndicator.hide();
                            },
                            error: function (oError) {
                                console.log(oError);
                                sap.ui.core.BusyIndicator.hide();
                                }
                        });
                    }
    
                });
            },

            OnRGPNRGPFragOpen:function(oEvent){
                if (!this._dialog_RGPNRGP) {
                    this._dialog_RGPNRGP = sap.ui.xmlfragment(this.getView().getId("RGPNRGP_dialog"), "gatepassapp.view.rgp_nrgp.fragment.rgpnrgp", this);
                    this.getView().addDependent(this._dialog_RGPNRGP);
                }
                this._dialog_RGPNRGP.open();
            },
    
            OnRGPNRGPSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Id", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },

            OnRGPNRGPSelect : function (oEvent) {
                sap.ui.core.BusyIndicator.show();
    
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
    
                var aContexts = oEvent.getParameter("selectedContexts");
    
                if (aContexts === undefined){
                    console.log("undefined");
                    // let Dataa = this.getView().byId("id_rgpnrgp_h").getValue();
                    // if(Dataa === ""){
                    //     this.getView().byId("Final_Update_Button").setEnabled(false);
                    //     this.getView().byId("Final_Delete_Button").setEnabled(false);
                    //     this.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
                    // }
                    sap.ui.core.BusyIndicator.hide();
                    
                }else{
    
                    var value1, value2;
    
                    if (aContexts && aContexts.length) {
        
                        aContexts.map(function (oContext) {
                            value1 = oContext.getObject().Id;
                            value2 = oContext.getObject().SAP_UUID;
                            return;
                        });
                        this.getView().byId("id_gateentryno_h").setValue(value1);
                        this.getView().byId("id_sapuuid_h").setValue(value2);

                    }
        
                    var filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, value1);
                    var model0 = this.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                    var that = this;
                    model0.read("/YY1_ZRGP_NRGP_HEAD", {
                        filters: [filter], 
                        success: function (ODat, oRespons) {
                            var value11 = ODat.results[0];  
                            var SAPUIID = value11.SAP_UUID;
                            var Status = value11.Status;
                            var RGPNRGPl = value11.GatePassType;
                            var NRStatus = value11.NRStatus;

                            var GateType = value11.GateType;
                            console.log("GateType", GateType)
                            if (GateType === "With Code") {
                                console.log("Setting 'With Code'");
                                that.getView().byId("RB3-1").setSelected(true);
                                that.getView().byId("RB3-2").setSelected(false);
                                that.getView().byId("id_product_i1").setWidth("11rem");
                                that.getView().byId("id_productname_i1").setVisible(true);
                                that.getView().byId("id_productname_i2").setVisible(false);
                                that.getView().byId("id_quantity_i1").setVisible(true);
                                that.getView().byId("id_quantity_i2").setVisible(false);
                                that.getView().byId("id_uom_i1").setVisible(true);
                                that.getView().byId("id_uom_i2").setVisible(false);
                                // that.getView().byId("id_value_i1").setVisible(true);
                                // that.getView().byId("id_value_i2").setVisible(false);
                                
                            } else if (GateType === "Without Code") {
                                console.log("Setting 'Without Code'");
                                that.getView().byId("RB3-1").setSelected(false);
                                that.getView().byId("RB3-2").setSelected(true);
                                that.getView().byId("id_product_i1").setWidth("0rem");
                                that.getView().byId("id_productname_i1").setVisible(false);
                                that.getView().byId("id_productname_i2").setVisible(true);
                                that.getView().byId("id_quantity_i1").setVisible(false);
                                that.getView().byId("id_quantity_i2").setVisible(true);
                                that.getView().byId("id_uom_i1").setVisible(false);
                                that.getView().byId("id_uom_i2").setVisible(true);
                                // that.getView().byId("id_value_i1").setVisible(false);
                                // that.getView().byId("id_value_i2").setVisible(true);
                            }

                            var rgpSelectBox = that.getView().byId("id_rgpnrgp_h");
                            var transporttype = that.getView().byId("id_transporttype_h");
                            var vehicletype = that.getView().byId("id_vehicletype_h");

                            if(RGPNRGPl === "RGP"){
                                that.getView().byId("id_duedate_visible").setWidth("11rem")
                                that.getView().byId("id_dispatchdate_visible").setWidth(".1rem")
                                rgpSelectBox.setSelectedKey("RGP");
                                
                            }else if(RGPNRGPl === "NRGP"){
                                that.getView().byId("id_dispatchdate_visible").setWidth("11rem")
                                that.getView().byId("id_duedate_visible").setWidth(".1rem")
                                rgpSelectBox.setSelectedKey("NRGP");
                            }

                            that.getView().byId("id_gateentrystatus").setText(Status);
                            that.getView().byId("id_gateentrystatus").setVisible(true);
    
                            if(Status === "created"){
                                that.getView().byId("id_gateentrystatus").setStatus("Success");
                            }else if(Status === "deleted") {
                                that.getView().byId("id_gateentrystatus").setStatus("Error");
                            }else if(Status === "approved"){
                                that.getView().byId("id_gateentrystatus").setStatus("Success");
                            }else if(Status === "rejected"){
                                that.getView().byId("id_gateentrystatus").setStatus("Error");
                            }
    
    
                            that.getView().byId("id_plantcode_h").setValue(value11.PlantCode);
                            that.getView().byId("id_plantname_h").setValue(value11.PlantName);
                            that.getView().byId("id_suppliercode_h").setValue(value11.SupplierCode);
                            that.getView().byId("id_suppliername_h").setValue(value11.SupplierName);
                            that.getView().byId("id_customercode_h").setValue(value11.CustomerCode);
                            that.getView().byId("id_customername_h").setValue(value11.CustomerName);
                            that.getView().byId("id_requestor_h").setValue(value11.Requestor);
                            that.getView().byId("id_valueininr_h").setValue(value11.ValueInINR);
                            that.getView().byId("id_purchasematerialdoc_h").setValue(value11.ReferenceDocumentNo);
                            that.getView().byId("id_vehicleno_h").setValue(value11.VehicleNo);
                            that.getView().byId("id_remark_h").setValue(value11.Remarks);  
                            that.getView().byId("id_tablestatus_h").setValue(value11.GateType); 
                            that.getView().byId("id_gatepassdate_h").setValue(value11.SAP_CreatedDateTime);  
                            transporttype.setSelectedKey(value11.TransporterMode); 
                            vehicletype.setSelectedKey(value11.VehicleType); 
                            
                            if(Status === "created"){
                                if(NRStatus === ""){
                                    that.getView().byId("id_gateentrystatus").setStatus("Success");
                                    that.getView().byId("id_update_button").setVisible(true);
                                    that.getView().byId("id_reject_button").setVisible(true);
        
                                    that.getView().byId("DeleteIndicId").setVisible(false); 
                                    that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(true); 
                                    that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(true); 
                                    that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
                                    that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);
                                }else{
                                    that.getView().byId("id_gateentrystatus").setStatus("Error");
                                    that.getView().byId("id_update_button").setVisible(false);
                                    that.getView().byId("id_reject_button").setVisible(false);
                                    that.getView().byId("DeleteIndicId").setVisible(false); 
                                    that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                                    that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false); 
                                }
    
                            }else if(Status === "deleted") {
                                that.getView().byId("id_gateentrystatus").setStatus("Error");
                                that.getView().byId("id_update_button").setVisible(false);
                                that.getView().byId("id_reject_button").setVisible(false);
    
                                that.getView().byId("DeleteIndicId").setVisible(true); 
                                that.getView().byId("id_update_button").setVisible(false); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false); 
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(true); 
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(true); 
    
                            }else if(Status === "approved"){
                                that.getView().byId("id_gateentrystatus").setStatus("Success");
                                that.getView().byId("id_update_button").setVisible(false);
                                that.getView().byId("id_reject_button").setVisible(false);
                                that.getView().byId("DeleteIndicId").setVisible(false); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false); 
    
                            }else if(Status === "rejected" || Status === "completed" || Status === "closed" || NRStatus !== ""){
                                that.getView().byId("id_gateentrystatus").setStatus("Error");
                                that.getView().byId("id_update_button").setVisible(false);
                                that.getView().byId("id_reject_button").setVisible(false);
                                that.getView().byId("DeleteIndicId").setVisible(false); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false); 
    
                            }
    
                            model0.read("/YY1_ZRGP_NRGP_HEAD(guid'" + SAPUIID + "')/to_ITEMS", {
                                success: function (oData) {
                                var oJSONModel = new sap.ui.model.json.JSONModel({
                                    data: oData.results
                                });
                                that.getView().setModel(oJSONModel, "JModel");
                                sap.ui.core.BusyIndicator.hide();
                                },
                                error: function (oError) {
                                    console.log(oError);
                                    sap.ui.core.BusyIndicator.hide();
                                    }
                            });
                        }
        
                    });
            
                }
                
            },

            OnGatePassType:function(oEvent){

                let Value = oEvent.oSource.getSelectedItem().getText();
                if(Value === "NRGP"){
                    this.getView().byId("id_dispatchdate_visible").setWidth("11rem")
                    this.getView().byId("id_duedate_visible").setWidth("0rem")
                    // this.count = 1;

                    // this.mModel = new sap.ui.model.json.JSONModel({
                    //     Samples : [{
                    //         ItemNo:this.count, 
                    //         Product:"" , 
                    //         ProductName:"" , 
                    //         Quantity:"" , 
                    //         UOM:"" , 
                    //         DueDate:this.CurrentDate, 
                    //         DispatchDate:this.CurrentDate, 
                    //         Value:"" , 
                    //         Remark:"" , 
                    //         MinDate: new Date()
                            
                    //     }]	
                    //     });
                    // this.getView().setModel(this.mModel, "mModel");
                }else{
                    this.getView().byId("id_dispatchdate_visible").setWidth("0rem")
                    this.getView().byId("id_duedate_visible").setWidth("11rem")
                    // this.count = 1;
                    // this.mModel = new sap.ui.model.json.JSONModel({
                    //     Samples : [{
                    //         ItemNo:this.count, 
                    //         Product:"" , 
                    //         ProductName:"" , 
                    //         Quantity:"" , 
                    //         UOM:"" , 
                    //         DueDate:this.CurrentDate, 
                    //         DispatchDate:this.CurrentDate, 
                    //         Value:"" , 
                    //         Remark:"" , 
                    //         MinDate: new Date()
                            
                    //     }]	
                    //     });
                    // this.getView().setModel(this.mModel, "mModel");
                }
                
                           
                
            },


                        //  ---------------- Start Plant Fragment & Suggestion Box -----------------------------
            
                        OnPlantSuggest:function(oEvent){ // Suggestion FUnction for Plant
                            sap.ui.core.BusyIndicator.show();
                            var oItem = oEvent.getParameter("selectedItem");
                            var GetKey = oItem ? oItem.getKey() : "";
                            var GetValue = oItem ? oItem.getText() : "";
            
                                // Do something with key and text values
                                console.log( oItem);
                                console.log("Selected Key:", GetKey);
                                console.log("Selected Text:", GetValue);
                            
                            this.byId("id_plantcode_h").setValue(GetValue);
                            this.byId("id_plantname_h").setValue(GetKey);
                            sap.ui.core.BusyIndicator.hide();
            
                        },
            
                        
                        OnPlantFragOpen:function(oEvent){ // Plant Fragment Open
                            console.log("Working")
                            if(!this._dialog_plant){
                                this._dialog_plant = sap.ui.xmlfragment(this.getView().getId("Plant_dialog"), "gatepassapp.view.rgp_nrgp.fragment.plant", this);
                                this.getView().addDependent(this._dialog_plant);
                            }
            
                            this._dialog_plant.open()
                        },
            
                        OnPlantSearch:function(oEvent){
                            let sValue = oEvent.getParameter("value");
                            let oFilter = new Filter("Plant", FilterOperator.Contains, sValue);
                            let oBinding = oEvent.getSource().getBinding("items");
                            oBinding.filter([oFilter]);
                        },
                        
                        OnPlantSelect:function(oEvent){
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
                                        value1 = oContext.getObject().Plant;
                                        value2 = oContext.getObject().PlantName;
                                        return;
                                    });
                                    this.byId("id_plantcode_h").setValue(value1);
                                    this.byId("id_plantname_h").setValue(value2);
                                    sap.ui.core.BusyIndicator.hide();
                                }
                            }
                        },
            
                    //  ---------------- End Plant Fragment & Suggestion Box -----------------------------
        //  ---------------- Start Supplier Fragment & Suggestion Box -----------------------------
            
        OnSupplierSuggest:function(oEvent){ // Suggestion Function for Supplier
            sap.ui.core.BusyIndicator.show();
            var oItem = oEvent.getParameter("selectedItem");
            var GetKey = oItem ? oItem.getKey() : "";
            var GetValue = oItem ? oItem.getText() : "";

                // Do something with key and text values
                console.log( oItem);
                console.log("Selected Key:", GetKey);
                console.log("Selected Text:", GetValue);
            
            this.byId("id_suppliercode_h").setValue(GetValue);
            this.byId("id_suppliername_h").setValue(GetKey);
            sap.ui.core.BusyIndicator.hide();

        },

        
        OnSupplierFragOpen:function(oEvent){ // Supplier Fragment Open
            console.log("Working")
            if(!this._dialog_supplier){
                this._dialog_supplier = sap.ui.xmlfragment(this.getView().getId("Supplier_dialog"), "gatepassapp.view.rgp_nrgp.fragment.supplier", this);
                this.getView().addDependent(this._dialog_supplier);
            }
            this._dialog_supplier.open()
        },

        OnSupplierSearch:function(oEvent){
            let sValue = oEvent.getParameter("value");
            let oFilter = new Filter("Supplier", FilterOperator.Contains, sValue);
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },
        
        OnSupplierSelect:function(oEvent){
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
                        value1 = oContext.getObject().Supplier;
                        value2 = oContext.getObject().SupplierName;
                        return;
                    });
                    this.byId("id_suppliercode_h").setValue(value1);
                    this.byId("id_suppliername_h").setValue(value2);
                    sap.ui.core.BusyIndicator.hide();
                }
            }
        },

    //  ---------------- End Supplier Fragment & Suggestion Box -----------------------------

    //  ---------------- Start Customer Fragment & Suggestion Box -----------------------------
        
        OnCustomerSuggest:function(oEvent){ // Suggestion FUnction for Customer
            sap.ui.core.BusyIndicator.show();
            var oItem = oEvent.getParameter("selectedItem");
            var GetKey = oItem ? oItem.getKey() : "";
            var GetValue = oItem ? oItem.getText() : "";

                // Do something with key and text values
                console.log( oItem);
                console.log("Selected Key:", GetKey);
                console.log("Selected Text:", GetValue);
            
            this.byId("id_customercode_h").setValue(GetValue);
            this.byId("id_customername_h").setValue(GetKey);
            sap.ui.core.BusyIndicator.hide();

        },

        
        OnCustomerFragOpen:function(oEvent){ // Customer Fragment Open
            console.log("Working")
            if(!this.dialog_customer){
                this.dialog_customer = sap.ui.xmlfragment(this.getView().getId("Customer_dialog"), "gatepassapp.view.rgp_nrgp.fragment.customer", this);
                this.getView().addDependent(this.dialog_customer);
            }
            this.dialog_customer.open()
        },

        OnCustomerSearch:function(oEvent){
            let sValue = oEvent.getParameter("value");
            let oFilter = new Filter("Customer", FilterOperator.Contains, sValue);
            let oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },
        
        OnCustomerSelect:function(oEvent){
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
                        value1 = oContext.getObject().Customer;
                        value2 = oContext.getObject().CustomerName;
                        return;
                    });
                    this.byId("id_customercode_h").setValue(value1);
                    this.byId("id_customername_h").setValue(value2);
                    sap.ui.core.BusyIndicator.hide();
                }
            }
        },

    //  ---------------- End Customer Fragment & Suggestion Box -----------------------------

    
            //  ---------------- Start Product Fragment & Suggestion Box -----------------------------
            
            OnProductSuggest:function(oEvent){ // Suggestion FUnction for Product
                sap.ui.core.BusyIndicator.show();
                var oItem = oEvent.getParameter("selectedItem");
                var GetKey = oItem ? oItem.getKey() : "";
                var GetValue = oItem ? oItem.getText() : "";

                    // Do something with key and text values
                    console.log( oItem);
                    console.log("Selected Key:", GetKey);
                    console.log("Selected Text:", GetValue);

                    let Quantity_to_Post_Input = oEvent.getSource().getParent().getCells()[6].getValue(); 

                    var oFilter1 = new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, GetValue);
                    var oModel1 = this.getView().getModel("YY1_ZGE_PRODUCT_CDS"); // Replace with your actual OData model name
                    
                    var oFilters1 = [oFilter1];
                    var that = this;
                    
                    oModel1.read("/YY1_ZGE_PRODUCT", {
                        filters: oFilters1,
                        success: function(oData) {
                            var aItems = oData.results; // The array of read items
                            oEvent.getSource().getParent().getCells()[3].setValue(aItems[0].ProductName)
                            oEvent.getSource().getParent().getCells()[4].setValue("")
                            oEvent.getSource().getParent().getCells()[7].setValue("")
                            oEvent.getSource().getParent().getCells()[5].setValue(aItems[0].BaseUnit)
                            oEvent.getSource().getParent().getCells()[6].setValue(aItems[0].StandardPrice)
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function(oError) {
                            // Handle error
                            console.error("Error reading data: ", oError);
                            sap.ui.core.BusyIndicator.hide();
                        }
                    });                    
                

            },

            
            OnProductFragOpen:function(oEvent){ // Product Fragment Open
                this.valueHelpIndex = oEvent.getSource().getParent();
                console.log("Working")
                if(!this.dialog_product){
                    this.dialog_product = sap.ui.xmlfragment(this.getView().getId("Product_dialog"), "gatepassapp.view.rgp_nrgp.fragment.product", this);
                    this.getView().addDependent(this.dialog_product);
                }
                this.dialog_product.open()
            },

            OnProductSearch:function(oEvent){
                let sValue = oEvent.getParameter("value");
                let oFilter = new Filter("Product", FilterOperator.Contains, sValue);
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },
            
            OnProductSelect : function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);

                var aContexts = oEvent.getParameter("selectedContexts");
                var value1, value2, value3, value4, value5;

                if(aContexts === undefined){
                    console.log("No Item Present");
                    sap.ui.core.BusyIndicator.hide();
                }else{
                    if (aContexts && aContexts.length) {

                        aContexts.map(function (oContext) {
                            value1 = oContext.getObject().Product;
                            value2 = oContext.getObject().ProductName;
                            value3 = oContext.getObject().ProductType;
                            value4 = oContext.getObject().BaseUnit;
                            value5 = oContext.getObject().StandardPrice;
                            return;
                        });

                        this.valueHelpIndex.getCells()[2].setValue(value1);
                        this.valueHelpIndex.getCells()[3].setValue(value2);
                        this.valueHelpIndex.getCells()[5].setValue(value4);
                        this.valueHelpIndex.getCells()[6].setValue(value5);
                        this.valueHelpIndex.getCells()[4].setValue("");
                        this.valueHelpIndex.getCells()[7].setValue("");
                        sap.ui.core.BusyIndicator.hide();
                    }
                }

            },

        //  ---------------- End Customer Fragment & Suggestion Box -----------------------------


        // ----Start Select Items Table Delete
        OnTableRowRemove: function(oEvent) {
            var oTable = this.byId("id_rgpnrgp_table");
            var oTableRows = oTable.getRows();
            var aIndices = this.byId("id_rgpnrgp_table").getSelectedIndices();
            
            for (let i=0; i < oTableRows.length; i++){
                console.log(i);
                aIndices.forEach(function(Index){
                    if ( i === Index){
                        let Visible_Status = oTable.getRows()[Index].getCells()[0].getVisible();
                        if (Visible_Status === false){
                            oTable.getRows()[Index].getCells()[0];
                            oTable.getRows()[Index].getCells()[0].setVisible(true);
                        }
                        if (Visible_Status === true){
                            oTable.getRows()[Index].getCells()[0];
                            oTable.getRows()[Index].getCells()[0].setVisible(false);
                        }
                        
                    }
                });
                
            }
        },


        OnQuantityCheck:function(oEvent){
            let GetQuantity = oEvent.getSource().getParent().getCells()[4].getValue(); 
            let GetValue = oEvent.getSource().getParent().getCells()[6].getValue(); 
            let ValueInINR = this.getView().byId("id_valueininr_h").getValue();
            if(ValueInINR === ""){
                ValueInINR = parseFloat(0.00);
            }else{
                ValueInINR = parseFloat(ValueInINR);
            }

            if(GetQuantity !== "" && GetValue !== ""){
                let SetValue = parseFloat(GetQuantity) * parseFloat(GetValue);
                oEvent.getSource().getParent().getCells()[7].setValue(SetValue.toFixed(2));
                this.getView().byId("id_valueininr_h").setValue((SetValue + ValueInINR).toFixed(2));
            }else{
                oEvent.getSource().getParent().getCells()[7].setValue();
                this.getView().byId("id_valueininr_h").setValue("");
            }

        },

        OnNetPriceCheck:function(oEvent){
            let GetQuantity = oEvent.getSource().getParent().getCells()[4].getValue(); 
            let GetValue = oEvent.getSource().getParent().getCells()[6].getValue(); 
            oEvent.getSource().getParent().getCells()[6].setValue(parseFloat(GetValue).toFixed(2));
            let ValueInINR = this.getView().byId("id_valueininr_h").getValue();
            if(ValueInINR === ""){
                ValueInINR = parseFloat(0.00);
            }else{
                ValueInINR = parseFloat(ValueInINR);
            }

            if(GetQuantity !== "" && GetValue !== ""){
                let SetValue = parseFloat(GetQuantity) * parseFloat(GetValue);
                oEvent.getSource().getParent().getCells()[7].setValue(SetValue.toFixed(2));
                this.getView().byId("id_valueininr_h").setValue((SetValue + ValueInINR).toFixed(2));
            }else{
                oEvent.getSource().getParent().getCells()[7].setValue();
                this.getView().byId("id_valueininr_h").setValue("");
            }

        },

        OnUpdate:async function(){
            sap.ui.core.BusyIndicator.show();
            let GateEntryNo = this.getView().byId("id_gateentryno_h").getValue();
            let SAP_UUID_H = this.getView().byId("id_sapuuid_h").getValue();
            let RGP_NRGP = this.getView().byId("id_rgpnrgp_h").getSelectedItem().getText();
            let PlantCode = this.getView().byId("id_plantcode_h").getValue();
            let PlantName = this.getView().byId("id_plantname_h").getValue();
            let SupplierCode = this.getView().byId("id_suppliercode_h").getValue();
            let SupplierName = this.getView().byId("id_suppliername_h").getValue();
            let CustomerCode = this.getView().byId("id_customercode_h").getValue();
            let CustomerName = this.getView().byId("id_customername_h").getValue();
            let Requestor = this.getView().byId("id_requestor_h").getValue();
            let ValueInINR = this.getView().byId("id_valueininr_h").getValue();
            let PurchaseMaterialDoc = this.getView().byId("id_purchasematerialdoc_h").getValue();
            let TranporterType = this.getView().byId("id_transporttype_h").getSelectedItem().getText();
            let VehicleType = this.getView().byId("id_vehicletype_h").getSelectedItem().getText();
            let VehicleNo = this.getView().byId("id_vehicleno_h").getValue();
            let Remark = this.getView().byId("id_remark_h").getValue();
            let TableSTatuss = this.getView().byId("id_tablestatus_h").getValue();
         
            console.log(GateEntryNo);
            console.log(SAP_UUID_H);
            console.log(RGP_NRGP);
            console.log(PlantCode);
            console.log(PlantName);
            console.log(SupplierCode);
            console.log(SupplierName);
            console.log(CustomerCode);
            console.log(CustomerName);
            console.log(Requestor);
            console.log(ValueInINR);
            console.log(PurchaseMaterialDoc);
            console.log(TranporterType);
            console.log(VehicleType);
            console.log(VehicleNo);
            console.log(Remark);
            console.log(TableSTatuss);
         
            if(PlantCode!=="" && Requestor!=="" && ValueInINR!== "" && VehicleNo !==""){
               
               this.getView().byId("id_rgpnrgp_h").setValueState(sap.ui.core.ValueState.None);
               this.getView().byId("id_rgpnrgp_h").setValueStateText("");
               this.getView().byId("id_plantcode_h").setValueState(sap.ui.core.ValueState.None);
               this.getView().byId("id_plantcode_h").setValueStateText("");
               this.getView().byId("id_requestor_h").setValueState(sap.ui.core.ValueState.None);
               this.getView().byId("id_requestor_h").setValueStateText("");
               this.getView().byId("id_valueininr_h").setValueState(sap.ui.core.ValueState.None);
               this.getView().byId("id_valueininr_h").setValueStateText("");
               this.getView().byId("id_vehicleno_h").setValueState(sap.ui.core.ValueState.None);
               this.getView().byId("id_vehicleno_h").setValueStateText("");                   
         

                     var oEntry1 = {
                        Id : GateEntryNo,
                        GatePassType : RGP_NRGP,
                        Requestor : Requestor,
                        PlantCode : PlantCode,
                        PlantName : PlantName,
                        SupplierCode : SupplierCode,
                        SupplierName : SupplierName,
                        SupplierType : "",
                        CustomerCode : CustomerCode,
                        CustomerName : CustomerName,
                        CustomerType : "",
                        ValueInINR : ValueInINR,
                        VehicleType : VehicleType,
                        VehicleNo : VehicleNo,
                        Transporter : "",
                        TransporterMode : TranporterType,
                        PurchaseOrder : "",
                        MaterialDocument : "",
                        ReferenceDocumentNo : PurchaseMaterialDoc,
                        Remarks : Remark,
                        Status : "created",
                        ApproveStatus : "pending",
                        GateType : TableSTatuss,
                    };
        
                    var that = this;

                    console.log("oEntry1:", oEntry1)
                    await that.ToUpdateItems(oEntry1)
                    
                    var oModel05 = this.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                    oModel05.setHeaders({
                    "X-Requested-With": "X",
                    "Content-Type": "application/json"
                    });
        
                    oModel05.update("/YY1_ZRGP_NRGP_HEAD(guid'" + SAP_UUID_H + "')", oEntry1, {
                    success: function(data) {
                        console.log("Header Updated:", data);
                        sap.ui.core.BusyIndicator.hide();
                        MessageBox.success("Document No " + GateEntryNo + " Updated Successfully", {
                            title: "RGP NRGP",
                            id: "messageBoxId1",
                            contentWidth: "100px",
                        });                    
                        oModel05.refresh(true);
                        var oJSONModel = new sap.ui.model.json.JSONModel({
                            data: {}
                        });
                        that.getView().setModel(oJSONModel, "JModel");

                        that.getView().byId("id_gateentryno_h").setValue("");
                        that.getView().byId("id_gateentryno_h").setSelectedKey("");
                        that.getView().byId("id_sapuuid_h").setValue("");
                        that.getView().byId("id_plantcode_h").setValue("");
                        that.getView().byId("id_plantname_h").setValue("");
                        that.getView().byId("id_suppliercode_h").setValue("");
                        that.getView().byId("id_suppliername_h").setValue("");
                        that.getView().byId("id_customercode_h").setValue("");
                        that.getView().byId("id_customername_h").setValue("");
                        that.getView().byId("id_requestor_h").setValue("");
                        that.getView().byId("id_valueininr_h").setValue("");
                        that.getView().byId("id_purchasematerialdoc_h").setValue("");
                        that.getView().byId("id_vehicleno_h").setValue("");
                        that.getView().byId("id_remark_h").setValue("");

        
                    },
                    error: function(error) {
                        console.error("Error updating header:", error);
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show(" Error")
                    }
                    });        
         
                    
                 }else{
                    sap.ui.core.BusyIndicator.hide();
         
                     if(RGP_NRGP ===""){
                         this.getView().byId("id_rgpnrgp_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_rgpnrgp_h").setValueStateText("Please Select Gate Pass Type");
                     }else{
                         this.getView().byId("id_rgpnrgp_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_rgpnrgp_h").setValueStateText("");

                     }
         
                     if(PlantCode ===""){
                         this.getView().byId("id_plantcode_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_plantcode_h").setValueStateText("Please Select Plant");
                     }else{
                         this.getView().byId("id_plantcode_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_plantcode_h").setValueStateText("");
                     }
         
                     if(Requestor ===""){
                         this.getView().byId("id_requestor_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_requestor_h").setValueStateText("Please Select Requestor");
                     }else{
                         this.getView().byId("id_requestor_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_requestor_h").setValueStateText("");
                     }
         
                     if(ValueInINR ===""){
                         this.getView().byId("id_valueininr_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_valueininr_h").setValueStateText("Please ENter Value In INR");
                     }else{
                         this.getView().byId("id_valueininr_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_valueininr_h").setValueStateText("");
                     }
         
                     if(TranporterType ===""){
                         this.getView().byId("id_transporttype_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_transporttype_h").setValueStateText("Please Select Tranporter Type");
                     }else{
                         this.getView().byId("id_transporttype_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_transporttype_h").setValueStateText("");
                     }
         
                     if(VehicleType ===""){
                         this.getView().byId("id_vehicletype_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_vehicletype_h").setValueStateText("Please Select Vehicle Type");
                     }else{
                         this.getView().byId("id_vehicletype_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_vehicletype_h").setValueStateText("");
                     }
         
                     if(VehicleNo ===""){
                         this.getView().byId("id_vehicleno_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_vehicleno_h").setValueStateText("Please Select VehicleNo");
                     }else{
                         this.getView().byId("id_vehicleno_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_vehicleno_h").setValueStateText("");
                     }
         
                 }
        },

        ToUpdateItems:function(oEntryH){

            return new Promise((resolve, reject) => {

                    var Table_Id = this.getView().byId("id_rgpnrgp_table"); // Assuming 'persoTable' is the ID of the Grid Table
                    var oModel = Table_Id.getModel();
                    var Table_Length = Table_Id.getRows().length;
            
                    var ItemNo_array = [];
                    var RefData_array = [];
                    var Product_array = [];
                    var Quantity_array = [];
                    var UOM_array = [];
                    var Amount_array = [];
                    var Header_Status = "200";
            
                    for (var i = 0; i < Table_Length; i++) {

                        var DeleteStatus = Table_Id.getRows()[i].getCells()[0].getVisible();
                        var ItemNo = Table_Id.getRows()[i].getCells()[1].getValue();
                            if(ItemNo === ""){
                                break;
                            }

                            if(oEntryH.GateType === "With Code"){
                                var Product = Table_Id.getRows()[i].getCells()[2].getValue();
                                if(Product.trim() === ""){ 
                                    MessageToast.show("Please Enter Product")
                                    Table_Id.getRows()[i].getCells()[2].setValueState(sap.ui.core.ValueState.Error);
                                    break;                            
                                }else{
                                    Table_Id.getRows()[i].getCells()[2].setValueState(sap.ui.core.ValueState.None);
                                }  
                                
                                var ProductName = Table_Id.getRows()[i].getCells()[3].getValue();
                            }else if(oEntryH.GateType === "Without Code"){
                                var Product = Table_Id.getRows()[i].getCells()[2].getValue();

                                var ProductName = Table_Id.getRows()[i].getCells()[3].getValue();
                                if(ProductName.trim() === ""){ 
                                    MessageToast.show("Please Enter Product Name")
                                    Table_Id.getRows()[i].getCells()[3].setValueState(sap.ui.core.ValueState.Error);
                                    break;                            
                                }else{
                                    Table_Id.getRows()[i].getCells()[3].setValueState(sap.ui.core.ValueState.None);
                                }
                            }

                        

                        var Quantity = Table_Id.getRows()[i].getCells()[4].getValue();
                            if(Quantity === ""){ 
                                MessageToast.show("Please Enter Quantity")
                                Table_Id.getRows()[i].getCells()[4].setValueState(sap.ui.core.ValueState.Error);
                                break;                            
                            }else{
                                Table_Id.getRows()[i].getCells()[4].setValueState(sap.ui.core.ValueState.None);
                            }

                        var UOM = Table_Id.getRows()[i].getCells()[5].getValue();

                        var Amount = Table_Id.getRows()[i].getCells()[6].getValue();
                            if(Amount === ""){ 
                                MessageToast.show("Please Enter Value")
                                Table_Id.getRows()[i].getCells()[6].setValueState(sap.ui.core.ValueState.Error);
                                break;                            
                            }else{
                                Table_Id.getRows()[i].getCells()[6].setValueState(sap.ui.core.ValueState.None);
                            }

                        var TotalPrice = Table_Id.getRows()[i].getCells()[7].getValue();

                        var DueDate = Table_Id.getRows()[i].getCells()[8].getValue();
                            if(DueDate.trim() === ""){ 
                                MessageToast.show("Please Enter Valid Date")
                                Table_Id.getRows()[i].getCells()[8].setValueState(sap.ui.core.ValueState.Error);
                                break;                            
                            }else{
                                Table_Id.getRows()[i].getCells()[8].setValueState(sap.ui.core.ValueState.None);
                            }

                        var DispatchDate = Table_Id.getRows()[i].getCells()[9].getValue();
                        var RemarksItem = Table_Id.getRows()[i].getCells()[10].getValue();
                        var SAP_UUID_I = Table_Id.getRows()[i].getCells()[11].getValue();
                        
                        if(DeleteStatus === true){
                           var Delete_Status = "deleted";
                        }else{
                           var Delete_Status = "";
                        }

                           var itemData = {
                               id:oEntryH.Id,
                               ItemNo:ItemNo,
                               Product:Product,
                               ProductName:ProductName,
                               Quantity:Quantity,
                               UOM:UOM,
                               DueDate:DueDate,
                               DispatchDate:DispatchDate,
                               Value:Amount,
                               Remarks:RemarksItem,
                               Status:"created",
                               ItemsStatus:Delete_Status,
                               ApproveStatus:"pending",
                               TotalAmount:TotalPrice,
                               GatePassType:oEntryH.GatePassType,
                               Requestor:oEntryH.Requestor,
                               PlantCode:oEntryH.PlantCode,
                               PlantName:oEntryH.PlantName,
                               SupplierCode:oEntryH.SupplierCode,
                               SupplierName:oEntryH.SupplierName,
                               SupplierType:"",
                               CustomerCode:oEntryH.CustomerCode,
                               CustomerName:oEntryH.CustomerName,
                               CustomerType:"",
                               ValueInINR:oEntryH.ValueInINR,
                               VehicleType:oEntryH.VehicleType,
                               VehicleNo:oEntryH.VehicleNo,
                               Transporter:"",
                               TransporterMode:oEntryH.TransporterMode,
                               PurchaseOrder:oEntryH.PurchaseOrder,
                               MaterialDocument:oEntryH.MaterialDocument,
                               ReferenceDocumentNo:oEntryH.ReferenceDocumentNo,
                               RemarkHead:oEntryH.Remark,
                               GateType:oEntryH.GateType,
            
                            };
        
                            console.log("itemData:", itemData)
        
                            var oModel_04 = this.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                            oModel_04.setHeaders({
                                "X-Requested-With": "X",
                                "Content-Type": "application/json"
                            });
            
                            oModel_04.update("/YY1_ITEMS_ZRGP_NRGP_HEAD(guid'" + SAP_UUID_I + "')", itemData, {
                                success: function(data) {
                                console.log("Item Updated:", data);
                                resolve(data);
                                },
                                error: function(error) {
                                console.error("Error updating item:", error);
                                sap.ui.core.BusyIndicator.hide();
                                reject(new Error("Validation failed"))
                                }
                            });
                        }
            })
        },

        OnUOMChange:function(oEvent){
            let DAtaa = oEvent.getSource().getParent().getCells()[5].getValue(); 
            let DAtaa01 = DAtaa.toUpperCase();
            oEvent.getSource().getParent().getCells()[5].setValue(DAtaa01); 
        },

        
        OnDeleteEntireDocument:function(){

            sap.ui.core.BusyIndicator.show();

            let GateEntryNo = this.getView().byId("id_gateentryno_h").getValue();
            let SAP_UUID_H = this.getView().byId("id_sapuuid_h").getValue();

            // ---------- Start Item Level

            var Table_Id = this.getView().byId("id_rgpnrgp_table");
            var Table_Length = Table_Id.getRows().length;

            for (var i = 0; i < Table_Length; i++) {
            var oRow = Table_Id.getRows()[i];
            var oBindingContext = oRow.mAggregations;

            if (oBindingContext) {
                let ItemNo = oBindingContext.cells[1].mProperties.value;
                var SAP_UUID_I = oBindingContext.cells[11].mProperties.value;
                var Delete_Status01 = oRow.getCells()[0].getVisible();

                if (ItemNo !== "") {
                    var Delete_Status = "deleted";
                    
                var itemData = {
                    Status: Delete_Status
                };

                var oModel_04 = this.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                oModel_04.setHeaders({
                    "X-Requested-With": "X",
                    "Content-Type": "application/json"
                });

                oModel_04.update("/YY1_ITEMS_ZRGP_NRGP_HEAD(guid'" + SAP_UUID_I + "')", itemData, {
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
            }
            }

            var oEntry1 = {
                Status: "deleted",
            };

            var that = this;

            var oModel05 = this.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
            oModel05.setHeaders({
            "X-Requested-With": "X",
            "Content-Type": "application/json"
            });

            oModel05.update("/YY1_ZRGP_NRGP_HEAD(guid'" + SAP_UUID_H + "')", oEntry1, {
            success: function(data) {
                console.log("Header Updated:", data);
                MessageToast.show(" "+GateEntryNo+" Deleted")        
                oModel05.refresh(true);
                sap.ui.core.BusyIndicator.hide();
                that.getView().byId("DeleteIndicId").setVisible(true); 
                that.getView().byId("id_update_button").setVisible(false); 
                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false); 
                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(true); 
                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(true); 

                var oJSONModel = new sap.ui.model.json.JSONModel({
                    data: {}
                });
                that.getView().setModel(oJSONModel, "JModel");

                that.getView().byId("id_gateentryno_h").setValue("");
                that.getView().byId("id_gateentryno_h").setSelectedKey("");
                that.getView().byId("id_sapuuid_h").setValue("");
                that.getView().byId("id_plantcode_h").setValue("");
                that.getView().byId("id_plantname_h").setValue("");
                that.getView().byId("id_suppliercode_h").setValue("");
                that.getView().byId("id_suppliername_h").setValue("");
                that.getView().byId("id_customercode_h").setValue("");
                that.getView().byId("id_customername_h").setValue("");
                that.getView().byId("id_requestor_h").setValue("");
                that.getView().byId("id_valueininr_h").setValue("");
                that.getView().byId("id_purchasematerialdoc_h").setValue("");
                that.getView().byId("id_vehicleno_h").setValue("");
                that.getView().byId("id_remark_h").setValue("");
                that.getView().byId("id_gateentrystatus").setVisible(false);

            },
            error: function(error) {
                console.error("Error updating header:", error);
                MessageToast.show(" "+GateEntryNo+" Not Deleted")
                sap.ui.core.BusyIndicator.hide();
            }
            });

            // ---------- End Item Level

        },

        
        OnUnDeleteEntireDocument:function(){
            sap.ui.core.BusyIndicator.show();

            let GateEntryNo = this.getView().byId("id_gateentryno_h").getValue();
            let SAP_UUID_H = this.getView().byId("id_sapuuid_h").getValue();

            // ---------- Start Item Level

            var Table_Id = this.getView().byId("id_rgpnrgp_table");
            var Table_Length = Table_Id.getRows().length;

            for (var i = 0; i < Table_Length; i++) {
            var oRow = Table_Id.getRows()[i];
            var oBindingContext = oRow.mAggregations;

            if (oBindingContext) {
                let ItemNo = oBindingContext.cells[1].mProperties.value;
                var SAP_UUID_I = oBindingContext.cells[11].mProperties.value;
                var Delete_Status01 = oRow.getCells()[0].getVisible();

                if (ItemNo !== "") {
                    var Delete_Status = "created";
                    
                var itemData = {
                    Status: Delete_Status
                };

                var oModel_04 = this.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                oModel_04.setHeaders({
                    "X-Requested-With": "X",
                    "Content-Type": "application/json"
                });

                oModel_04.update("/YY1_ITEMS_ZRGP_NRGP_HEAD(guid'" + SAP_UUID_I + "')", itemData, {
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
            }
            }

            var oEntry1 = {
                Status: "created",
            };

            var that = this;

            var oModel05 = this.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
            oModel05.setHeaders({
            "X-Requested-With": "X",
            "Content-Type": "application/json"
            });

            oModel05.update("/YY1_ZRGP_NRGP_HEAD(guid'" + SAP_UUID_H + "')", oEntry1, {
            success: function(data) {
                console.log("Header Updated:", data);
                MessageToast.show(" "+GateEntryNo+" Deleted")        
                oModel05.refresh(true);
                sap.ui.core.BusyIndicator.hide();
                that.getView().byId("DeleteIndicId").setVisible(false); 
                that.getView().byId("id_update_button").setVisible(true); 
                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(true); 
                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(true); 
                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);

                var oJSONModel = new sap.ui.model.json.JSONModel({
                    data: {}
                });
                that.getView().setModel(oJSONModel, "JModel");

                that.getView().byId("id_gateentryno_h").setValue("");
                that.getView().byId("id_rgpnrgp_h").setSelectedKey("");
                that.getView().byId("id_sapuuid_h").setValue("");
                that.getView().byId("id_plantcode_h").setValue("");
                that.getView().byId("id_plantname_h").setValue("");
                that.getView().byId("id_suppliercode_h").setValue("");
                that.getView().byId("id_suppliername_h").setValue("");
                that.getView().byId("id_customercode_h").setValue("");
                that.getView().byId("id_customername_h").setValue("");
                that.getView().byId("id_requestor_h").setValue("");
                that.getView().byId("id_valueininr_h").setValue("");
                that.getView().byId("id_purchasematerialdoc_h").setValue("");
                that.getView().byId("id_vehicleno_h").setValue("");
                that.getView().byId("id_remark_h").setValue("");
                that.getView().byId("id_gateentrystatus").setVisible(false);

            },
            error: function(error) {
                console.error("Error updating header:", error);
                MessageToast.show(" "+GateEntryNo+" Not Deleted")
                sap.ui.core.BusyIndicator.hide();
            }
            });

            // ---------- End Item Level

        },

        onSendMail:function(){
            this.sendEmail();
        },
    
            sendEmail: function() {
                // Construct the email parameters
                var emailParams = {
                        "Body": {
                          "Content": "Hai, \n\n "
                        },
                        "Subject": "Subject from API",
                      //   "CcRecipients": [
                      //     {
                      //       "EmailAddress": {
                      //         "Address": "srinivas.katta@castaliaz.co.in",
                      //         "Name": "Srinivas Katta"
                      //       }
                      //     }
                      //   ],
                        "ToRecipients": [
                          {
                            "EmailAddress": {
                              "Address": "srinivas.nama@castaliaz.co.in",
                              "Name": "Srinivas Nama"
                            }
                          }
                        ]
                };
    
                // Call the function to send the email via Integration Suite
                this.sendEmailViaIntegrationSuite(emailParams);
            },

            // sendEmailViaIntegrationSuite: function(emailParams) {
            //     var that = this;
    
            //     // Make an AJAX request to upload the attachment
            //     $.ajax({
            //         url: "https://api.openconnectors.trial.us10.ext.hana.ondemand.com/elements/api-v2/messages/{id}/attachments",
            //         method: "POST",
            //         headers: {
            //             "Authorization": "User GzjrbmqAYmxrdZ0Sbo5SdKMw0VNZz4vueI8jp+lJMFc=, Organization b08b9164a3259b321496c6d53afb26fe, Element v6QlDmyaNvj9zAAjWJzdFwKp872ACTPGU8B5ecnUmx0=",
            //             "accept":"application/json", 
            //             "Content-Type":"application/json" 
            //         },
            //         data: JSON.stringify(emailParams.Attachments[0]), // Assuming you're only sending one attachment
            //         success: function(attachmentResponse) {
            //             // If the attachment upload is successful, update the attachment details in emailParams
            //             emailParams.Attachments[0].Id = attachmentResponse.Id; // Update the attachment ID
            //             emailParams.Attachments[0].ContentBytes = attachmentResponse.ContentBytes; // Update the attachment content bytes
    
            //             // Make another AJAX request to send the email with the updated attachment details
            //             $.ajax({
            //                 url: "https://api.openconnectors.trial.us10.ext.hana.ondemand.com/elements/api-v2/messages",
            //                 method: "POST",
            //                 headers: {
            //                     "Authorization": "User GzjrbmqAYmxrdZ0Sbo5SdKMw0VNZz4vueI8jp+lJMFc=, Organization b08b9164a3259b321496c6d53afb26fe, Element v6QlDmyaNvj9zAAjWJzdFwKp872ACTPGU8B5ecnUmx0=",
            //                     "accept":"application/json", 
            //                     "Content-Type":"application/json"                            
            //                  },
            //                 data: JSON.stringify(emailParams),
            //                 success: function(response) {
            //                     console.log(response);
            //                     MessageBox.success("Email sent successfully!");
            //                 },
            //                 error: function(xhr, status, error) {
            //                     MessageBox.error("Failed to send email: " + error);
            //                 }
            //             });
            //         },
            //         error: function(xhr, status, error) {
            //             MessageBox.error("Failed to upload attachment: " + error);
            //         }
            //     });
            // },
    
            sendEmailViaIntegrationSuite: function(emailParams) {
                // Make an AJAX request to the server-side endpoint responsible for sending emails
                $.ajax({
                    url: "https://api.openconnectors.trial.us10.ext.hana.ondemand.com/elements/api-v2/messages", // Replace with the actual endpoint URL
                    method: "POST",
                    headers: {
                        "Authorization": "User GzjrbmqAYmxrdZ0Sbo5SdKMw0VNZz4vueI8jp+lJMFc=, Organization b08b9164a3259b321496c6d53afb26fe, Element v6QlDmyaNvj9zAAjWJzdFwKp872ACTPGU8B5ecnUmx0=",
                        "accept":"application/json", 
                        "Content-Type":"application/json" 
                    },
                    contentType: "application/json",
                    data: JSON.stringify(emailParams),
                    success: function(response) {
                        console.log("response:", response)
                        var messageId = response.id; // Assuming the response includes the ID as a property named "id"

                        // Now you can use the message ID as needed
                        console.log("Message ID:", messageId);
                        MessageBox.success("Email sent successfully!");
                    },
                    error: function(xhr, status, error) {
                        MessageBox.error("Failed to send email: " + error);
                    }
                });
            },


        onPrint: function () {

            let GatePassNo = this.getView().byId("id_gateentryno_h").getValue();
            let GatePassType = this.getView().byId("id_rgpnrgp_h").getSelectedKey();
            let Plant = this.getView().byId("id_plantcode_h").getValue();
            let PlantName = this.getView().byId("id_plantname_h").getValue();
            let Requestor = this.getView().byId("id_requestor_h").getValue();
            let VehicleNo = this.getView().byId("id_vehicleno_h").getValue();
            let GatePassDate1 = this.getView().byId("id_gatepassdate_h").getValue();
            let ValueInINRH = this.getView().byId("id_valueininr_h").getValue();
            var Table_Id = this.getView().byId("id_rgpnrgp_table"); // Assuming 'persoTable' is the ID of the Grid Table
            var oModel = Table_Id.getModel();
            var Table_Length = Table_Id.getRows().length;

            // DIGIT TO WORD STRING

            function test(n) {
                if (n < 0)
                  return false;
                 let single_digit = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
                 let double_digit = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
                 let below_hundred = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

                if (n === 0) return 'Zero'
                function translate(n) {
                    let word = ""
                    let rem = ""
                    if (n < 10) {
                        word = single_digit[n] + ' '
                    }
                    else if (n < 20) {
                        word = double_digit[n - 10] + ' '
                    }
                    else if (n < 100) {
                        rem = translate(n % 10)
                        word = below_hundred[(n - n % 10) / 10 - 2] + ' ' + rem
                    }
                    else if (n < 1000) {
                        word = single_digit[Math.trunc(n / 100)] + ' Hundred ' + translate(n % 100)
                    }
                    else if (n < 1000000) {
                        word = translate(parseInt(n / 1000)).trim() + ' Thousand ' + translate(n % 1000)
                    }
                    else if (n < 1000000000) {
                        word = translate(parseInt(n / 1000000)).trim() + ' Million ' + translate(n % 1000000)
                    }
                    else {
                        word = translate(parseInt(n / 1000000000)).trim() + ' Billion ' + translate(n % 1000000000)
                    }
                    return word
                }
                 let result = translate(n) 
                return result.trim()+'.'
            }

            let ValueINTWords = test(parseInt(ValueInINRH));


            // DIGIT TO WORD STRING
            
            const d = new Date(GatePassDate1)

            if(d.getDate() < 10){
            var date1 = "0"+d.getDate();
            }
            if(d.getMonth() < 10){
            var month1 = "0"+d.getMonth();
            }
            var YEar1 = d.getFullYear();
            let GatePassDate = date1+"-"+month1+"-"+YEar1;

            const d1 = new Date()
            if(d1.getDate() < 10){
            var date1 = "0"+d1.getDate();
            }
            if(d1.getMonth() < 10){
            var month1 = "0"+d1.getMonth();
            }
            var YEar1 = d1.getFullYear();
            let CurrentDate = date1+"-"+month1+"-"+YEar1;

			var header =
				' <html>' +
				' <head>' +
				' <style>' +
				' @font-face {font-family:"Cambria Math"; panose-1:2 4 5 3 5 4 6 3 2 4;} @font-face {font-family:Arial MT;} /* Style Definitions */ p.MsoNormal, li.MsoNormal, div.MsoNormal {margin:0in; text-autospace:none; font-size:11.0pt; font-family:"Arial",sans-serif;} p.MsoBodyText, li.MsoBodyText, div.MsoBodyText {margin-top:2.8pt; margin-right:0in; margin-bottom:0in; margin-left:0in; text-autospace:none; font-size:20.0pt; font-family:"Arial",sans-serif; font-weight:bold;} p.TableParagraph, li.TableParagraph, div.TableParagraph {mso-style-name:"Table Paragraph"; margin:0in; text-autospace:none; font-size:11.0pt; font-family:"Arial",sans-serif;} .MsoChpDefault {font-family:"Calibri",sans-serif;} .MsoPapDefault {text-autospace:none;} @page WordSection1 {size:595.5pt 842.0pt; margin:12.0pt 14.0pt 14.0pt 9.0pt;} div.WordSection1 {page:WordSection1;} /* List Definitions */ ol {margin-bottom:0in;} ul {margin-bottom:0in;}'+
				' </style>' +
				'</head>' +
				'<body lang=EN-US style="word-wrap:break-word">' +
				' <div class=WordSection1>' +
				'<p class=MsoBodyText style="margin-top:3.45pt;margin-right:80.2pt;margin-bottom: 0in;margin-left:140pt;margin-bottom:.0001pt">Castaliaz Technologies Pvt Ltd </p>' +
				'<p class=MsoNormal style="margin-top:12.05pt;margin-right:145.05pt;margin-bottom:0in;margin-left:145pt;margin-bottom:.0001pt;line-height:103%">' +
				'<span style="position:absolute;z-index:15728640;left:0px;margin-left:70px;margin-top: 0px;width:98px;height:63px;">' +
				'<img width=98 height=63 src="https://www.castaliaz.co.in/wp-content/uploads/2021/02/castaliaz-transparent-2.png"></span>' +
				'<b><span style="font-size:8.0pt;line-height:103%;letter-spacing:-.2pt">Corp.Office : </span></b>' +
				'<span style="font-size:8.0pt;line-height:103%;font-family:Arial MT,sans-serif; letter-spacing:-.2pt">#402, 4<sup>th</sup> Floor, Momdi Business Center (MBC),134 Infantry Road, Shivajinagar, Bengaluru - 560 001. </span>' +
				'<b><span style="font-size:8.0pt;line-height:103%"> <br>Ph.No.</span></b>' +
				'<span style="font-size:8.0pt;line-height:103%;font-family:Arial MT,sans-serif">+91 9876543210, </span>' +
				'<a href="mailto:admin@srthoratmilk.com"><b><span style="font-size:8.0pt;line-height:103%;color:windowtext;text-decoration:none">E-Mail:</span></b>' +
				'<span style="font-size:8.0pt;line-height:103%;font-family:Arial MT,sans-serif; color:windowtext;text-decoration:none">admin@castaliaz.co</span></a>' +
				'<span style="font-size:8.0pt;line-height:103%;font-family:Arial MT,sans-serif">.in</span>' +
				'<span style="font-size:8.0pt;line-height:103%;font-family:Arial MT,sans-serif">,</span>' +
				'</p>' +  

				'<p class=MsoNormal style="margin-top:.1pt;margin-right:0in;margin-bottom:0in; margin-left:145pt;margin-bottom:.0001pt">'+
				'<b><span style="font-size:8.0pt; letter-spacing:-.1pt">GST.No</span></b><span style="font-size:8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.1pt">:0987654321,</span>'+
				'<span style="font-size:8.0pt;font-family:Arial MT,sans-serif"></span>'+
				'<b><span style="font-size:8.0pt;letter-spacing:-.1pt">PAN.No:</span></b>'+
				'<span style="font-size:8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.1pt">XXXXXXXXXX,</span><span'+
				'style="font-size:8.0pt;font-family:Arial MT,sans-serif">    </span></p>'+

                '<p class=MsoNormal align=center style="margin-top:8.75pt;margin-right:84.35pt;margin-bottom:0in;margin-left:4.15pt;margin-bottom:.0001pt;text-align:center">'+
                '<b><span style="font-size:16.0pt;letter-spacing:-.2pt">Gate Pass - '+ GatePassType +'</span></b></p>'+
                '<p class=MsoBodyText><span style="font-size:10.0pt">&nbsp;</span></p>'+

                '<table class=MsoNormalTable border=1 cellspacing=0 cellpadding=0 width=741 style="margin-left:6.35pt;border-collapse:collapse;border:none">'+
                '<tr style="height:12.9pt">'+
                '<td width=266 colspan=3 style="width:199.4pt;border:solid black 1.0pt;padding:0in 0in 0in 0in;height:12.9pt">'+
                '<p class=TableParagraph style="margin-top:1.05pt;margin-right:-35.45pt; margin-bottom:0in;margin-left:7.0pt;margin-bottom:.0001pt">'+
                '<span style="font-size:7.5pt;font-family:Arial MT,sans-serif;letter-spacing:-.2pt">Gate Pass No</span><span style="font-size:7.5pt;font-family:Arial MT,sans-serif;'+
                'letter-spacing:-.1pt"> </span><span style="font-size:7.5pt;font-family:Arial MT,sans-serif;'+
                'letter-spacing:-.2pt">:</span><span style="font-size:7.5pt;font-family:Arial MT,sans-serif;'+
                'letter-spacing:-.05pt"> </span><span style="font-size:7.5pt;font-family:Arial MT,sans-serif;'+
                'letter-spacing:-.2pt">&nbsp;'+GatePassNo+'</span>'+
                '</p>'+
                '</td>'+
                '<td width=171 colspan=3 style="width:127.95pt;border:solid black 1.0pt; border-left:none;padding:0in 0in 0in 0in;height:12.9pt">'+
                '<p class=TableParagraph style="margin-top:1.05pt;margin-right:0in;margin-bottom:0in;margin-left:7.15pt;margin-bottom:.0001pt">'+
                '<span style="font-size:7.5pt;font-family:Arial MT,sans-serif">Gate Pass Date</span>'+
                '<span style="font-size:7.5pt;font-family:Arial MT,sans-serif;letter-spacing:.6pt">'+
                '</span><span style="font-size:7.5pt;font-family:Arial MT,sans-serif">:</span>'+
                '<span style="font-size:7.5pt;font-family:Arial MT,sans-serif;letter-spacing:.55pt">'+
                '</span><span style="font-size:7.5pt;font-family:Arial MT,sans-serif">&nbsp;'+GatePassDate+'</span>'+
                '</p>'+
                '</td>'+
                '<td width=302 colspan=4 style="width:226.5pt;border:solid black 1.0pt; border-left:none;padding:0in 0in 0in 0in;height:12.9pt">'+
                '<p class=TableParagraph style="margin-top:1.05pt;margin-right:0in;margin-bottom: 0in;margin-left:7.15pt;margin-bottom:.0001pt">'+
                '<span style="font-size:7.5pt;font-family:Arial MT,sans-serif">Plant         :</span>'+
                '<span style="font-size:7.5pt;font-family:Arial MT,sans-serif;letter-spacing:.15pt">'+
                '</span><span style="font-size:7.5pt;font-family:Arial MT,sans-serif">&nbsp;'+Plant+' - '+PlantName+'</span>'+
                '</p>'+
                '</td>'+
                '<td style="border:none;padding:0in 0in 0in 0in" width=2>'+
                '<p class="MsoNormal">&nbsp;'+
                '</td>'+
                '</tr>'+
                '<tr style="height:12.95pt">'+
                '<td width=266 colspan=3 style="width:199.4pt;border:solid black 1.0pt;'+
                'border-top:none;padding:0in 0in 0in 0in;height:12.95pt">'+
                '<p class=TableParagraph style="margin-top:1.1pt;margin-right:0in;margin-bottom:'+
                '0in;margin-left:7.0pt;margin-bottom:.0001pt"><span style="font-size:7.5pt;'+
                'font-family:Arial MT,sans-serif;letter-spacing:-.2pt">Document Date:</span><span'+
                'style="font-size:7.5pt;font-family:Arial MT,sans-serif;letter-spacing:-.3pt">'+
                '</span><span style="font-size:7.5pt;font-family:Arial MT,sans-serif;letter-spacing:-.2pt">&nbsp;'+CurrentDate+'</span>'+
                '</p>'+
                '</td>'+
                '<td width=171 colspan=3 style="width:127.95pt;border-top:none;border-left:'+
                'none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;'+
                'padding:0in 0in 0in 0in;height:12.95pt">'+
                '<p class=TableParagraph style="margin-top:.95pt;margin-right:0in;margin-bottom:'+
                '0in;margin-left:8.55pt;margin-bottom:.0001pt"><span style="font-size:7.5pt;font-family:Arial MT,sans-serif">Vehicle No</span>'+
                '<span style="font-size: 7.5pt;font-family:Arial MT,sans-serif;letter-spacing:.25pt">'+
                '</span><span'+
                'style="font-size:7.5pt;font-family:Arial MT,sans-serif">:</span><span'+
                'style="font-size:7.5pt;font-family:Arial MT,sans-serif;letter-spacing:.3pt">'+
                '</span><span style="font-size:7.5pt;font-family:Arial MT,sans-serif;letter-spacing:-.25pt"> &nbsp;'+VehicleNo+'</span>'+
                '</p>'+
                '</td>'+
                '<td width=302 colspan=4 style="width:226.5pt;border-top:none;border-left:'+
                'none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;'+
                'padding:0in 0in 0in 0in;height:12.95pt">'+
                '<p class=TableParagraph style="margin-top:1.1pt;margin-right:0in;margin-bottom:'+
                '0in;margin-left:7.1pt;margin-bottom:.0001pt"><span style="font-size:7.5pt;'+
                'font-family:Arial MT,sans-serif">Requestor: &nbsp;'+Requestor+'</span></p>'+
                '</td>'+
                '<td style="border:none;padding:0in 0in 0in 0in" width=2>'+
                '<p class="MsoNormal">&nbsp;'+
                '</td>'+
                '</tr>'+
                // ----
                
                '<tr style="height:78pt">'+
                '<td width=313 colspan=5 style="width:234.9pt;border:solid black 1.0pt;'+
                'border-top:none;padding:0in 0in 0in 0in;height:74.1pt">'+

                '<p class=TableParagraph style="margin-left:1.15pt;line-height:8.4pt"><b>'+
                '<span style="font-size:7pt;font-family:Arial MT,sans-serif;">FROM </span></b><b>'+
                '<span style="font-size:7.5pt"> <span style="letter-spacing:-.5pt">:</span></span></b></p>'+
                '<p class=TableParagraph style="margin-top:4.35pt;margin-right:0in;margin-bottom:'+
                '0in;margin-left:.05in;margin-bottom:.0001pt"><span style="font-size:7.5pt;'+
                'font-family:Arial MT,sans-serif;letter-spacing:-.2pt">Name &nbsp;&nbsp;&nbsp;&nbsp;:</span>'+
                '<span style="font-size:7.5pt;font-family:Arial MT,sans-serif">         '+
                '<span style="letter-spacing:-.5pt;margin-left:2%;font-size:7.5pt;font-family:Arial MT,sans-serif">CASTALIAZ TECHNOLOGIES PRIVATE LIMITED</span>'+
                '</p>'+

                '<p class=TableParagraph style="margin-top:3.65pt;margin-right:0in;margin-bottom:0in;margin-left:.05in;margin-bottom:.0001pt;line-height:8.35pt">'+
                '<span style="font-size:7.5pt;font-family:Arial MT,sans-serif;letter-spacing:-.2pt">Address</span>'+
                '<span style="font-size:7.5pt;font-family:Arial MT,sans-serif">'+
                '<span style="letter-spacing:-.5pt">:</span></span></p>'+
                '<p class=TableParagraph style="margin-left:.62in;line-height:8.35pt">'+
                '<span style="font-size:7.5pt;font-family:Arial MT,sans-serif;">#402, 4th Floor, Momdi Business Center(MBC), 143 Infantry Road, Shivajinagar, Bangalore - 560001.</span>'+
                '</p>'+

                '</td>'+
                '<td width=425 colspan=5 style="width:318.95pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;height:74.1pt">'+
                '<p class=TableParagraph style="margin-left:1.15pt;line-height:8.4pt"><b>'+
                '<span style="font-size:7.5pt">TO </span></b><b>'+
                '<span style="font-size:7.5pt"> <span style="letter-spacing:-.5pt">:</span></span></b></p>'+
                '<p class=TableParagraph style="margin-top:4.35pt;margin-right:0in;margin-bottom:0in;margin-left:.05in;margin-bottom:.0001pt">'+
                '<span style="font-size:7.5pt;font-family:Arial MT,sans-serif;letter-spacing:-.2pt">Name &nbsp;&nbsp;&nbsp;&nbsp;:</span>'+
                '<span style="font-size:7.5pt;font-family:Arial MT,sans-serif">         '+
                '<span style="letter-spacing:-.5pt;margin-left:9pt">CASTALIAZ TECHNOLOGIES PRIVATE LIMITED</span>'+
                '</p>'+
                '<p class=TableParagraph style="margin-top:3.65pt;margin-right:0in;margin-bottom:'+
                '0in;margin-left:.05in;margin-bottom:.0001pt;line-height:8.35pt">'+
                '<span style="font-size:7.5pt;font-family:Arial MT,sans-serif;letter-spacing:-.1pt">Address</span>'+
                '<span style="font-size:7.5pt;font-family:Arial MT,sans-serif">   '+
                '<span style="letter-spacing:-.5pt">:</span></span></p>'+
                '<p class=TableParagraph style="margin-left:.62in;line-height:8.35pt">'+
                '<span style="font-size:7.5pt;font-family:Arial MT,sans-serif">#402, 4th Floor, Momdi Business Center(MBC), 143 Infantry Road, Shivajinagar, Bangalore - 560001.</span>'+
                '</p>'+
                '</td>'+
                '<td style="border:none;padding:0in 0in 0in 0in" width=2>'+
                '<p class="MsoNormal">&nbsp;'+
                '</td>'+
                '</tr>';

                

                // Item COl HEader

                if(GatePassType === "RGP"){
                    var ITemHeader = '<tr style="height:15.1pt"> '+
                    '<td width=38 style="width:28.35pt;border-top:none;border-left:solid black 1.0pt;  border-bottom:none;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;  height:15.1pt">  '+
                    '<p class=TableParagraph align=center style="margin-top:7.1pt;margin-right:  1.9pt;margin-bottom:0in;margin-left:0in;margin-bottom:.0001pt;text-align:  center">'+
                    '<b><span style="font-size:7.5pt;letter-spacing:-.25pt">Sr.</span></b></p>  </td>  '+
                    '<td width=284 colspan=2 rowspan=2 style="width:212.65pt;border-top:none;  border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;  padding:0in 0in 0in 0in;height:15.1pt">  '+
                    '<p class=TableParagraph align=center style="margin-top:7.1pt;margin-right:  0in;margin-bottom:0in;margin-left:5.45pt;margin-bottom:.0001pt;text-align:  center">'+
                    '<b><span style="font-size:7.5pt;letter-spacing:-.25pt">PRODUCT  DESCRIPTION</span></b></p>  </td>  '+
                    '<td width=85 rowspan=2 style="width:63.8pt;border-top:none;border-left:none;  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;  height:15.1pt">  '+
                    '<p class=TableParagraph align=center style="margin-top:7.1pt;margin-right:  0in;margin-bottom:0in;margin-left:7.4pt;margin-bottom:.0001pt;text-align:  center">'+
                    '<b><span style="font-size:7.5pt">QUANTITY</span></b></p>  </td>  '+
                    '<td width=66 colspan=3 rowspan=2 style="width:49.6pt;border-top:none;  border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;  padding:0in 0in 0in 0in;height:15.1pt">  '+
                    '<p class=TableParagraph align=center style="margin-top:7.1pt;margin-right:  0in;margin-bottom:0in;margin-left:7.4pt;margin-bottom:.0001pt;text-align:  center">'+
                    '<b><span style="font-size:7.5pt">UOM</span></b></p>  </td>  '+
                    '<td width=76 rowspan=2 style="width:56.7pt;border-top:none;border-left:none;  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;  height:15.1pt">  '+
                    '<p class=TableParagraph align=center style="margin-top:7.1pt;margin-right:  0in;margin-bottom:0in;margin-left:7.4pt;margin-bottom:.0001pt;text-align:  center">'+
                    '<b><span style="font-size:7.5pt">VALUE</span></b></p>  </td>  '+
                    '<td width=94 rowspan=2 style="width:70.85pt;border-top:none;border-left:none;  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;  height:15.1pt">  '+
                    '<p class=TableParagraph align=center style="margin-top:7.1pt;margin-right:  0in;margin-bottom:0in;margin-left:7.4pt;margin-bottom:.0001pt;text-align:  center">'+
                    '<b><span style="font-size:7.5pt">DUE DATE</span></b></p>  </td> '+
                    '<td width=104 rowspan=2 style="width:78.0pt;border-top:none;border-left:none;  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;  height:15.1pt">  '+
                    '<p class=TableParagraph align=center style="margin-top:7.1pt;margin-right:  0in;margin-bottom:0in;margin-left:6.3pt;margin-bottom:.0001pt;text-align:  center">'+
                    '<b><span style="font-size:7.5pt;letter-spacing:-.2pt">AMOUNT</span></b></p></td>'+
                    '</tr>'+
                    '<tr style="height:14.45pt">'+
                    '<td width=38 style="width:28.35pt;border:solid black 1.0pt;border-top:none; padding:0in 0in 0in 0in;height:14.45pt">'+
                    '<p class=TableParagraph align=center style="margin-top:1.15pt;margin-right: 1.9pt;margin-bottom:0in;margin-left:0in;margin-bottom:.0001pt;text-align:center">'+
                    '<b><span style="font-size:7.5pt;letter-spacing:-.25pt">No</span></b></p>'+
                    '</td>'+
                    '</tr>';    
                }
                else{
                    var ITemHeader = '<tr style="height:15.1pt"> '+
                    '<td width=38 style="width:28.35pt;border-top:none;border-left:solid black 1.0pt;  border-bottom:none;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;  height:15.1pt">  '+
                    '<p class=TableParagraph align=center style="margin-top:7.1pt;margin-right:  1.9pt;margin-bottom:0in;margin-left:0in;margin-bottom:.0001pt;text-align:  center">'+
                    '<b><span style="font-size:7.5pt;letter-spacing:-.25pt">Sr.</span></b></p>  </td>  '+
                    '<td width=284 colspan=2 rowspan=2 style="width:212.65pt;border-top:none;  border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;  padding:0in 0in 0in 0in;height:15.1pt">  '+
                    '<p class=TableParagraph align=center style="margin-top:7.1pt;margin-right:  0in;margin-bottom:0in;margin-left:5.45pt;margin-bottom:.0001pt;text-align:  center">'+
                    '<b><span style="font-size:7.5pt;letter-spacing:-.25pt">PRODUCT  DESCRIPTION</span></b></p>  </td>  '+
                    '<td width=85 rowspan=2 style="width:63.8pt;border-top:none;border-left:none;  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;  height:15.1pt">  '+
                    '<p class=TableParagraph align=center style="margin-top:7.1pt;margin-right:  0in;margin-bottom:0in;margin-left:7.4pt;margin-bottom:.0001pt;text-align:  center">'+
                    '<b><span style="font-size:7.5pt">QUANTITY</span></b></p>  </td>  '+
                    '<td width=66 colspan=3 rowspan=2 style="width:49.6pt;border-top:none;  border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;  padding:0in 0in 0in 0in;height:15.1pt">  '+
                    '<p class=TableParagraph align=center style="margin-top:7.1pt;margin-right:  0in;margin-bottom:0in;margin-left:7.4pt;margin-bottom:.0001pt;text-align:  center">'+
                    '<b><span style="font-size:7.5pt">UOM</span></b></p>  </td>  '+
                    '<td width=76 rowspan=2 style="width:56.7pt;border-top:none;border-left:none;  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;  height:15.1pt">  '+
                    '<p class=TableParagraph align=center style="margin-top:7.1pt;margin-right:  0in;margin-bottom:0in;margin-left:7.4pt;margin-bottom:.0001pt;text-align:  center">'+
                    '<b><span style="font-size:7.5pt">VALUE</span></b></p>  </td>  '+
                    '<td width=94 rowspan=2 style="width:70.85pt;border-top:none;border-left:none;  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;  height:15.1pt">  '+
                    '<p class=TableParagraph align=center style="margin-top:7.1pt;margin-right:  0in;margin-bottom:0in;margin-left:7.4pt;margin-bottom:.0001pt;text-align:  center">'+
                    '<b><span style="font-size:7.5pt">DISPATCH DATE</span></b></p>  </td> '+
                    '<td width=104 rowspan=2 style="width:78.0pt;border-top:none;border-left:none;  border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;  height:15.1pt">  '+
                    '<p class=TableParagraph align=center style="margin-top:7.1pt;margin-right:  0in;margin-bottom:0in;margin-left:6.3pt;margin-bottom:.0001pt;text-align:  center">'+
                    '<b><span style="font-size:7.5pt;letter-spacing:-.2pt">AMOUNT</span></b></p></td>'+
                    '</tr>'+
                    '<tr style="height:14.45pt">'+
                    '<td width=38 style="width:28.35pt;border:solid black 1.0pt;border-top:none; padding:0in 0in 0in 0in;height:14.45pt">'+
                    '<p class=TableParagraph align=center style="margin-top:1.15pt;margin-right: 1.9pt;margin-bottom:0in;margin-left:0in;margin-bottom:.0001pt;text-align:center">'+
                    '<b><span style="font-size:7.5pt;letter-spacing:-.25pt">No</span></b></p>'+
                    '</td>'+
                    '</tr>';
    
                }

                                

                //End  Item COl HEader

                // Items Loop
                var ITemLoop = '';

                if(GatePassType === "RGP"){
                    for (var i = 0; i < Table_Length; i++) {
                        let ItemNo = Table_Id.getRows()[i].getCells()[1].getValue();
                        let ItemProduct = Table_Id.getRows()[i].getCells()[2].getValue();
                        let ItemProductName = Table_Id.getRows()[i].getCells()[3].getValue();
                        let ItemQuantity = Table_Id.getRows()[i].getCells()[4].getValue();
                        let ItemUOM = Table_Id.getRows()[i].getCells()[5].getValue();
                        let ItemValue = Table_Id.getRows()[i].getCells()[6].getValue();
                        let ItemAMount = Table_Id.getRows()[i].getCells()[7].getValue();
                        let ItemDate = Table_Id.getRows()[i].getCells()[8].getValue();
                        
                        if(ItemNo !== ""){
                            ITemLoop += 
                            '<tr style="height:21.55pt">'+
                            '<td width=38 valign=top style="width:28.35pt;border:solid black 1.0pt;border-top:none;padding:0in 0in 0in 0in;height:21.55pt">'+
                            '<p class=TableParagraph align=center style="margin-top:5.7pt;margin-right:5.2pt;margin-bottom:0in;margin-left:0in;margin-bottom:.0001pt;text-align:center">'+
                            '<span style="font-size:7.0pt;font-family:"Arial MT",sans-serif;letter-spacing:-.5pt">'+ItemNo+'</span></p>'+
                            '</td>'+
                            '<td width=284 colspan=2 style="width:212.65pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;height:21.55pt">'+
                            '<p class=MsoNormal><span style="font-size:8.0pt">'+ItemProduct +'-'+ ItemProductName+'</span></p>'+
                            '</td>'+
                            '<td width=85 style="width:63.8pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;height:21.55pt">'+
                            '<p class=MsoNormal align=center style="text-align:center"><span style="font-size:8.0pt">'+ItemQuantity+'</span></p>'+
                            '</td>'+
                            '<td width=66 colspan=3 style="width:49.6pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;height:21.55pt">'+
                            '<p class=MsoNormal align=center style="text-align:center"><span style="font-size:8.0pt">'+ItemUOM+'</span></p>'+
                            '</td>'+
                            '<td width=76 style="width:56.7pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;height:21.55pt">'+
                            '<p class=MsoNormal align=center style="text-align:center"><span style="font-size:8.0pt">'+ItemValue+'</span></p>'+
                            '</td>'+
                            '<td width=94 style="width:70.85pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;height:21.55pt">'+
                            '<p class=MsoNormal align=center style="text-align:center"><span style="font-size:8.0pt">'+ItemDate+'</span></p>'+
                            '</td>'+
                            '<td width=104 style="width:78.0pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;height:21.55pt">'+
                            '<p class=MsoNormal align=center style="text-align:center"><span style="font-size:8.0pt">'+ItemAMount+'</span></p>'+
                            '</td>'+
                            '</tr>';
        
                        }
    
                    }    
    
                }else{
                    for (var i = 0; i < Table_Length; i++) {
                        let ItemNo = Table_Id.getRows()[i].getCells()[1].getValue();
                        let ItemProduct = Table_Id.getRows()[i].getCells()[2].getValue();
                        let ItemProductName = Table_Id.getRows()[i].getCells()[3].getValue();
                        let ItemQuantity = Table_Id.getRows()[i].getCells()[4].getValue();
                        let ItemUOM = Table_Id.getRows()[i].getCells()[5].getValue();
                        let ItemValue = Table_Id.getRows()[i].getCells()[6].getValue();
                        let ItemAMount = Table_Id.getRows()[i].getCells()[7].getValue();
                        let ItemDate = Table_Id.getRows()[i].getCells()[9].getValue();
                        
                        if(ItemNo !== ""){
                            ITemLoop += 
                            '<tr style="height:21.55pt">'+
                            '<td width=38 valign=top style="width:28.35pt;border:solid black 1.0pt;border-top:none;padding:0in 0in 0in 0in;height:21.55pt">'+
                            '<p class=TableParagraph align=center style="margin-top:5.7pt;margin-right:5.2pt;margin-bottom:0in;margin-left:0in;margin-bottom:.0001pt;text-align:center">'+
                            '<span style="font-size:7.0pt;font-family:"Arial MT",sans-serif;letter-spacing:-.5pt">'+ItemNo+'</span></p>'+
                            '</td>'+
                            '<td width=284 colspan=2 style="width:212.65pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;height:21.55pt">'+
                            '<p class=MsoNormal><span style="font-size:8.0pt">'+ItemProduct +'-'+ ItemProductName+'</span></p>'+
                            '</td>'+
                            '<td width=85 style="width:63.8pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;height:21.55pt">'+
                            '<p class=MsoNormal align=center style="text-align:center"><span style="font-size:8.0pt">'+ItemQuantity+'</span></p>'+
                            '</td>'+
                            '<td width=66 colspan=3 style="width:49.6pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;height:21.55pt">'+
                            '<p class=MsoNormal align=center style="text-align:center"><span style="font-size:8.0pt">'+ItemUOM+'</span></p>'+
                            '</td>'+
                            '<td width=76 style="width:56.7pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;height:21.55pt">'+
                            '<p class=MsoNormal align=center style="text-align:center"><span style="font-size:8.0pt">'+ItemValue+'</span></p>'+
                            '</td>'+
                            '<td width=94 style="width:70.85pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;height:21.55pt">'+
                            '<p class=MsoNormal align=center style="text-align:center"><span style="font-size:8.0pt">'+ItemDate+'</span></p>'+
                            '</td>'+
                            '<td width=104 style="width:78.0pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;height:21.55pt">'+
                            '<p class=MsoNormal align=center style="text-align:center"><span style="font-size:8.0pt">'+ItemAMount+'</span></p>'+
                            '</td>'+
                            '</tr>';
        
                        }
    
                    }    
    
                }


                // End Loop


                var AfterLoop = '<tr style="height:21.0pt">'+
                '<td width=616 colspan=9 style="width:461.7pt;border:solid black 1.0pt;border-top:none;padding:0in 0in 0in 0in;height:21.0pt">'+
                '<p class=TableParagraph align=center style="text-align:center"><b><span style="font-size:10.0pt;letter-spacing:-.1pt">Total</span></b></p></td>'+
                '<td width=123 style="width:92.15pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;height:21.0pt">'+
                '<p class=MsoNormal align=center style="text-align:center"><b><span style="font-size:10.0pt;font-family:"Times New Roman",serif"> </span></b><b><span style="font-size:10.0pt">'+ValueInINRH+'</span></b></p>'+
                '</td>'+
                '<td style="border:none;padding:0in 0in 0in 0in" width=2>'+
                '<p class="MsoNormal">&nbsp;'+
                '</td>'+
                '</tr>'+
                '<tr style="height:14.75pt">'+
                '<td width=738 colspan=10 style="width:553.85pt;border:solid black 1.0pt; border-top:none;padding:0in 0in 0in 0in;height:14.75pt">'+
                '<p class=TableParagraph style="margin-top:1.9pt;margin-right:0in;margin-bottom: 0in;margin-left:1.55pt;margin-bottom:.0001pt"><b><span style="font-size:8.0pt">Total</span></b><b><span style="font-size:8.0pt;letter-spacing:.25pt"> </span></b><b><span style="font-size:8.0pt">Invoice</span></b><b><span style="font-size:8.0pt; letter-spacing:.25pt"> </span></b><b><span style="font-size:8.0pt">Amount</span></b><b><span style="font-size:8.0pt;letter-spacing:.25pt"> </span></b><b><span style="font-size:8.0pt">in</span></b><b><span style="font-size:8.0pt; letter-spacing:.25pt"> </span></b><b><span style="font-size:8.0pt">Words</span></b><b><span style="font-size:8.0pt;letter-spacing:.25pt">: &nbsp;'+ ValueINTWords+'</span></b></p>'+
                '</td>'+
                '<td style="border:none;padding:0in 0in 0in 0in" width=2>'+
                '<p class="MsoNormal">&nbsp;'+
                '</td>'+
                '</tr>'+
                '<tr style="height:73.75pt">'+

                '<td width=455 colspan=6 valign=top style="width:340.9pt;border:solid black 1.0pt; border-top:none;padding:0in 0in 0in 0in;height:73.75pt">'+
                '<p class=TableParagraph style="margin-top:.35pt;margin-right:0in;margin-bottom:0in;margin-left:7.65pt;margin-bottom:.0001pt">'+
                '<b><span style="font-size:7.5pt">&nbsp;</span></b></p>'+
                '<p class=TableParagraph style="margin-top:.35pt;margin-right:0in;margin-bottom:0in;margin-left:7.65pt;margin-bottom:.0001pt"><b><span style="font-size:7.5pt">Remarks:</span></b></p>'+
                '</td>'+
                '<td width=284 colspan=4 valign=bottom style="width:212.95pt;border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:0in 0in 0in 0in;height:73.75pt">'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:1.0pt">&nbsp;</span></p>'+
                '<p class=MsoNormal><span style="font-size:10.0pt">&nbsp;</span></p>'+
                '<p class=TableParagraph align=center style="margin-top:.35pt;margin-right: 0in;margin-bottom:0in;margin-left:7.65pt;margin-bottom:.0001pt;text-align: center"><b><span style="font-size:7.5pt">Signature</span></b></p>'+
                '</td>'+
                '</tr>'+
                '<tr style="height:11.95pt">'+
                '<td width=738 colspan=10 style="width:553.85pt;border:solid black 1.0pt;border-top:none;padding:0in 0in 0in 0in;height:11.95pt">'+
                '<p class=TableParagraph style="margin-left:1.55pt;line-height:8.6pt"><b><span style="font-size:8.0pt;letter-spacing:-.2pt">Declaration:</span></b><b><span style="font-size:8.0pt;letter-spacing:-.5pt"> </span></b><span style="font-size:8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.2pt">We</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.4pt">'+
                '</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif; letter-spacing:-.2pt">declare</span><span style="font-size:8.0pt;font-family: Arial MT,sans-serif;letter-spacing:-.35pt"> </span><span style="font-size: 8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.2pt">that</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.4pt">'+
                '</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif; letter-spacing:-.2pt">this</span><span style="font-size:8.0pt;font-family: Arial MT,sans-serif;letter-spacing:-.35pt"> </span><span style="font-size: 8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.2pt">invoice</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.4pt">'+
                '</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif; letter-spacing:-.2pt">shown</span><span style="font-size:8.0pt;font-family: Arial MT,sans-serif;letter-spacing:-.35pt"> </span><span style="font-size: 8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.2pt">the</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.4pt">'+
                '</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif; letter-spacing:-.2pt">actual</span><span style="font-size:8.0pt;font-family: Arial MT,sans-serif;letter-spacing:-.35pt"> </span><span style="font-size: 8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.2pt">price</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.4pt">'+
                '</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif; letter-spacing:-.2pt">of</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif; letter-spacing:-.35pt"> </span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif; letter-spacing:-.2pt">the</span><span style="font-size:8.0pt;font-family: Arial MT,sans-serif;letter-spacing:-.4pt"> </span><span style="font-size: 8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.2pt">goods</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.35pt">'+
                '</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif; letter-spacing:-.2pt">described</span><span style="font-size:8.0pt; font-family:Arial MT,sans-serif;letter-spacing:-.35pt"> </span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.2pt">and</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.4pt">'+
                '</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif; letter-spacing:-.2pt">that</span><span style="font-size:8.0pt;font-family: Arial MT,sans-serif;letter-spacing:-.35pt"> </span><span style="font-size: 8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.2pt">all</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.4pt">'+
                '</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif; letter-spacing:-.2pt">particulars</span><span style="font-size:8.0pt; font-family:Arial MT,sans-serif;letter-spacing:-.35pt"> </span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.2pt">are</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.4pt">'+
                '</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif; letter-spacing:-.2pt">true</span><span style="font-size:8.0pt;font-family: Arial MT,sans-serif;letter-spacing:-.35pt"> </span><span style="font-size: 8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.2pt">and</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.4pt">'+
                '</span><span style="font-size:8.0pt;font-family:Arial MT,sans-serif;letter-spacing:-.2pt">correct.</span></p>'+
                '</td>'+
                '<td style="border:none;padding:0in 0in 0in 0in" width=2>'+
                '<p class="MsoNormal">&nbsp;'+
                '</td>'+
                '</tr>'+
                '<tr height=0>'+
                '<td width=2 style="border:none"></td>'+
                '<td width=28 style="border:none"></td>'+
                '<td width=236 style="border:none"></td>'+
                '<td width=47 style="border:none"></td>'+
                '<td width=101 style="border:none"></td>'+
                '<td width=22 style="border:none"></td>'+
                '<td width=20 style="border:none"></td>'+
                '<td width=58 style="border:none"></td>'+
                '<td width=101 style="border:none"></td>'+
                '<td width=123 style="border:none"></td>'+
                '<td width=2 style="border:none"></td>'+
                '</tr>'+


                '</table>'+
                '</div>'+
                '</body>'+
                '</html>';


			$("#container-PR_Form---Main--xcmglogo").attr("aria-hidden", "false");
			var ctrlString = "width=800px,height=1000px";
			var wind = window.open("", "Print window", ctrlString);

			wind.document.write(header,ITemHeader,ITemLoop,AfterLoop);
			wind.print();
			wind.close();

            // Get the content of the PDF as base64
            // var pdfContentBase64 = wind.document.body.innerHTML; 

            // // Construct the email parameters
            // var emailParams = {
            //     "Attachments": [
            //         {
            //             "@odata.type": "string",
            //             "ContentBytes": pdfContentBase64,
            //             "Name": "current_document.pdf"
            //         }
            //     ],
            //     "Body": {
            //         "Content": "Good Morning..."
            //     },
            //     "Subject": "Subject from API",
            //     "ToRecipients": [
            //         {
            //             "EmailAddress": {
            //                 "Address": "srinivas.nama@castaliaz.co.in",
            //                 "Name": "Srinivas Nama"
            //             }
            //         }
            //     ]
            // };

            // this.sendEmailViaIntegrationSuite(emailParams);

		}
            

        });
    });
