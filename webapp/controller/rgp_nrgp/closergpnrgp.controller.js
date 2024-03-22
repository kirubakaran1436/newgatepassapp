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

        return Controller.extend("gatepassapp.controller.rgp_nrgp.closergpnrgp", {
            onInit: function () {

                this.GetReceivedData = 0;
                this.GetActualQTYData = 0
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
                this.GetReceivedData = 0;
                this.getView().byId("id_received_h").setValue("0");
                
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

                        if(RGPNRGPl === "RGP"){
                            that.getView().byId("id_duedate_visible").setWidth("11rem")
                            that.getView().byId("id_dispatchdate_visible").setWidth(".1rem")
                            that.getView().byId("id_rgpnrgp_h").setValue("RGP")
                            
                        }else if(RGPNRGPl === "NRGP"){
                            that.getView().byId("id_dispatchdate_visible").setWidth("11rem")
                            that.getView().byId("id_duedate_visible").setWidth(".1rem")
                            that.getView().byId("id_rgpnrgp_h").setValue("NRGP")
                        }

                        that.getView().byId("id_gateentrystatus").setText(Status);
                        that.getView().byId("id_gateentrystatus").setVisible(true);

                        if(Status === "created"){
                            that.getView().byId("id_gateentrystatus").setStatus("Success");
                            that.getView().byId("id_close_button").setVisible(true);
                            that.getView().byId("id_cancel_button").setVisible(true);
                            that.getView().byId("id_update_button").setVisible(true);
                        }else if(Status === "deleted") {
                            that.getView().byId("id_gateentrystatus").setStatus("Error");
                            that.getView().byId("id_close_button").setVisible(false);
                            that.getView().byId("id_cancel_button").setVisible(false);
                            that.getView().byId("id_update_button").setVisible(false);
                        }else if(Status === "approved"){
                            that.getView().byId("id_gateentrystatus").setStatus("Success");
                            that.getView().byId("id_close_button").setVisible(false);
                            that.getView().byId("id_cancel_button").setVisible(false);
                            that.getView().byId("id_update_button").setVisible(true);
                        }else if(Status === "rejected"){
                            that.getView().byId("id_gateentrystatus").setStatus("Error");
                            that.getView().byId("id_close_button").setVisible(false);
                            that.getView().byId("id_cancel_button").setVisible(false);
                            that.getView().byId("id_update_button").setVisible(false);
                        }else if(Status === "completed"){
                            that.getView().byId("id_gateentrystatus").setStatus("Success");
                            that.getView().byId("id_close_button").setVisible(true);
                            that.getView().byId("id_cancel_button").setVisible(true);
                            that.getView().byId("id_update_button").setVisible(false);
                        }else if(Status === "closed"){
                            that.getView().byId("id_gateentrystatus").setStatus("Success");
                            that.getView().byId("id_close_button").setVisible(false);
                            that.getView().byId("id_cancel_button").setVisible(false);
                            that.getView().byId("id_update_button").setVisible(false);
                        }

                        that.getView().byId("id_sapuuid_h").setValue(value11.SAP_UUID);
                        that.getView().byId("id_screenstatus_h").setValue(Status);
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
                    this._dialog_RGPNRGP = sap.ui.xmlfragment(this.getView().getId("RGPNRGP_dialog"), "gatepassapp.view.rgp_nrgp.fragment.closergpnrgp", this);
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
                this.GetReceivedData = 0;
                this.getView().byId("id_received_h").setValue("0");
    
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

                            if(RGPNRGPl === "RGP"){
                                that.getView().byId("id_duedate_visible").setWidth("11rem")
                                that.getView().byId("id_dispatchdate_visible").setWidth(".1rem")
                                that.getView().byId("id_rgpnrgp_h").setValue("RGP")
                                
                            }else if(RGPNRGPl === "NRGP"){
                                that.getView().byId("id_dispatchdate_visible").setWidth("11rem")
                                that.getView().byId("id_duedate_visible").setWidth(".1rem")
                                that.getView().byId("id_rgpnrgp_h").setValue("NRGP")
                            }

                            that.getView().byId("id_gateentrystatus").setText(Status);
                            that.getView().byId("id_gateentrystatus").setVisible(true);
    
                            if(Status === "created"){
                                that.getView().byId("id_gateentrystatus").setStatus("Success");
                                that.getView().byId("id_close_button").setVisible(true);
                                that.getView().byId("id_cancel_button").setVisible(true);
                                that.getView().byId("id_update_button").setVisible(true);
                            }else if(Status === "deleted") {
                                that.getView().byId("id_gateentrystatus").setStatus("Error");
                                that.getView().byId("id_close_button").setVisible(false);
                                that.getView().byId("id_cancel_button").setVisible(false);
                                that.getView().byId("id_update_button").setVisible(false);
                            }else if(Status === "approved"){
                                that.getView().byId("id_gateentrystatus").setStatus("Success");
                                that.getView().byId("id_close_button").setVisible(true);
                                that.getView().byId("id_cancel_button").setVisible(true);
                                that.getView().byId("id_update_button").setVisible(true);
                            }else if(Status === "rejected"){
                                that.getView().byId("id_gateentrystatus").setStatus("Error");
                                that.getView().byId("id_close_button").setVisible(false);
                                that.getView().byId("id_cancel_button").setVisible(false);
                                that.getView().byId("id_update_button").setVisible(false);
                            }else if(Status === "completed"){
                                that.getView().byId("id_gateentrystatus").setStatus("Success");
                                that.getView().byId("id_close_button").setVisible(true);
                                that.getView().byId("id_cancel_button").setVisible(true);
                                that.getView().byId("id_update_button").setVisible(false);
                            }else if(Status === "closed"){
                                that.getView().byId("id_gateentrystatus").setStatus("Success");
                                that.getView().byId("id_close_button").setVisible(false);
                                that.getView().byId("id_cancel_button").setVisible(false);
                                that.getView().byId("id_update_button").setVisible(false);
                            }
    
    
                            that.getView().byId("id_plantcode_h").setValue(value11.PlantCode);
                            that.getView().byId("id_screenstatus_h").setValue(Status);
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

            OnClose:function(){
                var that = this;
                var Dafaf = that.getView();
                MessageBox.warning("Do you confirm to close...", {
                    actions: ["Confirm", "Cancel"],
                    emphasizedAction: "Confirm",
                    onClose: function (sAction) {
                       if(sAction === "Confirm"){
                
                        sap.ui.core.BusyIndicator.show();
        
                        var GateEntryNo = Dafaf.byId("id_gateentryno_h").getValue();
                        var SAP_UUID_H = Dafaf.byId("id_sapuuid_h").getValue();
                        var ActQty = Dafaf.byId("id_actualquantity_h").getValue();
                        var STausText = Dafaf.byId("id_gateentrystatus").getText();
                    
                        if( GateEntryNo !== "" && SAP_UUID_H !== ""){
                        // ---------- Start Item Level
                
                            that.GetReceivedData = 0
                            that.GetActualQTYData = 0
                            Dafaf.byId("id_received_h").setValue("0");
        
                            if(parseInt(ActQty) === 0 || ActQty === "0"){
        
                                var oEntry1 = {
                                    Status: "closed",
                                };

                                var Table_Id = that.getView().byId("id_rgpnrgp_table");
                                var Table_Length = Table_Id.getRows().length;
                                //#############
                                for (var i = 0; i < Table_Length; i++) {
                                    var oRow = Table_Id.getRows()[i];
                                    var oBindingContext = oRow.mAggregations;
                        
                                    if (oBindingContext) {
                                        let ItemNo = oBindingContext.cells[0].mProperties.value;
                                        var SAP_UUID_I = oBindingContext.cells[13].mProperties.value;
                        
                                        if (ItemNo !== "") {
                                            var Delete_Status = "closed";
                                            
                                        var itemData = {
                                            Status: Delete_Status
                                        };
                        
                                        var oModel_04 = that.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
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
                                //#############
                                                
                                var oModel05 = Dafaf.getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                                oModel05.setHeaders({
                                "X-Requested-With": "X",
                                "Content-Type": "application/json"
                                });
                        
                                oModel05.update("/YY1_ZRGP_NRGP_HEAD(guid'" + SAP_UUID_H + "')", oEntry1, {
                                success: function(data) {
                                    console.log("Header Updated:", data);
                                    oModel05.refresh(true);
        
                                    MessageBox.success("Gate Entry No " + GateEntryNo + " Closed", {
                                        title: "RGP NRGP ",
                                        id: "messageBoxId1",
                                        contentWidth: "100px",
                                    });
                        
                                    var oJSONModel = new sap.ui.model.json.JSONModel({
                                        data: {}
                                    });
                                    Dafaf.setModel(oJSONModel, "JModel");
                            
                                    Dafaf.byId("id_gateentryno_h").setValue("");
                                    Dafaf.byId("id_gateentryno_h").setSelectedKey("");
                                    Dafaf.byId("id_sapuuid_h").setValue("");
                                    Dafaf.byId("id_plantcode_h").setValue("");
                                    Dafaf.byId("id_plantname_h").setValue("");
                                    Dafaf.byId("id_suppliercode_h").setValue("");
                                    Dafaf.byId("id_suppliername_h").setValue("");
                                    Dafaf.byId("id_customercode_h").setValue("");
                                    Dafaf.byId("id_customername_h").setValue("");
                                    Dafaf.byId("id_requestor_h").setValue("");
                                    Dafaf.byId("id_valueininr_h").setValue("");
                                    Dafaf.byId("id_purchasematerialdoc_h").setValue("");
                                    Dafaf.byId("id_vehicleno_h").setValue("");
                                    Dafaf.byId("id_remark_h").setValue("");
                                    Dafaf.byId("id_gateentrystatus").setVisible(false);
                                    Dafaf.byId("id_update_button").setVisible(false);
                            
                                    sap.ui.core.BusyIndicator.hide();
                                },
                                error: function(error) {
                                    console.error("Error updating header:", error);
                                    sap.ui.core.BusyIndicator.hide();
                                }
                                });
        
                            }else{
                                sap.ui.core.BusyIndicator.hide();

                                MessageBox.warning("Some Quantity not received fully. Are you comfirm to close the document: "+GateEntryNo, {
                                    actions: ["Confirm", "Cancel"],
                                    emphasizedAction: "Confirm",
                                    onClose: function (sAction) {
                                        sap.ui.core.BusyIndicator.show();
                                       if(sAction === "Confirm"){
                                        var oEntry1 = {
                                            Status: "closed",
                                        };

                                var Table_Id = that.getView().byId("id_rgpnrgp_table");
                                var Table_Length = Table_Id.getRows().length;
                                //#############
                                for (var i = 0; i < Table_Length; i++) {
                                    var oRow = Table_Id.getRows()[i];
                                    var oBindingContext = oRow.mAggregations;
                        
                                    if (oBindingContext) {
                                        let ItemNo = oBindingContext.cells[0].mProperties.value;
                                        var SAP_UUID_I = oBindingContext.cells[13].mProperties.value;
                        
                                        if (ItemNo !== "") {
                                            var Delete_Status = "closed";
                                            
                                        var itemData = {
                                            Status: Delete_Status
                                        };
                        
                                        var oModel_04 = that.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
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
                                //#############
                                                        
                                        var oModel05 = Dafaf.getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                                        oModel05.setHeaders({
                                        "X-Requested-With": "X",
                                        "Content-Type": "application/json"
                                        });
                                
                                        oModel05.update("/YY1_ZRGP_NRGP_HEAD(guid'" + SAP_UUID_H + "')", oEntry1, {
                                        success: function(data) {
                                            console.log("Header Updated:", data);
                                            oModel05.refresh(true);
                
                                            MessageBox.success("Gate Entry No " + GateEntryNo + " Closed", {
                                                title: "RGP NRGP ",
                                                id: "messageBoxId1",
                                                contentWidth: "100px",
                                            });
                                
                                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                                data: {}
                                            });
                                            Dafaf.setModel(oJSONModel, "JModel");
                                    
                                            Dafaf.byId("id_gateentryno_h").setValue("");
                                            Dafaf.byId("id_gateentryno_h").setSelectedKey("");
                                            Dafaf.byId("id_sapuuid_h").setValue("");
                                            Dafaf.byId("id_plantcode_h").setValue("");
                                            Dafaf.byId("id_plantname_h").setValue("");
                                            Dafaf.byId("id_suppliercode_h").setValue("");
                                            Dafaf.byId("id_suppliername_h").setValue("");
                                            Dafaf.byId("id_customercode_h").setValue("");
                                            Dafaf.byId("id_customername_h").setValue("");
                                            Dafaf.byId("id_requestor_h").setValue("");
                                            Dafaf.byId("id_valueininr_h").setValue("");
                                            Dafaf.byId("id_purchasematerialdoc_h").setValue("");
                                            Dafaf.byId("id_vehicleno_h").setValue("");
                                            Dafaf.byId("id_remark_h").setValue("");
                                            Dafaf.byId("id_gateentrystatus").setVisible(false);
                                            Dafaf.byId("id_update_button").setVisible(false);
                                    
                                            sap.ui.core.BusyIndicator.hide();
                                        },
                                        error: function(error) {
                                            console.error("Error updating header:", error);
                                            sap.ui.core.BusyIndicator.hide();
                                        }
                                        });
        
                                       }else{
                                        MessageToast.show("Cancelled");
                                        sap.ui.core.BusyIndicator.hide();
                                       }
                                    }
                                });
                            }
        
                        }else{
                            MessageToast.show("Please Enter Valid Gate Pass No")
                            sap.ui.core.BusyIndicator.hide();
                        }
        
        
                       }else{
                        MessageToast.show("Cancelled");
                       }
                    }
                });
            },

            OnReceivedQtyCalc:function(ItemNo, Product, Quantity){
                var that = this; 
                let GatePassNo = that.getView().byId("id_gateentryno_h").getValue();

                if(ItemNo !== null && Product !== null && GatePassNo !== "" && Quantity !== ""){
                    return new Promise(function(resolve, reject) {
                    
                        var oFilter = new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, GatePassNo);
                        var oFilter1 = new sap.ui.model.Filter("ItemNo", sap.ui.model.FilterOperator.EQ, ItemNo);
                        var oFilter2 = new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, Product);
                        var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'created');
                        var oFilter4 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'approved');
                
                        var oModel = that.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4];
    
                        var CalData = 0;
                
                        oModel.read("/YY1_ITEMS_ZRGP_NRGP_HEAD", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results;
                                for (var i = 0; i < aItems.length; i++) {
                                    CalData += parseFloat(aItems[i].ReceivedQuantity);
                                }
                                resolve(CalData.toFixed(2)); // Resolve with the data
                            },
                            error: function(oError) {
                                console.error("Error reading data: ", oError);
                                reject(oError); // Reject with the error
                            }
                        });
                    }); 
                }

            },

            OnPendingQtyCalc:function(ItemNo, Product, Quantity){
                var that = this; 
                let GatePassNo = that.getView().byId("id_gateentryno_h").getValue();
                

                if(ItemNo !== null && Product !== null && Quantity !== null){
                    return new Promise(function(resolve, reject) {
                        
                        var GetDat = that.getView().byId("id_received_h").getValue();

                        console.log("GetDat GetDat :", GetDat);

                        // that.GetReceivedData = that.getView().byId("id_received_h").setValue(PutData.toFixed(2));

                        var oFilter = new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, GatePassNo);
                        var oFilter1 = new sap.ui.model.Filter("ItemNo", sap.ui.model.FilterOperator.EQ, ItemNo);
                        var oFilter2 = new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, Product);
                        var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'created');
                        var oFilter4 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'approved');
                
                        var oModel = that.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4];
    
                        var CalData = 0;
                
                        oModel.read("/YY1_ITEMS_ZRGP_NRGP_HEAD", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results;
                                // console.log("aItems:", aItems)
                                // console.log("aItems Length:", aItems.length)
                                for (var i = 0; i < aItems.length; i++) {
                                    CalData += parseFloat(aItems[i].ReceivedQuantity);
                                }
                                
                                let FinalData = parseFloat(Quantity) - parseFloat(CalData);
                                console.log("FinalData:", FinalData);
                                that.GetReceivedData += FinalData;
                                console.log("that.GetReceivedData:", that.GetReceivedData);
                                that.getView().byId("id_received_h").setValue(that.GetReceivedData);
                                that.getView().byId("id_actualquantity_h").setValue(that.GetReceivedData);
                                
                                resolve(FinalData.toFixed(2)); // Resolve with the data
                            },
                            error: function(oError) {
                                console.error("Error reading data: ", oError);
                                reject(oError); // Reject with the error
                            }
                        });
                        
                    }); 
                }

            },

            OnEnterQuantityValue:function(ItemNo){
                if(ItemNo !== null){
                    return new Promise(function(resolve, reject) {
                        
                        resolve("0.00");
    
                    }); 
    
                }
            },

            OnEnterQuantityED:function(ItemNo, Product, Quantity){
                var that = this; 
                let GatePassNo = that.getView().byId("id_gateentryno_h").getValue();
                

                if(ItemNo !== null && Product !== null && Quantity !== null){
                    return new Promise(function(resolve, reject) {
                        
                        var GetDat = that.getView().byId("id_received_h").getValue();

                        console.log("GetDat GetDat :", GetDat);

                        // that.GetReceivedData = that.getView().byId("id_received_h").setValue(PutData.toFixed(2));

                        var oFilter = new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, GatePassNo);
                        var oFilter1 = new sap.ui.model.Filter("ItemNo", sap.ui.model.FilterOperator.EQ, ItemNo);
                        var oFilter2 = new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, Product);
                        var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'created');
                        var oFilter4 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'approved');
                
                        var oModel = that.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4];
    
                        var CalData = 0;
                
                        oModel.read("/YY1_ITEMS_ZRGP_NRGP_HEAD", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results;
                                // console.log("aItems:", aItems)
                                // console.log("aItems Length:", aItems.length)
                                for (var i = 0; i < aItems.length; i++) {
                                    CalData += parseFloat(aItems[i].ReceivedQuantity);
                                }
                                
                                let FinalData = parseFloat(Quantity) - parseFloat(CalData);
                                if(FinalData === 0 || FinalData === "0.00"){
                                    var Status = false;
                                }else{
                                    var Status = true;
                                }
                                
                                resolve(Status); // Resolve with the data
                            },
                            error: function(oError) {
                                console.error("Error reading data: ", oError);
                                reject(oError); // Reject with the error
                            }
                        });
                        
                    }); 
                }

            },

            OnEnterQuantityCalc:function(oEvent){
                // sap.ui.core.BusyIndicator.show();
                let ItemNo = (oEvent.getSource().getParent().getCells()[0].getValue()).trim(); 
                let Product = (oEvent.getSource().getParent().getCells()[1].getValue()).trim(); 
                let EnterQuantity01 = oEvent.getSource().getParent().getCells()[6].getValue().trim(); 
                let PendingQuantity01 = oEvent.getSource().getParent().getCells()[5].getValue(); 
                let OrderQuantity = oEvent.getSource().getParent().getCells()[3].getValue(); 
                let DueDate = oEvent.getSource().getParent().getCells()[10].getValue(); 
                let SinglePenQuantity = this.getView().byId("id_received_h").getValue();
                let ActualPenQuantity = this.getView().byId("id_actualquantity_h").getValue();

                 // ----Start For Current Date -----
                     var today = new Date();
                     var dd = '' + today.getDate();
                     var mm = '' + (today.getMonth() + 1); //January is 0!
                     if (mm.length < 2) {
                         mm = '0' + mm;
                     }
                     if (dd.length < 2) {
                         dd = '0' + dd;
                     }
                     var yyyy = today.getFullYear();
                     let CurrentDate = yyyy + '-' + mm + '-' + dd;
                // ----Start For Current Date -----

                let EnterQuantity = parseFloat(EnterQuantity01);
                let PendingQuantity = parseFloat(PendingQuantity01);

                if(EnterQuantity === ""){
                    oEvent.getSource().getParent().getCells()[6].setValue("0");
                    // sap.ui.core.BusyIndicator.hide();
                }else{
                    var that = this; 
                    let GatePassNo = that.getView().byId("id_gateentryno_h").getValue();

                    var oFilter = new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, GatePassNo);
                    var oFilter1 = new sap.ui.model.Filter("ItemNo", sap.ui.model.FilterOperator.EQ, ItemNo);
                    var oFilter2 = new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, Product);
                    var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'created');
                    var oFilter4 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'approved');
                
                    let oModel = that.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                    let oFilters = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4];
    
                    oModel.read("/YY1_ITEMS_ZRGP_NRGP_HEAD", {
                        filters: oFilters,
                        success: function(oData) {
                            var aItems = oData.results[0];
                            console.log("aItems:", aItems)
                            console.log("aItems ReceivedQuantity:", aItems.ReceivedQuantity)
                                let PastQuantity = parseFloat(aItems.ReceivedQuantity);
                                console.log("PastQuantity:", PastQuantity)

                            if(PendingQuantity >= EnterQuantity){
                                
                                if(DueDate >= CurrentDate){
                                    console.log("The Enter Quantity is EQ/Less the  Pending :", EnterQuantity)
                                    oEvent.getSource().getParent().getCells()[6].setValue(EnterQuantity.toFixed(2));
                                    
                                    if(EnterQuantity === ""){
                                        SinglePenQuantity = 0;
                                    }
                                    let ENterVal = parseFloat(ActualPenQuantity) - parseFloat(EnterQuantity);
                                    that.getView().byId("id_actualquantity_h").setValue(ENterVal)
                                    if(ENterVal === 0){
                                        console.log("Completed")
                                    }

                                    }else{
                                    MessageBox.confirm("Due date is Expired. Do you want to allow this entry ?", {
                                        actions: ["Allow", MessageBox.Action.CANCEL],
                                        emphasizedAction: "Allow",
                                        onClose: function (sAction) {
                                            if(sAction === "Allow"){
                                                console.log("The Enter Quantity is EQ/Less the  Pending :", EnterQuantity)
                                                oEvent.getSource().getParent().getCells()[6].setValue(EnterQuantity.toFixed(2));

                                                let ENterVal = parseFloat(ActualPenQuantity) - parseFloat(EnterQuantity);
                                                that.getView().byId("id_actualquantity_h").setValue(ENterVal)
                                                if(ENterVal === 0){
                                                    console.log("Completed")
                                                }
            
                                            }else{
                                                console.log("The Enter Quantity is EQ/Less the  Pending :", PastQuantity)
                                                oEvent.getSource().getParent().getCells()[6].setValue("0");
                                                MessageToast.show("Cancelled");
                                                that.getView().byId("id_actualquantity_h").setValue(SinglePenQuantity)
                                            }
                                        }
                                    });
                                }
                            }else if(PendingQuantity < EnterQuantity){
                                
                                console.log("The Enter Quantity is Greaterthan the  Pending:", PastQuantity)
                                oEvent.getSource().getParent().getCells()[6].setValue("0");
                                that.getView().byId("id_actualquantity_h").setValue(SinglePenQuantity)
                            }
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function(oError) {
                            console.error("Error reading data: ", oError);
                            // sap.ui.core.BusyIndicator.hide();
                        }
                    });
                }

            },

            OnUpdate:async function(){

                var that = this;
                
                sap.ui.core.BusyIndicator.show();

                var GateEntryNo = that.getView().byId("id_gateentryno_h").getValue();
                var SAP_UUID_H = that.getView().byId("id_sapuuid_h").getValue();
                var ActQty = that.getView().byId("id_actualquantity_h").getValue();
                var STausText = that.getView().byId("id_gateentrystatus").getText();
            
                if( GateEntryNo !== "" && SAP_UUID_H !== ""){
                // ---------- Start Item Level

                await that.ToSaveItemsFunc(GateEntryNo);

                    that.GetReceivedData = 0
                    that.GetActualQTYData = 0
                    that.getView().byId("id_received_h").setValue("0");

                    if(parseInt(ActQty) === 0 || ActQty === "0"){

                        var oEntry1 = {
                            Status: "completed",
                            NRStatus: "completed",
                        };
                
                        var that = that;
                
                        var oModel05 = that.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                        oModel05.setHeaders({
                        "X-Requested-With": "X",
                        "Content-Type": "application/json"
                        });
                
                        oModel05.update("/YY1_ZRGP_NRGP_HEAD(guid'" + SAP_UUID_H + "')", oEntry1, {
                        success: function(data) {
                            console.log("Header Updated:", data);
                            oModel05.refresh(true);

                            MessageBox.success("Gate Entry No " + GateEntryNo + " Completed", {
                                title: "RGP NRGP ",
                                id: "messageBoxId1",
                                contentWidth: "100px",
                            });
                
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
                            that.getView().byId("id_update_button").setVisible(false);
                    
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function(error) {
                            console.error("Error updating header:", error);
                            sap.ui.core.BusyIndicator.hide();
                        }
                        });

                    }else{
                        var oEntry1 = {
                            Status: STausText,
                            NRStatus: "received",
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
                            oModel05.refresh(true);

                            MessageBox.success("Gate Entry No " + GateEntryNo + " Updated", {
                                title: "RGP NRGP ",
                                id: "messageBoxId1",
                                contentWidth: "100px",
                            });
                
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
                            that.getView().byId("id_update_button").setVisible(false);
                    
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function(error) {
                            console.error("Error updating header:", error);
                            sap.ui.core.BusyIndicator.hide();
                        }
                        });

                    }

                }else{
                    MessageToast.show("Please Enter Valid Gate Pass No")
                    sap.ui.core.BusyIndicator.hide();
                }

            },

            ToSaveItemsFunc:function(GetData){

                return new Promise((resolve, reject) => {
                    var that = this;
                    var Table_Id = that.getView().byId("id_rgpnrgp_table");
                    var Table_Length = Table_Id.getRows().length;
        
                    for (var i = 0; i < Table_Length; i++) {
                    var oRow = Table_Id.getRows()[i];
                    var oBindingContext = oRow.mAggregations;
        
                    if (oBindingContext) {
                        
                        var SAP_UUID_I = oBindingContext.cells[13].mProperties.value;
                        var ReceivedOverall = oBindingContext.cells[4].mProperties.value;
                        var ReceivedQuantity1 = oBindingContext.cells[6].mProperties.value;
                        var ItemNo = oBindingContext.cells[0].mProperties.value;
        
                        if (ItemNo !== "" && ReceivedQuantity1 !== "") {
                            console.log("ReceivedOverall:", ReceivedOverall)
                            console.log("ReceivedQuantity1:", ReceivedQuantity1)
                            var ReceivedQuantity = (parseFloat(ReceivedOverall) + parseFloat(ReceivedQuantity1)).toFixed(2);
                                ReceivedQuantity = String(ReceivedQuantity);
                            console.log("String(parseFloat(ReceivedOverall) + parseFloat(ReceivedQuantity1));", String(parseFloat(ReceivedOverall) + parseFloat(ReceivedQuantity1)))
                            
                        var itemData = {
                            ReceivedQuantity: ReceivedQuantity
                        };
        
                        var oModel_04 = that.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                            oModel_04.setHeaders({
                                "X-Requested-With": "X",
                                "Content-Type": "application/json"
                            });
        
                        oModel_04.update("/YY1_ITEMS_ZRGP_NRGP_HEAD(guid'" + SAP_UUID_I + "')", itemData, {
                            success: function(data) {
                            console.log("Item Updated:", data);
                            sap.ui.core.BusyIndicator.hide();
                            that.GetReceivedData = 0;
                            that.GetActualQTYData = 0;
                            resolve(data)
                            },
                            error: function(error) {
                            console.error("Error updating item:", error);
                            sap.ui.core.BusyIndicator.hide();
                            reject(new Error("Validation failed"))
                            }
                        });
                        }
                      }
                    }
    
                });

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
                    let ItemNo = oBindingContext.cells[0].mProperties.value;
                    var SAP_UUID_I = oBindingContext.cells[13].mProperties.value;
    
                    if (ItemNo !== "") {
                        var Delete_Status = "rejected";
                        
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
                    Status: "rejected",
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
