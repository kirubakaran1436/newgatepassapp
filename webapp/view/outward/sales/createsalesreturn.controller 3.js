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
    function (Controller, Device, SearchField, TypeString, ColumnListItem, Label, Filter, UIComponent, FilterOperator, JSONModel,library,Token,ODataModel,Column, MessageBox,MessageToast) {
        "use strict";

        return Controller.extend("gatepassapp.controller.inward.salesreturn.createsalesreturn", {
            onInit: function () {

                var JSonModel = new sap.ui.model.json.JSONModel({
                    Samples: [
                        { "VehicleID": 1, "VehicleName": "Truck" },
                        { "VehicleID": 2, "VehicleName": "Tempo" },
                        { "VehicleID": 3, "VehicleName": "Tractor" }
                    ]
                });
                this.getView().setModel(JSonModel, "JModel");


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

                this.getView().byId("id_sr_gate_date").setValue(this.CurrentDate)
                // ----Start For Current Date -----

                var oMultiInput, oMultiInputWithSuggestions;
                oMultiInput = this.byId("id_ret_sale_document_h");
                oMultiInput.addValidator(this._onMultiInputValidate);
                //  oMultiInput.setTokens(this._getDefaultTokens());
                this._oMultiInput = oMultiInput;
            
               


            this.oProductsModel = this.getView().getModel("YY1_ZGE_INWARD_SR_HEAD_CDS");
            this.getView().setModel(this.oProductsModel);


            var oMultiInput2 = this.getView().byId("id_ret_sale_document_h");
			// add checkbox validator
            oMultiInput2.addValidator(function(args){
                if (args.suggestionObject){
                    var key = args.suggestionObject.getCells()[0].getText();
                    var text = args.suggestionObject.getCells()[0].getText();
                    // var text = key + "(" + args.suggestionObject.getCells()[1].getText() + ")";

                    return new sap.m.Token({key: key, text: key});
                }
                return null;
            });



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
                    name: "gatepassapp.view.inward.salesreturn.fragment.SalesValueHelpDialogFilterbar"
                }).then(function(oDialog) {
                    var oFilterBar = oDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
                    this._oVHD = oDialog;
    
                    this.getView().addDependent(oDialog);
    
                    // Set key fields for filtering in the Define Conditions Tab
                    oDialog.setRangeKeyFields([{
                        label: "CustomerReturn",
                        key: "CustomerReturn",
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
                                path: "YY1_ZGE_INWARD_SR_HEAD_CDS>/YY1_ZGE_INWARD_SR_HEAD",
                                events: {
                                    dataReceived: function() {
                                        oDialog.update();
                                    }
                                }
                            });
                            oColumnProductCode = new sap.ui.table.Column({label: new sap.m.Label({text: "Customer Return"}), template: new sap.m.Text({wrapping: false, text: "{YY1_ZGE_INWARD_SR_HEAD_CDS>CustomerReturn}"})});
                            oColumnProductCode.data({
                                fieldName: "CustomerReturn"
                            });
                            oColumnProductName = new sap.ui.table.Column({label: new sap.m.Label({text: "Customer Name"}), template: new sap.m.Text({wrapping: false, text: "{YY1_ZGE_INWARD_SR_HEAD_CDS>CustomerName}"})});
                            oColumnProductName.data({
                                fieldName: "CustomerName"
                            });
                            oTable.addColumn(oColumnProductCode);
                            oTable.addColumn(oColumnProductName);
                        }
    
                        // For Mobile the default table is sap.m.Table
                        if (oTable.bindItems) {
                            // Bind items to the ODataModel and add columns
                            oTable.bindAggregation("items", {
                                path: "YY1_ZGE_INWARD_SR_HEAD_CDS>/YY1_ZGE_INWARD_SR_HEAD",
                                template: new sap.m.ColumnListItem({
                                    cells: [new sap.m.Label({text: "{YY1_ZGE_INWARD_SR_HEAD_CDS>CustomerReturn}"}), new sap.m.Label({text: "{YY1_ZGE_INWARD_SR_HEAD_CDS>CustomerName}"})]
                                }),
                                events: {
                                    dataReceived: function() {
                                        oDialog.update();
                                    }
                                }
                            });
                            oTable.addColumn(new sap.m.Column({header: new sap.m.Label({text: "Customer Return"})}));
                            oTable.addColumn(new sap.m.Column({header: new sap.m.Label({text: "Custome Name"})}));
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



                var oMultiInput2 = this.getView().byId("id_ret_sale_document_h");
                // add checkbox validator
                oMultiInput2.addValidator(function(args){
                    if (args.suggestionObject){
                        var key = args.suggestionObject.getCells()[0].getText();
                        var text = args.suggestionObject.getCells()[1].getText();
                        // var text = key + "(" + args.suggestionObject.getCells()[1].getText() + ")";
    
                        return new sap.m.Token({key: key, text: key});
                    }
                    return null;
                });


                var aTokens = this.getView().byId("id_ret_sale_document_h").getTokens();
                    console.log("aTokens:",aTokens);
                    var aMultiInputValues = aTokens.map(function (oToken) {
                        return oToken.getKey();
                    });
                        if(aTokens.length > 0){
                            var aFilters1 = aMultiInputValues.map(function (sValue) {
                                return new sap.ui.model.Filter("CustomerReturn", sap.ui.model.FilterOperator.EQ, sValue);
                            });
                          
                        }

                // var oFilter = new sap.ui.model.Filter("CustomerReturn", sap.ui.model.FilterOperator.EQ, GetKey);
                var oTable = this.getView().byId("salesreturn_table_id");
                var oModel = this.getView().getModel("YY1_ZGE_INWARD_SR_ITEM_CDS"); // Replace with your actual OData model name
                var oFilters = [aFilters1];
                var that = this;
                oModel.read("/YY1_ZGE_INWARD_SR_ITEM", {
                    filters: oFilters,
                    success: function (oData) {
                        var aItems = oData.results; // The array of read items
                        // let lant_H = aItems[0].Plant;
                        // let lant_Name_H = aItems[0].PlantName;
                        // that.getView().byId("id_sr_plant_h").setValue(lant_H);
                        // that.getView().byId("id_sr_plant_name_h").setValue(lant_Name_H);
                        // Create a JSON model and set the data
                        var oTableModel = new sap.ui.model.json.JSONModel();
                        oTableModel.setData({ items: aItems });
                        oModel.refresh(true);
                        // Set the model on the table and bind the rows
                        oTable.setModel(oTableModel);
                        oTable.bindRows("/items");
                        that.getView().byId("salesreturn_table_id").setVisible(true);
                        sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (oError) {
                        // Handle error
                        console.error("Error reading data: ", oError);
                        sap.ui.core.BusyIndicator.hide();
                    }
                });

            


                var oTable = this.getView().byId("salesreturn_table_id");
                var oFilter112 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, "GE4");
                var oModel11 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS"); // Replace with your actual OData model name
                var that = this;
                oModel11.read("/YY1_ZINWARD_HEAD", {
                    filters: [oFilter112],
                    success: function (oData) {
                        var aItems = oData.results; // The array of read items
                        let gate00 = aItems.length
                        let Count = Number(gate00) + 1; // This should be a number, no need to use Number()
                        let CountLen = Count.toString(); // Convert to string to get its length
                        let AddData = "20000";
                        let Data = 5 - CountLen.length;
                        let CountArray = "";
                        for (let i = 0; i < Data; i++) {
                            CountArray += "0";
                        }
                        console.log(AddData + CountArray + Count); // Concatenate strings correctly
                        let LastId = AddData + CountArray + Count;
                        that.getView().byId("id_gateentry_h").setValue(LastId);
                        sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (oError) {
                        // Handle error
                        console.error("Error reading data: ", oError);
                        sap.ui.core.BusyIndicator.hide();
                    }
                });






            },
    
            onValueHelpCancelPress: function () {
                this._oVHD.close();
            },
    
            onValueHelpAfterClose: function () {
                this._oVHD.destroy();
            },
    
            onFilterBarSearch: function (oEvent) {
                var sSearchQuery = this._oBasicSearchField.getValue(),
                    aSelectionSet = oEvent.getParameter("selectionSet");
    
                var aFilters =aSelectionSet && aSelectionSet.reduce(function (aResult, oControl) {
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
                        new sap.ui.model.Filter({ path: "CustomerReturn", operator: sap.ui.model.FilterOperator.Contains, value1: sSearchQuery }),
                        new sap.ui.model.Filter({ path: "CustomerName", operator: sap.ui.model.FilterOperator.Contains, value1: sSearchQuery })
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



// Suggestion new for Multi po











    // suggestion old for single PO

            OnCustomReturnSuggest: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                // var oItem = oEvent.getParameter("selectedItem");
                // var GetKey = oItem ? oItem.getKey() : "";
                // var GetValue = oItem ? oItem.getText() : "";

                // // Do something with key and text values
                // console.log(oItem);
                // console.log("Selected Key:", GetKey);
                // console.log("Selected Text:", GetValue);


                var oMultiInput2 = this.getView().byId("id_ret_sale_document_h");
                // add checkbox validator
                oMultiInput2.addValidator(function(args){
                    if (args.suggestionObject){
                        var key = args.suggestionObject.getCells()[0].getText();
                        var text = args.suggestionObject.getCells()[1].getText();
                        // var text = key + "(" + args.suggestionObject.getCells()[1].getText() + ")";
    
                        return new sap.m.Token({key: key, text: key});
                    }
                    return null;
                });


                var aTokens = this.getView().byId("id_ret_sale_document_h").getTokens();
                    console.log("aTokens:",aTokens);
                    var aMultiInputValues = aTokens.map(function (oToken) {
                        return oToken.getKey();
                    });
                        if(aTokens.length > 0){
                            var aFilters1 = aMultiInputValues.map(function (sValue) {
                                return new sap.ui.model.Filter("CustomerReturn", sap.ui.model.FilterOperator.EQ, sValue);
                            });
                          
                        }

                //  var oFilter = new sap.ui.model.Filter("CustomerReturn", sap.ui.model.FilterOperator.EQ, aTokens);
                var oTable = this.getView().byId("salesreturn_table_id");
                var oModel = this.getView().getModel("YY1_ZGE_INWARD_SR_ITEM_CDS"); // Replace with your actual OData model name
                var oFilters = [aFilters1];
                var that = this;
                oModel.read("/YY1_ZGE_INWARD_SR_ITEM", {
                    filters: oFilters,
                    success: function (oData) {
                        var aItems = oData.results; // The array of read items
                        // let lant_H = aItems[0].Plant;
                        // let lant_Name_H = aItems[0].PlantName;
                        // that.getView().byId("id_sr_plant_h").setValue(lant_H);
                        // that.getView().byId("id_sr_plant_name_h").setValue(lant_Name_H);
                        // Create a JSON model and set the data
                        var oTableModel = new sap.ui.model.json.JSONModel();
                        oTableModel.setData({ items: aItems });
                        oTableModel.refresh(true);
                        // Set the model on the table and bind the rows
                        oTable.setModel(oTableModel);
                        oTable.bindRows("/items");
                        that.getView().byId("salesreturn_table_id").setVisible(true);
                        sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (oError) {
                        // Handle error
                        console.error("Error reading data: ", oError);
                        sap.ui.core.BusyIndicator.hide();
                    }
                });

                // var oFilter11 = new sap.ui.model.Filter("CustomerReturn", sap.ui.model.FilterOperator.EQ, GetKey);
                // var oModel11 = this.getView().getModel("YY1_ZGE_INWARD_SR_HEAD_CDS"); // Replace with your actual OData model name
                // var oFilters11 = [oFilter11];
                // var that = this;
                // oModel11.read("/YY1_ZGE_INWARD_SR_HEAD", {
                //     filters: oFilters11,
                //     success: function (oData) {
                //         var aItems = oData.results[0]; // The array of read items
                //         let SoldToParty = aItems.SoldToParty;
                //         let CustomerName = aItems.CustomerName;
                //         let CustomerReturnType = aItems.CustomerReturnType;
                //         that.getView().byId("id_sr_cust_code_h").setValue(SoldToParty);
                //         that.getView().byId("id_sr_cust_name_h").setValue(CustomerName);
                //         that.getView().byId("id_del_ret_type_h").setValue(CustomerReturnType);
                //         sap.ui.core.BusyIndicator.hide();
                //     },
                //     error: function (oError) {
                //         // Handle error
                //         console.error("Error reading data: ", oError);
                //         sap.ui.core.BusyIndicator.hide();
                //     }
                // });


                var oTable = this.getView().byId("salesreturn_table_id");
                var oFilter112 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, "GE4");
                var oModel11 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS"); // Replace with your actual OData model name
                var that = this;
                oModel11.read("/YY1_ZINWARD_HEAD", {
                    filters: [oFilter112],
                    success: function (oData) {
                        var aItems = oData.results; // The array of read items
                        let gate00 = aItems.length
                        let Count = Number(gate00) + 1; // This should be a number, no need to use Number()
                        let CountLen = Count.toString(); // Convert to string to get its length
                        let AddData = "20000";
                        let Data = 5 - CountLen.length;
                        let CountArray = "";
                        for (let i = 0; i < Data; i++) {
                            CountArray += "0";
                        }
                        console.log(AddData + CountArray + Count); // Concatenate strings correctly
                        let LastId = AddData + CountArray + Count;
                        that.getView().byId("id_gateentry_h").setValue(LastId);
                        sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (oError) {
                        // Handle error
                        console.error("Error reading data: ", oError);
                        sap.ui.core.BusyIndicator.hide();
                    }
                });

                sap.ui.core.BusyIndicator.hide();
            },

            //Start Fragment for PO Header 
            OnPoDocFragOpen: function (oEvent) {
                // alert("this is test");
                if (!this._dialog_PoDochead) {
                    this._dialog_PoDochead = sap.ui.xmlfragment(this.getView().getId("PoDocHead_dialog"), "gatepassapp.view.inward.salesreturn.fragment.sales_return_header", this);
                    this.getView().addDependent(this._dialog_PoDochead);
                }

                this._dialog_PoDochead.open();
            },

            OnSoDocSearch11: function (oEvent) {
                var sValue1 = oEvent.getParameter("value");
                console.log(sValue1);
                console.log(oEvent);
                // var oFilter2 = new Filter("CustomerReturn", FilterOperator.EQ, sValue1);
                var oFilter2 = new sap.ui.model.Filter("CustomerReturn", sap.ui.model.FilterOperator.Contains, sValue1)
                console.log(oFilter2);
                var oBinding = oEvent.getSource().getBinding("items");
                console.log(oBinding)
                oBinding.filter([oFilter2]);
            },

            OnPoDoHeadSelect: function (oEvent) {
                sap.ui.core.BusyIndicator.show();

                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);

                var aContexts = oEvent.getParameter("selectedContexts");
                var scode, customer_type, customer_code, customer_name;


                //Value help check empty or not

                if (aContexts === undefined) {
                    console.log("No item present");
                    sap.ui.core.BusyIndicator.hide();

                } else {
                    if (aContexts && aContexts.length) {

                        aContexts.map(function (oContext) {
                            scode = oContext.getObject().CustomerReturn;
                            customer_type = oContext.getObject().CustomerReturnType;
                            customer_code = oContext.getObject().SoldToParty;
                            customer_name = oContext.getObject().CustomerName;
                            return;
                        });
                        this.getView().byId("id_ret_sale_document_h").setValue(scode);
                        this.getView().byId("id_del_ret_type_h").setValue(customer_type);
                        this.getView().byId("id_sr_cust_code_h").setValue(customer_code);
                        this.getView().byId("id_sr_cust_name_h").setValue(customer_name);
                    }

                    var Sales_Return_Document_H = this.getView().byId("id_ret_sale_document_h").getValue();

                    //table binding

                    var oFilter = new sap.ui.model.Filter("CustomerReturn", sap.ui.model.FilterOperator.EQ, Sales_Return_Document_H);
                    var oTable = this.getView().byId("salesreturn_table_id");
                    var oModel = this.getView().getModel("YY1_ZGE_INWARD_SR_ITEM_CDS"); // Replace with your actual OData model name
                    var oFilters = [oFilter];
                    var that = this;
                    oModel.read("/YY1_ZGE_INWARD_SR_ITEM", {
                        filters: oFilters,
                        success: function (oData) {
                            var aItems = oData.results; // The array of read items
                            let lant_H = aItems[0].Plant;
                            let lant_Name_H = aItems[0].PlantName;
                            that.getView().byId("id_sr_plant_h").setValue(lant_H);
                            that.getView().byId("id_sr_plant_name_h").setValue(lant_Name_H);
                            // Create a JSON model and set the data
                            var oTableModel = new sap.ui.model.json.JSONModel();
                            oTableModel.setData({ items: aItems });
                            // Set the model on the table and bind the rows
                            oTable.setModel(oTableModel);
                            oTable.bindRows("/items");
                            that.getView().byId("salesreturn_table_id").setVisible(true);
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function (oError) {
                            // Handle error
                            console.error("Error reading data: ", oError);
                            sap.ui.core.BusyIndicator.hide();
                        }
                    });

                    var oTable = this.getView().byId("salesreturn_table_id");
                    var oFilter112 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, "GE4");
                    var oModel111 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS"); // Replace with your actual OData model name
                    var that = this;
                    oModel111.read("/YY1_ZINWARD_HEAD", {
                        filters: [oFilter112],
                        success: function (oData) {
                            var aItems = oData.results; // The array of read items
                            let gate00 = aItems.length
                            let Count = Number(gate00) + 1; // This should be a number, no need to use Number()
                            let CountLen = Count.toString(); // Convert to string to get its length
                            let AddData = "20000";
                            let Data = 5 - CountLen.length;
                            let CountArray = "";
                            for (let i = 0; i < Data; i++) {
                                CountArray += "0";
                            }
                            console.log(AddData + CountArray + Count); // Concatenate strings correctly
                            let LastId = AddData + CountArray + Count;
                            that.getView().byId("id_gateentry_h").setValue(LastId);
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function (oError) {
                            // Handle error
                            console.error("Error reading data: ", oError);
                            sap.ui.core.BusyIndicator.hide();
                        }
                    });

                }

            },



            OnPendingQtyCal: function (OrderQuantity, SoItem, SoNo) {

                var that = this; // Store reference to 'this'
                var OrderQuantity = parseFloat(OrderQuantity);
                if (OrderQuantity !== null && SoItem !== null && SoNo !== null) {

                    return new Promise(function (resolve, reject) {


                        var oFilter = new sap.ui.model.Filter("ItemNo", sap.ui.model.FilterOperator.EQ, SoItem);
                        var oFilter1 = new sap.ui.model.Filter("ReferenceDocument", sap.ui.model.FilterOperator.EQ, SoNo);
                        var oFilter2 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, "GE4");
                        var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "created");
                        var oFilter4 = new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, 'created');
                        


                        var oModel = that.getView().getModel("YY1_ZINWARD_HEAD_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4];

                        var CalData = 0;

                        oModel.read("/YY1_ITEM_ZINWARD_HEAD", {
                            filters: oFilters,
                            success: function (oData) {
                                var aItems = oData.results;
                                for (var i = 0; i < aItems.length; i++) {
                                    CalData += parseFloat(aItems[i].QuantityInGE);
                                }
                                console.log("---------------------------------------------");
                                console.log(OrderQuantity);
                                console.log(CalData);
                                var FinalData = parseFloat(OrderQuantity) - parseFloat(CalData);
                                console.log(FinalData);
                                console.log("---------------------------------------------");
                                resolve(FinalData); // Resolve with the data
                            },
                            error: function (oError) {
                                console.error("Error reading data: ", oError);
                                reject(oError); // Reject with the error
                            }
                        });
                    });



                }


            },

            OnQuantityinGECal: function (OrderQuantity, SoItem, SoNo) {

                var that = this; // Store reference to 'this'
                var OrderQuantity = parseFloat(OrderQuantity);
                if (OrderQuantity !== null && SoItem !== null && SoNo !== null) {

                    return new Promise(function (resolve, reject) {


                        var oFilter = new sap.ui.model.Filter("ItemNo", sap.ui.model.FilterOperator.EQ, SoItem);
                        var oFilter1 = new sap.ui.model.Filter("ReferenceDocument", sap.ui.model.FilterOperator.EQ, SoNo);
                        var oFilter2 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, "GE4");
                        var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "created");
                        var oFilter4 = new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, 'created');


                        var oModel = that.getView().getModel("YY1_ZINWARD_HEAD_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4];

                        var CalData = 0;

                        oModel.read("/YY1_ITEM_ZINWARD_HEAD", {
                            filters: oFilters,
                            success: function (oData) {
                                var aItems = oData.results;
                                for (var i = 0; i < aItems.length; i++) {
                                    CalData += parseFloat(aItems[i].QuantityInGE);
                                }
                                console.log("---------------------------------------------");
                                console.log(OrderQuantity);
                                console.log(CalData);
                                var FinalData = parseFloat(OrderQuantity) - parseFloat(CalData);
                                console.log(FinalData);
                                console.log("---------------------------------------------");

                                if (FinalData === 0 || FinalData === "0") {

                                    var status = false;
                                }

                                else {

                                    var status = true;

                                }
                                resolve(status); // Resolve with the data
                            },
                            error: function (oError) {
                                console.error("Error reading data: ", oError);
                                reject(oError); // Reject with the error
                            }
                        });
                    });



                }


            },


            Quantity_to_Post_InputyLine: function (oEvent) {
                let Quantity_to_Post_Input = oEvent.getSource().getParent().getCells()[8].getValue();
                let QuantityLine = oEvent.getSource().getParent().getCells()[7].getValue();
                console.log(Quantity_to_Post_Input);
                console.log(QuantityLine)

                let Quantity_to_Post_Input_Float = parseFloat(Quantity_to_Post_Input.trim());
                let QuantityLine_Float = parseFloat(QuantityLine.trim());
                console.log(Quantity_to_Post_Input_Float);
                console.log(QuantityLine_Float)

                if (Quantity_to_Post_Input_Float > QuantityLine_Float) {
                    // MessageToast.show("Please Enter Valid Quantity...!");
                    oEvent.getSource().getParent().getCells()[8].setValueState(sap.ui.core.ValueState.Error);
                    oEvent.getSource().getParent().getCells()[8].setValueStateText("Please Enter Valid Quantity");
                    this.getView().byId("Final_Save_Button").setEnabled(false);
                    this.getView().byId("Final_Save_Button").setEnabled(false);
                }

                else if (Quantity_to_Post_Input_Float === "") {
                    oEvent.getSource().getParent().getCells()[8].setValue("0");
                    this.getView().byId("Final_Save_Button").setEnabled(false);

                }

                else if (Quantity_to_Post_Input_Float <= QuantityLine_Float) {
                    oEvent.getSource().getParent().getCells()[8].setValueState(sap.ui.core.ValueState.None);

                    this.getView().byId("Final_Save_Button").setEnabled(true);

                }

            },

            OnVehicleFetch: function (oEvent) {
                let Dataa = this.getView().byId("id_sr_vehno_h").getValue();
                var data = new Promise(function (resolve) {

                    let Dataa1 = Dataa;

                    resolve(Dataa1);
                });
                return data;
            },

            OnCustomerCodeFetch : function(SoNo){
                var that = this; // Store reference to 'this'
               // var OrderQuantity = parseFloat(OrderQuantity);
               if(SoNo !== null){
                console.log("SoNo:", SoNo)

                return new Promise(function(resolve, reject) {
       
                    var oModel008 = that.getView().getModel("YY1_ZGE_INWARD_SR_HEAD_CDS");
                    var oFilter = new sap.ui.model.Filter("CustomerReturn", sap.ui.model.FilterOperator.EQ, SoNo);           
                    var oFilters011 = [oFilter];
           
                    oModel008.read("/YY1_ZGE_INWARD_SR_HEAD", {
                        filters: oFilters011,
                        success: function(oData) {
                            var aItems = oData.results;
                            console.log(aItems)
                                 resolve(aItems[0].SoldToParty); // Resolve with the data
                        },
                        error: function(oError) {
                            console.error("Error reading data: ", oError);
                            reject(oError); // Reject with the error
                        }
                    });
                });
               }
            },



            OnCustomerNameFetch : function(SoNo){
                var that = this; // Store reference to 'this'
               // var OrderQuantity = parseFloat(OrderQuantity);
               if(SoNo !== null){
                console.log("SoNo:", SoNo)

                return new Promise(function(resolve, reject) {
       
                    var oModel0081 = that.getView().getModel("YY1_ZGE_INWARD_SR_HEAD_CDS");
                    var oFilter = new sap.ui.model.Filter("CustomerReturn", sap.ui.model.FilterOperator.EQ, SoNo);           
                    var oFilters0112 = [oFilter];
           
                    oModel0081.read("/YY1_ZGE_INWARD_SR_HEAD", {
                        filters: oFilters0112,
                        success: function(oData) {
                            var aItems = oData.results;
                            console.log(aItems)
                                 resolve(aItems[0].CustomerName); // Resolve with the data
                        },
                        error: function(oError) {
                            console.error("Error reading data: ", oError);
                            reject(oError); // Reject with the error
                        }
                    });
                });
               }
            },



            OnCustomerReturnTypeFetch : function(SoNo){
                var that = this; // Store reference to 'this'
               // var OrderQuantity = parseFloat(OrderQuantity);
               if(SoNo !== null){
                console.log("SoNo:", SoNo)

                return new Promise(function(resolve, reject) {
       
                    var oModel0081 = that.getView().getModel("YY1_ZGE_INWARD_SR_HEAD_CDS");
                    var oFilter = new sap.ui.model.Filter("CustomerReturn", sap.ui.model.FilterOperator.EQ, SoNo);           
                    var oFilters0112 = [oFilter];
           
                    oModel0081.read("/YY1_ZGE_INWARD_SR_HEAD", {
                        filters: oFilters0112,
                        success: function(oData) {
                            var aItems = oData.results;
                            console.log(aItems)
                                 resolve(aItems[0].CustomerReturnType); // Resolve with the data
                        },
                        error: function(oError) {
                            console.error("Error reading data: ", oError);
                            reject(oError); // Reject with the error
                        }
                    });
                });


               }

            },










            OnVehicleTypeFetch: function (oEvent) {
                let Dataa = this.getView().byId("id_sr_vehicle_type_h").getValue();
                var data = new Promise(function (resolve) {

                    let Dataa1 = Dataa;

                    resolve(Dataa1);
                });
                return data;
            },


            OnTransporterFetch: function (oEvent) {
                let Dataa = this.getView().byId("id_sr_transporter_h").getValue();
                var data = new Promise(function (resolve) {

                    let Dataa1 = Dataa;

                    resolve(Dataa1);
                });
                return data;
            },


            OnRemarkFetch: function (oEvent) {
                let Dataa = this.getView().byId("id_sr_remark_h").getValue();
                var data = new Promise(function (resolve) {

                    let Dataa1 = Dataa;

                    resolve(Dataa1);
                });
                return data;
            },


            ontokenupdate: function (oEvent) {


                var getType = oEvent.getParameter("type");
                // var aData = this.getView().byId("Purchasing_Document_H").getTokens();

                if (getType === "removed") {

                    var sKey = oEvent.getParameter("removedTokens")[0].getProperty("key");

                    var aData = this.getView().byId("id_ret_sale_document_h").getTokens();

                    for (var i = 0, len = aData.length; i < len; i++) {

                        var idx;

                        if (aData[i].getKey() === sKey) {

                            idx = i;

                        }

                    }

                    aData.splice(idx, 1);

                    var getFinalTokens = [];

                    for (var j = 0; j < aData.length; j++) {

                        var getTokenKeys = aData[j].getKey();

                        getFinalTokens.push(getTokenKeys);

                    }

                    if (getFinalTokens.length > 0) {
                        var aFilters1 = getFinalTokens.map(function (sValue) {
                            return new sap.ui.model.Filter("CustomerReturn", sap.ui.model.FilterOperator.EQ, sValue);
                        });


                        var oTable = this.byId("salesreturn_table_id");
                        var oModel1 = this.getView().getModel("YY1_ZGE_INWARD_SR_ITEM_CDS"); // Replace with your actual OData model name
    
                        var oFilters1 = [aFilters1];
                        var that = this;
    
                        oModel1.read("/YY1_ZGE_INWARD_SR_ITEM", {
                            filters: oFilters1,
                            success: function (oData) {
                                var aItems = oData.results; // The array of read items
                                var oTableModel = new sap.ui.model.json.JSONModel();
                                oTableModel.setData({ items: aItems });
    
                                // Set the model on the table and bind the rows
                                oTable.setModel(oTableModel);
                                oTable.bindRows("/items");
                                oTableModel.refresh(true);
                                that.getView().byId("salesreturn_table_id").setVisible(true);
                                sap.ui.core.BusyIndicator.hide();
    
                            },
                            error: function (oError) {
                                // Handle error
                                console.error("Error reading data: ", oError);
                                sap.ui.core.BusyIndicator.hide();
                            }
    
                        });

                    }
                    
                    
                    
                    else {

                        var oTable = this.byId("salesreturn_table_id");
                        var oModel1 = this.getView().getModel("YY1_ZGE_INWARD_SR_ITEM_CDS"); // Replace with your actual OData model name
    
                        var oFilters1 = [aFilters1];
                        var that = this;
    
                        oModel1.read("/YY1_ZGE_INWARD_SR_ITEM", {
                            filters: oFilters1,
                            success: function (oData) {
                                var aItems = oData.results; // The array of read items
                                var oTableModel = new sap.ui.model.json.JSONModel();
                                oTableModel.setData({ items: aItems });
    
                                // Set the model on the table and bind the rows
                                oTable.setModel("");
                                oTable.bindRows("/items");
                                oTableModel.refresh(true);
                                that.getView().byId("salesreturn_table_id").setVisible(true);
                                sap.ui.core.BusyIndicator.hide();
    
                            },
                            error: function (oError) {
                                // Handle error
                                console.error("Error reading data: ", oError);
                                sap.ui.core.BusyIndicator.hide();
                            }
    
                        });


                    }



                } 
                
                
                
                // else {


                //     var aTokens = this.getView().byId("id_ret_sale_document_h").getTokens();
                //     console.log("aTokens:", aTokens);
                //     var aMultiInputValues = aTokens.map(function (oToken) {
                //         return oToken.getKey();
                //     });
                //     if (aTokens.length > 0) {
                //         var aFilters1 = aMultiInputValues.map(function (sValue) {
                //             return new sap.ui.model.Filter("CustomerReturn", sap.ui.model.FilterOperator.EQ, sValue);
                //         });

                //     }

                //     //  var oFilter = new sap.ui.model.Filter("PurchaseOrder", sap.ui.model.FilterOperator.EQ, key);



                //     var oTable = this.byId("salesreturn_table_id");
                //     var oModel1 = this.getView().getModel("YY1_ZGE_INWARD_SR_ITEM_CDS"); // Replace with your actual OData model name

                //     var oFilters1 = [aFilters1];
                //     var that = this;

                //     oModel1.read("/YY1_ZGE_INWARD_SR_ITEM", {
                //         filters: oFilters1,
                //         success: function (oData) {
                //             var aItems = oData.results; // The array of read items

                //             // Create a JSON model and set the data
                //             var oTableModel = new sap.ui.model.json.JSONModel();
                //             oTableModel.setData({ items: aItems });

                //             // Set the model on the table and bind the rows
                //             oTable.setModel(oTableModel);
                //             oTable.bindRows("/items");
                //             oTableModel.refresh(true);
                //             that.getView().byId("salesreturn_table_id").setVisible(true);
                //             sap.ui.core.BusyIndicator.hide();

                //         },
                //         error: function (oError) {
                //             // Handle error
                //             console.error("Error reading data: ", oError);
                //             sap.ui.core.BusyIndicator.hide();
                //         }

                //     });
                // }


            },

            //End Frgment Head

            OnSubmit: function (OEvent) {
                // sap.ui.core.BusyIndicator.show();

                
                let Customer_Return = this.getView().byId("id_ret_sale_document_h").getTokens();
                console.log("Customer_Return_Length:", Customer_Return.length);

                var Table_Id = this.getView().byId("salesreturn_table_id");
                
                var Table_Length = Table_Id.getRows().length;


                   for(var k=0; k<Customer_Return.length;k++){




                    let gateentryno = this.getView().byId("id_gateentry_h").getValue();
                        // let Delivery_Return_Type = this.getView().byId("id_del_ret_type_h").getValue();
                        // let Plant_Code = this.getView().byId("id_sr_plant_h").getValue();
                        // let Plant_Name = this.getView().byId("id_sr_plant_name_h").getValue();
                        // let Customer_Code = this.getView().byId("id_sr_cust_code_h").getValue();
                        // let Customer_Name = this.getView().byId("id_sr_cust_name_h").getValue();
                        let Gate_Entry_Date = this.getView().byId("id_sr_gate_date").getValue();
                        let Vehicle_No = this.getView().byId("id_sr_vehno_h").getValue();
                        let Vehicle_Type = this.getView().byId("id_sr_vehicle_type_h").getValue();
                        let No_Of_Packages = this.getView().byId("id_sr_no_of_package_h").getValue();
                        let Transporter = this.getView().byId("id_sr_transporter_h").getValue();
                        let Transporter_Mode = this.getView().byId("id_sr_transporter_mode_h").getValue();
                        let Gross_Weight = this.getView().byId("id_sr_gross_wt_h").getValue();
                        let Weight_Time = this.getView().byId("id_sr_wt_dt_time_h").getValue();
                        let Remarks = this.getView().byId("id_sr_remark_h").getValue();
        
                        console.log("gateentryno:", gateentryno);
                        console.log("Customer_Return:", Customer_Return[k]);
                        // console.log("Delivery_Return_Type:", Delivery_Return_Type);
                        // console.log("Plant_Code:", Plant_Code);
                        // console.log("Plant_Name:", Plant_Name);
                        // console.log("Customer_Code:", Customer_Code);
                        // console.log("Customer_Name:", Customer_Name);
                        console.log("Gate_Entry_Date:", Gate_Entry_Date);
                        console.log("Vehicle_No:", Vehicle_No);
                        console.log("Vehicle_Type:", Vehicle_Type);
                        console.log("No_Of_Packages:", No_Of_Packages);
                        console.log("Transporter:", Transporter);
                        console.log("Transporter_Mode:", Transporter_Mode);
                        console.log("Gross_Weight:", Gross_Weight);
                        console.log("Weight_Time:", Weight_Time);
                        console.log("Remarks:", Remarks);



                    

                    var itemData = [];
                    let ItemNo_array = [];
                     let Quantity_array = [];
                    console.log("Customer_Return---:", Customer_Return[k].getKey())

                        for (var i = 0; i < Table_Length; i++) {
                            var Customer_Document_No = Table_Id.getRows()[i].getCells()[1].getValue();
                            
                                        var Product_Code = Table_Id.getRows()[i].getCells()[2].getValue();
                                        var Product_Name = Table_Id.getRows()[i].getCells()[3].getValue();
                                        var Product_Type = Table_Id.getRows()[i].getCells()[4].getValue();
                                        var Purchase_Order_Quantity = Table_Id.getRows()[i].getCells()[5].getValue();
                                        var UOM = Table_Id.getRows()[i].getCells()[6].getValue();
                                        var Open_Quantity = Table_Id.getRows()[i].getCells()[7].getValue();
                                        var Quantity_in_GE = Table_Id.getRows()[i].getCells()[8].getValue();
                                        var Plant_Code = Table_Id.getRows()[i].getCells()[9].getValue();
                                        var Plant_Name = Table_Id.getRows()[i].getCells()[10].getValue();
                                        var Customer_Code = Table_Id.getRows()[i].getCells()[11].getValue();
                                        var Customer_Name = Table_Id.getRows()[i].getCells()[12].getValue();
                                        var Delivery_Return_Type = Table_Id.getRows()[i].getCells()[13].getValue();
                
                
                                        var Quantity01 = Quantity_in_GE.trim();
                                        if (Quantity01 !== "") {
                                            Quantity_array.push(Quantity01);
                                            Table_Id.getRows()[i].getCells()[8].setValueState(sap.ui.core.ValueState.None);
                                        }
                                        else {
                                            Table_Id.getRows()[i].getCells()[8].setValueState(sap.ui.core.ValueState.Error);
                                            Table_Id.getRows()[i].getCells()[8].setValueStateText("Please Enter Quantity");
                                            break;
                                        }
                
                
                                        var Item = Table_Id.getRows()[i].getCells()[0].getValue();
                                        var ItemNo01 = Item.trim();
                                        if (ItemNo01 !== "") {
                                            ItemNo_array.push(ItemNo01);
                                        }
                
                                        if (Item === "") {
                                            break;
                                        }





                        let Customer_Do_No00 = Table_Id.getRows()[i].getCells()[1].getValue();
                        if(Customer_Do_No00 !== ""){
                            if(Customer_Do_No00 === Customer_Return[k].getKey()){
                                itemData.push({
                                    ReferenceDocument: Customer_Return[k].getKey(),
                                                    Id: gateentryno,
                                                    ItemNo: Item,
                                                    ReferenceDocumentType: Delivery_Return_Type,
                                                    ProductCode: Product_Code,
                                                    ProductName: Product_Name,
                                                    ProductType: Product_Type,
                                                    OrderQuantity: Open_Quantity,
                                                    UOM: UOM,
                                                    OpenQuantity: Open_Quantity,
                                                    OpenQuantityUOM: UOM,
                                                    QuantityInGE: Quantity_in_GE,
                                                    QuantityInGEUOM: UOM,
                                                    PlantCode: Plant_Code,
                                                    PlantName: Plant_Name,
                                                    SupplierCode: "",
                                                    SupplierName: "",
                                                    SupplierType: "",
                                                    CustomerCode: Customer_Code,
                                                    CustomerName: Customer_Name,
                                                    CustomerType: "",
                                                    EWayBill: "",
                                                    GateEntryDate: Gate_Entry_Date,
                                                    VehicleType: Vehicle_Type,
                                                    VehicleNo: Vehicle_No,
                                                    InvoiceNo: "",
                                                    InvoiceDate: "",
                                                    Transporter: Transporter,
                                                    TransporterMode: Transporter_Mode,
                                                    LRNo: "",
                                                    LRDate: "",
                                                    GrossWeight: Gross_Weight,
                                                    WeightTime: Weight_Time,
                                                    WeightDate: Weight_Time,
                                                    NoOfPackages: "",
                                                    Remarks: Remarks,
                                                    Status: "created",
                                                    ItemsStatus: "created",
                                                    ApproveStatus: "",
                                                    PurchaseOrderNo: "",
                                                    DeliveryDocumentNo: "",
                                                    SalesReturnNo:Customer_Return[k].getKey(),
                                                    ScreenCode: "GE4",
                                                    PostingDate: this.CurrentDate01,

                                })
                            }
                        }
                    }      
                    console.log("itemData---00:", itemData);  
                    
                    
                    if (Quantity_array.length > 0 && ItemNo_array.length > 0) {
                                    if (ItemNo_array.length === Quantity_array.length) {           
                                        var oEntry = {};            
                                        oEntry.Id = gateentryno,
                                            oEntry.ReferenceDocument = Customer_Return[k].getKey(),
                                            oEntry.ReferenceDocumentType = Delivery_Return_Type,
                                            oEntry.PlantCode = Plant_Code,
                                            oEntry.PlantName = Plant_Name,
                                            oEntry.SupplierCode = "",
                                            oEntry.SupplierName = "",
                                            oEntry.SupplierType = "",
                                            oEntry.CustomerCode = Customer_Code,
                                            oEntry.CustomerName = Customer_Name,
                                            oEntry.CustomerType = "",
                                            oEntry.EWayBill = "",
                                            oEntry.GateEntryDate = Gate_Entry_Date,
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
                                            oEntry.NoOfPackages = No_Of_Packages,
                                            oEntry.Remarks = Remarks,
                                            oEntry.Status = "created",
                                            oEntry.ApproveStatus = "",
                                            oEntry.PurchaseOrderNo = "",
                                            oEntry.DeliveryDocumentNo = "",
                                            oEntry.SalesReturnNo = Customer_Return[k].getKey(),
                                            oEntry.CustomerReturnNo = "",
                                            oEntry.ScreenCode = "GE4"
            
                                        oEntry.to_ITEM = itemData,
                                            console.log(oEntry);         
            
                                        this.getView().setModel();
            
                                        var oModelGet = this.getView().getModel("YY1_ZINWARD_HEAD_CDS");
                                        var that = this;

                                        // if (oModelGet.getProperty("/YY1_ZINWARD_HEAD('" + gateentryno + "')")) {
                                        //     // Entry with the same key already exists, handle it
                                            
                                        // } else {
                                        //     // Continue with creating the new entry
                                        // }
                                        

            
                                        oModelGet.create("/YY1_ZINWARD_HEAD", oEntry, {
                                            success: function (oData, oResponse) {
                                                console.log(oData);
                                                console.log("saved")
                                                // oModelGet.refresh(true);
                                                // MessageBox.success("Document No " + gateentryno + " Generated", {
                                                //     title: "Sales Return",
                                                //     id: "messageBoxId1",
                                                //     contentWidth: "100px",
                                                // });
                                                sap.ui.core.BusyIndicator.hide();
            
                                                // empty field to reload 
                                                that.getView().byId("id_gateentry_h").setValue("");
                                                that.getView().byId("id_ret_sale_document_h").setTokens("");
                                                // that.getView().byId("id_del_ret_type_h").setValue("");
                                                // that.getView().byId("id_sr_plant_h").setValue("");
                                                // that.getView().byId("id_sr_plant_name_h").setValue("");
                                                // that.getView().byId("id_sr_cust_code_h").setValue("");
                                                // that.getView().byId("id_sr_cust_name_h").setValue("");
                                                that.getView().byId("id_sr_gate_date").setValue("");
                                                that.getView().byId("id_sr_vehno_h").setValue("");
                                                that.getView().byId("id_sr_vehicle_type_h").setValue("");
                                                that.getView().byId("id_sr_no_of_package_h").setValue("");
                                                that.getView().byId("id_sr_transporter_h").setValue("");
                                                that.getView().byId("id_sr_transporter_mode_h").setValue("");
                                                that.getView().byId("id_sr_gross_wt_h").setValue("");
                                                that.getView().byId("id_sr_wt_dt_time_h").setValue("");
                                                that.getView().byId("id_sr_remark_h").setValue("");
            
                                                var oTable = that.getView().byId("salesreturn_table_id");
                                                var oTableModel = new sap.ui.model.json.JSONModel();
                                                oTableModel.setData({ items: "" });
                                                oTable.setModel(oTableModel);
                                                oTable.bindRows("/items");
                                            },
            
                                            error: function (error) {
                                                console.log("error");
                                                sap.ui.core.BusyIndicator.hide();
            
                                            }
                                        });
            
                                    } else {
                                        MessageBox.show("Please Fill the Mandatory Fields ", MessageBox.Icon.ERROR, "");
                                        sap.ui.core.BusyIndicator.hide();
                                    }
                                } else {
                                    MessageBox.show("Please Fill the Mandatory Fields ", MessageBox.Icon.ERROR, "");
                                    sap.ui.core.BusyIndicator.hide();
                                }      

                   }



                 //old code  start
                // for(var k=0; k<Customer_Return.length; k++){
             
                //     console.log("Customer_Return:",Customer_Return[k]);
                    
                //     let gateentryno = this.getView().byId("id_gateentry_h").getValue();
                //     // let Delivery_Return_Type = this.getView().byId("id_del_ret_type_h").getValue();
                //     // let Plant_Code = this.getView().byId("id_sr_plant_h").getValue();
                //     // let Plant_Name = this.getView().byId("id_sr_plant_name_h").getValue();
                //     // let Customer_Code = this.getView().byId("id_sr_cust_code_h").getValue();
                //     // let Customer_Name = this.getView().byId("id_sr_cust_name_h").getValue();
                //     let Gate_Entry_Date = this.getView().byId("id_sr_gate_date").getValue();
                //     let Vehicle_No = this.getView().byId("id_sr_vehno_h").getValue();
                //     let Vehicle_Type = this.getView().byId("id_sr_vehicle_type_h").getValue();
                //     let No_Of_Packages = this.getView().byId("id_sr_no_of_package_h").getValue();
                //     let Transporter = this.getView().byId("id_sr_transporter_h").getValue();
                //     let Transporter_Mode = this.getView().byId("id_sr_transporter_mode_h").getValue();
                //     let Gross_Weight = this.getView().byId("id_sr_gross_wt_h").getValue();
                //     let Weight_Time = this.getView().byId("id_sr_wt_dt_time_h").getValue();
                //     let Remarks = this.getView().byId("id_sr_remark_h").getValue();
    
                //     console.log("gateentryno:", gateentryno);
                //     console.log("Customer_Return:", Customer_Return[k]);
                //     // console.log("Delivery_Return_Type:", Delivery_Return_Type);
                //     // console.log("Plant_Code:", Plant_Code);
                //     // console.log("Plant_Name:", Plant_Name);
                //     // console.log("Customer_Code:", Customer_Code);
                //     // console.log("Customer_Name:", Customer_Name);
                //     console.log("Gate_Entry_Date:", Gate_Entry_Date);
                //     console.log("Vehicle_No:", Vehicle_No);
                //     console.log("Vehicle_Type:", Vehicle_Type);
                //     console.log("No_Of_Packages:", No_Of_Packages);
                //     console.log("Transporter:", Transporter);
                //     console.log("Transporter_Mode:", Transporter_Mode);
                //     console.log("Gross_Weight:", Gross_Weight);
                //     console.log("Weight_Time:", Weight_Time);
                //     console.log("Remarks:", Remarks);
    
                //     if (Gate_Entry_Date !== "" && Vehicle_No !== "" && No_Of_Packages !== "" && Transporter !== "" && Gross_Weight !== "") {
                //         // this.getView().byId("id_ret_sale_document_h").setValueState(sap.ui.core.ValueState.None);
                //         // this.getView().byId("id_ret_sale_document_h").setValueStateText("");
    
                //         this.getView().byId("id_sr_gate_date").setValueState(sap.ui.core.ValueState.None);
                //         this.getView().byId("id_sr_gate_date").setValueStateText("");
    
                //         this.getView().byId("id_sr_vehno_h").setValueState(sap.ui.core.ValueState.None);
                //         this.getView().byId("id_sr_vehno_h").setValueStateText("");
    
                //         this.getView().byId("id_sr_no_of_package_h").setValueState(sap.ui.core.ValueState.None);
                //         this.getView().byId("id_sr_no_of_package_h").setValueStateText("");
    
    
                //         this.getView().byId("id_sr_transporter_h").setValueState(sap.ui.core.ValueState.None);
                //         this.getView().byId("id_sr_transporter_h").setValueStateText("");
    
                //         this.getView().byId("id_sr_gross_wt_h").setValueState(sap.ui.core.ValueState.None);
                //         this.getView().byId("id_sr_gross_wt_h").setValueStateText("");
    
                //         var Table_Id = this.getView().byId("salesreturn_table_id"); // Assuming 'persoTable' is the ID of the Grid Table
                //         var oModel = Table_Id.getModel();
                //         var Table_Length = Table_Id.getRows().length;
    
                //         var itemData = [];
                //         let ItemNo_array = [];
                //         let Quantity_array = [];
    
                //         for (var i = 0; i < Table_Length; i++) {
    
                //             var Customer_Document_No = Table_Id.getRows()[1].getCells()[1].getValue();
                            
                //             var Product_Code = Table_Id.getRows()[i].getCells()[2].getValue();
                //             var Product_Name = Table_Id.getRows()[i].getCells()[3].getValue();
                //             var Product_Type = Table_Id.getRows()[i].getCells()[4].getValue();
                //             var Purchase_Order_Quantity = Table_Id.getRows()[i].getCells()[5].getValue();
                //             var UOM = Table_Id.getRows()[i].getCells()[6].getValue();
                //             var Open_Quantity = Table_Id.getRows()[i].getCells()[7].getValue();
                //             var Quantity_in_GE = Table_Id.getRows()[i].getCells()[8].getValue();
                //             var Plant_Code = Table_Id.getRows()[i].getCells()[9].getValue();
                //             var Plant_Name = Table_Id.getRows()[i].getCells()[10].getValue();
                //             var Customer_Code = Table_Id.getRows()[i].getCells()[11].getValue();
                //             var Customer_Name = Table_Id.getRows()[i].getCells()[12].getValue();
                //             var Delivery_Return_Type = Table_Id.getRows()[i].getCells()[13].getValue();
    
    
                //             var Quantity01 = Quantity_in_GE.trim();
                //             if (Quantity01 !== "") {
                //                 Quantity_array.push(Quantity01);
                //                 Table_Id.getRows()[i].getCells()[8].setValueState(sap.ui.core.ValueState.None);
                //             }
                //             else {
                //                 Table_Id.getRows()[i].getCells()[8].setValueState(sap.ui.core.ValueState.Error);
                //                 Table_Id.getRows()[i].getCells()[8].setValueStateText("Please Enter Quantity");
                //                 break;
                //             }
    
    
                //             var Item = Table_Id.getRows()[i].getCells()[0].getValue();
                //             var ItemNo01 = Item.trim();
                //             if (ItemNo01 !== "") {
                //                 ItemNo_array.push(ItemNo01);
                //             }
    
                //             if (Item === "") {
                //                 break;
                //             }
    
    
                //             //             //  ITEM DATA 
    
    
                //             itemData.push({
    
                //                 Id: gateentryno,
                //                 ItemNo: Item,
                //                 ReferenceDocument: Customer_Return[k],
                //                 ReferenceDocumentType: Delivery_Return_Type,
                //                 ProductCode: Product_Code,
                //                 ProductName: Product_Name,
                //                 ProductType: Product_Type,
                //                 OrderQuantity: Open_Quantity,
                //                 UOM: UOM,
                //                 OpenQuantity: Open_Quantity,
                //                 OpenQuantityUOM: UOM,
                //                 QuantityInGE: Quantity_in_GE,
                //                 QuantityInGEUOM: UOM,
                //                 PlantCode: Plant_Code,
                //                 PlantName: Plant_Name,
                //                 SupplierCode: "",
                //                 SupplierName: "",
                //                 SupplierType: "",
                //                 CustomerCode: Customer_Code,
                //                 CustomerName: Customer_Name,
                //                 CustomerType: "",
                //                 EWayBill: "",
                //                 GateEntryDate: Gate_Entry_Date,
                //                 VehicleType: Vehicle_Type,
                //                 VehicleNo: Vehicle_No,
                //                 InvoiceNo: "",
                //                 InvoiceDate: "",
                //                 Transporter: Transporter,
                //                 TransporterMode: Transporter_Mode,
                //                 LRNo: "",
                //                 LRDate: "",
                //                 GrossWeight: Gross_Weight,
                //                 WeightTime: Weight_Time,
                //                 WeightDate: Weight_Time,
                //                 NoOfPackages: "",
                //                 Remarks: Remarks,
                //                 Status: "created",
                //                 ItemsStatus: "created",
                //                 ApproveStatus: "",
                //                 PurchaseOrderNo: "",
                //                 DeliveryDocumentNo: "",
                //                 SalesReturnNo: Customer_Return[k],
                //                 ScreenCode: "GE4",
                //                 PostingDate: this.CurrentDate01,
    
                //             });
                //         }
    
                //         console.log(itemData);
    
                //         if (Quantity_array.length > 0 && ItemNo_array.length > 0) {
                //             if (ItemNo_array.length === Quantity_array.length) {
    
                //                 var oEntry = {};
    
                //                 oEntry.Id = gateentryno,
                //                     oEntry.ReferenceDocument = Customer_Return[k],
                //                     oEntry.ReferenceDocumentType = Delivery_Return_Type,
                //                     oEntry.PlantCode = Plant_Code,
                //                     oEntry.PlantName = Plant_Name,
                //                     oEntry.SupplierCode = "",
                //                     oEntry.SupplierName = "",
                //                     oEntry.SupplierType = "",
                //                     oEntry.CustomerCode = Customer_Code,
                //                     oEntry.CustomerName = Customer_Name,
                //                     oEntry.CustomerType = "",
                //                     oEntry.EWayBill = "",
                //                     oEntry.GateEntryDate = Gate_Entry_Date,
                //                     oEntry.VehicleType = Vehicle_Type,
                //                     oEntry.VehicleNo = Vehicle_No,
                //                     oEntry.InvoiceNo = "",
                //                     oEntry.InvoiceDate = "",
                //                     oEntry.Transporter = Transporter,
                //                     oEntry.TransporterMode = Transporter_Mode,
                //                     oEntry.LRNo = "",
                //                     oEntry.LRDate = "",
                //                     oEntry.GrossWeight = Gross_Weight,
                //                     oEntry.WeightTime = Weight_Time,
                //                     oEntry.WeightDate = Weight_Time,
                //                     oEntry.NoOfPackages = No_Of_Packages,
                //                     oEntry.Remarks = Remarks,
                //                     oEntry.Status = "created",
                //                     oEntry.ApproveStatus = "",
                //                     oEntry.PurchaseOrderNo = "",
                //                     oEntry.DeliveryDocumentNo = "",
                //                     oEntry.SalesReturnNo = Customer_Return[k],
                //                     oEntry.CustomerReturnNo = "",
                //                     oEntry.ScreenCode = "GE4"
    
                //                 oEntry.to_ITEM = itemData,
                //                     console.log(oEntry);
    
    
                //                 this.getView().setModel();
    
                //                 var oModelGet = this.getView().getModel("YY1_ZINWARD_HEAD_CDS");
                //                 var that = this;
    
                //                 oModelGet.create("/YY1_ZINWARD_HEAD", oEntry, {
                //                     success: function (oData, oResponse) {
                //                         console.log(oData);
                //                         console.log("saved")
                //                         oModelGet.refresh(true);
                //                         MessageBox.success("Document No " + gateentryno + " Generated", {
                //                             title: "Sales Return",
                //                             id: "messageBoxId1",
                //                             contentWidth: "100px",
                //                         });
                //                         sap.ui.core.BusyIndicator.hide();
    
                //                         // empty field to reload 
                //                         that.getView().byId("id_gateentry_h").setValue("");
                //                         that.getView().byId("id_ret_sale_document_h").setTokens("");
                //                         // that.getView().byId("id_del_ret_type_h").setValue("");
                //                         // that.getView().byId("id_sr_plant_h").setValue("");
                //                         // that.getView().byId("id_sr_plant_name_h").setValue("");
                //                         // that.getView().byId("id_sr_cust_code_h").setValue("");
                //                         // that.getView().byId("id_sr_cust_name_h").setValue("");
                //                         that.getView().byId("id_sr_gate_date").setValue("");
                //                         that.getView().byId("id_sr_vehno_h").setValue("");
                //                         that.getView().byId("id_sr_vehicle_type_h").setValue("");
                //                         that.getView().byId("id_sr_no_of_package_h").setValue("");
                //                         that.getView().byId("id_sr_transporter_h").setValue("");
                //                         that.getView().byId("id_sr_transporter_mode_h").setValue("");
                //                         that.getView().byId("id_sr_gross_wt_h").setValue("");
                //                         that.getView().byId("id_sr_wt_dt_time_h").setValue("");
                //                         that.getView().byId("id_sr_remark_h").setValue("");
    
                //                         var oTable = that.getView().byId("salesreturn_table_id");
                //                         var oTableModel = new sap.ui.model.json.JSONModel();
                //                         oTableModel.setData({ items: "" });
                //                         oTable.setModel(oTableModel);
                //                         oTable.bindRows("/items");
                //                     },
    
                //                     error: function (error) {
                //                         console.log("error");
                //                         sap.ui.core.BusyIndicator.hide();
    
                //                     }
                //                 });
    
                //             } else {
                //                 MessageBox.show("Please Fill the Mandatory Fields ", MessageBox.Icon.ERROR, "");
                //                 sap.ui.core.BusyIndicator.hide();
                //             }
                //         } else {
                //             MessageBox.show("Please Fill the Mandatory Fields ", MessageBox.Icon.ERROR, "");
                //             sap.ui.core.BusyIndicator.hide();
                //         }
    
    
    
                //     }
    
                //     else {
                //         sap.ui.core.BusyIndicator.hide();
                //         // if (Customer_Return === "") {
                //         //     this.getView().byId("id_ret_sale_document_h").setValueState(sap.ui.core.ValueState.Error);
                //         //     this.getView().byId("id_ret_sale_document_h").setValueStateText("Please Enter Customer Return No");
                //         // } else {
                //         //     this.getView().byId("id_ret_sale_document_h").setValueState(sap.ui.core.ValueState.None);
                //         //     this.getView().byId("id_ret_sale_document_h").setValueStateText("");
                //         // }
                //         {
                //             if (Gate_Entry_Date === "") {
                //                 this.getView().byId("id_sr_gate_date").setValueState(sap.ui.core.ValueState.Error);
                //                 this.getView().byId("id_sr_gate_date").setValueStateText("Please Enter Gate Entry Date");
                //             } else {
                //                 this.getView().byId("id_sr_gate_date").setValueState(sap.ui.core.ValueState.None);
                //                 this.getView().byId("id_sr_gate_date").setValueStateText("");
                //             }
                //         }
                //         {
                //             if (Vehicle_No === "") {
                //                 this.getView().byId("id_sr_vehno_h").setValueState(sap.ui.core.ValueState.Error);
                //                 this.getView().byId("id_sr_vehno_h").setValueStateText("Please Enter Vehicle No");
                //             } else {
                //                 this.getView().byId("id_sr_vehno_h").setValueState(sap.ui.core.ValueState.None);
                //                 this.getView().byId("id_sr_vehno_h").setValueStateText("");
                //             }
                //         }
                //         {
                //             if (No_Of_Packages === "") {
                //                 this.getView().byId("id_sr_no_of_package_h").setValueState(sap.ui.core.ValueState.Error);
                //                 this.getView().byId("id_sr_no_of_package_h").setValueStateText("Please Enter No of Package");
                //             } else {
                //                 this.getView().byId("id_sr_no_of_package_h").setValueState(sap.ui.core.ValueState.None);
                //                 this.getView().byId("id_sr_no_of_package_h").setValueStateText("");
                //             }
                //         }
                //         {
                //             if (Transporter === "") {
                //                 this.getView().byId("id_sr_transporter_h").setValueState(sap.ui.core.ValueState.Error);
                //                 this.getView().byId("id_sr_transporter_h").setValueStateText("Please Enter Tranporter No");
                //             } else {
                //                 this.getView().byId("id_sr_transporter_h").setValueState(sap.ui.core.ValueState.None);
                //                 this.getView().byId("id_sr_transporter_h").setValueStateText("");
                //             }
                //         }
                //         {
                //             if (Gross_Weight === "") {
                //                 this.getView().byId("id_sr_gross_wt_h").setValueState(sap.ui.core.ValueState.Error);
                //                 this.getView().byId("id_sr_gross_wt_h").setValueStateText("Please Enter Gross Weight No");
                //             } else {
                //                 this.getView().byId("id_sr_gross_wt_h").setValueState(sap.ui.core.ValueState.None);
                //                 this.getView().byId("id_sr_gross_wt_h").setValueStateText("");
                //             }
                //         }
                //     }




                // }
        // old card finish
                

            },

            
            OnCreateCancel:function(){

                this.getView().byId("id_gateentry_h").setValue("");
                this.getView().byId("id_ret_sale_document_h").setValue("");
                this.getView().byId("id_del_ret_type_h").setValue("");
                this.getView().byId("id_sr_plant_h").setValue("");
                this.getView().byId("id_sr_plant_name_h").setValue("");
                this.getView().byId("id_sr_cust_code_h").setValue("");
                this.getView().byId("id_sr_cust_name_h").setValue("");
                this.getView().byId("id_sr_gate_date").setValue("");
                this.getView().byId("id_sr_vehno_h").setValue("");
                this.getView().byId("id_sr_vehicle_type_h").setValue("");
                this.getView().byId("id_sr_no_of_package_h").setValue("");
                this.getView().byId("id_sr_transporter_h").setValue("");
                this.getView().byId("id_sr_transporter_mode_h").setValue("");
                this.getView().byId("id_sr_gross_wt_h").setValue("");
                this.getView().byId("id_sr_wt_dt_time_h").setValue("");
                this.getView().byId("id_sr_remark_h").setValue("");



                var oTable = this.getView().byId("salesreturn_table_id");
                var oTableModel = new sap.ui.model.json.JSONModel();
                oTableModel.setData({ items: "" });
                oTable.setModel(oTableModel);
                oTable.bindRows("/items");





            },







            // --------------------------------------------------------------------------------------------------------------------------


            // Change page controller 


           





            OnSoChangeDocNoFragOpen: function (oEvent) {
                if (!this.SoChangeDocNohead) {
                    this.SoChangeDocNohead = sap.ui.xmlfragment(this.getView().getId("SalChangeDocNo_dialog"), "gatepassapp.view.inward.salesreturn.fragment.edit_sales_return_dialog_open", this);
                    this.getView().addDependent(this.SoChangeDocNohead);
                }

                this.SoChangeDocNohead.open();
            },








            OnSoChangeDocFragOpen: function (oEvent) {
                if (!this.SoDocChange) {
                    this.SoDocChange = sap.ui.xmlfragment(this.getView().getId("SoChangeDocHead_dialog"), "gatepassapp.view.inward.salesreturn.fragment.sales_return_doc_head", this);
                    this.getView().addDependent(this.SoDocChange);
                }

                this.SoDocChange.open();
            },

            OnSoChangeDocHeadSearch: function (oEvent) {
                var sValue2 = oEvent.getParameter("value");
                var oFilter3 = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.Contains, sValue2)
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter3]);
            },



            OnChangeSalesSuggest: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                var oItem = oEvent.getParameter("selectedItem");
                var GetKey = oItem ? oItem.getKey() : "";
                var GetValue = oItem ? oItem.getText() : "";

                // Do something with key and text values
                console.log(oItem);
                console.log("Selected Key:", GetKey);
                console.log("Selected Text:", GetValue);


               


                    var filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, GetKey);
                    var model0 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS");
                    var that = this;
                    model0.read("/YY1_ZINWARD_HEAD", {
                        filters: [filter],
                        success: function (ODat, oRespons) {
                            var value11 = ODat.results[0];
                            var SAPUIID = value11.SAP_UUID;
                            var Status = value11.Status;
                            console.log(value11);
                            that.getView().byId("sales_return_change_Document_H").setValue(value11.ReferenceDocument);
                            that.getView().byId("id_sapuuid_so_h").setValue(SAPUIID);
                            that.getView().byId("id_cust_ret_change_type_h").setValue(value11.ReferenceDocumentType);
                            that.getView().byId("id_sr_change_plant_h").setValue(value11.PlantCode);
                            that.getView().byId("id_sr_change_plant_name_h").setValue(value11.PlantName);
                            that.getView().byId("id_sr_change_cust_code_h").setValue(value11.CustomerCode);
                            that.getView().byId("id_sr_change_cust_name_h").setValue(value11.CustomerName);
                            that.getView().byId("id_sr_change_gate_date").setValue(value11.GateEntryDate);
                            that.getView().byId("id_sr_change_vehno_h").setValue(value11.VehicleNo);
                            that.getView().byId("id_sr_change_vehicle_type_h").setValue(value11.VehicleType);
                            that.getView().byId("id_sr_change_no_of_package_h").setValue(value11.NoOfPackages);
                            that.getView().byId("id_sr_change_transporter_h").setValue(value11.Transporter);
                            that.getView().byId("id_sr_change_transporter_mode_h").setValue(value11.TransporterMode);
                            that.getView().byId("id_sr_change_gross_wt_h").setValue(value11.GrossWeight);
                            that.getView().byId("id_sr_change_wt_dt_time_h").setValue(value11.WeightDate);
                            that.getView().byId("id_sr_change_wt_dt_time_h").setValue(value11.WeightTime);
                            that.getView().byId("id_sr_change_remark_h").setValue(value11.Remarks);




                            if (Status === "deleted") {
                                that.getView().byId("DeleteIndicId").setVisible(true);
                                that.getView().byId("id_update_button").setVisible(false);
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false);
                                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(true);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(true);
                            } else if (Status === "approved" || Status === "rejected") {
                                that.getView().byId("DeleteIndicId").setVisible(false);
                                that.getView().byId("id_update_button").setVisible(false);
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false);
                                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);
                            } else {
                                that.getView().byId("DeleteIndicId").setVisible(false);
                                that.getView().byId("id_update_button").setVisible(true);
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(true);
                                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(true);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);
                            }

                            model0.read("/YY1_ZINWARD_HEAD(guid'" + SAPUIID + "')/to_ITEM", {

                                success: function (oData) {
                                    let data = {};
                                    var oJSONModel = new sap.ui.model.json.JSONModel({
                                        data: oData.results
                                    });
                                    console.log(data);
                                    that.getView().setModel(oJSONModel, "JModel");
                                    sap.ui.core.BusyIndicator.hide();
                                },
                                error: function (oError) {
                                    console.log(oError);
                                    sap.ui.core.BusyIndicator.hide();
                                }
                            });

                        },

                        error: function (oError) {
                            console.log(oError);

                        }

                    });


                
            },



            OnSoChangeDoHeadSelect: function (oEvent) {
                sap.ui.core.BusyIndicator.show();

                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);

                var aContexts = oEvent.getParameter("selectedContexts");

                if (aContexts === undefined) {
                    // console.log("undefined");
                    let Dataa = this.getView().byId("id_gateentrychange_h").getValue();
                    if (Dataa === "") {
                        this.getView().byId("id_update_button").setEnabled(false);
                        this.getView().byId("Final_Delete_Button").setEnabled(false);
                        this.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
                        sap.ui.core.BusyIndicator.hide();
                    }

                } else {

                    var SaleDocNo, SAP_UUID_H;

                    if (aContexts && aContexts.length) {

                        aContexts.map(function (oContext) {
                            SaleDocNo = oContext.getObject().Id;
                            SAP_UUID_H = oContext.getObject().SAP_UUID;
                            return;
                        });
                        this.getView().byId("id_gateentrychange_h").setValue(SaleDocNo);
                        this.getView().byId("idsrchangeuuid").setValue(SAP_UUID_H);
                        sap.ui.core.BusyIndicator.hide();
                    }





                    var filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, SaleDocNo);
                    var model0 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS");
                    var that = this;
                    model0.read("/YY1_ZINWARD_HEAD", {
                        filters: [filter],
                        success: function (ODat, oRespons) {
                            var value11 = ODat.results[0];
                            var SAPUIID = value11.SAP_UUID;
                            var Status = value11.Status;
                            console.log(value11);
                            that.getView().byId("sales_return_change_Document_H").setValue(value11.ReferenceDocument);
                            that.getView().byId("id_sapuuid_so_h").setValue(SAPUIID);
                            that.getView().byId("id_cust_ret_change_type_h").setValue(value11.ReferenceDocumentType);
                            that.getView().byId("id_sr_change_plant_h").setValue(value11.PlantCode);
                            that.getView().byId("id_sr_change_plant_name_h").setValue(value11.PlantName);
                            that.getView().byId("id_sr_change_cust_code_h").setValue(value11.CustomerCode);
                            that.getView().byId("id_sr_change_cust_name_h").setValue(value11.CustomerName);
                            that.getView().byId("id_sr_change_gate_date").setValue(value11.GateEntryDate);
                            that.getView().byId("id_sr_change_vehno_h").setValue(value11.VehicleNo);
                            that.getView().byId("id_sr_change_vehicle_type_h").setValue(value11.VehicleType);
                            that.getView().byId("id_sr_change_no_of_package_h").setValue(value11.NoOfPackages);
                            that.getView().byId("id_sr_change_transporter_h").setValue(value11.Transporter);
                            that.getView().byId("id_sr_change_transporter_mode_h").setValue(value11.TransporterMode);
                            that.getView().byId("id_sr_change_gross_wt_h").setValue(value11.GrossWeight);
                            that.getView().byId("id_sr_change_wt_dt_time_h").setValue(value11.WeightDate);
                            that.getView().byId("id_sr_change_wt_dt_time_h").setValue(value11.WeightTime);
                            that.getView().byId("id_sr_change_remark_h").setValue(value11.Remarks);




                            if (Status === "deleted") {
                                that.getView().byId("DeleteIndicId").setVisible(true);
                                that.getView().byId("id_update_button").setVisible(false);
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false);
                                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(true);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(true);
                            } else if (Status === "approved" || Status === "rejected") {
                                that.getView().byId("DeleteIndicId").setVisible(false);
                                that.getView().byId("id_update_button").setVisible(false);
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false);
                                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);
                            } else {
                                that.getView().byId("DeleteIndicId").setVisible(false);
                                that.getView().byId("id_update_button").setVisible(true);
                                that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(true);
                                that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(true);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
                                that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);
                            }

                            model0.read("/YY1_ZINWARD_HEAD(guid'" + SAPUIID + "')/to_ITEM", {

                                success: function (oData) {
                                    let data = {};
                                    var oJSONModel = new sap.ui.model.json.JSONModel({
                                        data: oData.results
                                    });
                                    console.log(data);
                                    that.getView().setModel(oJSONModel, "JModel");
                                    sap.ui.core.BusyIndicator.hide();
                                },
                                error: function (oError) {
                                    console.log(oError);
                                    sap.ui.core.BusyIndicator.hide();
                                }
                            });

                        },

                        error: function (oError) {
                            console.log(oError);

                        }

                    });





                }
            },


            // ----Start Select Items Table Delete
            OnTableRowRemove: function (oEvent) {
                var oTable = this.byId("salesreturnchange_table_id");
                var oTableRows = oTable.getRows();
                var aIndices = this.byId("salesreturnchange_table_id").getSelectedIndices();

                for (let i = 0; i < oTableRows.length; i++) {
                    console.log(i);
                    aIndices.forEach(function (Index) {
                        if (i === Index) {
                            let Visible_Status = oTable.getRows()[Index].getCells()[0].getVisible();
                            if (Visible_Status === false) {
                                oTable.getRows()[Index].getCells()[0];
                                oTable.getRows()[Index].getCells()[0].setVisible(true);
                            }
                            if (Visible_Status === true) {
                                oTable.getRows()[Index].getCells()[0];
                                oTable.getRows()[Index].getCells()[0].setVisible(false);
                            }

                        }
                    });

                }
            },



            OnPendingQtyCalEdit: function (SoItem, SocHead, OrderQuantity) {

                var that = this; // Store reference to 'this'
                if (SoItem !== null && SocHead !== null && OrderQuantity !== null) {
                    var SoItem = SoItem;
                    var SocHead = SocHead;
                    var OrderQuantity = OrderQuantity;

                    console.log("SoItem:", SoItem)
                    console.log("SocHead:", SocHead)
                    console.log("DocOrderQuantitytem:", OrderQuantity)

                    return new Promise(function (resolve, reject) {

                        var oFilter = new sap.ui.model.Filter("ItemNo", sap.ui.model.FilterOperator.EQ, SoItem);
                        var oFilter1 = new sap.ui.model.Filter("ReferenceDocument", sap.ui.model.FilterOperator.EQ, SocHead);
                        //var oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'created');
                        var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE4');
                        var oFilter4 = new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, 'created');

                        var oModel2 = that.getView().getModel("YY1_ZINWARD_HEAD_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter3, oFilter4];

                        var CalData = 0;

                        oModel2.read("/YY1_ITEM_ZINWARD_HEAD", {
                            filters: oFilters,
                            success: function (oData) {
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
                            error: function (oError) {
                                console.error("Error reading data: ", oError);
                                reject(oError); // Reject with the error
                            }
                        });
                    });

                }
            },







            OnGateQtyToPostEnteredit: function (oEvent) {
                let Quantity_to_Post_Input = oEvent.getSource().getParent().getCells()[9].getValue();
                let OrderQuantity = oEvent.getSource().getParent().getCells()[8].getValue();

                if (Quantity_to_Post_Input === "") {
                    oEvent.getSource().getParent().getCells()[9].setValue("0");
                } else {
                    let SoItem = oEvent.getSource().getParent().getCells()[1].getValue();
                    let SocHead = oEvent.getSource().getParent().getCells()[2].getValue();
                    let Id = this.getView().byId("id_gateentrychange_h").getValue();
                    console.log("SoItem:", SoItem);
                    console.log("SocHead:", SocHead);
                    console.log("Id:", Id);

                    let Quantity_to_Post_Input_Float = parseFloat(Quantity_to_Post_Input);
                    let OrderQuantity_Float = parseFloat(OrderQuantity);

                    var oFilter = new sap.ui.model.Filter("ItemNo", sap.ui.model.FilterOperator.EQ, SoItem);
                    var oFilter1 = new sap.ui.model.Filter("ReferenceDocument", sap.ui.model.FilterOperator.EQ, SocHead);
                    var oFilter2 = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, Id);
                    var that = this;
                    var oModel002 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS");
                    var oFilters = [oFilter, oFilter1, oFilter2];

                    oModel002.read("/YY1_ITEM_ZINWARD_HEAD", {
                        filters: oFilters,
                        success: function (oData) {
                            var aItems01 = oData.results;
                            console.log("aItems01:", aItems01);
                            console.log(aItems01[0].QuantityInGE);

                            var Clone_Quantity_to_Post_Input_Float = parseFloat(aItems01[0].QuantityInGE);

                            var GatePendingQty_Float = Clone_Quantity_to_Post_Input_Float + Quantity_to_Post_Input_Float;


                            if (parseFloat(Quantity_to_Post_Input_Float) > parseFloat(GatePendingQty_Float)) {
                                oEvent.getSource().getParent().getCells()[9].setValue(Clone_Quantity_to_Post_Input_Float);
                                oEvent.getSource().getParent().getCells()[9].setValueState(sap.ui.core.ValueState.Error);
                                console.log("If Condition 01");
                                that.getView().byId("id_update_button").setEnabled(false);
                            } else {
                                oEvent.getSource().getParent().getCells()[9].setValueState(sap.ui.core.ValueState.None);
                                console.log("If COndition 03")
                                that.getView().byId("id_update_button").setEnabled(true);
                            }

                        },
                        error: function (oError) {
                            console.error("Error reading data: ", oError);
                            reject(oError); // Reject with the error
                        }
                    });


                }
            },






            OnUpdate: async function () {

                let GateEntryNo = this.getView().byId("id_gateentrychange_h").getValue();
                let SAP_UUID_H = this.getView().byId("id_sapuuid_so_h").getValue();
                let CustomerReturnType = this.getView().byId("id_cust_ret_change_type_h").getValue();
                let PlantCode = this.getView().byId("id_sr_change_plant_h").getValue();
                let PlantName = this.getView().byId("id_sr_change_plant_name_h").getValue();
                let CustomerCode = this.getView().byId("id_sr_change_cust_code_h").getValue();
                let CustomerName = this.getView().byId("id_sr_change_cust_name_h").getValue();
                let GateEntryDate = this.getView().byId("id_sr_change_gate_date").getValue();
                let VehicleType = this.getView().byId("id_sr_change_vehicle_type_h").getValue();
                let VehicleNo = this.getView().byId("id_sr_change_vehno_h").getValue();
                let NoOfPackages = this.getView().byId("id_sr_change_no_of_package_h").getValue();
                let Transporter = this.getView().byId("id_sr_change_transporter_h").getValue();
                let TransporterMode = this.getView().byId("id_sr_change_transporter_mode_h").getValue();
                let GrossWeight = this.getView().byId("id_sr_change_gross_wt_h").getValue();
                let WeightTimeDate = this.getView().byId("id_sr_change_wt_dt_time_h").getValue();
                let Remark = this.getView().byId("id_sr_change_remark_h").getValue();

                console.log(GateEntryNo);
                console.log(SAP_UUID_H);
                console.log(CustomerReturnType);
                console.log(PlantCode);
                console.log(PlantName);
                console.log(CustomerCode);
                console.log(CustomerName);
                console.log(GateEntryDate);
                console.log(VehicleType);
                console.log(VehicleNo);
                console.log(NoOfPackages);
                console.log(Transporter);
                console.log(TransporterMode);
                console.log(GrossWeight);
                console.log(WeightTimeDate);
                console.log(Remark);




                if (NoOfPackages !== "" && VehicleNo !== "" && Transporter !== "" && GrossWeight !== "") {
                    this.getView().byId("id_sr_change_no_of_package_h").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("id_sr_change_no_of_package_h").setValueStateText("");

                    this.getView().byId("id_sr_change_vehno_h").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("id_sr_change_vehno_h").setValueStateText("");

                    this.getView().byId("id_sr_change_transporter_h").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("id_sr_change_transporter_h").setValueStateText("");

                    this.getView().byId("id_sr_change_gross_wt_h").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("id_sr_change_gross_wt_h").setValueStateText("");


                    // ---------- Start Item Level

                    var Table_Id = this.getView().byId("salesreturnchange_table_id");
                    var Table_Length = Table_Id.getRows().length;
                    var that = this;
                    for (var i = 0; i < Table_Length; i++) {
                        var oRow = Table_Id.getRows()[i];
                        var oBindingContext = oRow.mAggregations;

                        if (oBindingContext) {
                            var Gate_Quantity_To_Post = oBindingContext.cells[9].mProperties.value;
                            var SAP_UUID_I = oBindingContext.cells[10].mProperties.value;
                            var Delete_Status01 = oRow.getCells()[0].getVisible();
                            if (SAP_UUID_I === '') {
                                break;
                            }

                            if (Delete_Status01 === true) {
                                var Delete_Status = "deleted";
                            }
                            else if (Delete_Status01 === false) {
                                var Delete_Status = "";
                            }
                            var itemData = {
                                QuantityInGE: Gate_Quantity_To_Post,
                                ItemsStatus: Delete_Status,
                                Status: "created",
                            };

                            console.log("SAP_UUID_I:", SAP_UUID_I)
                            console.log("itemData:", itemData);


                            var oModel_041 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS");
                            oModel_041.setHeaders({
                                "X-Requested-With": "X",
                                "Content-Type": "application/json"
                            });

                            oModel_041.update("/YY1_ITEM_ZINWARD_HEAD(guid'" + SAP_UUID_I + "')", itemData, {
                                success: function (data) {
                                    console.log("Item Updated:", data);
                                    // MessageBox.show("Sales Return "+GateEntryNo+" Updated");
                                },
                                error: function (error) {
                                    console.error("Error updating item:", error);
                                }
                            });

                        }
                    }


                    var oEntry1 = {
                        NoOfPackages: NoOfPackages,
                        VehicleNo: VehicleNo,
                        Transporter: Transporter,
                        GrossWeight: GrossWeight,
                        Status: "created",
                        Remarks :Remark
                    };

                    var that = this;

                    var oModel05 = that.getView().getModel("YY1_ZINWARD_HEAD_CDS");
                    oModel05.setHeaders({
                        "X-Requested-With": "X",
                        "Content-Type": "application/json"
                    });

                    oModel05.update("/YY1_ZINWARD_HEAD(guid'" + SAP_UUID_H + "')", oEntry1, {
                        success: function (data) {
                            console.log("Header Updated:", data);
                            oModel05.refresh(true);
                            MessageBox.success("Sales Return Document No " + GateEntryNo + " Updated Successfully", {
                                title: "Change Sales Return",
                                id: "messageBoxId1",
                                contentWidth: "100px",
                            });
                            oModel05.refresh(true);
                            var oJSONModel = new sap.ui.model.json.JSONModel({
                                data: {}
                            });


                            that.getView().setModel(oJSONModel, "JModel");

                            that.getView().byId("id_update_button").setEnabled(false);
                            that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);

                            that.getView().byId("id_gateentrychange_h").setValue("");
                            that.getView().byId("id_sapuuid_so_h").setValue("");
                            that.getView().byId("id_cust_ret_change_type_h").setValue("");
                            that.getView().byId("sales_return_change_Document_H").setValue("");
                            that.getView().byId("id_sr_change_plant_h").setValue("");
                            that.getView().byId("id_sr_change_plant_name_h").setValue("");
                            that.getView().byId("id_sr_change_cust_code_h").setValue("");
                            that.getView().byId("id_sr_change_cust_name_h").setValue("");
                            that.getView().byId("id_sr_change_gate_date").setValue("");
                            that.getView().byId("id_sr_change_vehicle_type_h").setValue("");
                            that.getView().byId("id_sr_change_vehno_h").setValue("");
                            that.getView().byId("id_sr_change_no_of_package_h").setValue("");
                            that.getView().byId("id_sr_change_transporter_h").setValue("");
                            that.getView().byId("id_sr_change_transporter_mode_h").setValue("");
                            that.getView().byId("id_sr_change_gross_wt_h").setValue("");
                            that.getView().byId("id_sr_change_wt_dt_time_h").setValue("");
                            that.getView().byId("id_sr_change_remark_h").setValue("");
                        },
                        error: function (error) {
                            console.error("Error updating header:", error);
                            MessageToast.show(" " + GateEntryNo + " Not Updated Successfully")
                        }
                    });

                    // ---------- End Item Level


                }


                else {

                    if (NoOfPackages === "") {
                        this.getView().byId("id_sr_change_no_of_package_h").setValueState(sap.ui.core.ValueState.Error);
                        this.getView().byId("id_sr_change_no_of_package_h").setValueStateText("Please Enter No of packages");
                    } else {
                        this.getView().byId("id_sr_change_no_of_package_h").setValueState(sap.ui.core.ValueState.None);
                        this.getView().byId("id_sr_change_no_of_package_h").setValueStateText("");
                    }
                    {
                        if (VehicleNo === "") {
                            this.getView().byId("id_sr_change_vehno_h").setValueState(sap.ui.core.ValueState.Error);
                            this.getView().byId("id_sr_change_vehno_h").setValueStateText("Please Enter Vehicle NO");
                        } else {
                            this.getView().byId("id_sr_change_vehno_h").setValueState(sap.ui.core.ValueState.None);
                            this.getView().byId("id_sr_change_vehno_h").setValueStateText("");
                        }
                    }
                    {
                        if (Transporter === "") {
                            this.getView().byId("id_sr_change_transporter_h").setValueState(sap.ui.core.ValueState.Error);
                            this.getView().byId("id_sr_change_transporter_h").setValueStateText("Please Enter Transporter No");
                        } else {
                            this.getView().byId("id_sr_change_transporter_h").setValueState(sap.ui.core.ValueState.None);
                            this.getView().byId("id_sr_change_transporter_h").setValueStateText("");
                        }
                    }


                    {
                        if (Gross_Weight === "") {
                            this.getView().byId("id_sr_change_gross_wt_h").setValueState(sap.ui.core.ValueState.Error);
                            this.getView().byId("id_sr_change_gross_wt_h").setValueStateText("Please Enter Gross Weight ");
                        } else {
                            this.getView().byId("id_sr_change_gross_wt_h").setValueState(sap.ui.core.ValueState.None);
                            this.getView().byId("id_sr_change_gross_wt_h").setValueStateText("");
                        }
                    }
                }



            },






            OnDeleteEntireDocument: function () {

                let Sales_Return_Document = this.getView().byId("id_gateentrychange_h").getValue();
                let SAP_UUID_H = this.getView().byId("id_sapuuid_so_h").getValue();

                // ---------- Start Item Level

                var Table_Id = this.getView().byId("salesreturnchange_table_id");
                var Table_Length = Table_Id.getRows().length;

                for (var i = 0; i < Table_Length; i++) {
                    var oRow = Table_Id.getRows()[i];
                    var oBindingContext = oRow.mAggregations;

                    if (oBindingContext) {
                        var Gate_Quantity_To_Post = oBindingContext.cells[9].mProperties.value;
                        var SAP_UUID_I = oBindingContext.cells[10].mProperties.value;
                        var Delete_Status01 = oRow.getCells()[0].getVisible();

                        if (SAP_UUID_I === '') {
                            break;
                        }
                        if (Gate_Quantity_To_Post !== "") {
                            var Delete_Status = "deleted";

                            var itemData = {
                                Status: Delete_Status,
                                ItemsStatus: Delete_Status
                            };

                            var oModel_04 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS");
                            oModel_04.setHeaders({
                                "X-Requested-With": "X",
                                "Content-Type": "application/json"
                            });

                            oModel_04.update("/YY1_ITEM_ZINWARD_HEAD(guid'" + SAP_UUID_I + "')", itemData, {
                                success: function (data) {
                                    console.log("Item Updated:", data);
                                },
                                error: function (error) {
                                    console.error("Error updating item:", error);
                                }
                            });
                        }
                    }
                }

                var oEntry1 = {
                    Status: "deleted",
                };

                var that = this;
                var oModel05 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS");
                oModel05.setHeaders({
                    "X-Requested-With": "X",
                    "Content-Type": "application/json"
                });

                oModel05.update("/YY1_ZINWARD_HEAD(guid'" + SAP_UUID_H + "')", oEntry1, {
                    success: function (data) {
                        console.log("Header Updated:", data);
                        MessageToast.show(" " + Sales_Return_Document + " Deleted")
                        oModel05.refresh(true);
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

                        that.getView().byId("id_gateentrychange_h").setValue("");
                        that.getView().byId("id_sapuuid_so_h").setValue("");
                        that.getView().byId("id_cust_ret_change_type_h").setValue("");
                        that.getView().byId("sales_return_change_Document_H").setValue("");
                        that.getView().byId("id_sr_change_plant_h").setValue("");
                        that.getView().byId("id_sr_change_plant_name_h").setValue("");
                        that.getView().byId("id_sr_change_cust_code_h").setValue("");
                        that.getView().byId("id_sr_change_cust_name_h").setValue("");
                        that.getView().byId("id_sr_change_gate_date").setValue("");
                        that.getView().byId("id_sr_change_vehicle_type_h").setValue("");
                        that.getView().byId("id_sr_change_vehno_h").setValue("");
                        that.getView().byId("id_sr_change_no_of_package_h").setValue("");
                        that.getView().byId("id_sr_change_transporter_h").setValue("");
                        that.getView().byId("id_sr_change_transporter_mode_h").setValue("");
                        that.getView().byId("id_sr_change_gross_wt_h").setValue("");
                        that.getView().byId("id_sr_change_wt_dt_time_h").setValue("");
                        that.getView().byId("id_sr_change_remark_h").setValue("");
                    },
                    error: function (error) {
                        console.error("Error updating header:", error);
                        MessageToast.show(" " + Sales_Return_Document + " Not Deleted")
                    }
                });

                // ---------- End Item Level

            },




            OnUnDeleteEntireDocument: function () {


                let Sales_Return_Document = this.getView().byId("id_gateentrychange_h").getValue();
                let SAP_UUID_H = this.getView().byId("id_sapuuid_so_h").getValue();

                // ---------- Start Item Level

                var Table_Id = this.getView().byId("salesreturnchange_table_id");
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

                            var oModel_04 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS");
                            oModel_04.setHeaders({
                                "X-Requested-With": "X",
                                "Content-Type": "application/json"
                            });

                            oModel_04.update("/YY1_ITEM_ZINWARD_HEAD(guid'" + SAP_UUID_I + "')", itemData, {
                                success: function (data) {
                                    console.log("Item Updated:", data);
                                },
                                error: function (error) {
                                    console.error("Error updating item:", error);
                                }
                            });
                        }
                    }
                }

                var oEntry1 = {
                    Status: "created",
                };

                var that = this;

                var oModel05 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS");
                oModel05.setHeaders({
                    "X-Requested-With": "X",
                    "Content-Type": "application/json"
                });

                oModel05.update("/YY1_ZINWARD_HEAD(guid'" + SAP_UUID_H + "')", oEntry1, {
                    success: function (data) {
                        console.log("Header Updated:", data);

                        MessageToast.show(" " + Sales_Return_Document + " Retrived")
                        oModel05.refresh(true);
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

                        that.getView().byId("id_gateentrychange_h").setValue("");

                        that.getView().byId("id_sapuuid_so_h").setValue("");
                        that.getView().byId("id_cust_ret_change_type_h").setValue("");
                        that.getView().byId("sales_return_change_Document_H").setValue("");
                        that.getView().byId("id_sr_change_plant_h").setValue("");
                        that.getView().byId("id_sr_change_plant_name_h").setValue("");
                        that.getView().byId("id_sr_change_cust_code_h").setValue("");
                        that.getView().byId("id_sr_change_cust_name_h").setValue("");
                        that.getView().byId("id_sr_change_gate_date").setValue("");
                        that.getView().byId("id_sr_change_vehicle_type_h").setValue("");
                        that.getView().byId("id_sr_change_vehno_h").setValue("");
                        that.getView().byId("id_sr_change_no_of_package_h").setValue("");
                        that.getView().byId("id_sr_change_transporter_h").setValue("");
                        that.getView().byId("id_sr_change_transporter_mode_h").setValue("");
                        that.getView().byId("id_sr_change_gross_wt_h").setValue("");
                        that.getView().byId("id_sr_change_wt_dt_time_h").setValue("");
                        that.getView().byId("id_sr_change_remark_h").setValue("");

                    },
                    error: function (error) {
                        console.error("Error updating header:", error);

                        MessageToast.show(" " + Sales_Return_Document + " Not Retrived")
                    }
                });

                // ---------- End Item Level
            },



            ONCancel: function () {
                this.SoChangeDocNohead.close();
                this.getView().byId("id_gateentrychange_h").setValue("");
                this.getView().byId("id_sapuuid_so_h").setValue("");
                this.getView().byId("id_cust_ret_change_type_h").setValue("");
                this.getView().byId("sales_return_change_Document_H").setValue("");
                this.getView().byId("id_sr_change_plant_h").setValue("");
                this.getView().byId("id_sr_change_plant_name_h").setValue("");
                this.getView().byId("id_sr_change_cust_code_h").setValue("");
                this.getView().byId("id_sr_change_cust_name_h").setValue("");
                this.getView().byId("id_sr_change_gate_date").setValue("");
                this.getView().byId("id_sr_change_vehicle_type_h").setValue("");
                this.getView().byId("id_sr_change_vehno_h").setValue("");
                this.getView().byId("id_sr_change_no_of_package_h").setValue("");
                this.getView().byId("id_sr_change_transporter_h").setValue("");
                this.getView().byId("id_sr_change_transporter_mode_h").setValue("");
                this.getView().byId("id_sr_change_gross_wt_h").setValue("");
                this.getView().byId("id_sr_change_wt_dt_time_h").setValue("");
                this.getView().byId("id_sr_change_remark_h").setValue("");



var oData={};

                                    var oJSONModel = new sap.ui.model.json.JSONModel({
                                        data :{}
                                    });
                                    console.log("data:",oData.results);
                                    this.getView().setModel(oJSONModel, "JModel");

                                    oJSONModel.refresh();

             
            },







        });
    });
