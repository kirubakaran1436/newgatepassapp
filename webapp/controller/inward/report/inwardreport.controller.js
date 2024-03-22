sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/m/SearchField",
    "sap/ui/model/type/String",
    "sap/ui/table/Column",
    "sap/m/Column",
    "sap/m/Text",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, Fragment, Filter, FilterOperator, Device, SearchField, TypeString, UIColumn, MColumn, Text, JSONModel,exportLibrary ,Export,ExportTypeCSV, Spreadsheet,MessageToast) {
        "use strict";

        return Controller.extend("gatepassapp.controller.inward.report.inwardreport", {
            onInit: function () {

                var JSonModel = new sap.ui.model.json.JSONModel({
                    Samples: [

                        { "InwardId": "all", "InwardType": "all" },
                        { "InwardId": "GE3", "InwardType": "General Purchase" },
                        { "InwardId": "GE4", "InwardType": "Sales Return" },
                        { "InwardId": "GE5", "InwardType": "STO Inward Receipt" },
                        { "InwardId": "GE21", "InwardType": "Subcontracting Good Receipt" }
                    ]

                });
                this.getView().setModel(JSonModel, "SModel");


                var JSonModel = new sap.ui.model.json.JSONModel({
                    Samples: [
                        { "Status": "all", "StatusID": "all" },
                        { "Status": "created", "StatusID": "1" },
                        { "Status": "deleted", "StatusID": "2" },
                        { "Status": "approved", "StatusID": "3" },
                        { "Status": "rejected", "StatusID": "4" },
                        { "Status": "completed", "StatusID": "5" },
                    ]

                });
                this.getView().setModel(JSonModel, "AModel");
            },

            OnPlantFragOpen:function(oEvent){ // Plant Fragment Open
              
                if(!this._dialog_plant){
                    this._dialog_plant = sap.ui.xmlfragment(this.getView().getId("id_report_plant_h"), "gatepassapp.view.inward.report.plant", this);
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
             
                // debugger;

                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);

                console.log(oBinding);
                let aContexts = oEvent.getParameter("selectedContexts");
                let value1,value2;
                console.log(aContexts);

                if(aContexts === undefined){
                    console.log("No Item Present");
                }else{
                    if (aContexts && aContexts.length) {

                        aContexts.map(function (oContext) {

                           
                            value1 = oContext.getObject().Plant;
                            value2 = oContext.getObject().PlantName;
                            return;
                            
                        });
                        this.byId("id_report_plant_h").setValue(value1);
                        this.byId("id_report_plantname_h").setValue(value2);
                        // sap.ui.core.BusyIndicator.hide();
                    }
                }

            },



            OnGataPassNoFragment:function(){

                var GetIOData = this.getView().byId("id_inward_combobox").getValue();
                var GetIODataKey = this.getView().byId("id_inward_combobox").getSelectedKey();
                console.log("GetIOData:",GetIOData);
                console.log("GetIODataKey:",GetIODataKey);

                if(GetIODataKey === "GE3"){ //----- If Select "General Purchase" -------//
                    if (!this._dialog_GenPurDocInwardNo) {
                        this._dialog_GenPurDocInwardNo = sap.ui.xmlfragment(this.getView().getId("idreportinwardgenpur"), "gatepassapp.view.inward.report.generalpurchase", this);
                        this.getView().addDependent(this._dialog_GenPurDocInwardNo);
                    }
                    this._dialog_GenPurDocInwardNo.open();
                }else if(GetIODataKey === "GE4"){
                    if (!this._dialog_SaleReturnDocNo) {
                        this._dialog_SaleReturnDocNo = sap.ui.xmlfragment(this.getView().getId("Soreport_dialog"), "gatepassapp.view.inward.report.salesreturn", this);
                        this.getView().addDependent(this._dialog_SaleReturnDocNo);
                    }
                    this._dialog_SaleReturnDocNo.open();
                }else if(GetIODataKey === "GE5"){
                    if (!this._dialog_StoReceiptDocNo) {
                        this._dialog_StoReceiptDocNo = sap.ui.xmlfragment(this.getView().getId("StoChangeDocHead_dialog"), "gatepassapp.view.inward.report.storeceipt", this);
                        this.getView().addDependent(this._dialog_StoReceiptDocNo);
                    }
                    this._dialog_StoReceiptDocNo.open();
                }else if(GetIODataKey === "GE21"){
                    if (!this._dialog_SubcontractDocNo) {
                        this._dialog_SubcontractDocNo = sap.ui.xmlfragment(this.getView().getId("idreportinwardgenpur"), "gatepassapp.view.inward.report.subcontracting", this);
                        this.getView().addDependent(this._dialog_SubcontractDocNo);
                    }
                    this._dialog_SubcontractDocNo.open();
                }else{
                    if (!this._dialog_allfrag) {
                        this._dialog_allfrag = sap.ui.xmlfragment(this.getView().getId("SalesGateEntryDocHead_dialog1"), "gatepassapp.view.inward.report.allfrag", this);
                        this.getView().addDependent(this._dialog_allfrag);
                    }
                    this._dialog_allfrag.open();
                }


            },






            OnGataPassNoSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Id", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },
    
            OnGataPassNoSelect : function (oEvent) {
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
                var aContexts = oEvent.getParameter("selectedContexts");
                var Id;
                if (aContexts && aContexts.length) {
                    aContexts.map(function (oContext) {
                        Id = oContext.getObject().Id;
                        return;
                    });
                    this.getView().byId("id_gate_pass_inward").setValue(Id);
                }
            }, 




            OnGoItemPage : function(){

                //  alert("clicked");


                let Dates = this.getView().byId("id_inward_date_h").getValue();

                if(Dates){

                    this.getView().byId("id_inward_date_h").setValueState(sap.ui.core.ValueState.None)
                    this.getView().byId("id_inward_date_h").setValueStateText("")
                    const myArray = Dates.split(" - ");
                    console.log("myArray:",myArray);
    
                    let datefrom = new Date(myArray[0]);
                    let dateto = new Date(myArray[1]);
                    let FromDate = new Date(datefrom.getTime() - (datefrom.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];    
                    let ToDate = new Date(dateto.getTime() - (dateto.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];    
                    let status = this.getView().byId("id_inward_rep_st_h").getValue();
                    let plant = this.getView().byId("id_report_plant_h").getValue();
                    
                    let selectinward = this.getView().byId("id_inward_combobox").getSelectedKey();
                    let gateentryno = this.getView().byId("id_gate_pass_inward").getValue();
    
                    console.log("FromDate:", FromDate);
                    console.log("ToDate:", ToDate);
                    var model0 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
    
    
                    let fromFilter = new sap.ui.model.Filter("PostingDate", sap.ui.model.FilterOperator.BT, FromDate, ToDate);
    
                    if(status !=="all") {
                        var StatusFilter = new sap.ui.model.Filter([
                            new sap.ui.model.Filter("Status",sap.ui.model.FilterOperator.EQ,status),
                            new sap.ui.model.Filter("ItemsStatus",sap.ui.model.FilterOperator.EQ,status)
                       ], false);

                    }else{
    
                        var StatusFilter = new sap.ui.model.Filter("Status",sap.ui.model.FilterOperator.NE,"")
    
                    }
    
    
                    if(plant !==""){
                        var PlantFilter = new sap.ui.model.Filter("PlantCode",sap.ui.model.FilterOperator.EQ,plant)
                       
                    }else{
    
                        var PlantFilter = new sap.ui.model.Filter("PlantCode",sap.ui.model.FilterOperator.NE,"")
    
                    }
    
    
    
    
    
                    
                    if(selectinward !=="all"){
                        var SelectInwardTypeFilter = new sap.ui.model.Filter("ScreenCode",sap.ui.model.FilterOperator.EQ,selectinward)
                       
                    }else{
    
                        var SelectInwardTypeFilter = new sap.ui.model.Filter("ScreenCode",sap.ui.model.FilterOperator.NE,"")
    
                    }
    
    
    
                    if(gateentryno !==""){
                        var GateEntryFilter = new sap.ui.model.Filter("Id",sap.ui.model.FilterOperator.EQ,gateentryno)
                       
                    }else{
    
                        var GateEntryFilter = new sap.ui.model.Filter("Id",sap.ui.model.FilterOperator.NE,"")
    
                    }
                    
                    console.log("fromFilter:",fromFilter)
    
    
                    var that = this;
                    model0.read("/YY1_ITEM_ZGE_INWARD_GATEPASS", {
                        filters:[fromFilter,StatusFilter,PlantFilter,SelectInwardTypeFilter,GateEntryFilter],
                        success: function (oData, oRespons) {
                            console.log("oData:",oData);
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                data: oData.results
                            });
                            that.getView().setModel(oJSONModel, "GPEmodel");
                            console.log(oJSONModel);
                        }
                    });
               
                }else{
                    this.getView().byId("id_inward_date_h").setValueState(sap.ui.core.ValueState.Error)
                    this.getView().byId("id_inward_date_h").setValueStateText("Please Select Dates")
                }
                
           
           
            },

            


            createColumnConfig: function() {
  
                return [
                    {
                        label: 'Gate Entry No',
                        property: 'Id',
                        scale: 0
                    },
                    {
                        label: 'ItemNo',
                        property: 'ItemNo',
                        width: '8'
                    },
                    {
                        label: 'Reference Document',
                        property: 'ReferenceDocument',
                        width: '20'
                    },
                    {
                        label: 'Reference Document Type',
                        property: 'ReferenceDocumentType',        
                        width: '8'
                    },
                    {
                        label: 'Product Code',
                        property: 'ProductCode',
                        width: '18'
                        //  type: exportLibrary.Edm.String
                    },
            
            
                    {
                        label: 'Product Type',
                        property: 'ProductType',
                        width: '14'
                    },

                    {
                        label: 'Product Name',
                        property: 'ProductName',
                        width: '14'
                    },
            
            
                    {
                        label: 'UOM',
                        property: 'UOM',
                        width: '8'
                    },
            
            
                    {
                        label: 'Open Quantity',
                        property: 'OpenQuantity',
                        width: '6'
                    },
            
                    {
                        label: 'Open Quantity UOM',
                        property: 'OpenQuantityUOM',
                        width: '6'
                    },
            
                    {
                        label: 'Quantity In GE',
                        property: 'QuantityInGE',
                        width: '6'
                    },
            
                    {
                        label: 'Quantity In GE UOM',
                        property: 'QuantityInGEUOM',
                        width: '6'
                    },
            
            
                    {
                        label: 'Plant Code',
                        property: 'PlantCode',
                        width: '10'
                    },
            
            
                    {
                        label: 'PlantName',
                        property: 'PlantName',
                        width: '18'
                    },
            
                    {
                        label: 'Supplier Code',
                        property: 'SupplierCode',
                        width: '10'
                    },
                    {
                        label: 'Supplier Name',
                        property: 'SupplierName',
                        width: '25'
                    },
            
                    {
                        label: 'Supplier Type',
                        property: 'SupplierType',
                        width: '14'
                    },
                    {
                        label: 'Customer Code',
                        property: 'CustomerCode',
                        width: '8'
                    },
            
                    {
                        label: 'Customer Name',
                        property: 'CustomerName',
                        width: '10'
                    },
            
                    {
                        label: 'CustomerType',
                        property: 'Customer Type',
                        width: '20'
                    },
            
                    {
                        label: 'EWay Bill',
                        property: 'EWayBill',
                        width: '8'
                    },
            
            
                    {
                        label: 'Gate Entry Date',
                        property: 'GateEntryDate',
                        width: '18'
                    },
            
                    
                    {
                        label: 'VehicleType',
                        property: 'VehicleType',
                        width: '12'
                    },
            
                    {
                        label: 'Vehicle No',
                        property: 'VehicleNo',
                        width: '14'
                    },
            
                    {
                        label: 'Invoice No',
                        property: 'InvoiceNo',
                        width: '16'
                    },
            
                    {
                        label: 'Invoice Date',
                        property: 'InvoiceDate',
                        width: '18'
                    },
                    
            
                    {
                        label: 'Transporter',
                        property: 'Transporter',
                        width: '16'
                    }
                    ,
                    
            
                    {
                        label: 'Transporter Mode',
                        property: 'TransporterMode',
                        width: '12'
                    },
                    {
                        label: 'LR No',
                        property: 'LRNo',
                        width: '6'
                    }
                    ,
                    {
                        label: 'LR Date',
                        property: 'LRDate',
                        width: '6'
                    },
            
                    ,
                    {
                        label: 'Gross Weight',
                        property: 'GrossWeight',
                        width: '10'
                    },
                    {
                        label: 'GrossWeight',
                        property: 'GrossWeight',
                        width: '8'
                    }
                    ,
                    {
                        label: 'Weight Time',
                        property: 'WeightTime',
                        width: '14'
                    }
                    ,
                    {
                        label: 'Weight Date',
                        property: 'WeightDate',
                        width: '14'
                    }
                    ,
                    {
                        label: 'No Of Packages',
                        property: 'NoOfPackages',
                        width: '6'
                    },
                    {
                        label: 'Remarks',
                        property: 'Remarks',
                        width: '16'
                    },
                    {
                        label: 'Approve Status',
                        property: 'ApproveStatus',
                        width: '12'
                    },
                    {
                        label: 'Billing Document',
                        property: 'BillingDocument',
                        width: '18'
                    },
                    {
                        label: 'Delivery Document No',
                        property: 'DeliveryDocumentNo',
                        width: '18'
                    },
                    {
                        label: 'Sales Return No',
                        property: 'SalesReturnNo',
                        width: '18'
                    },
                    {
                        label: 'Status',
                        property: 'Status',
                        width: '14'
                    },
            
                    {
                        label: 'Posting Date',
                        property: 'PostingDate',
                        width: '30'
                    }
            
            
            
                
                
                ];
            },
            
            
            //1st method
            
            
            OnExportExl: function() {
                var aCols, oBinding, oSettings, oSheet, oTable;
            
                oTable = this.byId('inward_report_table_id');
                oBinding = oTable.getBinding().getModel().oData.data;
                
            
                console.log("oBinding:",oBinding);
                aCols = this.createColumnConfig();
            
                oSettings = {
                    workbook: { columns: aCols },
                    dataSource: oBinding
                };
                
            
                oSheet = new sap.ui.export.Spreadsheet(oSettings);
                oSheet.build()
                    .then(function() {
                        MessageToast.show('Spreadsheet export has finished');
                    }).finally(function() {
                        oSheet.destroy();
                    });
            }
            
           

        });
    });
