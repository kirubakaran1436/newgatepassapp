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

        return Controller.extend("gatepassapp.controller.rgp_nrgp.approvergpnrgp", {
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
                        var GateType = value11.GateType;
                        if(GateType === "With Code"){
                            that.getView().byId("id_product_i1").setWidth("11rem");
                        }else if(GateType === "Without Code"){
                            that.getView().byId("id_product_i1").setWidth("0rem");
                        }

                        var rgpSelectBox = that.getView().byId("id_rgpnrgp_h");

                            if(RGPNRGPl === "RGP"){
                                that.getView().byId("id_duedate_visible").setWidth("11rem")
                                that.getView().byId("id_dispatchdate_visible").setWidth(".1rem")
                                rgpSelectBox.setValue("RGP");
                                
                            }else if(RGPNRGPl === "NRGP"){
                                that.getView().byId("id_dispatchdate_visible").setWidth("11rem")
                                that.getView().byId("id_duedate_visible").setWidth(".1rem")
                                rgpSelectBox.setValue("NRGP");
                            }

                        that.getView().byId("id_gateentrystatus").setText(Status);
                        that.getView().byId("id_gateentrystatus").setVisible(true);

                        if(Status === "created"){
                            that.getView().byId("id_gateentrystatus").setStatus("Success");
                            that.getView().byId("id_approve_button").setVisible(true);
                            that.getView().byId("id_reject_button").setVisible(true);
                        }else if(Status === "deleted") {
                            that.getView().byId("id_gateentrystatus").setStatus("Error");
                            that.getView().byId("id_approve_button").setVisible(false);
                            that.getView().byId("id_reject_button").setVisible(false);
                        }else if(Status === "approved" || Status === "completed" || Status === "closed"){
                            that.getView().byId("id_gateentrystatus").setStatus("Success");
                            that.getView().byId("id_approve_button").setVisible(false);
                            that.getView().byId("id_reject_button").setVisible(false);
                        }else if(Status === "rejected"){
                            that.getView().byId("id_gateentrystatus").setStatus("Error");
                            that.getView().byId("id_approve_button").setVisible(false);
                            that.getView().byId("id_reject_button").setVisible(false);
                        }

                        that.getView().byId("id_sapuuid_h").setValue(value11.SAP_UUID);
                        that.getView().byId("id_plantcode_h").setValue(value11.PlantCode);
                        that.getView().byId("id_plantname_h").setValue(value11.PlantName);
                        that.getView().byId("id_suppliercode_h").setValue(value11.SupplierCode);
                        that.getView().byId("id_suppliername_h").setValue(value11.SupplierName);
                        that.getView().byId("id_customercode_h").setValue(value11.CustomerCode);
                        that.getView().byId("id_customername_h").setValue(value11.CustomerName);
                        that.getView().byId("id_requestor_h").setValue(value11.PlantCode);
                        that.getView().byId("id_valueininr_h").setValue(value11.ValueInINR);
                        that.getView().byId("id_purchasematerialdoc_h").setValue(value11.ReferenceDocumentNo);
                        that.getView().byId("id_vehicleno_h").setValue(value11.VehicleNo);
                        that.getView().byId("id_remark_h").setValue(value11.Remarks);  
                        that.getView().byId("id_transporttype_h").setValue(value11.TransporterMode);  
                        that.getView().byId("id_vehicletype_h").setValue(value11.VehicleType);  

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
                    this._dialog_RGPNRGP = sap.ui.xmlfragment(this.getView().getId("RGPNRGP_dialog"), "gatepassapp.view.rgp_nrgp.fragment.approvergpnrgp", this);
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
                            var GateType = value11.GateType;
                            if(GateType === "With Code"){
                                that.getView().byId("id_product_i1").setWidth("11rem");
                            }else if(GateType === "Without Code"){
                                that.getView().byId("id_product_i1").setWidth("0rem");
                            }

                            var rgpSelectBox = that.getView().byId("id_rgpnrgp_h");

                            if(RGPNRGPl === "RGP"){
                                that.getView().byId("id_duedate_visible").setWidth("11rem")
                                that.getView().byId("id_dispatchdate_visible").setWidth(".1rem")
                                rgpSelectBox.setValue("RGP");
                                
                            }else if(RGPNRGPl === "NRGP"){
                                that.getView().byId("id_dispatchdate_visible").setWidth("11rem")
                                that.getView().byId("id_duedate_visible").setWidth(".1rem")
                                rgpSelectBox.setValue("NRGP");
                            }

                            that.getView().byId("id_gateentrystatus").setText(Status);
                            that.getView().byId("id_gateentrystatus").setVisible(true);
    
                            if(Status === "created"){
                                that.getView().byId("id_gateentrystatus").setStatus("Success");
                                that.getView().byId("id_approve_button").setVisible(true);
                                that.getView().byId("id_reject_button").setVisible(true);
                            }else if(Status === "deleted") {
                                that.getView().byId("id_gateentrystatus").setStatus("Error");
                                that.getView().byId("id_approve_button").setVisible(false);
                                that.getView().byId("id_reject_button").setVisible(false);
                            }else if(Status === "approved"){
                                that.getView().byId("id_gateentrystatus").setStatus("Success");
                                that.getView().byId("id_approve_button").setVisible(false);
                                that.getView().byId("id_reject_button").setVisible(false);
                            }else if(Status === "rejected"){
                                that.getView().byId("id_gateentrystatus").setStatus("Error");
                                that.getView().byId("id_approve_button").setVisible(false);
                                that.getView().byId("id_reject_button").setVisible(false);
                            }
    
    
                            that.getView().byId("id_plantcode_h").setValue(value11.PlantCode);
                            that.getView().byId("id_plantname_h").setValue(value11.PlantName);
                            that.getView().byId("id_suppliercode_h").setValue(value11.SupplierCode);
                            that.getView().byId("id_suppliername_h").setValue(value11.SupplierName);
                            that.getView().byId("id_customercode_h").setValue(value11.CustomerCode);
                            that.getView().byId("id_customername_h").setValue(value11.CustomerName);
                            that.getView().byId("id_requestor_h").setValue(value11.PlantCode);
                            that.getView().byId("id_valueininr_h").setValue(value11.ValueInINR);
                            that.getView().byId("id_purchasematerialdoc_h").setValue(value11.ReferenceDocumentNo);
                            that.getView().byId("id_vehicleno_h").setValue(value11.VehicleNo);
                            that.getView().byId("id_remark_h").setValue(value11.Remarks);  
                            that.getView().byId("id_transporttype_h").setValue(value11.TransporterMode);  
                            that.getView().byId("id_vehicletype_h").setValue(value11.VehicleType); 
    
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

            OnApprove:function(){
                sap.ui.core.BusyIndicator.show();

                let GateEntryNo = this.getView().byId("id_gateentryno_h").getValue();
                let SAP_UUID_H = this.getView().byId("id_sapuuid_h").getValue();

                if( GateEntryNo !== "" && SAP_UUID_H !== ""){
                // ---------- Start Item Level
    
                var Table_Id = this.getView().byId("id_rgpnrgp_table");
                var Table_Length = Table_Id.getRows().length;
    
                for (var i = 0; i < Table_Length; i++) {
                var oRow = Table_Id.getRows()[i];
                var oBindingContext = oRow.mAggregations;
    
                if (oBindingContext) {
                    let ItemNo = oBindingContext.cells[1].mProperties.value;
                    var SAP_UUID_I = oBindingContext.cells[10].mProperties.value;
    
                    if (ItemNo !== "") {
                        var Delete_Status = "approved";
                        
                    var itemData = {
                        Status: Delete_Status,
                        ApproveStatus:""
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
                    Status: "approved",
                    ApproveStatus: "",
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

                    sap.ui.core.BusyIndicator.hide();
                },
                error: function(error) {
                    console.error("Error updating header:", error);
                    MessageToast.show(" "+GateEntryNo+" Not Deleted")
                    sap.ui.core.BusyIndicator.hide();
                }
                });

            }else{
                MessageToast.show("Please Enter Valid Gate Pass No")
                sap.ui.core.BusyIndicator.hide();
            }
    
            },

            OnReject:function(){
                sap.ui.core.BusyIndicator.show();

                let GateEntryNo = this.getView().byId("id_gateentryno_h").getValue();
                let SAP_UUID_H = this.getView().byId("id_sapuuid_h").getValue();

                if( GateEntryNo !== "" && SAP_UUID_H !== ""){
                // ---------- Start Item Level
    
                var Table_Id = this.getView().byId("id_rgpnrgp_table");
                var Table_Length = Table_Id.getRows().length;
    
                for (var i = 0; i < Table_Length; i++) {
                var oRow = Table_Id.getRows()[i];
                var oBindingContext = oRow.mAggregations;
    
                if (oBindingContext) {
                    let ItemNo = oBindingContext.cells[1].mProperties.value;
                    var SAP_UUID_I = oBindingContext.cells[10].mProperties.value;
    
                    if (ItemNo !== "") {
                        var Delete_Status = "rejected";
                        
                    var itemData = {
                        Status: Delete_Status,
                        ApproveStatus: ""
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
                    Status: "rejected",
                    ApproveStatus: "",
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

                    sap.ui.core.BusyIndicator.hide();
                },
                error: function(error) {
                    console.error("Error updating header:", error);
                    MessageToast.show(" "+GateEntryNo+" Not Deleted")
                    sap.ui.core.BusyIndicator.hide();
                }
                });

            }else{
                MessageToast.show("Please Enter Valid Gate Pass No")
                sap.ui.core.BusyIndicator.hide();
            }
    
            },

        });
    });
