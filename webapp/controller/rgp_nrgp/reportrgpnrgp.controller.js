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
    'sap/ui/comp/library',
	'sap/ui/model/type/String',
	'sap/m/ColumnListItem',
	'sap/m/Label',
	'sap/m/SearchField',
	'sap/m/Token',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/table/Column',
	'sap/m/Column',
	'sap/m/Text',
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, MessageToast, Fragment,TypeString, Filter, FilterOperator,UIColumn, MColumn,Text, JSONModel,ODataModel, UI5Date,Token,SearchField,Label,ColumnListItem, compLibrary,  exportLibrary ,Export,ExportTypeCSV, Spreadsheet) {
        "use strict";

        return Controller.extend("gatepassapp.controller.rgp_nrgp.reportrgpnrgp", {
            onInit: function () {
                var oMultiInput;
                oMultiInput = this.byId("multiInput");
                oMultiInput.addValidator(this._onMultiInputValidate);
                // oMultiInput.setTokens(this._getDefaultTokens());
                this._oMultiInput = oMultiInput;
            
                this.oProductsModel = this.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                this.getView().setModel(this.oProductsModel);
            },

            // ========++++++++===========+++++++++++==========++++++++++++===========++++++++++++=========+++++++
            onExit: function() {
                if (this.oProductsModel) {
                    this.oProductsModel.destroy();
                    this.oProductsModel = null;
                }
            },
            // #region Value Help Dialog standard use case with filter bar without filter suggestions
            onValueHelpRequested: function() {
                this._oBasicSearchField = new sap.m.SearchField();
                this.loadFragment({
                    name: "gatepassapp.view.rgp_nrgp.fragment.ValueHelpDialogFilterbar"
                }).then(function(oDialog) {
                    var oFilterBar = oDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
                    this._oVHD = oDialog;
    
                    this.getView().addDependent(oDialog);
    
                    // Set key fields for filtering in the Define Conditions Tab
                    oDialog.setRangeKeyFields([{
                        label: "Gate Pass No",
                        key: "Id",
                        type: "string",
                        typeInstance: new sap.ui.model.type.String({}, {
                            maxLength: 10
                        })
                    }]);
    
                    // Set Basic Search for FilterBar
                    oFilterBar.setFilterBarExpanded(false);
                    oFilterBar.setBasicSearch(this._oBasicSearchField);
    
                    // Trigger filter bar search when the basic search is fired
                    this._oBasicSearchField.attachSearch(function() {
                        oFilterBar.search();
                    });
    
                    oDialog.getTableAsync().then(function (oTable) {
    
                        oTable.setModel(this.oProductsModel);
    
                        // For Desktop and tabled the default table is sap.ui.table.Table
                        if (oTable.bindRows) {
                            // Bind rows to the ODataModel and add columns
                            oTable.bindAggregation("rows", {
                                path: "YY1_ZRGP_NRGP_HEAD_CDS>/YY1_ZRGP_NRGP_HEAD",
                                events: {
                                    dataReceived: function() {
                                        oDialog.update();
                                    }
                                }
                            });
                            oColumnProductCode = new sap.ui.table.Column({label: new sap.m.Label({text: "Gate Pass No"}), template: new sap.m.Text({wrapping: false, text: "{YY1_ZRGP_NRGP_HEAD_CDS>Id}"})});
                            oColumnProductCode.data({
                                fieldName: "Id"
                            });
                            oColumnProductName = new sap.ui.table.Column({label: new sap.m.Label({text: "Gate Pass Type"}), template: new sap.m.Text({wrapping: false, text: "{YY1_ZRGP_NRGP_HEAD_CDS>GatePassType}"})});
                            oColumnProductName.data({
                                fieldName: "GatePassType"
                            });
                            oTable.addColumn(oColumnProductCode);
                            oTable.addColumn(oColumnProductName);
                        }
    
                        // For Mobile the default table is sap.m.Table
                        if (oTable.bindItems) {
                            // Bind items to the ODataModel and add columns
                            oTable.bindAggregation("items", {
                                path: "YY1_ZRGP_NRGP_HEAD_CDS>/YY1_ZRGP_NRGP_HEAD",
                                template: new sap.m.ColumnListItem({
                                    cells: [new sap.m.Label({text: "{YY1_ZRGP_NRGP_HEAD_CDS>Id}"}), new sap.m.Label({text: "{YY1_ZRGP_NRGP_HEAD_CDS>GatePassType}"})]
                                }),
                                events: {
                                    dataReceived: function() {
                                        oDialog.update();
                                    }
                                }
                            });
                            oTable.addColumn(new sap.m.Column({header: new sap.m.Label({text: "Id"})}));
                            oTable.addColumn(new sap.m.Column({header: new sap.m.Label({text: "GatePassType"})}));
                        }
                        oDialog.update();
                    }.bind(this));
    
                    oDialog.setTokens(this._oMultiInput.getTokens());
                    oDialog.open();
                }.bind(this));
            },
    
            onValueHelpOkPress: function (oEvent) {
                var aTokens = oEvent.getParameter("tokens");
                this._oMultiInput.setTokens(aTokens);
                this._oVHD.close();
            },
    
            onValueHelpCancelPress: function () {
                this._oVHD.close();
            },
    
            onValueHelpAfterClose: function () {
                this._oVHD.destroy();
            },
            // #endregion
    
    
    
            // #region Whitespace
    
            onFilterBarSearch: function (oEvent) {
                var sSearchQuery = this._oBasicSearchField.getValue(),
                    aSelectionSet = oEvent.getParameter("selectionSet");
    
                var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        aResult.push(new sap.ui.model.Filter({
                            path: oControl.getName(),
                            operator: FilterOperator.Contains,
                            value1: oControl.getValue()
                        }));
                    }
    
                    return aResult;
                }, []);
    
                aFilters.push(new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({ path: "Id", operator: FilterOperator.Contains, value1: sSearchQuery }),
                        new sap.ui.model.Filter({ path: "GatePassType", operator: FilterOperator.Contains, value1: sSearchQuery })
                    ],
                    and: false
                }));
    
                this._filterTable(new sap.ui.model.Filter({
                    filters: aFilters,
                    and: true
                }));
            },
    
        
        
            _filterTable: function (oFilter) {
                var oVHD = this._oVHD;
    
                oVHD.getTableAsync().then(function (oTable) {
                    if (oTable.bindRows) {
                        oTable.getBinding("rows").filter(oFilter);
                    }
                    if (oTable.bindItems) {
                        oTable.getBinding("items").filter(oFilter);
                    }
    
                    // This method must be called after binding update of the table.
                    oVHD.update();
                });
            },

            OnGoPress:function(){
                let Dates = this.getView().byId("iddaterange").getValue();
                if(Dates){ // ***************************************************************************************************
                    this.getView().byId("iddaterange").setValueState(sap.ui.core.ValueState.None)
                    this.getView().byId("iddaterange").setValueStateText("")

                    const myArray = Dates.split(" - ");
                    let datefrom = new Date(myArray[0]);
                    let dateto = new Date(myArray[1]);
                    let FromDate = new Date(datefrom.getTime() - (datefrom.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];     
                    let ToDate = new Date(dateto.getTime() - (dateto.getTimezoneOffset() * 60000 )).toISOString().split("T")[0]; 
                    
                    // ####################################################
                    let fromtoFilter, PlantFilter, StatusFIlter, GatePassTypeFIlter, FILTERDATA;
                    // ####################################################

                    let Plant = this.getView().byId("idplant").getValue();
                        if(Plant !== ""){
                            PlantFilter = new sap.ui.model.Filter("PlantCode", sap.ui.model.FilterOperator.EQ, Plant)
                        }else{
                            PlantFilter = new sap.ui.model.Filter("PlantCode", sap.ui.model.FilterOperator.NE, "")
                        }

                    let Status = this.getView().byId("idstatus").getSelectedItem().getText();
                        if(Status === "All"){
                            StatusFIlter = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.NE, "")
                        }else{
                            StatusFIlter = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, Status)
                        }

                    let GatePassType = this.getView().byId("idgatepasstype").getSelectedItem().getText();
                        if(GatePassType === "All"){
                            GatePassTypeFIlter = new sap.ui.model.Filter("GatePassType", sap.ui.model.FilterOperator.NE, "")
                        }else{
                            GatePassTypeFIlter = new sap.ui.model.Filter("GatePassType", sap.ui.model.FilterOperator.EQ, GatePassType)
                        }

                        // Get MultiInput values
                    var aTokens = this.getView().byId("multiInput").getTokens();
                    console.log("aTokens:",aTokens);
                    var aMultiInputValues = aTokens.map(function (oToken) {
                        return oToken.getKey();
                    });
                        if(aTokens.length > 0){
                            var aFilters1 = aMultiInputValues.map(function (sValue) {
                                return new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, sValue);
                            });
                            var oCombinedFilter = new sap.ui.model.Filter(aFilters1, false);
                        }else{
                            var oCombinedFilter = new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.NE, "");
                        }

                    

                    console.log("aFilters1:", oCombinedFilter);                    
                    console.log("FromDate:", FromDate);
                    console.log("ToDate:", ToDate);
                    console.log("Plant:", Plant);
                    console.log("Status:", Status);
                    console.log("GatePassType:", GatePassType);
                    console.log("oCombinedFilter:", oCombinedFilter);

                    fromtoFilter = new sap.ui.model.Filter("PostingDate", sap.ui.model.FilterOperator.BT, FromDate, ToDate);
                    FILTERDATA = [fromtoFilter, PlantFilter, StatusFIlter, oCombinedFilter, GatePassTypeFIlter]

                    var model0 = this.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                    var that = this;
                    model0.read("/YY1_ITEMS_ZRGP_NRGP_HEAD", {
                        filters:[FILTERDATA],
                        success: function (oData, oRespons) {
                            console.log("oData:",oData);
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                data: oData.results
                            });
                            that.getView().setModel(oJSONModel, "JModel");
                            console.log(oJSONModel);
                        }
                    });
                        // *********************************************
                }else{
                    this.getView().byId("iddaterange").setValueState(sap.ui.core.ValueState.Error)
                    this.getView().byId("iddaterange").setValueStateText("Please Select Dates")
                }
                
            },

            openPersoDialog:function(){
                let OTable = this.getView().byId("id_rgpnrgp_table");
                console.log("OTable:", OTable);
            },


            createColumnConfig: function() {
  
                return [
                    {
                        label: 'Gate Pass Type',
                        property: 'GatePassType',
                        scale: 0
                    },
                    {
                        label: 'Gate Entry No',
                        property: 'Id',
                        scale: 0
                    },

                    {
                        label: 'Item No',
                        property: 'ItemNo',
                        width: '25'
                    },

                    {
                        label: 'Product',
                        property: 'Product',
                        width: '25'
                    },

                    {
                        label: 'Product Name',
                        property: 'ProductName',        
                        width: '18'
                    },

                    {
                        label: 'Quantity',
                        property: 'Quantity',
                        width: '18'
                        //  type: exportLibrary.Edm.String
                    },
            
                    {
                        label: 'Received Quantity',
                        property: 'ReceivedQuantity',
                        width: '18'
                    },
            
                    {
                        label: 'UOM',
                        property: 'UOM',
                        width: '18'
                    },
            
                    {
                        label: 'Due Date',
                        property: 'DueDate',
                        width: '18'
                    },
            
                    {
                        label: 'Dispatch Date',
                        property: 'DispatchDate',
                        width: '18'
                    },
            
                    {
                        label: 'Value',
                        property: 'Value',
                        width: '18'
                    },
            
                    {
                        label: 'Remarks',
                        property: 'Remarks',
                        width: '20'
                    },
            
                    {
                        label: 'Status',
                        property: 'Status',
                        width: '18'
                    },
            
                    {
                        label: 'Items Status',
                        property: 'ItemsStatus',
                        width: '18'
                    },
            
                    {
                        label: 'Approve Status',
                        property: 'ApproveStatus',
                        width: '18'
                    },
            
                    {
                        label: 'Total Amount',
                        property: 'TotalAmount',
                        width: '18'
                    },
            
                    {
                        label: 'Requestor',
                        property: 'Requestor',
                        width: '18'
                    },
            
                    {
                        label: 'Plant Code',
                        property: 'PlantCode',
                        width: '18'
                    },
            
                    {
                        label: 'Plant Name',
                        property: 'PlantName',
                        width: '18'
                    },
            
                    {
                        label: 'Supplier Code',
                        property: 'SupplierCode',
                        width: '18'
                    },
            
                    {
                        label: 'Supplier Name',
                        property: 'SupplierName',
                        width: '18'
                    },
            
                    {
                        label: 'Supplier Type',
                        property: 'SupplierType',
                        width: '5'
                    },
            
                    {
                        label: 'Customer Code',
                        property: 'CustomerCode',
                        width: '18'
                    },
            
                    {
                        label: 'Customer Name',
                        property: 'CustomerName',
                        width: '18'
                    },
            
                    {
                        label: 'Customer Type',
                        property: 'CustomerType',
                        width: '18'
                    },
            
                    {
                        label: 'Value In INR',
                        property: 'ValueInINR',
                        width: '18'
                    },
            
                    {
                        label: 'Vehicle Type',
                        property: 'VehicleType',
                        width: '18'
                    },
            
                    {
                        label: 'Vehicle No',
                        property: 'VehicleNo',
                        width: '18'
                    },
            
                    {
                        label: 'Transporter',
                        property: 'Transporter',
                        width: '18'
                    },
            
                    {
                        label: 'Transporter Mode',
                        property: 'TransporterMode',
                        width: '18'
                    },
            
                    {
                        label: 'PurchaseOrder',
                        property: 'PurchaseOrder',
                        width: '18'
                    },
            
                    {
                        label: 'Material Document',
                        property: 'MaterialDocument',
                        width: '18'
                    },
            
                    {
                        label: 'Reference Document No',
                        property: 'ReferenceDocumentNo',
                        width: '18'
                    },
            
                    {
                        label: 'Remark Head',
                        property: 'RemarkHead',
                        width: '18'
                    },
            
                    {
                        label: 'Gate Status',
                        property: 'GateStatus',
                        width: '18'
                    },
            
                    {
                        label: 'Gate Type',
                        property: 'GateType',
                        width: '18'
                    },
                        
                ];
            },
            
            
            //1st method
            
            
            OnExportToExl: function() {
                var aCols, oBinding, oSettings, oSheet, oTable;
            
                oTable = this.byId('id_rgpnrgp_table');
                oBinding = oTable.getBinding().getModel().oData.data;
                
            
                console.log("oBinding:",oBinding);
                aCols = this.createColumnConfig();
            
                oSettings = {
                    workbook: { columns: aCols, context:{
                                                        sheetName: "Sheet1",
                                                         application: "GatePassApplication",
                                                         title: "RGP/NRGP Report",}
                                                         },
                    dataSource: oBinding,
                    fileName:"RGP_NRGP Report.xlsx"
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
