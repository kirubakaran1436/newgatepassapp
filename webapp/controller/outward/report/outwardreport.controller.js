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

        return Controller.extend("gatepassapp.controller.outward.report.outwardreport", {
            onInit: function () {

                var JSonModel = new sap.ui.model.json.JSONModel({
                    Samples: [
                        { "OutwardId": "all", "OutwardType": "all" },
                        { "OutwardId": "GE8", "OutwardType": "Sales" },
                        { "OutwardId": "GE9", "OutwardType": "STO" },
                        { "OutwardId": "GE10", "OutwardType": "Vendor Return" },
                        { "OutwardId": "GE11", "OutwardType": "Subcontracting" }
                    ]

                });
                this.getView().setModel(JSonModel, "OModel");


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
                    this._dialog_plant = sap.ui.xmlfragment(this.getView().getId("id_outward_plant_h"), "gatepassapp.view.outward.report.plant", this);
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
                        this.byId("id_outward_plant_h").setValue(value1);
                        this.byId("id_outward_plantname_h").setValue(value2);
                        // sap.ui.core.BusyIndicator.hide();
                    }
                }

            },



            OnGataPassNoFragment:function(){

                var GetIOData = this.getView().byId("id_outward_combobox").getValue();
                var GetIODataKey = this.getView().byId("id_outward_combobox").getSelectedKey();
                console.log("GetIOData:",GetIOData);
                console.log("GetIODataKey:",GetIODataKey);

                if(GetIODataKey === "GE8"){ //----- If Select "General Purchase" -------//
                    if (!this._dialog_SalesOutward) {
                        this._dialog_SalesOutward = sap.ui.xmlfragment(this.getView().getId("id_gate_pass_outward"), "gatepassapp.view.outward.report.salesoutwarddeliverydocumenthead", this);
                        this.getView().addDependent(this._dialog_SalesOutward);
                    }
                    this._dialog_SalesOutward.open();
                }else if(GetIODataKey === "GE9"){
                    if (!this._dialog_StooutBound) {
                        this._dialog_StooutBound = sap.ui.xmlfragment(this.getView().getId("id_gate_pass_outward"), "gatepassapp.view.outward.report.stodeliverydocumenthead", this);
                        this.getView().addDependent(this._dialog_StooutBound);
                    }
                    this._dialog_StooutBound.open();
                }else if(GetIODataKey === "GE10"){
                    if (!this._dialog_Vendorreturn) {
                        this._dialog_Vendorreturn = sap.ui.xmlfragment(this.getView().getId("id_gate_pass_outward"), "gatepassapp.view.outward.report.materialdocumenthead", this);
                        this.getView().addDependent(this._dialog_Vendorreturn);
                    }
                    this._dialog_Vendorreturn.open();
                }else if(GetIODataKey === "GE11"){
                    if (!this._dialog_subcontracting) {
                        this._dialog_subcontracting = sap.ui.xmlfragment(this.getView().getId("id_gate_pass_outward"), "gatepassapp.view.outward.report.subcontractingmaterialdocumenthead", this);
                        this.getView().addDependent(this._dialog_subcontracting);
                    }
                    this._dialog_subcontracting.open();
                }else{
                    if (!this._dialog_allfrag) {
                        this._dialog_allfrag = sap.ui.xmlfragment(this.getView().getId("SalesGateEntryDocHead_dialog1"), "gatepassapp.view.outward.report.allfrag", this);
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
                    this.getView().byId("id_gate_pass_outward").setValue(Id);
                }
            }, 

            OnGoItemPage : function(){
                
                let Dates = this.getView().byId("id_outward_date_h").getValue();
                if(Dates){
                    this.getView().byId("id_outward_date_h").setValueState(sap.ui.core.ValueState.None)
                    const myArray = Dates.split(" - ");
                    console.log("myArray:",myArray);
    
                    let datefrom = new Date(myArray[0]);
                    let dateto = new Date(myArray[1]);
                    let FromDate = new Date(datefrom.getTime() - (datefrom.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];    
                    let ToDate = new Date(dateto.getTime() - (dateto.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];    
                    let status = this.getView().byId("id_outward_rep_st_h").getValue();
                    let plant = this.getView().byId("id_outward_plant_h").getValue();
                    let selectoutward = this.getView().byId("id_outward_combobox").getSelectedKey();
                    let gateentryno = this.getView().byId("id_gate_pass_outward").getValue();
    
                    console.log("FromDate:", FromDate);
                    console.log("ToDate:", ToDate);
                    var model0 = this.getView().getModel("YY1_ZGE_OUTWARD_GATEPASS_CDS");
    
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
    
                    if(selectoutward !=="all"){
                        var SelectOutwardTypeFilter = new sap.ui.model.Filter("ScreenCode",sap.ui.model.FilterOperator.EQ,selectoutward)
                    }else{
                        var SelectOutwardTypeFilter = new sap.ui.model.Filter("ScreenCode",sap.ui.model.FilterOperator.NE,"")
                    }
    
                    if(gateentryno !==""){
                        var GateEntryFilter = new sap.ui.model.Filter("Id",sap.ui.model.FilterOperator.EQ,gateentryno)
                    }else{
                        var GateEntryFilter = new sap.ui.model.Filter("Id",sap.ui.model.FilterOperator.NE,"")
                    }
                    console.log("fromFilter:",fromFilter)
    
                    var that = this;
                    model0.read("/YY1_ITEM_ZGE_OUTWARD_GATEPASS", {
                        filters:[fromFilter,StatusFilter,PlantFilter,SelectOutwardTypeFilter,GateEntryFilter],
                        success: function (oData, oRespons) {
                            console.log("oData:",oData);
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                datas: oData.results
                            });
                            that.getView().setModel(oJSONModel, "GPEoutmodel");
                            console.log(oJSONModel);
                        }
                    });
               
                }else{
                    this.getView().byId("id_outward_date_h").setValueState(sap.ui.core.ValueState.Error)
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
                        width: '25'
                    },
                    {
                        label: 'Reference Document',
                        property: 'ReferenceDocument',
                        width: '25'
                    },
                    {
                        label: 'Reference Document Type',
                        property: 'ReferenceDocumentType',        
                        width: '18'
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
                        width: '18'
                    },
            
            
                    {
                        label: 'Product Type',
                        property: 'ProductType',
                        width: '18'
                    },
            
                
                
                ];
            },
            
            
            //1st method
            
            
            OnExportExl: function() {
                var aCols, oBinding, oSettings, oSheet, oTable;
            
                oTable = this.byId('outwardreport_table_id');
                oBinding = oTable.getBinding().getModel().oData.datas;
                
            
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
