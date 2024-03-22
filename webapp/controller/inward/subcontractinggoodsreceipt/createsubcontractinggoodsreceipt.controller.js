sap.ui.define([
    // "sap/ui/core/mvc/Controller",
    "gatepassapp/controller/inward/subcontractinggoodsreceipt/editcontroller",
    "sap/ui/Device",
    "sap/m/SearchField",
    "sap/ui/model/type/String",
    "sap/ui/table/Column",
    "sap/m/Column",
    "sap/m/Text",
    'sap/m/Label',
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/m/MessageBox",
    "sap/m/MessageToast"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,  Fragment,  Device, SearchField, TypeString, UIColumn, MColumn, Text, Label, JSONModel, Filter, FilterOperator, MessageBox,MessageToast) {
        "use strict";

        return Controller.extend("gatepassapp.controller.inward.subcontractinggoodsreceipt.createsubcontractinggoodsreceipt", {
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
                var JSonModel = new sap.ui.model.json.JSONModel({
                    Samples: [
                        { "Status": "Approved", "StatusID": "1" },
                        { "Status": "Rejected", "StatusID": "2" },
                        { "Status": "Pending", "StatusID": "3" },


                    ]

                });
                this.getView().setModel(JSonModel, "SModel");

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
                this.getView().byId("id_gatepassdate").setValue(dd + '-' + mm + '-' + yyyy);
                this.getView().byId("id_invoociedate").setValue(dd + '-' + mm + '-' + yyyy);
                this.getView().byId("id_lrdate").setValue(dd + '-' + mm + '-' + yyyy);

                    this.JSonModelMadDatas = new sap.ui.model.json.JSONModel({
                        Datas : []
                    });
                    this.getView().setModel(this.JSonModelMadDatas, "JSonModelMadDatas");

                    // ---------------For Multi Input--------------------------------------
                    var oMultiInput;
                    this.oMultiInputEdit;
                    oMultiInput = this.byId("Purchasing_Document_H");
                    oMultiInput.addValidator(this._onMultiInputValidate);
                    this._oMultiInput = oMultiInput;

                    try{
                        this.oMultiInputEdit = this.byId("Edit_Purchasing_Document_H");
                        this.oMultiInputEdit.addValidator(this._onMultiInputValidate);
                        this._oMultiInputEdit = this.oMultiInputEdit;
                    }catch (err){
                        console.log(err)
                    }
                    this.oProductsModel = this.getView().getModel("YY1_ZGE_INWARD_PO_HEAD_CDS");
                    this.getView().setModel(this.oProductsModel);

                    this.InitialDelDocNo = [];

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
                                if(item.AppId === "GE21"){
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


                          // --------------------------

            onValueHelpRequested: function() {
                this._oBasicSearchField = new sap.m.SearchField();
                this.loadFragment({
                    name: "gatepassapp.view..inward.subcontractinggoodsreceipt.fragment.ValueHelpDialogFilterbar"
                }).then(function(oDialog) {
                    var oFilterBar = oDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
                    this._oVHD = oDialog;
    
                    this.getView().addDependent(oDialog);
    
                    // Set key fields for filtering in the Define Conditions Tab
                    oDialog.setRangeKeyFields([{
                        label: "PurchaseOrder",
                        key: "PurchaseOrder",
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
                                path: "YY1_ZGE_INWARD_PO_HEAD_CDS>/YY1_ZGE_INWARD_PO_HEAD",
                                events: {
                                    dataReceived: function() {
                                        oDialog.update();
                                    }
                                }
                            });
                            oColumnProductCode = new sap.ui.table.Column({label: new sap.m.Label({text: "Purchase Order No"}), template: new sap.m.Text({wrapping: false, text: "{YY1_ZGE_INWARD_PO_HEAD_CDS>PurchaseOrder}"})});
                            oColumnProductCode.data({
                                fieldName: "PurchaseOrder"
                            });
                            oColumnProductName = new sap.ui.table.Column({label: new sap.m.Label({text: "Customer"}), template: new sap.m.Text({wrapping: false, text: "{YY1_ZGE_INWARD_PO_HEAD_CDS>SupplierName}"})});
                            oColumnProductName.data({
                                fieldName: "SupplierName"
                            });
                            oTable.addColumn(oColumnProductCode);
                            oTable.addColumn(oColumnProductName);
                        }
    
                        // For Mobile the default table is sap.m.Table
                        if (oTable.bindItems) {
                            // Bind items to the ODataModel and add columns
                            oTable.bindAggregation("items", {
                                path: "YY1_ZGE_INWARD_PO_HEAD_CDS>/YY1_ZGE_INWARD_PO_HEAD",
                                template: new sap.m.ColumnListItem({
                                    cells: [new sap.m.Label({text: "{YY1_ZGE_INWARD_PO_HEAD_CDS>PurchaseOrder}"}), new sap.m.Label({text: "{YY1_ZGE_INWARD_PO_HEAD_CDS>SupplierName}"})]
                                }),
                                events: {
                                    dataReceived: function() {
                                        oDialog.update();''
                                    }
                                }
                            });
                            oTable.addColumn(new sap.m.Column({header: new sap.m.Label({text: "Purchase Order No"})}));
                            oTable.addColumn(new sap.m.Column({header: new sap.m.Label({text: "Supplier Name"})}));
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

                var oMultiInput = this.getView().byId("Purchasing_Document_H");
                // add checkbox validator
                oMultiInput.addValidator(function(args){
                    if (args.suggestionObject){
                        var key = args.suggestionObject.getCells()[0].getText();
                        var text = args.suggestionObject.getCells()[1].getText();
                        // var text = key + "(" + args.suggestionObject.getCells()[1].getText() + ")";
    
                        return new sap.m.Token({key: key, text: key});
                    }
                    return null;
                });

                var aTokens = this.getView().byId("Purchasing_Document_H").getTokens();
                    console.log("aTokens:",aTokens);
                    var aMultiInputValues = aTokens.map(function (oToken) {
                        return oToken.getKey();
                    });
                        if(aTokens.length > 0){
                            var aFilters1 = aMultiInputValues.map(function (sValue) {
                                return new sap.ui.model.Filter("PurchaseOrder", sap.ui.model.FilterOperator.EQ, sValue);
                            });
                          
                        }else{
                            var aFilters1 = new sap.ui.model.Filter("PurchaseOrder", sap.ui.model.FilterOperator.EQ, "");
                        }

                // var oFilter = new sap.ui.model.Filter("PurchaseOrder", sap.ui.model.FilterOperator.EQ, GetKey);
                var oTable = this.getView().byId("Table_Id");
                var oModel = this.getView().getModel("YY1_ZGE_INWARD_PO_ITEM_CDS"); // Replace with your actual OData model name
                var oFilters = [aFilters1];
                var that = this;
                oModel.read("/YY1_ZGE_INWARD_PO_ITEM", {
                    filters: oFilters,
                    success: function (oData) {
                        var aItems = oData.results; // The array of read items
                        var oTableModel = new sap.ui.model.json.JSONModel();
                        oTableModel.setData({ items: aItems });
                        oModel.refresh(true);
                        // Set the model on the table and bind the rows
                        oTable.setModel(oTableModel);
                        oTable.bindRows("/items");
                        that.getView().byId("Table_Id").setVisible(true);
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
                        new sap.ui.model.Filter({ path: "PurchaseOrder", operator: sap.ui.model.FilterOperator.Contains, value1: sSearchQuery }),
                        new sap.ui.model.Filter({ path: "SupplierName", operator: sap.ui.model.FilterOperator.Contains, value1: sSearchQuery })
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

            // -------------------------------------

            ontokenupdate:function(oEvent){
                sap.ui.core.BusyIndicator.show();
                try{
                    var sType = oEvent.getParameter("type");
                    let GetTokens = this.getView().byId("Purchasing_Document_H").getTokens();
                    let Arrauuu = [];
                    let DelTokens;

                    if (GetTokens && GetTokens.length) {
                        GetTokens.map(function (oContext) {
                            Arrauuu.push(oContext.getKey());
                            return;
                        });
                    }

                    if (sType === "removed") {
                        var sKey = oEvent.getParameter("removedTokens")[0].getKey();
                        let Arrauuu1 = Arrauuu.filter(function(item) {
                            return item !== sKey;
                        });
                            DelTokens = Arrauuu1;
                    }else{
                            DelTokens = Arrauuu;
                    }

                    if(DelTokens.length > 0){
                        var aFilters1 = DelTokens.map(function (sValue) {
                            return new sap.ui.model.Filter("PurchaseOrder", sap.ui.model.FilterOperator.EQ, sValue);
                        });
                    }else{
                        var aFilters1 = new sap.ui.model.Filter("PurchaseOrder", sap.ui.model.FilterOperator.EQ, "")
                    } 

                        var oTable = this.getView().byId("Table_Id");
                        var oModel = this.getView().getModel("YY1_ZGE_INWARD_PO_ITEM_CDS"); // Replace with your actual OData model name
                        var oFilters = [aFilters1];
                        var that = this;
                        oModel.read("/YY1_ZGE_INWARD_PO_ITEM", {
                            filters: oFilters,
                            success: function (oData) {
                                var aItems = oData.results; // The array of read items
                                var oTableModel = new sap.ui.model.json.JSONModel();
                                oTableModel.setData({ items: aItems });
                                oModel.refresh(true);
                                // Set the model on the table and bind the rows
                                oTable.setModel(oTableModel);
                                oTable.bindRows("/items");
                                that.getView().byId("Table_Id").setVisible(true);
                                sap.ui.core.BusyIndicator.hide();
                            },
                            error: function (oError) {
                                // Handle error
                                console.error("Error reading data: ", oError);
                                sap.ui.core.BusyIndicator.hide();
                            }
                        });
                    }
                catch(err){
                    console.log("err", err);
                    sap.ui.core.BusyIndicator.hide();
                }
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
                        var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE21');
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
                                console.log("aItems000:", aItems)
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
                let DocumentItemNo = oEvent.getSource().getParent().getCells()[0].getValue(); 
                let DocumentNo = oEvent.getSource().getParent().getCells()[1].getValue(); 
                let Order_Quantity = oEvent.getSource().getParent().getCells()[5].getValue(); 
                let Enter_Quantity = oEvent.getSource().getParent().getCells()[8].getValue(); 
                let Pending_Quantity = oEvent.getSource().getParent().getCells()[7].getValue();
                let Enter_Quantity_Float = parseFloat(Enter_Quantity.trim());
                let Order_Quantity_Float = parseFloat(Order_Quantity.trim());
                // let Pending_Quantity_Float = parseFloat(Pending_Quantity.trim());
                // console.log(Enter_Quantity_Float);
                // console.log(Pending_Quantity_Float)


                        var oFilter = new sap.ui.model.Filter("ItemNo", sap.ui.model.FilterOperator.EQ, DocumentItemNo);
                        var oFilter1 = new sap.ui.model.Filter("ReferenceDocument", sap.ui.model.FilterOperator.EQ, DocumentNo);
                        var oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'created');
                        var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE21');
                        var oFilter4 = new sap.ui.model.Filter({
                            filters: [
                                new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, 'created'),
                                new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, '')
                            ],
                            and: false
                        });
                        var that = this;
                        var oModel2 = that.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4];
    
                        let Pending_Quantity_Float = 0;
                
                        oModel2.read("/YY1_ITEM_ZGE_INWARD_GATEPASS", {
                            filters: oFilters,
                            success: function(oData) {
                                var aItems = oData.results;
                                for (var i = 0; i < aItems.length; i++) {
                                    Pending_Quantity_Float += parseFloat(aItems[i].QuantityInGE.trim());
                                }
                                console.log("Pending_Quantity_Float", Pending_Quantity_Float)
                                var FinalData = parseFloat(Order_Quantity_Float) - parseFloat(Pending_Quantity_Float);

                                if(FinalData !== "0" || FinalData !== 0 ){
                                    if(Enter_Quantity_Float > FinalData){
                                        oEvent.getSource().getParent().getCells()[8].setValueState(sap.ui.core.ValueState.Error);
                                        oEvent.getSource().getParent().getCells()[8].setValueStateText("Please Enter Valid Quantity");
                                        that.getView().byId("Final_Save_Button").setEnabled(true);
                                        oEvent.getSource().getParent().getCells()[7].setValue(FinalData);
                                        oEvent.getSource().getParent().getCells()[8].setValue(FinalData);
                                    }
                                    else if(Enter_Quantity_Float === "" ){
                                        oEvent.getSource().getParent().getCells()[8].setValue("");
                                        that.getView().byId("Final_Save_Button").setEnabled(true);
                                        oEvent.getSource().getParent().getCells()[7].setValue(FinalData);
                                    }
                                    else if (Enter_Quantity_Float <= FinalData ) {
                                        let FInalValue = parseFloat(FinalData) - parseFloat(Enter_Quantity_Float);
                                        oEvent.getSource().getParent().getCells()[7].setValue(FInalValue);
                                        oEvent.getSource().getParent().getCells()[8].setValueState(sap.ui.core.ValueState.None);
                                        that.getView().byId("Final_Save_Button").setEnabled(true);
                                    }
                                }
                            },
                            error: function(oError) {
                                console.error("Error reading data: ", oError);
                                oEvent.getSource().getParent().getCells()[7].setValue(Pending_Quantity_Float);
                                reject(oError); // Reject with the error
                            }
                        });

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
                        var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE21');
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

            // ------------- Formatter ----------------------
        OnFormatterSupplierName : function(value1){
            var that = this; // Store reference to 'this'
           if(value1 !== null){
            console.log("value1:", value1)

            return new Promise(function(resolve, reject) {
   
                var oModel0081 = that.getView().getModel("YY1_ZGE_INWARD_PO_HEAD_CDS");
                var oFilter = new sap.ui.model.Filter("PurchaseOrder", sap.ui.model.FilterOperator.EQ, value1);           
                var oFilters0112 = [oFilter];
       
                oModel0081.read("/YY1_ZGE_INWARD_PO_HEAD", {
                    filters: oFilters0112,
                    success: function(oData) {
                        var aItems = oData.results;
                        console.log(aItems)
                             resolve(aItems[0].Supplier); // Resolve with the data
                    },
                    error: function(oError) {
                        console.error("Error reading data: ", oError);
                        reject(oError); // Reject with the error
                    }
                });
            });
            }
           },

        OnFormatterSupplierName : function(value1){
            var that = this; // Store reference to 'this'
            if(value1 !== null){
            console.log("value1:", value1)

            return new Promise(function(resolve, reject) {
   
                var oModel0081 = that.getView().getModel("YY1_ZGE_INWARD_PO_HEAD_CDS");
                var oFilter = new sap.ui.model.Filter("PurchaseOrder", sap.ui.model.FilterOperator.EQ, value1);           
                var oFilters0112 = [oFilter];
       
                oModel0081.read("/YY1_ZGE_INWARD_PO_HEAD", {
                    filters: oFilters0112,
                    success: function(oData) {
                        var aItems = oData.results;
                        console.log(aItems)
                             resolve(aItems[0].SupplierName); // Resolve with the data
                    },
                    error: function(oError) {
                        console.error("Error reading data: ", oError);
                        reject(oError); // Reject with the error
                    }
                });
            });
            }
           },

           OnCancel:function(){
            sap.ui.core.BusyIndicator.show();
            var oTable = this.getView().byId("Table_Id");
            var oTableModel = new sap.ui.model.json.JSONModel();
            oTableModel.setData({ items: "" });
            oTable.setModel(oTableModel);
            oTable.bindRows("/items");
        
            var multiInput = that.getView().byId("Purchasing_Document_H");
            multiInput.removeAllTokens();
            that.getView().byId("id_ewaybill").setValue("");
            that.getView().byId("id_vehicleno").setValue("");
            that.getView().byId("id_vehicletype").setSelectedKey("1");
            that.getView().byId("id_transporter").setValue("");
            that.getView().byId("id_transportermode").setSelectedItem("ROAD");
            that.getView().byId("id_lrno").setValue("");
            that.getView().byId("id_lrdate").setValue("");
            that.getView().byId("id_grosswt").setValue("");
            that.getView().byId("id_noofpackages").setValue("");
            that.getView().byId("id_remark").setValue("");
            that.getView().byId("id_invocieno").setValue("");
            that.getView().byId("id_invoociedate").setValue("");
            that.getView().byId("Final_Save_Button").setEnabled(true);
            sap.ui.core.BusyIndicator.hide();

        },



            OnSubmit: function (oEvent) {
                sap.ui.core.BusyIndicator.show();

                let Tokensss = this.getView().byId("Purchasing_Document_H").getTokens();
                console.log("Tokensss", Tokensss.length);

                if(Tokensss.length > 0){
    
                    this.getView().setModel();
    
                    var that = this; // Preserve the reference to the controller
                    var oFilter11 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, "GE21");
                    var CountoModel = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                    var oFilters11 = [oFilter11];
                    if (CountoModel) {
                        CountoModel.read("/YY1_ZGE_INWARD_GATEPASS", {
                            filters: oFilters11,
                            success: async function (oData) {
                                var aItems = oData.results; // The array of read items
                                console.log(aItems.length);
                                let Count = Number(aItems.length) + 1; // This should be a number, no need to use Number()
                                let CountLen = Count.toString(); // Convert to string to get its length
                                let AddData = "40000";
                                let Data = 5 - CountLen.length;
                                let CountArray = "";
                                for (let i = 0; i < Data; i++) {
                                    CountArray += "0";
                                }
                                console.log(AddData + CountArray + Count); // Concatenate strings correctly
                                let LastId = AddData + CountArray + Count;
        
                                await that.ToSaveFunc(LastId);
                                console.log("Success");
                                sap.m.MessageBox.success("Gate Entry No " + LastId + " Generated", {
                                    title: "Subcontracting Goods Receipt",
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
                        console.error("YY1_ZGE_INWARD_GATEPASS model is undefined.");
                    }
    
                }else{
                    sap.m.MessageToast.show("Please enter/select purchase document");
                    sap.ui.core.BusyIndicator.hide();
                }
            },

            ToSaveFunc:function(GetId){

                return new Promise((resolve, reject) => {

                    let getArray = [
                        "Purchasing_Document_H",
                        "id_ewaybill",
                        "id_gatepassdate",
                        "id_vehicleno",
                        "id_vehicletype",
                        "id_invocieno",
                        "id_invoociedate",
                        "id_transporter",
                        "id_transportermode",
                        "id_lrno",
                        "id_lrdate",
                        "id_grosswt",
                        "id_noofpackages",
                        "id_remark"
                    ];

                    let RequiredMan = '';
                    let ValidationArrayNonDatas = [];
                    for(let kk=0; kk < getArray.length; kk++){
                        let GetThisId = this.getView().byId(getArray[kk]);
                        if(getArray[kk] === "Purchasing_Document_H"){
                            let GetTokens = this.getView().byId("Purchasing_Document_H").getTokens();
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

                    let GetTokens = this.getView().byId("Purchasing_Document_H").getTokens();
                    let Delivery_Document_Array = [];

                    if (GetTokens && GetTokens.length) {
                        GetTokens.map(function (oContext) {
                            Delivery_Document_Array.push(oContext.getKey());
                            return;
                        });
                    }

                    let gateentryno = GetId;
                    let Gate_Entry_Date = this.getView().byId("id_gatepassdate").getValue();
                        let DateArr = Gate_Entry_Date.split("-")
                        Gate_Entry_Date = DateArr[2] + '-' + DateArr[1] + '-' + DateArr[0];

                    let InvoiceDate = this.getView().byId("id_invoociedate").getValue();
                    if(InvoiceDate.trim() === ""){
                        InvoiceDate = null;
                    }else{
                        let DateArr1 = InvoiceDate.split("-")
                        InvoiceDate = new Date(DateArr1[2] + '-' + DateArr1[1] + '-' + DateArr1[0]);
                    }

                    let LRDate = this.getView().byId("id_lrdate").getValue();
                    if(LRDate.trim() === ""){
                        LRDate = null;
                    }else{
                        let DateArr2 = LRDate.split("-")
                        LRDate = new Date(DateArr2[2] + '-' + DateArr2[1] + '-' + DateArr2[0]);
                    }

                    let EWayBill = this.getView().byId("id_ewaybill").getValue();
                    let Vehicle_No = this.getView().byId("id_vehicleno").getValue();
                    let Vehicle_Type = this.getView().byId("id_vehicletype").getSelectedItem().getText();
                    let Transporter = this.getView().byId("id_transporter").getValue();
                    let Transporter_Mode = this.getView().byId("id_transportermode").getSelectedItem().getText();
                    let Tare_Wt = "";
                    let Net_Wt  = "";
                    let LRNo = this.getView().byId("id_lrno").getValue();
                    // let LRDate = this.getView().byId("id_lrdate").getValue();
                    let Gross_Weight = this.getView().byId("id_grosswt").getValue();
                    let NoOfPackages = this.getView().byId("id_noofpackages").getValue();
                    let Remarks = this.getView().byId("id_remark").getValue();
                    let InvoiceNo = this.getView().byId("id_invocieno").getValue();
                    // let InvoiceDate = this.getView().byId("id_invoociedate").getValue();
      
                    console.log("gateentryno:",gateentryno);
                    console.log("Gate_Entry_Date:",Gate_Entry_Date);
                    console.log("EWayBill:",EWayBill);
                    console.log("Vehicle_No:",Vehicle_No);
                    console.log("Vehicle_Type:",Vehicle_Type);
                    console.log("Transporter:",Transporter);
                    console.log("Transporter_Mode:",Transporter_Mode);
                    console.log("Tare_Wt:",Tare_Wt);
                    console.log("Net_Wt:",Net_Wt);
                    console.log("LRNo:",LRNo);
                    console.log("LRDate:",LRDate);
                    console.log("Gross_Weight:",Gross_Weight);
                    console.log("NoOfPackages:",NoOfPackages);
                    console.log("Remarks:",Remarks);
                    console.log("InvoiceNo:",InvoiceNo);
                    console.log("InvoiceDate:",InvoiceDate);
                                

                    console.log("ValidationArrayNonDatas:", ValidationArrayNonDatas)
                    console.log("ValidationArrayNonDatasLength:", ValidationArrayNonDatas.length)

            if (ValidationArrayNonDatas.length === 0 || ValidationArrayNonDatas.length === "0" ){
                
              
                var Table_Id = this.getView().byId("Table_Id"); // Assuming 'persoTable' is the ID of the Grid Table
                var oModel = Table_Id.getModel();
                var Table_Length = Table_Id.getRows().length;
            
                var headerdata = [];
                var itemData = [];

                for (let kk=0; kk < Delivery_Document_Array.length; kk++){
                    let Delivery_Document = Delivery_Document_Array[kk];

                    headerdata.push({

                        Id:gateentryno,
                        ReferenceDocument:Delivery_Document,
                        ReferenceDocumentType:"",
                        PlantCode:"",
                        PlantName:"",
                        SupplierCode:"",
                        SupplierName:"",
                        SupplierType:"",
                        CustomerCode:"",
                        CustomerName:"",
                        CustomerType:"",
                        Status:"created",
                        ApproveStatus:"",
                        PurchaseOrderNo:"",
                        DeliveryDocumentNo:"",
                        SalesReturnNo:"",
                        CustomerReturnNo:"",
                        PostingDate:this.CurrentDate01,

                    });

                }
              
                for (var i = 0; i < Table_Length; i++) {
            
                    // var Customer_Document_No01 = Table_Id.getRows()[1].getCells()[1].getValue();
                    let Open_Quantity00 = Table_Id.getRows()[i].getCells()[7].getValue();
                    if(Open_Quantity00 !== "0" || Open_Quantity00 !== 0 ){
                        var Customer_Document_No = Table_Id.getRows()[i].getCells()[1].getValue();
                        var Product_Code = Table_Id.getRows()[i].getCells()[2].getValue();
                        var Product_Name = Table_Id.getRows()[i].getCells()[3].getValue();
                        var Product_Type = Table_Id.getRows()[i].getCells()[4].getValue();
                        var Order_Quantity = Table_Id.getRows()[i].getCells()[5].getValue();
                        var UOM = Table_Id.getRows()[i].getCells()[6].getValue();
                        var Open_Quantity = Table_Id.getRows()[i].getCells()[7].getValue();
                        var PlantCode  = Table_Id.getRows()[i].getCells()[9].getValue();
                        var PlantName  = Table_Id.getRows()[i].getCells()[10].getValue();
                        var SupplierCode  = Table_Id.getRows()[i].getCells()[11].getValue();
                        var SupplierName  = Table_Id.getRows()[i].getCells()[12].getValue();
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
                            ReferenceDocument:Customer_Document_No,
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
                            PlantCode:PlantCode,
                            PlantName:PlantName,
                            SupplierCode:SupplierCode,
                            SupplierName:SupplierName,
                            SupplierType:"",
                            CustomerCode:"",
                            CustomerName:"",
                            CustomerType:"",
                            EWayBill:EWayBill,
                            GateEntryDate:new Date(Gate_Entry_Date),
                            VehicleType:Vehicle_Type,
                            VehicleNo:Vehicle_No,
                            InvoiceNo:InvoiceNo,
                            InvoiceDate:InvoiceDate,
                            Transporter:Transporter,
                            TransporterMode:Transporter_Mode,
                            LRNo:LRNo,
                            LRDate:LRDate,
                            GrossWeight:Gross_Weight,
                            TareWeight:"",
                            NetWeight:"",
                            WeightDateTime:"",
                            NoOfPackages:NoOfPackages,
                            Remarks:Remarks,
                            Status:"created",
                            ItemsStatus:"created",
                            ApproveStatus:"",
                            PurchaseOrderNo:"",
                            DeliveryDocumentNo:"",
                            SalesReturnNo:"",
                            ScreenCode:"GE21",
                            PostingDate:this.CurrentDate01,
                            ReferenceDocumentYear:"",

                        });
                    }
                
                }
                console.log(headerdata);
                console.log(itemData);
            
                var oEntry = {};

                oEntry.Id = gateentryno;
                oEntry.Status = "created";
                oEntry.ScreenCode = "GE21";
                oEntry.ApproveStatus = "";
                oEntry.VehicleNo = Vehicle_No;
                oEntry.VehicleType = Vehicle_Type;
                oEntry.Transporter = Transporter;
                oEntry.TransporterMode = Transporter_Mode;
                oEntry.GateEntryDate = new Date(Gate_Entry_Date);
                oEntry.GrossWeight = Gross_Weight;
                oEntry.NetWeight = "";
                oEntry.TareWeight = "";
                oEntry.Remarks =Remarks;
                oEntry.EWayBill = EWayBill;
                oEntry.InvoiceNo = InvoiceNo;
                oEntry.InvoiceDate = InvoiceDate;
                oEntry.LRNo = LRNo;
                oEntry.LRDate = LRDate;
                oEntry.NoOfPackages = NoOfPackages;

                oEntry.to_HEADER = headerdata
                oEntry.to_ITEM = itemData,
                                       
                console.log("oEntryoEntry:", oEntry);
                
                this.getView().setModel();
                                    
                var oModelGet = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                var that = this;
            
                oModelGet.create("/YY1_ZGE_INWARD_GATEPASS", oEntry, {
                success: function (oData, oResponse) {
                console.log(oData);
                console.log("saved")
                oModelGet.refresh(true);
                    sap.ui.core.BusyIndicator.hide();

                    var oTable = that.getView().byId("Table_Id");
                    var oTableModel = new sap.ui.model.json.JSONModel();
                    oTableModel.setData({ items: "" });
                    oTable.setModel(oTableModel);
                    oTable.bindRows("/items");
            
                    var multiInput = that.getView().byId("Purchasing_Document_H");
                    multiInput.removeAllTokens();
                    that.getView().byId("id_ewaybill").setValue("");
                    that.getView().byId("id_vehicleno").setValue("");
                    that.getView().byId("id_vehicletype").setSelectedKey("1");
                    that.getView().byId("id_transporter").setValue("");
                    that.getView().byId("id_transportermode").setSelectedItem("ROAD");
                    that.getView().byId("id_lrno").setValue("");
                    that.getView().byId("id_lrdate").setValue("");
                    that.getView().byId("id_grosswt").setValue("");
                    that.getView().byId("id_noofpackages").setValue("");
                    that.getView().byId("id_remark").setValue("");
                    that.getView().byId("id_invocieno").setValue("");
                    that.getView().byId("id_invoociedate").setValue("");
                    that.getView().byId("Final_Save_Button").setEnabled(true);

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
                sap.m.MessageToast.show("Please Enter Mandatory Fields...")
            }
            });

            },


//             //---- chaange General purchase---------

//             // -----Edit Page Open

//             OnEditGP: function () {
//                 if (!this._dialog_changeGeneralPurchaseDialog) {
//                     this._dialog_changeGeneralPurchaseDialog = sap.ui.xmlfragment(this.getView().getId("idegpfragment"), "gatepassapp.view.inward.subcontractinggoodsreceipt.fragment.EditGeneralPurchase", this);
//                     this.getView().addDependent(this._dialog_changeGeneralPurchaseDialog);
//                 }
//                 this._dialog_changeGeneralPurchaseDialog.open();

//             },

// // suggestion code

//             onEditPurchaseOrderSuggest: function (oEvent) {
             
//                 sap.ui.core.BusyIndicator.show();
//                 var oItem = oEvent.getParameter("selectedItem");
//                 var GetKey = oItem ? oItem.getKey() : "";
//                 var GetValue = oItem ? oItem.getText() : "";

//                 // Do something with key and text values
//                 console.log(oItem);
//                 console.log("Selected Key:", GetKey);
//                 console.log("Selected Text:", GetValue);




//                     var filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, GetValue);
//                     var model0 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS");
                    
//                     var that = this;

//                     model0.read("/YY1_ZINWARD_HEAD", {
//                         filters: [filter],
//                         success: function (ODat, oRespons) {
//                             var value11 = ODat.results[0];
//                             var SAPUIID = value11.SAP_UUID;
//                             var Status = value11.Status;
//                             console.log("value11", value11);
//                             that.getView().byId("idegpgenpurdoc").setValue(value11.ReferenceDocument);
//                             that.getView().byId("idegpewaybillno").setValue(value11.EWayBill);
//                             that.getView().byId("idegpgateentrydate").setValue(value11.GateEntryDate);
//                             that.getView().byId("idegpvehicletype").setValue(value11.VehicleType);
//                             that.getView().byId("idegpvehicleno").setValue(value11.VehicleNo);
//                             that.getView().byId("idegpinvoiceno").setValue(value11.InvoiceNo);
//                             that.getView().byId("idegpinvoicedt").setValue(value11.InvoiceDate);
//                             that.getView().byId("idegptranporter").setValue(value11.Transporter);
//                             that.getView().byId("idegptranspmode").setValue(value11.TransporterMode);
//                             that.getView().byId("idegplrno").setValue(value11.LRNo);
//                             that.getView().byId("idegplrdate").setValue(value11.LRDate);
//                             that.getView().byId("idegpgrossweight").setValue(value11.GrossWeight);
//                             that.getView().byId("idegpweighttimedt").setValue(value11.WeightTime);
//                             that.getView().byId("idegpnoofpackages").setValue(value11.NoOfPackages);
//                             that.getView().byId("idegpplant").setValue(value11.PlantCode);
//                             that.getView().byId("idegpplantname").setValue(value11.PlantName);
//                             that.getView().byId("idegpinsuptype").setValue(value11.SupplierType);
//                             that.getView().byId("idegpsupname").setValue(value11.SupplierName);
//                             that.getView().byId("idegpsupcode").setValue(value11.SupplierCode);
//                             that.getView().byId("idegpstatus").setValue(Status);
//                             that.getView().byId("idegpremarks").setValue(value11.Remarks);
//                             that.getView().byId("idingeguuidh").setValue(SAPUIID);
                          
                           

//                             if (Status === "deleted") {
//                                 that.getView().byId("DeleteIndicId").setVisible(true);
//                                 that.getView().byId("id_update_button").setVisible(false);
//                                 that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false);
//                                 that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
//                                 that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(true);
//                                 that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(true);
//                             } else if (Status === "approved" || Status === "rejected") {
//                                 that.getView().byId("DeleteIndicId").setVisible(false);
//                                 that.getView().byId("id_update_button").setVisible(false);
//                                 that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false);
//                                 that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
//                                 that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
//                                 that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);
//                             } else {
//                                 that.getView().byId("DeleteIndicId").setVisible(false);
//                                 that.getView().byId("id_update_button").setVisible(true);
//                                 that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(true);
//                                 that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(true);
//                                 that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
//                                 that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);
//                             }


//                             model0.read("/YY1_ZINWARD_HEAD(guid'" + SAPUIID + "')/to_ITEM", {

//                                 success: function (oData) {
//                                     var GPEmodel = new sap.ui.model.json.JSONModel({
//                                         dataedit: oData.results
//                                     });
//                                     that.getView().setModel(GPEmodel, "GPEmodel");
//                                     GPEmodel.refresh();
//                                     that.getView().byId("id_update_button").setEnabled(true);
//                                     sap.ui.core.BusyIndicator.hide();
//                                 },
//                                 error: function (oError) {
//                                     console.log(oError);
//                                     sap.ui.core.BusyIndicator.hide();
//                                 }
//                             });
//                         }
//                     });


                
//             },


//             //----select gate entry frag open


//             OnSelectGateEntry:function (oEvent1) {
//                 if (!this._dialog_PoDocChangeDialog) {
//                     this._dialog_PoDocChangeDialog = sap.ui.xmlfragment(this.getView().getId("idgateentryopen_dialog"), "gatepassapp.view.inward.subcontractinggoodsreceipt.fragment.GateEntryNoGP", this);
//                     this.getView().addDependent(this._dialog_PoDocChangeDialog);
//                 }

//                 this._dialog_PoDocChangeDialog.open();
//             },

             
//             OnGateEntryDocNoSelect: function (oEvent) {

//                 sap.ui.core.BusyIndicator.show();

//                 var oBinding = oEvent.getSource().getBinding("items");
//                 oBinding.filter([]);

//                 var aContexts = oEvent.getParameter("selectedContexts");
//                 console.log("aContexts;", aContexts);

//                 //Value help check empty or not

//                 if (aContexts === undefined) {
//                     console.log("No item present");
//                     let Dataa = this.getView().byId("idegpgateentryno").getValue()

//                     if(Dataa === ""){
//                         this.getView().byId("id_update_button").setEnabled(false);
//                         this.getView().byId("id_reject_button").setEnabled(false);
                      
//                       this.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
//                       sap.ui.core.BusyIndicator.hide();
//                     }
                    

//                 } else {


//                     var Gateentryno, GPSAPUUIID;
//                     if (aContexts && aContexts.length) {

//                         aContexts.map(function (oContext) {
//                             Gateentryno = oContext.getObject().Id;
//                             GPSAPUUIID = oContext.getObject().SAP_UUID;

//                             return;
//                         });
//                         this.getView().byId("idegpgateentryno").setValue(Gateentryno);
//                         this.getView().byId("idingeguuidh").setValue(GPSAPUUIID);



//                     }



//                     var filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, Gateentryno);
//                     var model10 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS");
                    
//                     var that = this;

//                     model10.read("/YY1_ZINWARD_HEAD", {
//                         filters: [filter],
//                         success: function (ODat, oRespons) {
//                             var value11 = ODat.results[0];
//                             var SAPUIID = value11.SAP_UUID;
//                             var Status = value11.Status;
//                             console.log("value11", value11);
//                             that.getView().byId("idegpgenpurdoc").setValue(value11.ReferenceDocument);
//                             that.getView().byId("idegpewaybillno").setValue(value11.EWayBill);
//                             that.getView().byId("idegpgateentrydate").setValue(value11.GateEntryDate);
//                             that.getView().byId("idegpvehicletype").setValue(value11.VehicleType);
//                             that.getView().byId("idegpvehicleno").setValue(value11.VehicleNo);
//                             that.getView().byId("idegpinvoiceno").setValue(value11.InvoiceNo);
//                             that.getView().byId("idegpinvoicedt").setValue(value11.InvoiceDate);
//                             that.getView().byId("idegptranporter").setValue(value11.Transporter);
//                             that.getView().byId("idegptranspmode").setValue(value11.TransporterMode);
//                             that.getView().byId("idegplrno").setValue(value11.LRNo);
//                             that.getView().byId("idegplrdate").setValue(value11.LRDate);
//                             that.getView().byId("idegpgrossweight").setValue(value11.GrossWeight);
//                             that.getView().byId("idegpweighttimedt").setValue(value11.WeightTime);
//                             that.getView().byId("idegpnoofpackages").setValue(value11.NoOfPackages);
//                             that.getView().byId("idegpplant").setValue(value11.PlantCode);
//                             that.getView().byId("idegpplantname").setValue(value11.PlantName);
//                             that.getView().byId("idegpinsuptype").setValue(value11.SupplierType);
//                             that.getView().byId("idegpsupname").setValue(value11.SupplierName);
//                             that.getView().byId("idegpsupcode").setValue(value11.SupplierCode);
//                             that.getView().byId("idegpstatus").setValue(Status);
//                             that.getView().byId("idegpremarks").setValue(value11.Remarks);
//                             that.getView().byId("idingeguuidh").setValue(SAPUIID);
                          
                           

//                             if (Status === "deleted") {
//                                 that.getView().byId("DeleteIndicId").setVisible(true);
//                                 that.getView().byId("id_update_button").setVisible(false);
//                                 that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false);
//                                 that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
//                                 that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(true);
//                                 that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(true);
//                             } else if (Status === "approved" || Status === "rejected") {
//                                 that.getView().byId("DeleteIndicId").setVisible(false);
//                                 that.getView().byId("id_update_button").setVisible(false);
//                                 that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false);
//                                 that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
//                                 that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
//                                 that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);
//                             } else {
//                                 that.getView().byId("DeleteIndicId").setVisible(false);
//                                 that.getView().byId("id_update_button").setVisible(true);
//                                 that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(true);
//                                 that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(true);
//                                 that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
//                                 that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);
//                             }


//                             model10.read("/YY1_ZINWARD_HEAD(guid'" + SAPUIID + "')/to_ITEM", {

//                                 success: function (oData) {
//                                     var GPEmodel = new sap.ui.model.json.JSONModel({
//                                         dataedit: oData.results
//                                     });
//                                     that.getView().setModel(GPEmodel, "GPEmodel");
//                                     GPEmodel.refresh();
                                    
//                                     that.getView().byId("id_update_button").setEnabled(true);
//                                     sap.ui.core.BusyIndicator.hide();
//                                 },
//                                 error: function (oError) {
//                                     console.log(oError);
//                                     sap.ui.core.BusyIndicator.hide();
//                                 }
//                             });
//                         }
//                     });


//                 }
//             },

//             //-----close edit fragment genral purchase
//             ONCancel: function () {
//                 this._dialog_changeGeneralPurchaseDialog.close();

//                 this.getView().byId("idegpgateentryno").setValue("");
//                 this.getView().byId("idegpgenpurdoc").setValue("");
//                 this.getView().byId("idegpewaybillno").setValue("");
//                 this.getView().byId("idegpgateentrydate").setValue("");
//                 this.getView().byId("idegpvehicletype").setValue("");
//                 this.getView().byId("idegpvehicleno").setValue("");
//                 this.getView().byId("idegpinvoiceno").setValue("");
//                 this.getView().byId("idegpinvoicedt").setValue("");
//                 this.getView().byId("idegptranporter").setValue("");
//                 this.getView().byId("idegptranspmode").setValue("");
//                 this.getView().byId("idegplrno").setValue("");
//                 this.getView().byId("idegplrdate").setValue("");
//                 this.getView().byId("idegpgrossweight").setValue("");
//                 this.getView().byId("idegpweighttimedt").setValue("");
//                 this.getView().byId("idegpnoofpackages").setValue("");
//                 this.getView().byId("idegpstatus").setValue("");
//                 this.getView().byId("idegpremarks").setValue("");
//                 this.getView().byId("idingeguuidh").setValue("");

//                 var GPEmodel = new sap.ui.model.json.JSONModel({
//                     dataedit: {}
//                 });
//                 that.getView().setModel(GPEmodel, "GPEmodel");
//                 GPEmodel.refresh();

//             },

//             // Gate Entry quantity validation


//             OnPendingQtyCalEdit: function (PoItem, PocHead, OrderQuantity) {

//                 var that = this; // Store reference to 'this'
//                 if (PoItem !== null && PocHead !== null && OrderQuantity !== null) {
//                     var PoItem = PoItem;
//                     var PocHead = PocHead;
//                     var OrderQuantity = OrderQuantity;

//                     console.log("PoItem:", PoItem)
//                     console.log("PocHead:", PocHead)
//                     console.log("DocOrderQuantitytem:", OrderQuantity)

//                     return new Promise(function (resolve, reject) {

//                         var oFilter = new sap.ui.model.Filter("ItemNo", sap.ui.model.FilterOperator.EQ, PoItem);
//                         var oFilter1 = new sap.ui.model.Filter("ReferenceDocument", sap.ui.model.FilterOperator.EQ, PocHead);
//                         //var oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'created');
//                         var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE21');
//                         var oFilter4 = new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, 'created');

//                         var oModel2 = that.getView().getModel("YY1_ZINWARD_HEAD_CDS");
//                         var oFilters = [oFilter, oFilter1, oFilter3, oFilter4];

//                         var CalData = 0;

//                         oModel2.read("/YY1_ITEM_ZINWARD_HEAD", {
//                             filters: oFilters,
//                             success: function (oData) {
//                                 var aItems = oData.results;
//                                 console.log("aItems:", aItems)
//                                 for (var i = 0; i < aItems.length; i++) {
//                                     CalData += parseFloat(aItems[i].QuantityInGE);

//                                 }

                              
//                                 console.log("---------------------------------------------");
//                                 console.log(OrderQuantity);
//                                 console.log("CalData:", CalData);
//                                 var FinalData = parseFloat(OrderQuantity) - parseFloat(CalData);
//                                 console.log(FinalData);
//                                 console.log("---------------------------------------------");
//                                 resolve(FinalData); // Resolve with the data
//                             },


                            
//                             error: function (oError) {
//                                 console.error("Error reading data: ", oError);
//                                 reject(oError); // Reject with the error
//                             }
//                         });
//                     });

//                 }
//             },



//             onlivechangeqtyeditge: function (oEvent) {
                
//                 let pendingquatity = oEvent.getSource().getParent().getCells()[8].mProperties.text;
//                 console.log("pendingquatity:",pendingquatity);
//                 let orderqty = oEvent.getSource().getParent().getCells()[10].getValue();
//                 console.log("orderqty:",orderqty);
         

//                 let Open_Quantity_Float = parseFloat(pendingquatity);
//                 let OrderQuantity_Float = parseFloat(orderqty);
//                 console.log("Open_Quantity_Float:",Open_Quantity_Float);
//                 console.log("OrderQuantity_Float:",OrderQuantity_Float);


//                 if (Open_Quantity_Float >= OrderQuantity_Float) {
                 
//                     oEvent.getSource().getParent().getCells()[10].setValueState(sap.ui.core.ValueState.None);

//                     this.getView().byId("id_update_button").setEnabled(true);
                   

//                 }

//                 else if (OrderQuantity_Float === "") {
//                     oEvent.getSource().getParent().getCells()[10].setValue("0");
//                     this.getView().byId("id_update_button").setEnabled(false);

//                 }

//                 else if (Open_Quantity_Float < OrderQuantity_Float) {
//                     oEvent.getSource().getParent().getCells()[10].setValueState(sap.ui.core.ValueState.Error);
//                     oEvent.getSource().getParent().getCells()[10].setValueStateText("Please Enter Valid Quantity");
                

//                     this.getView().byId("id_update_button").setEnabled(false);

//                 }
//             },

//             //-----------update function for gate entry in general purchase

//             OnUpdate: function () {

//                 // sap.ui.core.BusyIndicator.show();
//                 let GUUID_H = this.getView().byId("idingeguuidh").getValue();
//                 let genumber = this.getView().byId("idegpgateentryno").getValue();
//                 let gpdocnum = this.getView().byId("idegpgenpurdoc").getValue();
//                 let ewaybillno = this.getView().byId("idegpewaybillno").getValue();
//                 let suppltype = this.getView().byId("idegpinsuptype").getValue();
//                 let supplname=this.getView().byId("idegpsupname").getValue();
//                 let suppcode=this.getView().byId("idegpsupcode").getValue();
//                 let plant=this.getView().byId("idegpplant").getValue();
//                 let plantname=this.getView().byId("idegpplantname").getValue();
//                 let gateentrydate = this.getView().byId("idegpgateentrydate").getValue();
//                 let vehicletype = this.getView().byId("idegpvehicletype").getValue();
//                 let vehnumber = this.getView().byId("idegpvehicleno").getValue();
//                 let invoiceno = this.getView().byId("idegpinvoiceno").getValue();
//                 let invoicedate = this.getView().byId("idegpinvoicedt").getValue();
//                 let transporter = this.getView().byId("idegptranporter").getValue();
//                 let transmode = this.getView().byId("idegptranspmode").getValue();
//                 let lrno = this.getView().byId("idegplrno").getValue();
//                 let lrdate = this.getView().byId("idegplrdate").getValue();
//                 let grossweight = this.getView().byId("idegpgrossweight").getValue();
//                 let grwtdttime = this.getView().byId("idegpweighttimedt").getValue();
//                 let noofpackages = this.getView().byId("idegpnoofpackages").getValue();
//                 let status = this.getView().byId("idegpstatus").getValue();
//                 let remarks = this.getView().byId("idegpremarks").getValue();

                 


//                 console.log("GUUID_H",GUUID_H);
//                 console.log("genumber",genumber);
//                 console.log("gpdocnum",gpdocnum);
//                 console.log("ewaybillno",ewaybillno);
//                 console.log("suppltype",suppltype);
//                 console.log("supplname",supplname);
//                 console.log("suppcode",suppcode);
//                 console.log("plant",plant);
//                 console.log("plantname",plantname);
//                 console.log("gateentrydate",gateentrydate);
//                 console.log("vehicletype",vehicletype);
//                 console.log("vehnumber",vehnumber);
//                 console.log("invoiceno",invoiceno);
//                 console.log("invoicedate",invoicedate);
//                 console.log("transporter",transporter);
//                 console.log("transmode",transmode);
//                 console.log("lrno",lrno);
//                 console.log("lrdate",lrdate);
//                 console.log("grossweight",grossweight);
//                 console.log("grwtdttime",grwtdttime);
//                 console.log("noofpackages",noofpackages);
//                 console.log("status",status);
//                 console.log("remarks",remarks);

//                 if (ewaybillno !== "" && transporter !== "" ) {
//                     this.getView().byId("idegpewaybillno").setValueState(sap.ui.core.ValueState.None);
//                     this.getView().byId("idegpewaybillno").setValueStateText("");

//                     this.getView().byId("idegpnoofpackages").setValueState(sap.ui.core.ValueState.None);
//                     this.getView().byId("idegpnoofpackages").setValueStateText("");

//                     this.getView().byId("idegptranporter").setValueState(sap.ui.core.ValueState.None);
//                     this.getView().byId("idegptranporter").setValueStateText("");

//                     this.getView().byId("idegpgrossweight").setValueState(sap.ui.core.ValueState.None);
//                     this.getView().byId("idegpgrossweight").setValueStateText("");


//                     this.getView().byId("idegptranspmode").setValueState(sap.ui.core.ValueState.None);
//                     this.getView().byId("idegptranspmode").setValueStateText("");

//                     this.getView().byId("idegplrno").setValueState(sap.ui.core.ValueState.None);
//                     this.getView().byId("idegplrno").setValueStateText("");

//                     this.getView().byId("idegplrdate").setValueState(sap.ui.core.ValueState.None);
//                     this.getView().byId("idegplrdate").setValueStateText("");

//                     this.getView().byId("idegpweighttimedt").setValueState(sap.ui.core.ValueState.None);
//                     this.getView().byId("idegpweighttimedt").setValueStateText("");


//                     this.getView().byId("idegpvehicletype").setValueState(sap.ui.core.ValueState.None);
//                     this.getView().byId("idegpvehicletype").setValueStateText("");



//                 //start table item



//                 var table = this.getView().byId("idegptable");
//                 var Tablerows = table.getRows().length;
//                 var that = this;
        

//                 for (let i = 0; i < Tablerows; i++) {
//                     var rows = table.getRows()[i];
//                     var oBindingContext = rows.mAggregations;
            
//                     if (oBindingContext) {

//                         var orderqtyGE = oBindingContext.cells[10].mProperties.value;
//                         var GUUID_I = oBindingContext.cells[12].mProperties.text;
//                         var Delete_Status01 = rows.getCells()[0].getVisible();
//                         if(GUUID_I===""){
//                             break;
//                         }
//                         console.log("GUUID_I:", GUUID_I);
                        

//                         if (Delete_Status01 === true) {
//                             var Delete_Status = "deleted";
//                         }
//                         else if (Delete_Status01 === false) {
//                             var Delete_Status = "";
//                         }

//                         var itemdata = {
//                             QuantityInGE: orderqtyGE,
//                             ItemsStatus: Delete_Status

//                         };
                       


//                         var oModel_041 = that.getView().getModel("YY1_ZINWARD_HEAD_CDS");
//                         oModel_041.setHeaders({
//                             "X-Requested-With": "X",
//                             "Content-Type": "application/json"
//                         });
                
//                         oModel_041.update("/YY1_ITEM_ZINWARD_HEAD(guid'" + GUUID_I + "')", itemdata, {
                            
//                             success: function (data) {
//                                 console.log("Item Updated:", data);
                                
//                                 sap.ui.core.BusyIndicator.hide();
//                             },
//                             error: function (error) {
//                                 sap.ui.core.BusyIndicator.hide(); 
//                                 console.error("Error updating item:", error);                             
//                             }
//                         });

//                     }

//                 }


//                 var Header = {
//                     // ReferenceDocument:gpdocnum,
//                     EWayBill: ewaybillno,
//                     GateEntryDate: gateentrydate,
//                     VehicleType: vehicletype,
//                     VehicleNo: vehnumber,
//                     InvoiceNo: invoiceno,
//                     InvoiceDate: invoicedate,
//                     Transporter: transporter,
//                     TransporterMode: transmode,
//                     LRNo: lrno,
//                     LRDate: lrdate,
//                     GrossWeight: grossweight,
//                     WeightTime: grwtdttime,
//                     WeightDate: grwtdttime,
//                     NoOfPackages: noofpackages,
//                     Remarks: remarks,
//                     Status: "created"

//                 }

                
//                 var that = this;

//                 var oModel05 = that.getView().getModel("YY1_ZINWARD_HEAD_CDS");
//                 oModel05.setHeaders({
//                     "X-Requested-With": "X",
//                     "Content-Type": "application/json"
//                 });

              
//                 // oModel05.update("/YY1_ZINWARD_HEAD", Header, {
//                 oModel05.update("/YY1_ZINWARD_HEAD(guid'" + GUUID_H + "')", Header, {
//                     success: function (data) {
//                         sap.ui.core.BusyIndicator.hide();
//                         oModel05.refresh(true);
//                         sap.m.MessageBox.success("Gate Entry " + genumber + " Updated Successfully", {
//                             title: "Change General Purchase",
//                             id: "messageBoxId11",
//                             contentWidth: "100px",
//                         });
//                         var GPEmodel = new sap.ui.model.json.JSONModel({
//                             dataedit: {}
//                         });
                        
//                         that.getView().setModel(GPEmodel, "GPEmodel");
//                         GPEmodel.refresh();


//                         that.getView().byId("idingeguuidh").setValue("");
//                         that.getView().byId("idegpgateentryno").setValue("");
//                         that.getView().byId("idegpgenpurdoc").setValue("");
//                         that.getView().byId("idegpewaybillno").setValue("");
//                         that.getView().byId("idegpgateentrydate").setValue("");
//                         that.getView().byId("idegpvehicletype").setValue("");
//                         that.getView().byId("idegpvehicleno").setValue("");
//                         that.getView().byId("idegpinvoiceno").setValue("");
//                         that.getView().byId("idegpinvoicedt").setValue("");
//                         that.getView().byId("idegptranporter").setValue("");
//                         that.getView().byId("idegptranspmode").setValue("");
//                         that.getView().byId("idegplrno").setValue("");
//                         that.getView().byId("idegplrdate").setValue("");
//                         that.getView().byId("idegpgrossweight").setValue("");
//                         that.getView().byId("idegpweighttimedt").setValue("");
//                         that.getView().byId("idegpnoofpackages").setValue("");
//                         that.getView().byId("idegpstatus").setValue("");
//                         that.getView().byId("idegpremarks").setValue("");                     
//                         that.getView().byId("idegpinsuptype").setValue("");
//                         that.getView().byId("idegpsupname").setValue("");
//                         that.getView().byId("idegpsupcode").setValue("");
//                         that.getView().byId("idegpplant").setValue("");
//                         that.getView().byId("idegpplantname").setValue("");


//                     },
//                     error: function (error) {
//                         sap.ui.core.BusyIndicator.hide();
//                         alert("Header error")
                        
//                         sap.m.MessageToast.show("Gate Entry Numer " + genumber + "  Not Updated");
//                     }
//                 });
//             }




//             else {

//                 if (ewaybillno === "") {
//                     this.getView().byId("idegpewaybillno").setValueState(sap.ui.core.ValueState.Error);
//                     this.getView().byId("idegpewaybillno").setValueStateText("Please Enter EWAY Bill No");
//                 } else {
//                     this.getView().byId("idegpewaybillno").setValueState(sap.ui.core.ValueState.None);
//                     this.getView().byId("idegpewaybillno").setValueStateText("");
//                 }
//                 {
//                     if (noofpackages === "") {
//                         this.getView().byId("idegpnoofpackages").setValueState(sap.ui.core.ValueState.Error);
//                         this.getView().byId("idegpnoofpackages").setValueStateText("Please No of Package");
//                     } else {
//                         this.getView().byId("idegpnoofpackages").setValueState(sap.ui.core.ValueState.None);
//                         this.getView().byId("idegpnoofpackages").setValueStateText("");
//                     }
//                 }
//                 {
//                     if (transporter === "") {
//                         this.getView().byId("idegptranporter").setValueState(sap.ui.core.ValueState.Error);
//                         this.getView().byId("idegptranporter").setValueStateText("Please Enter Transporter No");
//                     } else {
//                         this.getView().byId("idegptranporter").setValueState(sap.ui.core.ValueState.None);
//                         this.getView().byId("idegptranporter").setValueStateText("");
//                     }
//                 }


//                 {
//                     if (grossweight === "") {
//                         this.getView().byId("idegpgrossweight").setValueState(sap.ui.core.ValueState.Error);
//                         this.getView().byId("idegpgrossweight").setValueStateText("Please Enter Gross Weight ");
//                     } else {
//                         this.getView().byId("idegpgrossweight").setValueState(sap.ui.core.ValueState.None);
//                         this.getView().byId("idegpgrossweight").setValueStateText("");
//                     }
//                 }


//                 {
//                     if (transmode === "") {
//                         this.getView().byId("idegptranspmode").setValueState(sap.ui.core.ValueState.Error);
//                         this.getView().byId("idegptranspmode").setValueStateText("Please Enter Tranport Mode ");
//                     } else {
//                         this.getView().byId("idegptranspmode").setValueState(sap.ui.core.ValueState.None);
//                         this.getView().byId("idegptranspmode").setValueStateText("");
//                     }
//                 }



//                 {
//                     if (lrno === "") {
//                         this.getView().byId("idegplrno").setValueState(sap.ui.core.ValueState.Error);
//                         this.getView().byId("idegplrno").setValueStateText("Please Enter the LRNo ");
//                     } else {
//                         this.getView().byId("idegplrno").setValueState(sap.ui.core.ValueState.None);
//                         this.getView().byId("idegplrno").setValueStateText("");
//                     }
//                 }






//                 {
//                     if (lrdate === "") {
//                         this.getView().byId("idegplrdate").setValueState(sap.ui.core.ValueState.Error);
//                         this.getView().byId("idegplrdate").setValueStateText("Please Enter Tranport Mode ");
//                     } else {
//                         this.getView().byId("idegplrdate").setValueState(sap.ui.core.ValueState.None);
//                         this.getView().byId("idegplrdate").setValueStateText("");
//                     }
//                 }



//                 {
//                     if (vehicletype === "") {
//                         this.getView().byId("idegpvehicletype").setValueState(sap.ui.core.ValueState.Error);
//                         this.getView().byId("idegpvehicletype").setValueStateText("Please Select Vehicle Type ");
//                     } else {
//                         this.getView().byId("idegpvehicletype").setValueState(sap.ui.core.ValueState.None);
//                         this.getView().byId("idegpvehicletype").setValueStateText("");
//                     }
//                 }


//                 {
//                     if (grwtdttime === "") {
//                         this.getView().byId("idegpweighttimedt").setValueState(sap.ui.core.ValueState.Error);
//                         this.getView().byId("idegpweighttimedt").setValueStateText("Please Select Vehicle Type ");
//                     } else {
//                         this.getView().byId("idegpweighttimedt").setValueState(sap.ui.core.ValueState.None);
//                         this.getView().byId("idegpweighttimedt").setValueStateText("");
//                     }
//                 }







//             }




               


//             },



//              // ----Start Select Items Table Delete
//              OnTableRowRemove: function (oEvent) {
//                 var oTable = this.byId("idegptable");
//                 var oTableRows = oTable.getRows();
//                 var aIndices = this.byId("idegptable").getSelectedIndices();

//                 for (let i = 0; i < oTableRows.length; i++) {
//                     console.log(i);
//                     aIndices.forEach(function (Index) {
//                         if (i === Index) {
//                             let Visible_Status = oTable.getRows()[Index].getCells()[0].getVisible();
//                             if (Visible_Status === false) {
//                                 oTable.getRows()[Index].getCells()[0];
//                                 oTable.getRows()[Index].getCells()[0].setVisible(true);
//                             }
//                             if (Visible_Status === true) {
//                                 oTable.getRows()[Index].getCells()[0];
//                                 oTable.getRows()[Index].getCells()[0].setVisible(false);
//                             }

//                         }
//                     });

//                 }
//             },




           



//             OnDeleteEntireDocument: function () {

//                 let gate_no_select = this.getView().byId("idegpgateentryno").getValue();
//                 let SAP_UUID_H = this.getView().byId("idingeguuidh").getValue();

//                 // ---------- Start Item Level

//                 var Table_Id = this.getView().byId("idegptable");
//                 var Table_Length = Table_Id.getRows().length;

//                 for (var i = 0; i < Table_Length; i++) {
//                     var oRow = Table_Id.getRows()[i];
//                     var oBindingContext = oRow.mAggregations;

//                     if (oBindingContext) {
//                         var Gate_Quantity_To_Post = oBindingContext.cells[10].mProperties.value;
//                         var SAP_UUID_I = oBindingContext.cells[12].mProperties.text;
//                         var Delete_Status01 = oRow.getCells()[0].getVisible();

//                         if (SAP_UUID_I === '') {
//                             break;
//                         }
//                         if (Gate_Quantity_To_Post !== "") {
//                             var Delete_Status = "deleted";

//                             var itemData = {
//                                 Status: Delete_Status,
//                                 ItemsStatus: Delete_Status
//                             };

//                             var oModel_04 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS");
//                             oModel_04.setHeaders({
//                                 "X-Requested-With": "X",
//                                 "Content-Type": "application/json"
//                             });

//                             oModel_04.update("/YY1_ITEM_ZINWARD_HEAD(guid'" + SAP_UUID_I + "')", itemData, {
//                                 success: function (data) {
//                                     console.log("Item Updated:", data);
//                                 },
//                                 error: function (error) {
//                                     console.error("Error updating item:", error);
//                                 }
//                             });
//                         }
//                     }
//                 }

//                 var oEntry1 = {
//                     Status: "deleted",
//                 };

//                 var that = this;
//                 var oModel05 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS");
//                 oModel05.setHeaders({
//                     "X-Requested-With": "X",
//                     "Content-Type": "application/json"
//                 });

//                 oModel05.update("/YY1_ZINWARD_HEAD(guid'" + SAP_UUID_H + "')", oEntry1, {
//                     success: function (data) {
//                         console.log("Header Updated:", data);
//                         MessageToast.show(" " + gate_no_select + " Deleted")
//                         oModel05.refresh(true);
//                         that.getView().byId("DeleteIndicId").setVisible(true);
//                         that.getView().byId("id_update_button").setVisible(false);
//                         that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(false);
//                         that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(false);
//                         that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(true);
//                         that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(true);


//                         var GPEmodel = new sap.ui.model.json.JSONModel({
//                             dataedit: {}
//                         });
        
//                         that.getView().setModel(GPEmodel, "GPEmodel");
//                         GPEmodel.refresh();

                        
//                         that.getView().byId("idingeguuidh").setValue("");
//                         that.getView().byId("idegpgateentryno").setValue("");
//                         that.getView().byId("idegpgenpurdoc").setValue("");
//                         that.getView().byId("idegpewaybillno").setValue("");
//                         that.getView().byId("idegpgateentrydate").setValue("");
//                         that.getView().byId("idegpvehicletype").setValue("");
//                         that.getView().byId("idegpvehicleno").setValue("");
//                         that.getView().byId("idegpinvoiceno").setValue("");
//                         that.getView().byId("idegpinvoicedt").setValue("");
//                         that.getView().byId("idegptranporter").setValue("");
//                         that.getView().byId("idegptranspmode").setValue("");
//                         that.getView().byId("idegplrno").setValue("");
//                         that.getView().byId("idegplrdate").setValue("");
//                         that.getView().byId("idegpgrossweight").setValue("");
//                         that.getView().byId("idegpweighttimedt").setValue("");
//                         that.getView().byId("idegpnoofpackages").setValue("");
//                         that.getView().byId("idegpstatus").setValue("");
//                         that.getView().byId("idegpremarks").setValue("");                     
//                         that.getView().byId("idegpinsuptype").setValue("");
//                         that.getView().byId("idegpsupname").setValue("");
//                         that.getView().byId("idegpsupcode").setValue("");
//                         that.getView().byId("idegpplant").setValue("");
//                         that.getView().byId("idegpplantname").setValue("");
//                     },
//                     error: function (error) {
//                         console.error("Error updating header:", error);
//                         MessageToast.show(" " + gate_no_select + " Not Deleted")
//                     }
//                 });

//                 // ---------- End Item Level

//             },



//             OnUnDeleteEntireDocument: function () {


//                 let gate_entry = this.getView().byId("idegpgateentryno").getValue();
//                 let SAP_UUID_H = this.getView().byId("idingeguuidh").getValue();

//                 // ---------- Start Item Level

//                 var Table_Id = this.getView().byId("idegptable");
//                 var Table_Length = Table_Id.getRows().length;

//                 for (var i = 0; i < Table_Length; i++) {
//                     var oRow = Table_Id.getRows()[i];
//                     var oBindingContext = oRow.mAggregations;

//                     if (oBindingContext) {
//                         var Gate_Quantity_To_Post = oBindingContext.cells[10].mProperties.value;
//                         var SAP_UUID_I = oBindingContext.cells[12].mProperties.text;
//                         var Delete_Status01 = oRow.getCells()[0].getVisible();

//                         if (Gate_Quantity_To_Post !== "") {
//                             var Delete_Status = "created";

//                             var itemData = {
//                                 Status: Delete_Status,
//                                 ItemsStatus: Delete_Status
//                             };

//                             var oModel_04 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS");
//                             oModel_04.setHeaders({
//                                 "X-Requested-With": "X",
//                                 "Content-Type": "application/json"
//                             });

//                             oModel_04.update("/YY1_ITEM_ZINWARD_HEAD(guid'" + SAP_UUID_I + "')", itemData, {
//                                 success: function (data) {
//                                     console.log("Item Updated:", data);
//                                 },
//                                 error: function (error) {
//                                     console.error("Error updating item:", error);
//                                 }
//                             });
//                         }
//                     }
//                 }

//                 var oEntry1 = {
//                     Status: "created",
//                 };

//                 var that = this;

//                 var oModel05 = this.getView().getModel("YY1_ZINWARD_HEAD_CDS");
//                 oModel05.setHeaders({
//                     "X-Requested-With": "X",
//                     "Content-Type": "application/json"
//                 });

//                 oModel05.update("/YY1_ZINWARD_HEAD(guid'" + SAP_UUID_H + "')", oEntry1, {
//                     success: function (data) {
//                         console.log("Header Updated:", data);

//                         MessageToast.show(" " + gate_entry + " Retrived")
//                         oModel05.refresh(true);
//                         that.getView().byId("DeleteIndicId").setVisible(false);
//                         that.getView().byId("id_update_button").setVisible(true);
//                         that.getView().byId("Final_DeleteEntireDocument_Button").setVisible(true);
//                         that.getView().byId("Final_DeleteEntireDocument_Button").setEnabled(true);
//                         that.getView().byId("UnFinal_DeleteEntireDocument_Button").setVisible(false);
//                         that.getView().byId("UnFinal_DeleteEntireDocument_Button").setEnabled(false);


//                         var GPEmodel = new sap.ui.model.json.JSONModel({
//                             dataedit: {}
//                         });
    
//                         that.getView().setModel(GPEmodel, "GPEmodel");
//                         GPEmodel.refresh();

//                         that.getView().byId("idingeguuidh").setValue("");
//                         that.getView().byId("idegpgateentryno").setValue("");
//                         that.getView().byId("idegpgenpurdoc").setValue("");
//                         that.getView().byId("idegpewaybillno").setValue("");
//                         that.getView().byId("idegpgateentrydate").setValue("");
//                         that.getView().byId("idegpvehicletype").setValue("");
//                         that.getView().byId("idegpvehicleno").setValue("");
//                         that.getView().byId("idegpinvoiceno").setValue("");
//                         that.getView().byId("idegpinvoicedt").setValue("");
//                         that.getView().byId("idegptranporter").setValue("");
//                         that.getView().byId("idegptranspmode").setValue("");
//                         that.getView().byId("idegplrno").setValue("");
//                         that.getView().byId("idegplrdate").setValue("");
//                         that.getView().byId("idegpgrossweight").setValue("");
//                         that.getView().byId("idegpweighttimedt").setValue("");
//                         that.getView().byId("idegpnoofpackages").setValue("");
//                         that.getView().byId("idegpstatus").setValue("");
//                         that.getView().byId("idegpremarks").setValue("");                     
//                         that.getView().byId("idegpinsuptype").setValue("");
//                         that.getView().byId("idegpsupname").setValue("");
//                         that.getView().byId("idegpsupcode").setValue("");
//                         that.getView().byId("idegpplant").setValue("");
//                         that.getView().byId("idegpplantname").setValue("");

//                     },
//                     error: function (error) {
//                         console.error("Error updating header:", error);

//                         MessageToast.show(" " + gate_entry + " Not Retrived")
//                     }
//                 });

//                 // ---------- End Item Level
//             }




            

        });
    });
