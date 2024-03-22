sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    'sap/m/SearchField',
    'sap/ui/model/type/String',
    'sap/m/ColumnListItem',
	'sap/m/Label',
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Device,SearchField,TypeString,ColumnListItem,Label,Filter,FilterOperator,MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("gatepassapp.controller.outward.sales.createsales", {
            onInit: function () {    

            // vehicle data
            var JSonModel = new sap.ui.model.json.JSONModel({
                Samples: [
                    { "VehicleID": 1, "VehicleName": "Truck" },
                    { "VehicleID": 2, "VehicleName": "Tempo" },
                    { "VehicleID": 3, "VehicleName": "Tractor" },
                    { "VehicleID": 4, "VehicleName": "Others" },

                ]

            });
            this.getView().setModel(JSonModel, "JModel");

            // vehicle data
            var JSonModel = new sap.ui.model.json.JSONModel({
                Samples: [
                    { "VehicleID": 1, "VehicleName": "Truck" },
                    { "VehicleID": 2, "VehicleName": "Tempo" },
                    { "VehicleID": 3, "VehicleName": "Tractor" },
                    { "VehicleID": 4, "VehicleName": "Others" },

                ]

            });
            this.getView().setModel(JSonModel, "VModel");
           
            var JSonModel = new sap.ui.model.json.JSONModel({
                Samples: [

                    { "TransportID": 1, "TransportType": "Road" },
                    { "TransportID": 2, "TransportType": "Sea" },
                    { "TransportID": 3, "TransportType": "Train" },
                    { "TransportID": 4, "TransportType": "Other" }
                ]

            });
            this.getView().setModel(JSonModel, "TModel");

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
                this.CurrentDate = dd + '-' + mm + '-' + yyyy;
                this.CurrentDate01 = today;

                this.getView().byId("id_sto_gate_date").setValue(this.CurrentDate)
                // ----Start For Current Date -----

                this.JSonModelMadDatas = new sap.ui.model.json.JSONModel({
                    Datas : []
                });
                this.getView().setModel(this.JSonModelMadDatas, "JSonModelMadDatas");
            },

            onBeforeRendering :function(){
                sap.ui.core.BusyIndicator.show();
                let model001 = this.getView().getModel("YY1_ZGE_GATEPASS_ATU_CDS");
                let model002 = this.getView().getModel("YY1_ZGE_GATEPASS_USER_TABL_CDS");
                
                var that = this;
                model001.read("/YY1_ZGE_GATEPASS_ATU", {
                  success: function (oData1, oRespons) { 
                    console.log("oData1.results[0].UserId", oData1.results[0].UserId);
      
                let FilterData = new sap.ui.model.Filter("UserId", sap.ui.model.FilterOperator.EQ, oData1.results[0].UserId)
      
                  model002.read("/YY1_MANDATORY_FIELD_ASSIGN_ZGE", {
                      filters:[FilterData],
                      success: function (oData, oRespons) {
                          // console.log(oData);
                          let aItems = oData.results;
                            let ManDatas = aItems.map(item => {
                                if(item.AppId === "GE8"){
                                    return item;
                                }else{
                                    return null;
                                }
                            }).filter(item => item !== null);
                            that.JSonModelMadDatas = new sap.ui.model.json.JSONModel({
                                Datas : ManDatas
                            });
                            that.getView().setModel(that.JSonModelMadDatas, "JSonModelMadDatas");
                            sap.ui.core.BusyIndicator.hide();
                      }
                    });
      
                    }
                });
              },
              

            //Start Fragment for PO Header 
            OnStoPoDocFragOpen:function(oEvent){
                if (!this._dialog_StoPoDochead) {
                    this._dialog_StoPoDochead = sap.ui.xmlfragment(this.getView().getId("DelDocHead_dialog"), "gatepassapp.view.outward.sales.fragment.deliverydocumenthead", this);
                    this.getView().addDependent(this._dialog_StoPoDochead);
                }
    
                this._dialog_StoPoDochead.open();
            },

            OnStoPoDocHeadSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("OutboundDelivery", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },

            OnStoPoDoHeadSelect : function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);

                var aContexts = oEvent.getParameter("selectedContexts");
                var scode, customer_type, customer_code, customer_name;

                if(aContexts===undefined){
                    console.log("No item present");
                    sap.ui.core.BusyIndicator.hide();

                }else{
                    if (aContexts && aContexts.length) {

                        aContexts.map(function (oContext) {
                            scode = oContext.getObject().OutboundDelivery;
                            customer_code= oContext.getObject().ShipToParty;
                            customer_name = oContext.getObject().CustomerName;
                            return;
                        });
                        this.getView().byId("id_sto_purchase_document_h").setValue(scode);
                        this.getView().byId("id_sto_customer_h").setValue(customer_code);
                        this.getView().byId("id_sto_cust_name_h").setValue(customer_name);
                    }
    
                        var Delivery_Document_H = this.getView().byId("id_sto_purchase_document_h").getValue();

                            //table binding
        
                            var oFilter = new sap.ui.model.Filter("OutboundDelivery", sap.ui.model.FilterOperator.EQ, Delivery_Document_H);
                            var oTable = this.getView().byId("salestoeturn_table_id");
                            var oModel = this.getView().getModel("YY1_ZGE_OUTWARD_OD_ITEM_CDS"); // Replace with your actual OData model name
                            var oFilters = [oFilter];
                            var that=this;
                            oModel.read("/YY1_ZGE_OUTWARD_OD_ITEM", {
                                filters: oFilters,
                                success: function(oData) {
                                    var aItems = oData.results; // The array of read items
                                    let lant_H = aItems[0].Plant;
                                    let lant_H_name = aItems[0].PlantName;
                                    that.getView().byId("id_sto_plant_h").setValue(lant_H);
                                    that.getView().byId("id_sto_plant_name_h").setValue(lant_H_name);
                                    // Create a JSON model and set the data
                                    var oTableModel = new sap.ui.model.json.JSONModel();
                                    oTableModel.setData({ items: aItems });
                                    // Set the model on the table and bind the rows
                                    oTable.setModel(oTableModel);
                                    oTable.bindRows("/items");
                                    that.getView().byId("salestoeturn_table_id").setVisible(true);
                                    sap.ui.core.BusyIndicator.hide();
                                },
                                error: function(oError) {
                                    // Handle error
                                    console.error("Error reading data: ", oError);
                                    sap.ui.core.BusyIndicator.hide();
                                }
                            });
                                
                        }                  
                },

            OnDeliveryDocSuggest:function(oEvent){
                sap.ui.core.BusyIndicator.show();
                var oItem = oEvent.getParameter("selectedItem");
                var Delivery_Document_H = oItem ? oItem.getKey() : "";
                var GetValue = oItem ? oItem.getText() : "";

                    // Do something with key and text values
                    console.log( oItem);
                    console.log("Selected Key:", Delivery_Document_H);
                    console.log("Selected Text:", GetValue);

                    //table binding

                    var oFilter = new sap.ui.model.Filter("OutboundDelivery", sap.ui.model.FilterOperator.EQ, Delivery_Document_H);
                    var oTable = this.getView().byId("salestoeturn_table_id");
                    var oModel = this.getView().getModel("YY1_ZGE_OUTWARD_OD_ITEM_CDS"); // Replace with your actual OData model name
                    var oFilters = [oFilter];
                    var that=this;
                    oModel.read("/YY1_ZGE_OUTWARD_OD_ITEM", {
                        filters: oFilters,
                        success: function(oData) {
                            var aItems = oData.results; // The array of read items
                            let lant_H = aItems[0].Plant;
                            let lant_H_name = aItems[0].PlantName;
                            let ShipToParty = aItems[0].ShipToParty;
                            let CustomerName = aItems[0].CustomerName;
                            that.getView().byId("id_sto_plant_h").setValue(lant_H);
                            that.getView().byId("id_sto_plant_name_h").setValue(lant_H_name);
                            // that.getView().byId("id_sto_customer_h").setValue(ShipToParty);
                            // that.getView().byId("id_sto_cust_name_h").setValue(CustomerName);
                            // Create a JSON model and set the data
                            var oTableModel = new sap.ui.model.json.JSONModel();
                            oTableModel.setData({ items: aItems });
                            // Set the model on the table and bind the rows
                            oTable.setModel(oTableModel);
                            oTable.bindRows("/items");
                            that.getView().byId("salestoeturn_table_id").setVisible(true);
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function(oError) {
                            // Handle error
                            console.error("Error reading data: ", oError);
                            sap.ui.core.BusyIndicator.hide();
                        }
                    });
                    var oFilter11 = new sap.ui.model.Filter("OutboundDelivery", sap.ui.model.FilterOperator.EQ, Delivery_Document_H);
                    var oModel11 = this.getView().getModel("YY1_ZGE_OUTWARD_OD_HEAD_CDS"); // Replace with your actual OData model name
                    var oFilters11 = [oFilter11];
                    var that=this;
                    oModel11.read("/YY1_ZGE_OUTWARD_OD_HEAD", {
                        filters: oFilters11,
                        success: function(oData) {
                            var aItems = oData.results[0]; // The array of read items
                            let ShipToParty = aItems.ShipToParty;
                            let CustomerName = aItems.CustomerName;
                            that.getView().byId("id_sto_customer_h").setValue(ShipToParty);
                            that.getView().byId("id_sto_cust_name_h").setValue(CustomerName);
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function(oError) {
                            // Handle error
                            console.error("Error reading data: ", oError);
                            sap.ui.core.BusyIndicator.hide();
                        }
                    });
                        
                },

                OnPendingQtyCal: function(DocItem, DocHead, OrderQuantity) {

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
                            var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE8');
                            var oFilter4 = new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, 'created');
                    
                            var oModel2 = that.getView().getModel("YY1_ZOUTWARD_HEAD_CDS");
                            var oFilters = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4];
    
                            var CalData = 0;
                    
                            oModel2.read("/YY1_ITEM_ZOUTWARD_HEAD", {
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

            Quantity_to_Post_InputyLine:function(oEvent){
                let Enter_Quantity = oEvent.getSource().getParent().getCells()[8].getValue(); 
                let Pending_Quantity = oEvent.getSource().getParent().getCells()[7].getValue();
                console.log(Enter_Quantity);
                console.log(Pending_Quantity)

                let Enter_Quantity_Float = parseFloat(Enter_Quantity.trim());
                let Pending_Quantity_Float = parseFloat(Pending_Quantity.trim());
                console.log(Enter_Quantity_Float);
                console.log(Pending_Quantity_Float)

                if(Enter_Quantity_Float > Pending_Quantity_Float){
                    oEvent.getSource().getParent().getCells()[8].setValueState(sap.ui.core.ValueState.Error);
                    oEvent.getSource().getParent().getCells()[8].setValueStateText("Please Enter Valid Quantity");
                    this.getView().byId("Final_Save_Button").setEnabled(false);
                }
                else if(Enter_Quantity_Float === "" ){
                    oEvent.getSource().getParent().getCells()[8].setValue("");
                    this.getView().byId("Final_Save_Button").setEnabled(false);
                }
                else if (Enter_Quantity_Float <= Pending_Quantity_Float ) {
                    oEvent.getSource().getParent().getCells()[8].setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("Final_Save_Button").setEnabled(true);
                }
            },

            OnEnterQtyCal: function(DocItem, DocHead, OrderQuantity) {

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
                        var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE8');
                        var oFilter4 = new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, 'created');
                
                        var oModel2 = that.getView().getModel("YY1_ZOUTWARD_HEAD_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4];

                        var CalData = 0;
                
                        oModel2.read("/YY1_ITEM_ZOUTWARD_HEAD", {
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

            OnSubmit: function (oEvent) {
                // sap.ui.core.BusyIndicator.show();
    
                this.getView().setModel();
    
                var that = this; // Preserve the reference to the controller
                var oFilter11 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, "GE8");
                var CountoModel = this.getView().getModel("YY1_ZOUTWARD_HEAD_CDS");
                var oFilters11 = [oFilter11];
                if (CountoModel) {
                    CountoModel.read("/YY1_ZOUTWARD_HEAD", {
                        filters: oFilters11,
                        success: async function (oData) {
                            var aItems = oData.results; // The array of read items
                            console.log(aItems.length);
                            let Count = Number(aItems.length) + 1; // This should be a number, no need to use Number()
                            let CountLen = Count.toString(); // Convert to string to get its length
                            let AddData = "50000";
                            let Data = 5 - CountLen.length;
                            let CountArray = "";
                            for (let i = 0; i < Data; i++) {
                                CountArray += "0";
                            }
                            console.log(AddData + CountArray + Count); // Concatenate strings correctly
                            let LastId = AddData + CountArray + Count;
    
                            await that.ToSaveFunc(LastId);
                            console.log("Success");
                            MessageBox.success("Gate Entry No " + LastId + " Generated", {
                                title: "Sales  ",
                                id: "messageBoxId3",
                                contentWidth: "100px",
                            });
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function (oError) {
                            console.error("Error reading data: ", oError);
                        }
                    });
                } else {
                    console.error("YY1_ZOUTWARD_HEAD_CDS model is undefined.");
                }
            },

            OnClick:function(){

                let getArray = [
                        "id_sto_purchase_document_h",
                        "id_sto_plant_h",
                        "id_sto_plant_name_h",
                        "id_sto_customer_h",
                        "id_sto_cust_name_h",
                        "id_sto_gate_date",
                        "id_sto_vehno_h",
                        "id_sto_vehicle_type_h",
                        "id_sto_transporter_h",
                        "id_sto_transporter_mode_h",
                        "id_sto_del_doc_wt_h",
                        "id_sto_tar_wt_h",
                        "id_sto_net_wt_h",
                        "id_sto_gross_wt_h",
                        "id_sto_wt_dt_time_h",
                        "id_sto_remark_h"
                    ];

                    let RequiredMan = '';
                    let ValidationArrayNonDatas = [];
                    for(let kk=0; kk < getArray.length; kk++){
                        let GetThisId = this.getView().byId(getArray[kk]);
                        try{
                            var GetThisValues = GetThisId.getValue();
                        }
                        catch(err){
                            var GetThisValues = GetThisId.getSelectedItem().getText();
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
                    
                    console.log("ValidationArrayNonDatas:", ValidationArrayNonDatas)
                    console.log("ValidationArrayNonDatasLength:", ValidationArrayNonDatas.length)


                // let Delivery_Document = this.getView().byId("id_sto_purchase_document_h");
                // console.log("Delivery_DocumentDelivery_Document", Delivery_Document)
                // console.log("Delivery_DocumentgetRequired", Delivery_Document.getRequired())
            },

            ToSaveFunc:function(GetId){

                return new Promise((resolve, reject) => {

                    let getArray = [
                        "id_sto_purchase_document_h",
                        "id_sto_plant_h",
                        "id_sto_plant_name_h",
                        "id_sto_customer_h",
                        "id_sto_cust_name_h",
                        "id_sto_gate_date",
                        "id_sto_vehno_h",
                        "id_sto_vehicle_type_h",
                        "id_sto_transporter_h",
                        "id_sto_transporter_mode_h",
                        "id_sto_del_doc_wt_h",
                        "id_sto_tar_wt_h",
                        "id_sto_net_wt_h",
                        "id_sto_gross_wt_h",
                        "id_sto_wt_dt_time_h",
                        "id_sto_remark_h"
                    ];

                    let RequiredMan = '';
                    let ValidationArrayNonDatas = [];
                    for(let kk=0; kk < getArray.length; kk++){
                        let GetThisId = this.getView().byId(getArray[kk]);
                        try{
                            var GetThisValues = GetThisId.getValue();
                        }
                        catch(err){
                            var GetThisValues = GetThisId.getSelectedItem().getText();
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

                    let gateentryno = GetId;
                    let Delivery_Document = this.getView().byId("id_sto_purchase_document_h").getValue();
                    let Plant_Code = this.getView().byId("id_sto_plant_h").getValue();
                    let Plant_Name = this.getView().byId("id_sto_plant_name_h").getValue();
                    let Customer_Code = this.getView().byId("id_sto_customer_h").getValue();
                    let Customer_Name = this.getView().byId("id_sto_cust_name_h").getValue();
                    let Gate_Entry_Date = this.getView().byId("id_sto_gate_date").getValue();
                    let Vehicle_No = this.getView().byId("id_sto_vehno_h").getValue();
                    let Vehicle_Type = this.getView().byId("id_sto_vehicle_type_h").getValue();
                    let Transporter = this.getView().byId("id_sto_transporter_h").getValue();
                    let Transporter_Mode = this.getView().byId("id_sto_transporter_mode_h").getSelectedItem().getText();
                    let Delivery_Doc_Gross = this.getView().byId("id_sto_del_doc_wt_h").getValue();
                    let Tare_Wt = this.getView().byId("id_sto_tar_wt_h").getValue();
                    let Net_Wt  = this.getView().byId("id_sto_net_wt_h").getValue();
                    let Gross_Weight = this.getView().byId("id_sto_gross_wt_h").getValue();
                    let Weight_Time = this.getView().byId("id_sto_wt_dt_time_h").getValue();
                    let Remarks = this.getView().byId("id_sto_remark_h").getValue();
            
                    console.log("gateentryno:", gateentryno);
                    console.log("Delivery_Document:", Delivery_Document);
                    console.log("Plant_Code:",Plant_Code);
                    console.log("Plant_Name:", Plant_Name);
                    console.log("Customer_Code:", Customer_Code);
                    console.log("Customer_Name:", Customer_Name);
                    console.log("Gate_Entry_Date:", Gate_Entry_Date);
                    console.log("Vehicle_No:", Vehicle_No);
                    console.log("Vehicle_Type:", Vehicle_Type);
                    console.log("Transporter:", Transporter);
                    console.log("Transporter_Mode:", Transporter_Mode);
                    console.log("Delivery_Doc_Gross:", Delivery_Doc_Gross);
                    console.log("Tare_Wt:", Tare_Wt);
                    console.log("Net_Wt:", Net_Wt);
                    console.log("Gross_Weight:", Gross_Weight);
                    console.log("Weight_Time:", Weight_Time);
                    console.log("Remarks:", Remarks);

                    console.log("ValidationArrayNonDatas:", ValidationArrayNonDatas)
                    console.log("ValidationArrayNonDatasLength:", ValidationArrayNonDatas.length)

            if (ValidationArrayNonDatas.length === 0 || ValidationArrayNonDatas.length === "0" ){
                // this.getView().byId("id_sto_purchase_document_h").setValueState(sap.ui.core.ValueState.None);
                // this.getView().byId("id_sto_purchase_document_h").setValueStateText("");
            
                // this.getView().byId("id_sto_gate_date").setValueState(sap.ui.core.ValueState.None);
                // this.getView().byId("id_sto_gate_date").setValueStateText("");
            
                // this.getView().byId("id_sto_vehno_h").setValueState(sap.ui.core.ValueState.None);
                // this.getView().byId("id_sto_vehno_h").setValueStateText("");
                
                // this.getView().byId("id_sto_transporter_h").setValueState(sap.ui.core.ValueState.None);
                // this.getView().byId("id_sto_transporter_h").setValueStateText("");
              
                var Table_Id = this.getView().byId("salestoeturn_table_id"); // Assuming 'persoTable' is the ID of the Grid Table
                var oModel = Table_Id.getModel();
                var Table_Length = Table_Id.getRows().length;
            
            var itemData = [];
            
                for (var i = 0; i < Table_Length; i++) {
            
                    var Customer_Document_No = Table_Id.getRows()[1].getCells()[1].getValue();
                    var Product_Code = Table_Id.getRows()[i].getCells()[2].getValue();
                    var Product_Name = Table_Id.getRows()[i].getCells()[3].getValue();
                    var Product_Type = Table_Id.getRows()[i].getCells()[4].getValue();
                    var Order_Quantity = Table_Id.getRows()[i].getCells()[5].getValue();
                    var UOM = Table_Id.getRows()[i].getCells()[6].getValue();
                    var Open_Quantity = Table_Id.getRows()[i].getCells()[7].getValue();
                    var Quantity_in_GE  = Table_Id.getRows()[i].getCells()[8].getValue();
                    if(Quantity_in_GE === ""){
                        var Quantity_in_GE1  = "0";
                    }else{
                        var Quantity_in_GE1  = Quantity_in_GE;
                    }
                    var Item = Table_Id.getRows()[i].getCells()[0].getValue();
            
                    if(Item ===""){
                          break;
                    }


                        itemData.push({

                            Id:gateentryno,
                            ItemNo:Item,
                            ReferenceDocumentYear:"",
                            ReferenceDocument:Delivery_Document,
                            ReferenceDocumentType:"",
                            ProductCode:Product_Code,
                            ProductName:Product_Name,
                            ProductType:"",
                            OrderQuantity:Order_Quantity,
                            UOM:UOM,
                            OpenQuantity:Open_Quantity,
                            OpenQuantityUOM:UOM,
                            QuantityInGE:Quantity_in_GE1,
                            QuantityInGEUOM:UOM,
                            PlantCode:Plant_Code,
                            PlantName:Plant_Name,
                            SupplierCode:"",
                            SupplierName:"",
                            SupplierType:"",
                            CustomerCode:Customer_Code,
                            CustomerName:Customer_Name,
                            CustomerType:"",
                            EWayBill:"",
                            GateEntryDate:Gate_Entry_Date,
                            VehicleType:Vehicle_Type,
                            VehicleNo:Vehicle_No,
                            InvoiceNo:"",
                            InvoiceDate:"",
                            Transporter:Transporter,
                            TransporterMode:Transporter_Mode,
                            LRNo:"",
                            LRDate:"",
                            GrossWeight:Gross_Weight,
                            WeightTime:Weight_Time,
                            WeightDate:Weight_Time,
                            NoOfPackages:"",
                            Remarks:Remarks,
                            Status:"created",
                            ItemsStatus:"created",
                            BillingDocument:"",
                            DeliveryDocumentNo:"",
                            SalesReturnNo:"",
                            ScreenCode:"GE8",
                            TareWeight:Tare_Wt,
                            NetWeight:Net_Wt,
                            DelDocGrossWeight:Delivery_Doc_Gross,              
                            PostingDate:this.CurrentDate01,              
                
                        });

                    }
            
                console.log(itemData);
            
                var oEntry = {};
                           
                oEntry.Id = gateentryno,
                oEntry.ReferenceDocumentYear = "",
                oEntry.ReferenceDocument = Delivery_Document,
                oEntry.ReferenceDocumentType = "",
                oEntry.PlantCode = Plant_Code,
                oEntry.PlantName = Plant_Name,
                oEntry.SupplierCode = "",
                oEntry.SupplierName = "",
                oEntry.SupplierType = "",
                oEntry.CustomerCode = Customer_Code,
                oEntry.CustomerName = Customer_Name,
                oEntry.CustomerType = "",
                oEntry.EWayBill = "",
                oEntry.GateEnrtyDate = Gate_Entry_Date,
                oEntry.VehicleType = Vehicle_Type,
                oEntry.VehicleNo = Vehicle_No,
                oEntry.InvoiceNo = "",
                oEntry.InvoiceDate = "",
                oEntry.Transporter = Transporter,
                oEntry.TransporterMode = Transporter_Mode,
                oEntry.LRNo = "",
                oEntry.LRDate = "",
                oEntry.GrossWeight = Gross_Weight,
                oEntry.WeightTime = Weight_Time,
                oEntry.WeightDate = Weight_Time,
                oEntry.NoOfPackages = "",
                oEntry.Remarks = Remarks,
                oEntry.Status = "created",
                oEntry.DeliveryDocumentNo = Delivery_Document,
                oEntry.BillingDocumentNo = "",
                oEntry.SalesReturnNo = "",
                oEntry.ScreenCode = "GE8",
                oEntry.TareWeight = Tare_Wt,
                oEntry.NetWeight = Net_Wt,
                oEntry.DelDocGrossWeight = Delivery_Doc_Gross,
            
                oEntry.to_ITEM = itemData,
            
                console.log(oEntry);
                
            this.getView().setModel();
                                
            var oModelGet = this.getView().getModel("YY1_ZOUTWARD_HEAD_CDS");
            var that = this;
            
            oModelGet.create("/YY1_ZOUTWARD_HEAD", oEntry, {
                success: function (oData, oResponse) {
               console.log(oData);
               console.log("saved")
               oModelGet.refresh(true);
                    sap.ui.core.BusyIndicator.hide();

                    var oTable = that.getView().byId("salestoeturn_table_id");
                    var oTableModel = new sap.ui.model.json.JSONModel();
                    oTableModel.setData({ items: "" });
                    oTable.setModel(oTableModel);
                    oTable.bindRows("/items");
            
                    // empty field to reload 
                    that.getView().byId("id_sto_purchase_document_h").setValue("");
                    that.getView().byId("id_sto_plant_h").setValue("");
                    that.getView().byId("id_sto_plant_name_h").setValue("");
                    that.getView().byId("id_sto_cust_name_h").setValue("");
                    that.getView().byId("id_sto_customer_h").setValue("");
                    that.getView().byId("id_sto_vehno_h").setValue("");
                    that.getView().byId("id_sto_vehicle_type_h").setValue("");
                    that.getView().byId("id_sto_transporter_h").setValue("");
                    that.getView().byId("id_sto_transporter_mode_h").setValue("");
                    that.getView().byId("id_sto_del_doc_wt_h").setValue("");
                    that.getView().byId("id_sto_tar_wt_h").setValue("");
                    that.getView().byId("id_sto_net_wt_h").setValue("");
                    that.getView().byId("id_sto_gross_wt_h").setValue("");
                    that.getView().byId("id_sto_wt_dt_time_h").setValue("");
                    that.getView().byId("id_sto_remark_h").setValue("");
                    that.getView().byId("idstotabopqtyge_i").setValue("");
                    that.getView().byId("Final_Save_Button").setEnabled(false);

                    resolve(oData);
                },
            
                error:function(error){
              console.log("error");
              sap.ui.core.BusyIndicator.hide();
              reject(new Error("Validation failed"))
            
                }
                 });
            
            }
                
            else{
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show("Please Enter Mandatory Fields...")
                // if(Delivery_Document === ""){
                //     this.getView().byId("id_sto_purchase_document_h").setValueState(sap.ui.core.ValueState.Error);
                //     this.getView().byId("id_sto_purchase_document_h").setValueStateText("Please Enter Sales STO No");
                // }else{
                //     this.getView().byId("id_sto_purchase_document_h").setValueState(sap.ui.core.ValueState.None);
                //     this.getView().byId("id_sto_purchase_document_h").setValueStateText("");
                // }
                // if(Gate_Entry_Date === ""){
                //     this.getView().byId("id_sto_gate_date").setValueState(sap.ui.core.ValueState.Error);
                //     this.getView().byId("id_sto_gate_date").setValueStateText("Please Enter Gate Entry Date");
                // }else{
                //     this.getView().byId("id_sto_gate_date").setValueState(sap.ui.core.ValueState.None);
                //     this.getView().byId("id_sto_gate_date").setValueStateText("");
                // }
                // if(Vehicle_No === ""){
                //     this.getView().byId("id_sto_vehno_h").setValueState(sap.ui.core.ValueState.Error);
                //     this.getView().byId("id_sto_vehno_h").setValueStateText("Please Enter Vehicle No");
                // }else{
                //     this.getView().byId("id_sto_vehno_h").setValueState(sap.ui.core.ValueState.None);
                //     this.getView().byId("id_sto_vehno_h").setValueStateText("");
                // }
                // if(Transporter === ""){
                //     this.getView().byId("id_sto_transporter_h").setValueState(sap.ui.core.ValueState.Error);
                //     this.getView().byId("id_sto_transporter_h").setValueStateText("Please Enter Tranporter No");
                // }else{
                //     this.getView().byId("id_sto_transporter_h").setValueState(sap.ui.core.ValueState.None);
                //     this.getView().byId("id_sto_transporter_h").setValueStateText("");
                // }
            
                }
            });

        },

        OnCancel:function(){
            sap.ui.core.BusyIndicator.show();
            var oTable = this.getView().byId("salestoeturn_table_id");
            var oTableModel = new sap.ui.model.json.JSONModel();
            oTableModel.setData({ items: "" });
            oTable.setModel(oTableModel);
            oTable.bindRows("/items");
        
            // empty field to reload 
            this.getView().byId("id_sto_purchase_document_h").setValue("");
            this.getView().byId("id_sto_plant_h").setValue("");
            this.getView().byId("id_sto_plant_name_h").setValue("");
            this.getView().byId("id_sto_cust_name_h").setValue("");
            this.getView().byId("id_sto_customer_h").setValue("");
            this.getView().byId("id_sto_vehno_h").setValue("");
            this.getView().byId("id_sto_vehicle_type_h").setValue("");
            this.getView().byId("id_sto_transporter_h").setValue("");
            this.getView().byId("id_sto_transporter_mode_h").setValue("");
            this.getView().byId("id_sto_del_doc_wt_h").setValue("");
            this.getView().byId("id_sto_tar_wt_h").setValue("");
            this.getView().byId("id_sto_net_wt_h").setValue("");
            this.getView().byId("id_sto_gross_wt_h").setValue("");
            this.getView().byId("id_sto_wt_dt_time_h").setValue("");
            this.getView().byId("id_sto_remark_h").setValue("");
            this.getView().byId("idstotabopqtyge_i").setValue("");
            this.getView().byId("Final_Save_Button").setEnabled(false);
            sap.ui.core.BusyIndicator.hide();

        },


        // --------------------------------------------------------------------------------------------------------------------

        
        ONCancel: function () {

            this.getView().byId("id_edit_sto_gateentry_h").setValue("");
            this.getView().byId("id_edit_sto_sapuuid_h").setValue("");
            this.getView().byId("id_edit_sto_purchase_document_h").setValue("")
            this.getView().byId("id_edit_sto_plant_h").setValue("")
            this.getView().byId("id_edit_sto_plant_name_h").setValue("")
            this.getView().byId("id_edit_sto_customer_h").setValue("")
            this.getView().byId("id_edit_sto_cust_name_h").setValue("")
            this.getView().byId("id_edit_sto_gate_date").setValue("")
            this.getView().byId("id_edit_sto_vehicle_type_h").setValue("")
            this.getView().byId("id_edit_sto_vehno_h").setValue("")
            this.getView().byId("id_edit_sto_transporter_mode_h").setValue("")
            this.getView().byId("id_edit_sto_transporter_h").setValue("")
            this.getView().byId("id_edit_sto_del_doc_wt_h").setValue("")
            this.getView().byId("id_edit_sto_tar_wt_h").setValue("")
            this.getView().byId("id_edit_sto_net_wt_h").setValue("")
            this.getView().byId("id_edit_sto_gross_wt_h").setValue("")
            this.getView().byId("id_edit_sto_wt_dt_time_h").setValue("")
            this.getView().byId("id_edit_sto_remark_h").setValue("")

            var oJSONModeledit = new sap.ui.model.json.JSONModel({
                datasedit: {}
            });
            this.getView().setModel(oJSONModeledit, "JModeledit");
            this.getView().byId("id_storeceipt_table").setVisible(false)

            this.StoChangeDocNohead.close();
        },
        
        
        OnStoChangeDocNoFragOpen:function(oEvent){
            if (!this.StoChangeDocNohead) {
                this.StoChangeDocNohead = sap.ui.xmlfragment(this.getView().getId("STODialogFrag"), "gatepassapp.view.outward.sales.fragment.changedeletestoreceipt", this);
                this.getView().addDependent(this.StoChangeDocNohead);
            }
            this.StoChangeDocNohead.open();
        },

        OnStoGateEntryNoFragOpen:function(oEvent){
            if (!this.SoDocChange) {
                this.SoDocChange = sap.ui.xmlfragment(this.getView().getId("StoChangeDocNo_dialog"), "gatepassapp.view.outward.sales.fragment.stogateentrydocno", this);
                this.getView().addDependent(this.SoDocChange);
            }
        
            this.SoDocChange.open();
        },
        
        
        
        OnSTOGateEntryDocSelect : function (oEvent) {
            sap.ui.core.BusyIndicator.show();
            
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);
        
            var aContexts = oEvent.getParameter("selectedContexts");
        
            if (aContexts === undefined){
                console.log("undefined");
                sap.ui.core.BusyIndicator.hide();
                // this._pBusyDialog.close();
                let Dataa = this.getView().byId("id_edit_sto_gateentry_h").getValue();
                if(Dataa === ""){
                    this.getView().byId("Final_Update_Button").setEnabled(false);
                    this.getView().byId("Final_Delete_Button").setEnabled(false);
                    this.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
                    sap.ui.core.BusyIndicator.hide();
                }
                
            }else{
        
                var value1 , value2;
        
                if (aContexts && aContexts.length) {
        
                    aContexts.map(function (oContext) {
                        value1 = oContext.getObject().Id;
                        value2 = oContext.getObject().SAP_UUID;
                        return;
                    });
                    this.getView().byId("id_edit_sto_gateentry_h").setValue(value1);
                    this.getView().byId("id_edit_sto_sapuuid_h").setValue(value2);
                }
        
                var filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, value1);
                var model0 = this.getView().getModel("YY1_ZOUTWARD_HEAD_CDS");
                var model011 = this.getView().getModel("YY1_ZOUTWARD_HEAD_CDS");
                var that = this;
                    model0.read("/YY1_ZOUTWARD_HEAD", {
                        filters: [filter], 
                        success: function (ODat, oRespons) {
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

                            let ReferenceDocument = value11.ReferenceDocument;
                            let ReferenceDocumentType = value11.ReferenceDocumentType;
                            let PlantCode = value11.PlantCode;
                            let PlantName = value11.PlantName;
                            let SupplierCode = value11.SupplierCode;
                            let SupplierName = value11.SupplierName;
                            let SupplierType = value11.SupplierType;
                            let CustomerCode = value11.CustomerCode;
                            let CustomerName = value11.CustomerName;
                            let CustomerType = value11.CustomerType;
                            let EWayBill = value11.EWayBill;
                            let GateEntryDate = value11.GateEnrtyDate;
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

                            that.getView().byId("id_edit_sto_purchase_document_h").setValue(ReferenceDocument)
                            that.getView().byId("id_edit_sto_plant_h").setValue(PlantCode)
                            that.getView().byId("id_edit_sto_plant_name_h").setValue(PlantName)
                            that.getView().byId("id_edit_sto_customer_h").setValue(CustomerCode)
                            that.getView().byId("id_edit_sto_cust_name_h").setValue(CustomerName)
                            that.getView().byId("id_edit_sto_gate_date").setValue(GateEntryDate)
                            that.getView().byId("id_edit_sto_vehicle_type_h").setValue(VehicleType)
                            that.getView().byId("id_edit_sto_vehno_h").setValue(VehicleNo)
                            that.getView().byId("id_edit_sto_transporter_mode_h").setValue(TransporterMode)
                            that.getView().byId("id_edit_sto_transporter_h").setValue(Transporter)
                            that.getView().byId("id_edit_sto_del_doc_wt_h").setValue(DelDocGrossWeight)
                            that.getView().byId("id_edit_sto_tar_wt_h").setValue(TareWeight)
                            that.getView().byId("id_edit_sto_net_wt_h").setValue(NetWeight)
                            that.getView().byId("id_edit_sto_gross_wt_h").setValue(GrossWeight)
                            that.getView().byId("id_edit_sto_wt_dt_time_h").setValue(WeightTime)
                            that.getView().byId("id_edit_sto_remark_h").setValue(Remarks)
                            
                            model011.read("/YY1_ZOUTWARD_HEAD(guid'" + SAPUIID + "')/to_ITEM", {
                            
                                success: function (oData) {
                                var oJSONModeledit = new sap.ui.model.json.JSONModel({
                                    datasedit: oData.results
                                });
                                that.getView().setModel(oJSONModeledit, "JModeledit");
                                that.getView().byId("id_storeceipt_table").setVisible(true)
                                sap.ui.core.BusyIndicator.hide();
                                },
                                error: function (oError) {
                                    console.log(oError);
                                    that.getView().byId("id_storeceipt_table").setVisible(false)
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
            let Quantity_to_Post_Input = oEvent.getSource().getParent().getCells()[9].getValue(); 
            let OrderQuantity = oEvent.getSource().getParent().getCells()[8].getValue(); 
            
            if (Quantity_to_Post_Input === ""){
                oEvent.getSource().getParent().getCells()[9].setValue("0"); 
            }else{
            let PoItem = oEvent.getSource().getParent().getCells()[1].getValue(); 
            let PoNo = oEvent.getSource().getParent().getCells()[2].getValue(); 
            let Id = this.getView().byId("id_edit_sto_gateentry_h").getValue();
            console.log("PoItem:",PoItem);
            console.log("PoNo:",PoNo);
            console.log("Id:",Id);
        
            let Quantity_to_Post_Input_Float = parseFloat(Quantity_to_Post_Input);
            let OrderQuantity_Float = parseFloat(OrderQuantity);
        
            var oFilter = new sap.ui.model.Filter("ItemNo", sap.ui.model.FilterOperator.EQ, PoItem);
            var oFilter1 = new sap.ui.model.Filter("ReferenceDocument", sap.ui.model.FilterOperator.EQ, PoNo);
            var oFilter2 = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, Id);
              var that=this;
                var oModel002 = this.getView().getModel("YY1_ZOUTWARD_HEAD_CDS");
                var oFilters = [oFilter, oFilter1, oFilter2];
        
                oModel002.read("/YY1_ITEM_ZOUTWARD_HEAD", {
                    filters: oFilters,
                    success: function(oData) {
                        var aItems01 = oData.results;
                         console.log("aItems01:",aItems01);
                        console.log(aItems01[0].QuantityInGE); 
        
                        var Clone_Quantity_to_Post_Input_Float = parseFloat(aItems01[0].QuantityInGE);
                           
                        if (parseFloat(Quantity_to_Post_Input_Float) > parseFloat(OrderQuantity_Float)){
                            oEvent.getSource().getParent().getCells()[9].setValue(Clone_Quantity_to_Post_Input_Float);
                            oEvent.getSource().getParent().getCells()[9].setValueState(sap.ui.core.ValueState.Error);
                            console.log("If Condition 01");
                            that.getView().byId("id_update_button").setEnabled(false);
                        }else{
                            oEvent.getSource().getParent().getCells()[9].setValueState(sap.ui.core.ValueState.None);
                            console.log("If COndition 03")
                            that.getView().byId("id_update_button").setEnabled(true);
                        }
        
                    },
                    error: function(oError) {
                        console.error("Error reading data: ", oError);
                        reject(oError); // Reject with the error
                    }
                });
              
               
            }
        },

        OnTableRowRemove: function(oEvent) {
            var oTable = this.byId("id_storeceipt_table");
            var oTableRows = oTable.getRows();
            var aIndices = this.byId("id_storeceipt_table").getSelectedIndices();
            
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
                    var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE8');
                    var oFilter4 = new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, 'created');
            
                    var oModel2 = that.getView().getModel("YY1_ZOUTWARD_HEAD_CDS");
                    var oFilters = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4];

                    var CalData = 0;
            
                    oModel2.read("/YY1_ITEM_ZOUTWARD_HEAD", {
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
            
            let GateEntryNo = this.getView().byId("id_edit_sto_gateentry_h").getValue()
            let ReferenceDocument = this.getView().byId("id_edit_sto_purchase_document_h").getValue()
            let SAP_UUID_H = this.getView().byId("id_edit_sto_sapuuid_h").getValue()
            let PlantCode = this.getView().byId("id_edit_sto_plant_h").getValue()
            let PlantName = this.getView().byId("id_edit_sto_plant_name_h").getValue()
            let CustomerCode = this.getView().byId("id_edit_sto_customer_h").getValue()
            let CustomerName = this.getView().byId("id_edit_sto_cust_name_h").getValue()
            let GateEntryDate = this.getView().byId("id_edit_sto_gate_date").getValue()
            let VehicleType = this.getView().byId("id_edit_sto_vehicle_type_h").getValue()
            let VehicleNo = this.getView().byId("id_edit_sto_vehno_h").getValue()
            let TransporterMode = this.getView().byId("id_edit_sto_transporter_mode_h").getValue()
            let Transporter = this.getView().byId("id_edit_sto_transporter_h").getValue()
            let DelDocGrossWeight = this.getView().byId("id_edit_sto_del_doc_wt_h").getValue()
            let TareWeight = this.getView().byId("id_edit_sto_tar_wt_h").getValue()
            let NetWeight = this.getView().byId("id_edit_sto_net_wt_h").getValue()
            let GrossWeight = this.getView().byId("id_edit_sto_gross_wt_h").getValue()
            let WeightTime = this.getView().byId("id_edit_sto_wt_dt_time_h").getValue()
            let Remarks = this.getView().byId("id_edit_sto_remark_h").getValue()     

            if(PlantCode!=="" && CustomerCode!=="" && Transporter!== "" && VehicleNo !==""){
               
               this.getView().byId("id_edit_sto_plant_h").setValueState(sap.ui.core.ValueState.None);
               this.getView().byId("id_edit_sto_plant_h").setValueStateText("");
               this.getView().byId("id_edit_sto_customer_h").setValueState(sap.ui.core.ValueState.None);
               this.getView().byId("id_edit_sto_customer_h").setValueStateText("");
               this.getView().byId("id_edit_sto_transporter_h").setValueState(sap.ui.core.ValueState.None);
               this.getView().byId("id_edit_sto_transporter_h").setValueStateText("");
               this.getView().byId("id_edit_sto_vehno_h").setValueState(sap.ui.core.ValueState.None);
               this.getView().byId("id_edit_sto_vehno_h").setValueStateText("");

                     var oEntrySTOHEAD = {
                        Id:GateEntryNo,
                        PlantCode: PlantCode,
                        PlantName: PlantName,
                        CustomerCode: CustomerCode,
                        CustomerName: CustomerName,
                        GateEnrtyDate: GateEntryDate,
                        VehicleType: VehicleType,
                        VehicleNo: VehicleNo,
                        TransporterMode: TransporterMode,
                        Transporter: Transporter,
                        DelDocGrossWeight: DelDocGrossWeight,
                        TareWeight: TareWeight,
                        NetWeight: NetWeight,
                        GrossWeight: GrossWeight,
                        WeightTime: WeightTime,
                        Remarks: Remarks,
                        Status : "created",

                    };
        
                    var that = this;

                    console.log("oEntrySTOHEAD:", oEntrySTOHEAD)
                    await that.ToUpdateSTOItems(oEntrySTOHEAD)
                    
                    var oModel06 = this.getView().getModel("YY1_ZOUTWARD_HEAD_CDS");
                    oModel06.setHeaders({
                    "X-Requested-With": "X",
                    "Content-Type": "application/json"
                    });
        
                    oModel06.update("/YY1_ZOUTWARD_HEAD(guid'" + SAP_UUID_H + "')", oEntrySTOHEAD, {
                    success: function(data) {
                        console.log("Header Updated:", data);
                        sap.ui.core.BusyIndicator.hide();
                        MessageBox.success("Document No " + GateEntryNo + " Updated Successfully", {
                            title: "Sales ",
                            id: "messageBoxId1",
                            contentWidth: "100px",
                        });                    
                        oModel06.refresh(true);
                        var oJSONModeledit = new sap.ui.model.json.JSONModel({
                            datasedit: {}
                        });
                        that.getView().setModel(oJSONModeledit, "JModeledit");
                        that.getView().byId("id_storeceipt_table").setVisible(false)

                        that.getView().byId("id_edit_sto_gateentry_h").setValue("")
                        that.getView().byId("id_edit_sto_purchase_document_h").setValue("")
                        that.getView().byId("id_edit_sto_sapuuid_h").setValue("")
                        that.getView().byId("id_edit_sto_plant_h").setValue("")
                        that.getView().byId("id_edit_sto_plant_name_h").setValue("")
                        that.getView().byId("id_edit_sto_customer_h").setValue("")
                        that.getView().byId("id_edit_sto_cust_name_h").setValue("")
                        that.getView().byId("id_edit_sto_gate_date").setValue("")
                        that.getView().byId("id_edit_sto_vehicle_type_h").setValue("")
                        that.getView().byId("id_edit_sto_vehno_h").setValue("")
                        that.getView().byId("id_edit_sto_transporter_mode_h").setValue("")
                        that.getView().byId("id_edit_sto_transporter_h").setValue("")
                        that.getView().byId("id_edit_sto_del_doc_wt_h").setValue("")
                        that.getView().byId("id_edit_sto_tar_wt_h").setValue("")
                        that.getView().byId("id_edit_sto_net_wt_h").setValue("")
                        that.getView().byId("id_edit_sto_gross_wt_h").setValue("")
                        that.getView().byId("id_edit_sto_wt_dt_time_h").setValue("")
                        that.getView().byId("id_edit_sto_remark_h").setValue("")
        
                    },
                    error: function(error) {
                        console.error("Error updating header:", error);
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show(" Error")
                    }
                    });        
         
                    
                 }else{
                    sap.ui.core.BusyIndicator.hide();
         
                     if(GateEntryNo ===""){
                         this.getView().byId("id_edit_sto_gateentry_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_edit_sto_gateentry_h").setValueStateText("Please Select Gate Entry No");
                     }else{
                         this.getView().byId("id_edit_sto_gateentry_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_edit_sto_gateentry_h").setValueStateText("");
                     }
         
                     if(Transporter ===""){
                         this.getView().byId("id_edit_sto_transporter_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_edit_sto_transporter_h").setValueStateText("Please Select Transporter");
                     }else{
                         this.getView().byId("id_edit_sto_transporter_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_edit_sto_transporter_h").setValueStateText("");
                     }
         
                     if(VehicleNo ===""){
                         this.getView().byId("id_edit_sto_vehno_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_edit_sto_vehno_h").setValueStateText("Please Enter ");
                     }else{
                         this.getView().byId("id_edit_sto_vehno_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_edit_sto_vehno_h").setValueStateText("");
                     }
                  
                 }
        },

        ToUpdateSTOItems:function(oEntryH){

            return new Promise((resolve, reject) => {

                    var Table_Id = this.getView().byId("id_storeceipt_table"); // Assuming 'persoTable' is the ID of the Grid Table
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
                                ApproveStatus:"pending",
                            };
        
                            console.log("itemDataSTO:", itemDataSTO);
        
                            var oModel_04 = this.getView().getModel("YY1_ZOUTWARD_HEAD_CDS");
                            oModel_04.setHeaders({
                                "X-Requested-With": "X",
                                "Content-Type": "application/json"
                            });
            
                            oModel_04.update("/YY1_ITEM_ZOUTWARD_HEAD(guid'" + SAP_UUID_I + "')", itemDataSTO, {
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

            let Sales_Return_Document = this.getView().byId("id_edit_sto_gateentry_h").getValue();
            if(Sales_Return_Document){
                let SAP_UUID_H = this.getView().byId("id_edit_sto_sapuuid_h").getValue();

                // ---------- Start Item Level

                var Table_Id = this.getView().byId("id_storeceipt_table");
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
                    Status: Delete_Status
                };

                var oModel_04 = this.getView().getModel("YY1_ZOUTWARD_HEAD_CDS");
                oModel_04.setHeaders({
                    "X-Requested-With": "X",
                    "Content-Type": "application/json"
                });

                oModel_04.update("/YY1_ITEM_ZOUTWARD_HEAD(guid'" + SAP_UUID_I + "')", itemData, {
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
            var oModel05 = this.getView().getModel("YY1_ZOUTWARD_HEAD_CDS");
            oModel05.setHeaders({
            "X-Requested-With": "X",
            "Content-Type": "application/json"
            });

            oModel05.update("/YY1_ZOUTWARD_HEAD(guid'" + SAP_UUID_H + "')", oEntry1, {
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
                that.getView().byId("id_storeceipt_table").setVisible(false)

                that.getView().byId("id_edit_sto_gateentry_h").setValue("")
                that.getView().byId("id_edit_sto_purchase_document_h").setValue("")
                that.getView().byId("id_edit_sto_sapuuid_h").setValue("")
                that.getView().byId("id_edit_sto_plant_h").setValue("")
                that.getView().byId("id_edit_sto_plant_name_h").setValue("")
                that.getView().byId("id_edit_sto_customer_h").setValue("")
                that.getView().byId("id_edit_sto_cust_name_h").setValue("")
                that.getView().byId("id_edit_sto_gate_date").setValue("")
                that.getView().byId("id_edit_sto_vehicle_type_h").setValue("")
                that.getView().byId("id_edit_sto_vehno_h").setValue("")
                that.getView().byId("id_edit_sto_transporter_mode_h").setValue("")
                that.getView().byId("id_edit_sto_transporter_h").setValue("")
                that.getView().byId("id_edit_sto_del_doc_wt_h").setValue("")
                that.getView().byId("id_edit_sto_tar_wt_h").setValue("")
                that.getView().byId("id_edit_sto_net_wt_h").setValue("")
                that.getView().byId("id_edit_sto_gross_wt_h").setValue("")
                that.getView().byId("id_edit_sto_wt_dt_time_h").setValue("")
                that.getView().byId("id_edit_sto_remark_h").setValue("")
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

            let Sales_Return_Document = this.getView().byId("id_edit_sto_gateentry_h").getValue();
            if(Sales_Return_Document !==""){
                let SAP_UUID_H = this.getView().byId("id_edit_sto_sapuuid_h").getValue();

                // ---------- Start Item Level

            var Table_Id = this.getView().byId("id_storeceipt_table");
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
                    Status: Delete_Status
                };

                var oModel_04 = this.getView().getModel("YY1_ZOUTWARD_HEAD_CDS");
                oModel_04.setHeaders({
                    "X-Requested-With": "X",
                    "Content-Type": "application/json"
                });

                oModel_04.update("/YY1_ITEM_ZOUTWARD_HEAD(guid'" + SAP_UUID_I + "')", itemData, {
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

            var oModel05 = this.getView().getModel("YY1_ZOUTWARD_HEAD_CDS");
            oModel05.setHeaders({
            "X-Requested-With": "X",
            "Content-Type": "application/json"
            });

            oModel05.update("/YY1_ZOUTWARD_HEAD(guid'" + SAP_UUID_H + "')", oEntry1, {
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
                that.getView().byId("id_storeceipt_table").setVisible(false)

                that.getView().byId("id_edit_sto_gateentry_h").setValue("")
                that.getView().byId("id_edit_sto_purchase_document_h").setValue("")
                that.getView().byId("id_edit_sto_sapuuid_h").setValue("")
                that.getView().byId("id_edit_sto_plant_h").setValue("")
                that.getView().byId("id_edit_sto_plant_name_h").setValue("")
                that.getView().byId("id_edit_sto_customer_h").setValue("")
                that.getView().byId("id_edit_sto_cust_name_h").setValue("")
                that.getView().byId("id_edit_sto_gate_date").setValue("")
                that.getView().byId("id_edit_sto_vehicle_type_h").setValue("")
                that.getView().byId("id_edit_sto_vehno_h").setValue("")
                that.getView().byId("id_edit_sto_transporter_mode_h").setValue("")
                that.getView().byId("id_edit_sto_transporter_h").setValue("")
                that.getView().byId("id_edit_sto_del_doc_wt_h").setValue("")
                that.getView().byId("id_edit_sto_tar_wt_h").setValue("")
                that.getView().byId("id_edit_sto_net_wt_h").setValue("")
                that.getView().byId("id_edit_sto_gross_wt_h").setValue("")
                that.getView().byId("id_edit_sto_wt_dt_time_h").setValue("")
                that.getView().byId("id_edit_sto_remark_h").setValue("")

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
        }
        

        });
    });
