sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    'sap/m/SearchField',
    'sap/ui/model/type/String',
    'sap/m/ColumnListItem',
    'sap/m/Label',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/ui/model/json/JSONModel",
    'sap/ui/comp/library',
	'sap/m/Token',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/table/Column',
	'sap/m/Column',
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, Device, SearchField, TypeString, ColumnListItem, Label, Filter, UIComponent, FilterOperator, JSONModel,library,Token,ODataModel,Column,MessageToast) {
        "use strict";

        return Controller.extend("gatepassapp.controller.inward.generalpurchase.editcontroller", {
            
            onInit: function () {  

                    // ----Start For Current Date -----
                    this.JSonModelMadDatas = new sap.ui.model.json.JSONModel({
                        Datas : []
                    });
                    this.getView().setModel(this.JSonModelMadDatas, "JSonModelMadDatas");
    
                },
        

            OnGateEntryDocSuggest: function (oEvent) {
            //   alert("this is test");
                sap.ui.core.BusyIndicator.show();

                var oItem = oEvent.getParameter("selectedItem");
                var GetKey = oItem ? oItem.getKey() : "";
                var GetValue = oItem ? oItem.getText() : "";

                // Do something with key and text values
                console.log(oItem);
                console.log("Selected Key:", GetKey);
                console.log("Selected Text:", GetValue);

                var filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, GetValue);
                var model0 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                var model011 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                var that = this;
                    model0.read("/YY1_ZGE_INWARD_GATEPASS", {
                        filters: [filter], 
                        success: function (ODat, oRespons) {
                            let oMultiInput20 = that.getView().byId("id_edit_document_no_h");
                            
                                model0.read("/YY1_HEADER_ZGE_INWARD_GATEPASS", {
                                    filters : [filter],
                                    success:function(GetHeader){
                                        let HeaderDatas = GetHeader.results;
                                        console.log("HeaderDatasSuggest:", HeaderDatas);
                                        if (HeaderDatas && HeaderDatas.length > 0) {
                                            HeaderDatas.forEach(function (oItem) {
                                                oMultiInput20.addToken(new sap.m.Token({
                                                    text: oItem.ReferenceDocument,
                                                    key: oItem.ReferenceDocument
                                                }));
                                                that.InitialDelDocNo.push(oItem.ReferenceDocument)
                                            });
                                            // console.log("HeaderDatas[0].ReferenceDocumentYear", HeaderDatas[0].ReferenceDocumentYear);
                                            // that.getView().byId("id_edit_document_year_h").setValue(HeaderDatas[0].ReferenceDocumentYear);
                                        }
                                    },
                                    error:function(){
                                        console.log("errorHeaderDatas")
                                    }
                                });
                            var value11 = ODat.results[0];  
                            var SAPUIID = value11.SAP_UUID;
                            var Status1 = value11.Status;

                            if(Status1 === "deleted"){
                                that.getView().byId("DeleteIndicId").setVisible(true); 
                                that.getView().byId("id_update_button").setVisible(false); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false); 
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(true); 
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(true); 
                            }else if(Status1 === "approved" || Status1 === "rejected"){
                                that.getView().byId("DeleteIndicId").setVisible(false); 
                                that.getView().byId("id_update_button").setVisible(false); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false); 
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);
                            }else{
                                that.getView().byId("DeleteIndicId").setVisible(false); 
                                that.getView().byId("id_update_button").setVisible(true); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(true); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(true); 
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);
                            }

                            let EWayBill = value11.EWayBill;
                            let GateEntryDate = value11.GateEntryDate;
                            let VehicleType = value11.VehicleType;
                            let VehicleNo = value11.VehicleNo;
                            let InvoiceNo = value11.InvoiceNo;
                            let InvoiceDate = value11.InvoiceDate;
                            let Transporter = value11.Transporter;
                            let TransporterMode = value11.TransporterMode;
                            let LRNo = value11.LRNo;
                            let LRDate = value11.LRDate;
                            let GrossWeight = value11.GrossWeight;
                            let WeightTime = value11.WeightTime;
                            let WeightDate = value11.WeightDate;
                            let NoOfPackages = value11.NoOfPackages;
                            let Remarks = value11.Remarks;
                            let Status = value11.Status;
                            let ScreenCode = value11.ScreenCode;
                            let TareWeight = value11.TareWeight;
                            let NetWeight = value11.NetWeight;
                            let DelDocGrossWeight = value11.DelDocGrossWeight;

                            that.getView().byId("id_edit_gateentry_h").setValue(value11.Id);
                            that.getView().byId("id_edit_sapuuid_h").setValue(value11.SAP_UUID);

                            var dd = '' + GateEntryDate.getDate();
                            var mm = '' + (GateEntryDate.getMonth() + 1); //January is 0!
                            if (mm.length < 2) {
                                mm = '0' + mm;
                            }
                            if (dd.length < 2) {
                                dd = '0' + dd;
                            }
                            var yyyy = GateEntryDate.getFullYear();
                            let GateEntryDate01 = yyyy + '-' + mm + '-' + dd;
                            that.getView().byId("id_edit_gate_date").setValue(GateEntryDate01)
                            that.getView().byId("id_edit_vehicle_type_h").setValue(VehicleType)
                            that.getView().byId("id_edit_vehno_h").setValue(VehicleNo)
                            that.getView().byId("id_edit_transporter_mode_h").setValue(TransporterMode)
                            that.getView().byId("id_edit_transporter_h").setValue(Transporter)
                            // that.getView().byId("id_edit_sto_del_doc_wt_h").setValue(DelDocGrossWeight)
                            that.getView().byId("id_edit_tar_wt_h").setValue(TareWeight)
                            that.getView().byId("id_edit_net_wt_h").setValue(NetWeight)
                            that.getView().byId("id_edit_gross_wt_h").setValue(GrossWeight)
                            // that.getView().byId("id_edit_sto_wt_dt_time_h").setValue(WeightTime)
                            that.getView().byId("id_edit_invoice_no_h").setValue(value11.InvoiceNo)
                            that.getView().byId("id_edit_invoice_date_h").setValue(value11.InvoiceDate)
                            that.getView().byId("id_edit_lrno_h").setValue(value11.No)
                            that.getView().byId("id_edit_noofpackages_h").setValue(value11.NoOfPackages)
                            that.getView().byId("id_edit_lrdate_h").setValue(value11.LRDate)
                            that.getView().byId("id_edit_ewaybill_h").setValue(value11.EWayBill)
                            that.getView().byId("id_edit_remark_h").setValue(Remarks)
                            
                            model011.read("/YY1_ZGE_INWARD_GATEPASS(guid'" + SAPUIID + "')/to_ITEM", {
                            
                                success: function (oData) {
                                var oJSONModeledit = new sap.ui.model.json.JSONModel({
                                    datasedit: oData.results
                                });
                                that.getView().setModel(oJSONModeledit, "JModeledit");
                                that.getView().byId("TableId_Edit").setVisible(true)
                                sap.ui.core.BusyIndicator.hide();
                                },
                                error: function (oError) {
                                    console.log(oError);
                                    that.getView().byId("TableId_Edit").setVisible(false)
                                    sap.ui.core.BusyIndicator.hide();
                                }
                            });              
                    },
                
                    error: function (oError) {
                        console.log(oError);
                        sap.ui.core.BusyIndicator.hide();
                    }
        
                });

        },    
        
        OnQtyCalEditED: function(DocItem, DocHead, OrderQuantity) {

            var that = this; // Store reference to 'this'
            if(DocItem !== null && DocHead !== null && OrderQuantity !== null){
                var DocItem = DocItem;
                var DocHead = DocHead;
                var OrderQuantity = OrderQuantity;

                console.log("DocItem:", DocItem)
                console.log("DocHead:", DocHead)
                console.log("DocOrderQuantitytem:", OrderQuantity)
            
                return new Promise(function(resolve, reject) {
            
                    var oFilter = new sap.ui.model.Filter("ItemNo", sap.ui.model.FilterOperator.EQ, DocItem);
                    var oFilter1 = new sap.ui.model.Filter("ReferenceDocument", sap.ui.model.FilterOperator.EQ, DocHead);
                    var oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'created');
                    var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE3');
                    var oFilter4 = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, 'created'),
                            new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, '')
                        ],
                        and: false
                    });
            
                    var oModel2 = that.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                    var oFilters = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4];

                    var CalData = 0;
            
                    oModel2.read("/YY1_ITEM_ZGE_INWARD_GATEPASS", {
                        filters: oFilters,
                        success: function(oData) {
                            var aItems = oData.results;
                            console.log("aItems:", aItems)
                            for (var i = 0; i < aItems.length; i++) {
                                CalData += parseFloat(aItems[i].QuantityInGE);
                            }
                            console.log("---------------------------------------------");
                            console.log(OrderQuantity);
                            console.log("CalData:", CalData);
                            var FinalData = parseFloat(OrderQuantity) - parseFloat(CalData);
                            console.log(FinalData);
                            console.log("---------------------------------------------");
                            if (FinalData === 0 || FinalData === "0"){
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
        
        OnEditFragOpen:function(oEvent){
            if (!this.OnEditFragOpen001) {
                this.OnEditFragOpen001 = sap.ui.xmlfragment(this.getView().getId("Edit_Frag_Id"), "gatepassapp.view.inward.generalpurchase.fragment.changedeletedocument", this);
                this.getView().addDependent(this.OnEditFragOpen001);
            }
            this.OnEditFragOpen001.open();
        },

        OnGateEntryNoFragOpen:function(oEvent){
            if (!this.SoDocChange) {
                this.SoDocChange = sap.ui.xmlfragment(this.getView().getId("GateEntryDocNoId"), "gatepassapp.view.inward.generalpurchase.fragment.gateentrydocno", this);                this.getView().addDependent(this.SoDocChange);
            }
            this.SoDocChange.open();
        },
        
        OnGateEntryDocSelect : function (oEvent) {
            sap.ui.core.BusyIndicator.show();
            
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);
        
            var aContexts = oEvent.getParameter("selectedContexts");
        
            if (aContexts === undefined){
                console.log("undefined");
                sap.ui.core.BusyIndicator.hide();
                // this._pBusyDialog.close();
                let Dataa = this.getView().byId("id_edit_gateentry_h").getValue();
                if(Dataa === ""){
                    this.getView().byId("Final_Update_Button").setEnabled(false);
                    this.getView().byId("Final_Delete_Button").setEnabled(false);
                    this.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
                    sap.ui.core.BusyIndicator.hide();
                }
                
            }else{

                var multiInput = this.getView().byId("id_edit_document_no_h");
                    multiInput.removeAllTokens();
                this.InitialDelDocNo = []; // Delivery Document No Based on create page gatepass no
        
                var value1 , value2;
        
                if (aContexts && aContexts.length) {
        
                    aContexts.map(function (oContext) {
                        value1 = oContext.getObject().Id;
                        value2 = oContext.getObject().SAP_UUID;
                        return;
                    });
                    this.getView().byId("id_edit_gateentry_h").setValue(value1);
                    this.getView().byId("id_edit_sapuuid_h").setValue(value2);
                }
        
                var filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, value1);
                var model0 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                var model011 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                var that = this;
                    model0.read("/YY1_ZGE_INWARD_GATEPASS", {
                        filters: [filter], 
                        success: function (ODat, oRespons) {
                            let oMultiInput20 = that.getView().byId("id_edit_document_no_h");
                            
                                model0.read("/YY1_HEADER_ZGE_INWARD_GATEPASS", {
                                    filters : [filter],
                                    success:function(GetHeader){
                                        let HeaderDatas = GetHeader.results;
                                        console.log("HeaderDatas:", HeaderDatas);
                                        if (HeaderDatas && HeaderDatas.length > 0) {
                                            HeaderDatas.forEach(function (oItem) {
                                                oMultiInput20.addToken(new sap.m.Token({
                                                    text: oItem.ReferenceDocument,
                                                    key: oItem.ReferenceDocument
                                                }));
                                                that.InitialDelDocNo.push(oItem.ReferenceDocument)
                                            });
                                        }
                                    },
                                    error:function(){
                                        console.log("errorHeaderDatas")
                                    }
                                })
                            var value11 = ODat.results[0];  
                            var SAPUIID = value11.SAP_UUID;
                            var Status1 = value11.Status;

                            if(Status1 === "deleted"){
                                that.getView().byId("DeleteIndicId").setVisible(true); 
                                that.getView().byId("id_update_button").setVisible(false); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false); 
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(true); 
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(true); 
                            }else if(Status1 === "approved" || Status1 === "rejected"){
                                that.getView().byId("DeleteIndicId").setVisible(false); 
                                that.getView().byId("id_update_button").setVisible(false); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false); 
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);
                            }else{
                                that.getView().byId("DeleteIndicId").setVisible(false); 
                                that.getView().byId("id_update_button").setVisible(true); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(true); 
                                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(true); 
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);
                            }
                            let EWayBill = value11.EWayBill;
                            let GateEntryDate = value11.GateEntryDate;
                            let VehicleType = value11.VehicleType;
                            let VehicleNo = value11.VehicleNo;
                            let InvoiceNo = value11.InvoiceNo;
                            let InvoiceDate = value11.InvoiceDate;
                            let Transporter = value11.Transporter;
                            let TransporterMode = value11.TransporterMode;
                            let LRNo = value11.LRNo;
                            let LRDate = value11.LRDate;
                            let GrossWeight = value11.GrossWeight;
                            let WeightTime = value11.WeightTime;
                            let WeightDate = value11.WeightDate;
                            let NoOfPackages = value11.NoOfPackages;
                            let Remarks = value11.Remarks;
                            let Status = value11.Status;
                            let ScreenCode = value11.ScreenCode;
                            let TareWeight = value11.TareWeight;
                            let NetWeight = value11.NetWeight;
                            let DelDocGrossWeight = value11.DelDocGrossWeight;

                            var dd = '' + GateEntryDate.getDate();
                            var mm = '' + (GateEntryDate.getMonth() + 1); //January is 0!
                            if (mm.length < 2) {
                                mm = '0' + mm;
                            }
                            if (dd.length < 2) {
                                dd = '0' + dd;
                            }
                            var yyyy = GateEntryDate.getFullYear();
                            let GateEntryDate01 = yyyy + '-' + mm + '-' + dd;

                            if(value11.InvoiceDate !== null){
                                var dd = '' + value11.InvoiceDate.getDate();
                                var mm = '' + (value11.InvoiceDate.getMonth() + 1); //January is 0!
                                if (mm.length < 2) {
                                    mm = '0' + mm;
                                }
                                if (dd.length < 2) {
                                    dd = '0' + dd;
                                }
                                var yyyy = value11.InvoiceDate.getFullYear();
                                var InvoiceDate01 = yyyy + '-' + mm + '-' + dd;
                            }else{
                                var InvoiceDate01 = "";
                            }


                            if(value11.LRDate !== null){
                                var dd = '' + value11.LRDate.getDate();
                                var mm = '' + (value11.LRDate.getMonth() + 1); //January is 0!
                                if (mm.length < 2) {
                                    mm = '0' + mm;
                                }
                                if (dd.length < 2) {
                                    dd = '0' + dd;
                                }
                                var yyyy = value11.LRDate.getFullYear();
                                var LRDate01 = yyyy + '-' + mm + '-' + dd;
                            }else{
                                var LRDate01 = "";
                            }

                            that.getView().byId("id_edit_gate_date").setValue(GateEntryDate01)
                            that.getView().byId("id_edit_invoice_date_h").setValue(InvoiceDate01)
                            that.getView().byId("id_edit_lrdate_h").setValue(LRDate01)


                            that.getView().byId("id_edit_vehicle_type_h").setValue(VehicleType)
                            that.getView().byId("id_edit_vehno_h").setValue(VehicleNo)
                            that.getView().byId("id_edit_transporter_mode_h").setValue(TransporterMode)
                            that.getView().byId("id_edit_transporter_h").setValue(Transporter)
                            that.getView().byId("id_edit_tar_wt_h").setValue(TareWeight)
                            that.getView().byId("id_edit_net_wt_h").setValue(NetWeight)
                            that.getView().byId("id_edit_gross_wt_h").setValue(GrossWeight)
                            that.getView().byId("id_edit_remark_h").setValue(Remarks)
                            that.getView().byId("id_edit_invoice_no_h").setValue(value11.InvoiceNo)
                            // that.getView().byId("id_edit_invoice_date_h").setValue(value11.InvoiceDate)
                            that.getView().byId("id_edit_lrno_h").setValue(value11.LRNo)
                            that.getView().byId("id_edit_noofpackages_h").setValue(value11.NoOfPackages)
                            // that.getView().byId("id_edit_lrdate_h").setValue(value11.LRDate)
                            that.getView().byId("id_edit_ewaybill_h").setValue(value11.EWayBill)
                            that.getView().byId("id_edit_remark_h").setValue(Remarks)
                            
                            model011.read("/YY1_ZGE_INWARD_GATEPASS(guid'" + SAPUIID + "')/to_ITEM", {
                            
                                success: function (oData) {
                                var oJSONModeledit = new sap.ui.model.json.JSONModel({
                                    datasedit: oData.results
                                });
                                that.getView().setModel(oJSONModeledit, "JModeledit");
                                that.getView().byId("TableId_Edit").setVisible(true)
                                sap.ui.core.BusyIndicator.hide();
                                },
                                error: function (oError) {
                                    console.log(oError);
                                    that.getView().byId("TableId_Edit").setVisible(false)
                                    sap.ui.core.BusyIndicator.hide();
                                }
                            });              
                    },
                
                    error: function (oError) {
                        console.log(oError);
                        sap.ui.core.BusyIndicator.hide();
                    }
        
                });
        
            }
        },

        OnGateQtyToPostEnteredit:function(oEvent){
            sap.ui.core.BusyIndicator.show();
            // let Quantity_to_Post_Input = oEvent.getSource().getParent().getCells()[9].getValue(); 
            // let OrderQuantity = oEvent.getSource().getParent().getCells()[8].getValue(); 

            let DocumentItemNo = oEvent.getSource().getParent().getCells()[1].getValue(); 
            let DocumentNo = oEvent.getSource().getParent().getCells()[2].getValue(); 
            let Order_Quantity = oEvent.getSource().getParent().getCells()[6].getValue(); 
            let Enter_Quantity = oEvent.getSource().getParent().getCells()[9].getValue(); 
            let Pending_Quantity = oEvent.getSource().getParent().getCells()[8].getValue();
            let Enter_Quantity_Float = '';

            if(Enter_Quantity.trim() === "" || Enter_Quantity.trim() === "NaN"){
                Enter_Quantity_Float = 0;
                oEvent.getSource().getParent().getCells()[9].setValue("0");
            }else{
                Enter_Quantity_Float = parseFloat(Enter_Quantity);
            }

            console.log("Enter_Quantity_Float:", Enter_Quantity_Float)
            let Order_Quantity_Float = parseFloat(Order_Quantity.trim());
            let Id = this.getView().byId("id_edit_gateentry_h").getValue();

            var oFilter = new sap.ui.model.Filter("ItemNo", sap.ui.model.FilterOperator.EQ, DocumentItemNo);
            var oFilter1 = new sap.ui.model.Filter("ReferenceDocument", sap.ui.model.FilterOperator.EQ, DocumentNo);
            var oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'created');
            var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE3');
            var oFilter4 = new sap.ui.model.Filter({
                filters: [
                    new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, 'created'),
                    new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, '')
                ],
                and: false
            });
            var oFilter5 = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, Id);
            var that = this;

            var oModel2 = that.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
            var oFilters1 = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4, oFilter5];
            var oFilters = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4];
            let Pending_Quantity_Float = 0;

                oModel2.read("/YY1_ITEM_ZGE_INWARD_GATEPASS", {
                    filters: oFilters1,
                    success: function(oData2) {
                        var aItems01 = oData2.results;
                        console.log("aItems01aItems01:", aItems01);
                        // console.log(aItems01[0].QuantityInGE); 
                        var Clone_Quantity_to_Post_Input_Float = parseFloat(aItems01[0].QuantityInGE);
        
                oModel2.read("/YY1_ITEM_ZGE_INWARD_GATEPASS", {
                    filters: oFilters,
                    success: function(oData) {
                        var aItems = oData.results;
                        for (var i = 0; i < aItems.length; i++) {
                            Pending_Quantity_Float += parseFloat(aItems[i].QuantityInGE.trim());
                        }
                        console.log("Pending_Quantity_Float", Pending_Quantity_Float)
                        
                        var FinalData = (parseFloat(Order_Quantity_Float) + Clone_Quantity_to_Post_Input_Float) - parseFloat(Pending_Quantity_Float);

                        // if(Enter_Quantity_Float === "" ){
                        //     oEvent.getSource().getParent().getCells()[9].setValue("0");
                        //     that.getView().byId("Final_Save_Button").setEnabled(true);
                        //     oEvent.getSource().getParent().getCells()[8].setValue(parseFloat(Order_Quantity_Float) + Clone_Quantity_to_Post_Input_Float);
                        // }else{
                            if(FinalData !== "0" || FinalData !== 0 ){
                                if(Enter_Quantity_Float > FinalData){
                                    oEvent.getSource().getParent().getCells()[9].setValueState(sap.ui.core.ValueState.Error);
                                    oEvent.getSource().getParent().getCells()[9].setValueStateText("Please Enter Valid Quantity");
                                    that.getView().byId("Final_Save_Button").setEnabled(true);
                                    oEvent.getSource().getParent().getCells()[8].setValue(FinalData);
                                    oEvent.getSource().getParent().getCells()[9].setValue(Clone_Quantity_to_Post_Input_Float);
                                    sap.ui.core.BusyIndicator.hide();
                                }
                                
                                else if (Enter_Quantity_Float <= FinalData ) {
                                    let FInalValue = parseFloat(FinalData) - parseFloat(Enter_Quantity_Float);
                                    oEvent.getSource().getParent().getCells()[8].setValue(FInalValue);
                                    oEvent.getSource().getParent().getCells()[9].setValueState(sap.ui.core.ValueState.None);
                                    that.getView().byId("Final_Save_Button").setEnabled(true);
                                    sap.ui.core.BusyIndicator.hide();
                                }
                            }

                        
                    },
                    error: function(oError) {
                        console.error("Error reading data: ", oError);
                        oEvent.getSource().getParent().getCells()[8].setValue(Pending_Quantity_Float);
                        sap.ui.core.BusyIndicator.hide();
                    }
                });

                }
            });

        },

        OnTableRowRemove: function(oEvent) {
            var oTable = this.byId("TableId_Edit");
            var oTableRows = oTable.getRows();
            var aIndices = this.byId("TableId_Edit").getSelectedIndices();
            
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

        OnPendingQtyCalEdit: function(DocItem, DocHead, OrderQuantity) {

            var that = this; // Store reference to 'this'
            if(DocItem !== null && DocHead !== null && OrderQuantity !== null){
                var DocItem = DocItem;
                var DocHead = DocHead;
                var OrderQuantity = OrderQuantity;

                console.log("DocItem:", DocItem)
                console.log("DocHead:", DocHead)
                console.log("DocOrderQuantitytem:", OrderQuantity)
            
                return new Promise(function(resolve, reject) {
            
                    var oFilter = new sap.ui.model.Filter("ItemNo", sap.ui.model.FilterOperator.EQ, DocItem);
                    var oFilter1 = new sap.ui.model.Filter("ReferenceDocument", sap.ui.model.FilterOperator.EQ, DocHead);
                    var oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'created');
                    var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE3');
                    // var oFilter4 = new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, '');
                    var oFilter4 = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, 'created'),
                            new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, '')
                        ],
                        and: false
                    });
            
                    var oModel2 = that.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                    var oFilters = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4];

                    var CalData = 0;
            
                    oModel2.read("/YY1_ITEM_ZGE_INWARD_GATEPASS", {
                        filters: oFilters,
                        success: function(oData) {
                            var aItems = oData.results;
                            console.log("aItems:", aItems)
                            for (var i = 0; i < aItems.length; i++) {
                                CalData += parseFloat(aItems[i].QuantityInGE);
                            }
                            console.log("---------------------------------------------");
                            console.log(OrderQuantity);
                            console.log("CalData:", CalData);
                            var FinalData = parseFloat(OrderQuantity) - parseFloat(CalData);
                            console.log(FinalData);
                            console.log("---------------------------------------------");
                            resolve(FinalData); // Resolve with the data
                        },
                        error: function(oError) {
                            console.error("Error reading data: ", oError);
                            reject(oError); // Reject with the error
                        }
                    });
                });

            }
        }, 

        OnUpdateSTO:async function(){
            sap.ui.core.BusyIndicator.show();
            
            let GateEntryNo = this.getView().byId("id_edit_gateentry_h").getValue()
            if(GateEntryNo.trim() === ""){
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Please enter/select Gate Pass No...")
            }else{

                    let getArray = [
                        "id_edit_gateentry_h",
                        "id_edit_document_no_h",
                        "id_edit_gate_date",
                        "id_edit_vehicle_type_h",
                        "id_edit_vehno_h",
                        "id_edit_transporter_mode_h",
                        "id_edit_transporter_h",
                        "id_edit_tar_wt_h",
                        "id_edit_net_wt_h",
                        "id_edit_gross_wt_h",
                        "id_edit_invoice_no_h",
                        "id_edit_invoice_date_h",
                        "id_edit_lrno_h",
                        "id_edit_noofpackages_h",
                        "id_edit_lrdate_h",
                        "id_edit_ewaybill_h",
                        "id_edit_remark_h"
                    ];

                    let RequiredMan = '';
                    let ValidationArrayNonDatas = [];
                    for(let kk=0; kk < getArray.length; kk++){
                        let GetThisId = this.getView().byId(getArray[kk]);
                        if(getArray[kk] === "id_edit_document_no_h"){
                            let GetTokens = this.getView().byId("id_edit_document_no_h").getTokens();
                            let Arrauuu = [];
        
                            if (GetTokens && GetTokens.length) {
                                GetTokens.map(function (oContext) {
                                    Arrauuu.push(oContext.getKey());
                                    return;
                                });
                            }
                            var GetThisValues = Arrauuu[0];
                        }else{
                            try{
                                var GetThisValues = GetThisId.getValue();
                            }
                            catch(err){
                                var GetThisValues = GetThisId.getSelectedItem().getText();
                            }
                        }
                        
                        if(GetThisId.getRequired() === true || GetThisId.getRequired() === "true"){
                            console.log("GetThisValues:", GetThisValues)
                            if(GetThisValues === ""){
                                if(RequiredMan === ""){
                                    this.getView().byId(getArray[kk]).setValueState(sap.ui.core.ValueState.Error);
                                    RequiredMan = "required";
                                    ValidationArrayNonDatas.push(getArray[kk]);
                                }else{
                                    this.getView().byId(getArray[kk]).setValueState(sap.ui.core.ValueState.Error);
                                    ValidationArrayNonDatas.push(getArray[kk]);
                                }
                            }else{
                                this.getView().byId(getArray[kk]).setValueState(sap.ui.core.ValueState.None);
                            }
                        }
                    } 

                    let GetTokens = this.getView().byId("id_edit_document_no_h").getTokens();
                    let Delivery_Document_Array = [];

                    if (GetTokens && GetTokens.length) {
                        GetTokens.map(function (oContext) {
                            Delivery_Document_Array.push(oContext.getKey());
                            return;
                        });
                    }

                let GateEntryNo = this.getView().byId("id_edit_gateentry_h").getValue()
                let SAP_UUID_H = this.getView().byId("id_edit_sapuuid_h").getValue()
                let GateEntryDate = this.getView().byId("id_edit_gate_date").getValue()
                let VehicleType = this.getView().byId("id_edit_vehicle_type_h").getValue()
                let VehicleNo = this.getView().byId("id_edit_vehno_h").getValue()
                let TransporterMode = this.getView().byId("id_edit_transporter_mode_h").getValue()
                let Transporter = this.getView().byId("id_edit_transporter_h").getValue()
                let TareWeight = this.getView().byId("id_edit_tar_wt_h").getValue()
                let NetWeight = this.getView().byId("id_edit_net_wt_h").getValue()
                let GrossWeight = this.getView().byId("id_edit_gross_wt_h").getValue()
                let Remarks = this.getView().byId("id_edit_remark_h").getValue()     
                let InvoiceNo = this.getView().byId("id_edit_invoice_no_h").getValue()     
                let InvoiceDate = this.getView().byId("id_edit_invoice_date_h").getValue() 
                    if(InvoiceDate === ""){
                        InvoiceDate=null
                    }else{
                        InvoiceDate = new Date(InvoiceDate);
                    }    
                let LRNo = this.getView().byId("id_edit_lrno_h").getValue()     
                let NoOfPackages = this.getView().byId("id_edit_noofpackages_h").getValue()     
                let LRDate = this.getView().byId("id_edit_lrdate_h").getValue()  
                    if(LRDate === ""){
                        LRDate=null
                    }else{
                        LRDate = new Date(LRDate);
                    }
                let EWayBill = this.getView().byId("id_edit_ewaybill_h").getValue()     
                       
                if (ValidationArrayNonDatas.length === 0 || ValidationArrayNonDatas.length === "0" ){

                         var oEntrySTOHEAD = {

                            Id:GateEntryNo,
                            Status:"created",
                            ApproveStatus:"",
                            VehicleNo: VehicleNo,
                            VehicleType:VehicleType,
                            TransporterMode: TransporterMode,
                            Transporter: Transporter,
                            GateEntryDate:new Date(GateEntryDate),
                            TareWeight: TareWeight,
                            NetWeight: NetWeight,
                            GrossWeight: GrossWeight,
                            Remarks:Remarks,
                            EWayBill:EWayBill,
                            InvoiceNo:InvoiceNo,
                            InvoiceDate:InvoiceDate,
                            LRNo:LRNo,
                            LRDate:LRDate,
                            NoOfPackages:NoOfPackages,

                        };
            
                        var that = this;
    
                        console.log("oEntrySTOHEAD:", oEntrySTOHEAD)
                        await that.ToUpdateSTOItems(oEntrySTOHEAD)
                        
                        var oModel06 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                        oModel06.setHeaders({
                        "X-Requested-With": "X",
                        "Content-Type": "application/json"
                        });
            
                        oModel06.update("/YY1_ZGE_INWARD_GATEPASS(guid'" + SAP_UUID_H + "')", oEntrySTOHEAD, {
                        success: function(data) {
                            console.log("Header Updated:", data);
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageBox.success("Document No " + GateEntryNo + " Updated Successfully", {
                                title: "General Purchase",
                                id: "messageBoxId1",
                                contentWidth: "100px",
                            });                    
                            oModel06.refresh(true);
                            var oJSONModeledit = new sap.ui.model.json.JSONModel({
                                datasedit: {}
                            });
                            that.getView().setModel(oJSONModeledit, "JModeledit");
                            that.getView().byId("TableId_Edit").setVisible(false)
    
                            that.getView().byId("id_edit_gateentry_h").setValue("")
                            var multiInput = that.getView().byId("id_edit_document_no_h");
                                multiInput.removeAllTokens();
                            that.getView().byId("id_edit_sapuuid_h").setValue("")
                            that.getView().byId("id_edit_gate_date").setValue("")
                            that.getView().byId("id_edit_vehicle_type_h").setSelectedItem("")
                            that.getView().byId("id_edit_vehno_h").setValue("")
                            that.getView().byId("id_edit_transporter_mode_h").setValue("")
                            that.getView().byId("id_edit_transporter_h").setValue("")
                            that.getView().byId("id_edit_tar_wt_h").setValue("")
                            that.getView().byId("id_edit_net_wt_h").setValue("")
                            that.getView().byId("id_edit_gross_wt_h").setValue("")
                            that.getView().byId("id_edit_remark_h").setValue("")
                            that.getView().byId("id_edit_invoice_no_h").setValue("")
                            that.getView().byId("id_edit_invoice_date_h").setValue("")
                            that.getView().byId("id_edit_lrno_h").setValue("")
                            that.getView().byId("id_edit_noofpackages_h").setValue("")
                            that.getView().byId("id_edit_lrdate_h").setValue("")
                            that.getView().byId("id_edit_ewaybill_h").setValue("")
            
                        },
                        error: function(error) {
                            console.error("Error updating header:", error);
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show(" Error")
                        }
                        });        
             
                    }else{
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Please Enter Mandatory Fields...")
                    }
    
            }
        },

        ToUpdateSTOItems:function(oEntryH){

            return new Promise((resolve, reject) => {

                    var Table_Id = this.getView().byId("TableId_Edit"); // Assuming 'persoTable' is the ID of the Grid Table
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

                        var QuantityInGE = Table_Id.getRows()[i].getCells()[9].getValue();
                        var OpenQuantity = Table_Id.getRows()[i].getCells()[8].getValue();
                        var SAP_UUID_I = Table_Id.getRows()[i].getCells()[10].getValue();
                        var DeleteStatus = Table_Id.getRows()[i].getCells()[0].getVisible();
                        var ItemNo = Table_Id.getRows()[i].getCells()[1].getValue();
                            if(ItemNo === ""){
                                break;
                            }

                        if(DeleteStatus === true){
                           var Delete_Status = "deleted";
                        }else{
                           var Delete_Status = "";
                        }

                           var itemDataSTO = {
                                QuantityInGE:QuantityInGE,
                                Status:"created",
                                ItemsStatus:Delete_Status,
                                OpenQuantity:OpenQuantity,
                                GateEntryDate:oEntryH.GateEntryDate,
                                ApproveStatus:"pending",
                            };
        
                            console.log("itemDataSTO:", itemDataSTO);
        
                            var oModel_04 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                            oModel_04.setHeaders({
                                "X-Requested-With": "X",
                                "Content-Type": "application/json"
                            });
            
                            oModel_04.update("/YY1_ITEM_ZGE_INWARD_GATEPASS(guid'" + SAP_UUID_I + "')", itemDataSTO, {
                                success: function(data) {
                                console.log("STO Item Updated:", data);
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

        OnDeleteEntireDocument:function(){
            sap.ui.core.BusyIndicator.show();

            let Sales_Return_Document = this.getView().byId("id_edit_gateentry_h").getValue();
            if(Sales_Return_Document){
                let SAP_UUID_H = this.getView().byId("id_edit_sapuuid_h").getValue();

                // ---------- Start Item Level

                var Table_Id = this.getView().byId("TableId_Edit");
            var Table_Length = Table_Id.getRows().length;

            for (var i = 0; i < Table_Length; i++) {
            var oRow = Table_Id.getRows()[i];
            var oBindingContext = oRow.mAggregations;

            if (oBindingContext) {
                var Gate_Quantity_To_Post = oBindingContext.cells[9].mProperties.value;
                var SAP_UUID_I = oBindingContext.cells[10].mProperties.value;
                var Delete_Status01 = oRow.getCells()[0].getVisible();

                if(SAP_UUID_I === '' ){
                    break;
                }
                if (Gate_Quantity_To_Post !== "") {
                    var Delete_Status = "deleted";
                    
                var itemData = {
                    Status: Delete_Status,
                    ItemsStatus: Delete_Status
                };

                var oModel_04 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                oModel_04.setHeaders({
                    "X-Requested-With": "X",
                    "Content-Type": "application/json"
                });

                oModel_04.update("/YY1_ITEM_ZGE_INWARD_GATEPASS(guid'" + SAP_UUID_I + "')", itemData, {
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
            var oModel05 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
            oModel05.setHeaders({
            "X-Requested-With": "X",
            "Content-Type": "application/json"
            });

            oModel05.update("/YY1_ZGE_INWARD_GATEPASS(guid'" + SAP_UUID_H + "')", oEntry1, {
            success: function(data) {
                console.log("Header Updated:", data);
                MessageToast.show(" "+Sales_Return_Document+" Deleted")        
                oModel05.refresh(true);
                that.getView().byId("DeleteIndicId").setVisible(true); 
                that.getView().byId("id_update_button").setVisible(false); 
                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false); 
                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false); 
                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false); 

                var oJSONModeledit = new sap.ui.model.json.JSONModel({
                    datasedit: {}
                });
                that.getView().setModel(oJSONModeledit, "JModeledit");
                that.getView().byId("TableId_Edit").setVisible(false)

                that.getView().byId("id_edit_gateentry_h").setValue("")
                var multiInput = that.getView().byId("id_edit_document_no_h");
                multiInput.removeAllTokens();
                that.getView().byId("id_edit_sapuuid_h").setValue("")
                // that.getView().byId("id_edit_sto_plant_h").setValue("")
                // that.getView().byId("id_edit_sto_plant_name_h").setValue("")
                // that.getView().byId("id_edit_sto_customer_h").setValue("")
                // that.getView().byId("id_edit_sto_cust_name_h").setValue("")
                that.getView().byId("id_edit_gate_date").setValue("")
                that.getView().byId("id_edit_vehicle_type_h").setSelectedItem("")
                that.getView().byId("id_edit_vehno_h").setValue("")
                that.getView().byId("id_edit_transporter_mode_h").setValue("")
                that.getView().byId("id_edit_transporter_h").setValue("")
                // that.getView().byId("id_edit_sto_del_doc_wt_h").setValue("")
                that.getView().byId("id_edit_tar_wt_h").setValue("")
                that.getView().byId("id_edit_net_wt_h").setValue("")
                that.getView().byId("id_edit_gross_wt_h").setValue("")
                // that.getView().byId("id_edit_sto_wt_dt_time_h").setValue("")
                that.getView().byId("id_edit_remark_h").setValue("")
                that.getView().byId("id_edit_invoice_no_h").setValue("")
                that.getView().byId("id_edit_invoice_date_h").setValue("")
                that.getView().byId("id_edit_lrno_h").setValue("")
                that.getView().byId("id_edit_noofpackages_h").setValue("")
                that.getView().byId("id_edit_lrdate_h").setValue("")
                that.getView().byId("id_edit_ewaybill_h").setValue("")
                sap.ui.core.BusyIndicator.hide();
            },
            error: function(error) {
                console.error("Error updating header:", error);
                MessageToast.show(" "+Sales_Return_Document+" Not Deleted")
                sap.ui.core.BusyIndicator.hide();
            }
            });

            }else{
                MessageToast.show(" Please Enter Valid Gate Entry no")
                sap.ui.core.BusyIndicator.hide();
            }
           
            // ---------- End Item Level

        },

        OnUnDeleteEntireDocument:function(){
            sap.ui.core.BusyIndicator.show();

            let Sales_Return_Document = this.getView().byId("id_edit_gateentry_h").getValue();
            if(Sales_Return_Document !==""){
                let SAP_UUID_H = this.getView().byId("id_edit_sapuuid_h").getValue();

                // ---------- Start Item Level

            var Table_Id = this.getView().byId("TableId_Edit");
            var Table_Length = Table_Id.getRows().length;

            for (var i = 0; i < Table_Length; i++) {
            var oRow = Table_Id.getRows()[i];
            var oBindingContext = oRow.mAggregations;

            if (oBindingContext) {
                var Gate_Quantity_To_Post = oBindingContext.cells[9].mProperties.value;
                var SAP_UUID_I = oBindingContext.cells[10].mProperties.value;
                var Delete_Status01 = oRow.getCells()[0].getVisible();

                if (Gate_Quantity_To_Post !== "") {
                    var Delete_Status = "created";
                    
                var itemData = {
                    Status: Delete_Status,
                    ItemsStatus: Delete_Status
                };

                var oModel_04 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                oModel_04.setHeaders({
                    "X-Requested-With": "X",
                    "Content-Type": "application/json"
                });

                oModel_04.update("/YY1_ITEM_ZGE_INWARD_GATEPASS(guid'" + SAP_UUID_I + "')", itemData, {
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

            var oModel05 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
            oModel05.setHeaders({
            "X-Requested-With": "X",
            "Content-Type": "application/json"
            });

            oModel05.update("/YY1_ZGE_INWARD_GATEPASS(guid'" + SAP_UUID_H + "')", oEntry1, {
            success: function(data) {
                console.log("Header Updated:", data);
               
                MessageToast.show(" "+Sales_Return_Document+" Retrived")        
                oModel05.refresh(true);
                that.getView().byId("DeleteIndicId").setVisible(false); 
                that.getView().byId("id_update_button").setVisible(true); 
                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false); 
                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false); 
                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);

                var oJSONModeledit = new sap.ui.model.json.JSONModel({
                    datasedit: {}
                });
                that.getView().setModel(oJSONModeledit, "JModeledit");
                that.getView().byId("TableId_Edit").setVisible(false)

                that.getView().byId("id_edit_gateentry_h").setValue("")
                var multiInput = that.getView().byId("id_edit_document_no_h");
                    multiInput.removeAllTokens();
                that.getView().byId("id_edit_sapuuid_h").setValue("")
                // that.getView().byId("id_edit_sto_plant_h").setValue("")
                // that.getView().byId("id_edit_sto_plant_name_h").setValue("")
                // that.getView().byId("id_edit_sto_customer_h").setValue("")
                // that.getView().byId("id_edit_sto_cust_name_h").setValue("")
                that.getView().byId("id_edit_gate_date").setValue("")
                that.getView().byId("id_edit_vehicle_type_h").setSelectedItem("")
                that.getView().byId("id_edit_vehno_h").setValue("")
                that.getView().byId("id_edit_transporter_mode_h").setValue("")
                that.getView().byId("id_edit_transporter_h").setValue("")
                // that.getView().byId("id_edit_sto_del_doc_wt_h").setValue("")
                that.getView().byId("id_edit_tar_wt_h").setValue("")
                that.getView().byId("id_edit_net_wt_h").setValue("")
                that.getView().byId("id_edit_gross_wt_h").setValue("")
                // that.getView().byId("id_edit_sto_wt_dt_time_h").setValue("")
                that.getView().byId("id_edit_remark_h").setValue("")
                that.getView().byId("id_edit_invoice_no_h").setValue("")
                that.getView().byId("id_edit_invoice_date_h").setValue("")
                that.getView().byId("id_edit_lrno_h").setValue("")
                that.getView().byId("id_edit_noofpackages_h").setValue("")
                that.getView().byId("id_edit_lrdate_h").setValue("")
                that.getView().byId("id_edit_ewaybill_h").setValue("")
                sap.ui.core.BusyIndicator.hide();

            },
            error: function(error) {
                console.error("Error updating header:", error);
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show(" "+Sales_Return_Document+" Not Retrived")
            }
            });

            }else{
                MessageToast.show(" Please Enter Valid Gate Entry no")
                sap.ui.core.BusyIndicator.hide();
            }
            
            // ---------- End Item Level
        },

        
    OnClose: function () {

        this.getView().byId("id_edit_gateentry_h").setValue("")
        var multiInput = this.getView().byId("id_edit_document_no_h");
            multiInput.removeAllTokens();
            this.getView().byId("id_edit_sapuuid_h").setValue("")
        this.getView().byId("id_edit_gate_date").setValue("")
        this.getView().byId("id_edit_vehicle_type_h").setSelectedItem("")
        this.getView().byId("id_edit_vehno_h").setValue("")
        this.getView().byId("id_edit_transporter_mode_h").setValue("")
        this.getView().byId("id_edit_transporter_h").setValue("")
        this.getView().byId("id_edit_tar_wt_h").setValue("")
        this.getView().byId("id_edit_net_wt_h").setValue("")
        this.getView().byId("id_edit_gross_wt_h").setValue("")
        this.getView().byId("id_edit_remark_h").setValue("")
        this.getView().byId("id_edit_invoice_no_h").setValue("")
        this.getView().byId("id_edit_invoice_date_h").setValue("")
        this.getView().byId("id_edit_lrno_h").setValue("")
        this.getView().byId("id_edit_noofpackages_h").setValue("")
        this.getView().byId("id_edit_lrdate_h").setValue("")
        this.getView().byId("id_edit_ewaybill_h").setValue("")

        var oJSONModeledit = new sap.ui.model.json.JSONModel({
            datasedit: {}
        });
        this.getView().setModel(oJSONModeledit, "JModeledit");
        this.getView().byId("TableId_Edit").setVisible(false)

        this.OnEditFragOpen001.close();
    },


        });
    });
