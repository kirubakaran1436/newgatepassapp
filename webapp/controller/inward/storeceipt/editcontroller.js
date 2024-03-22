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

        return Controller.extend("gatepassapp.controller.inward.storeceipt.editcontroller", {
            
            onInit: function () {  

                // vehicle data
                var JSonModel = new sap.ui.model.json.JSONModel({
                    Samples: [
                        { "id":"Truck", "VehicleID": "Truck", "VehicleName": "Truck" },
                        { "id":"Tempo", "VehicleID": "Tempo", "VehicleName": "Tempo" },
                        { "id":"Tractor", "VehicleID": "Tractor", "VehicleName": "Tractor" },
                        { "id":"Others", "VehicleID": "Others", "VehicleName": "Others" },
                    ]
                });
                this.getView().setModel(JSonModel, "JModel");
    
                // vehicle data
                var JSonModel = new sap.ui.model.json.JSONModel({
                    Samples: [
                        {"id":"Truck", "VehicleID": "Truck", "VehicleName": "Truck" },
                        {"id":"Tempo", "VehicleID": "Tempo", "VehicleName": "Tempo" },
                        {"id":"Tractor", "VehicleID": "Tractor", "VehicleName": "Tractor" },
                        {"id":"Others", "VehicleID": "Others", "VehicleName": "Others" },
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

                    // ----Start For Current Date -----
                    this.JSonModelMadDatas = new sap.ui.model.json.JSONModel({
                        Datas : []
                    });
                    this.getView().setModel(this.JSonModelMadDatas, "JSonModelMadDatas");
    
                    // // ---------------For Multi Input--------------------------------------
                    // var oMultiInput20, oMultiInputWithSuggestions;
                    // oMultiInput20 = this.byId("id_edit_sto_purchase_document_h");
                    // oMultiInput20.addValidator(this._onMultiInputValidate);
                    // this._oMultiInput20 = oMultiInput;
                
                    // this.oProductsModel = this.getView().getModel("YY1_ZGE_OUTWARD_OD_HEAD_CDS");
                    // this.getView().setModel(this.oProductsModel);
    
                    // var oMultiInput2 = this.getView().byId("id_edit_sto_purchase_document_h");
                    // oMultiInput2.addValidator(function(args){
                    //     if (args.suggestionObject){
                    //         var key = args.suggestionObject.getCells()[0].getText();
                    //         var text = args.suggestionObject.getCells()[0].getText();
                    //         // var text = key + "(" + args.suggestionObject.getCells()[1].getText() + ")";
                    //         return new sap.m.Token({key: key, text: key});
                    //     }
                    //     return null;
                    // });
                    // // ---------------For Multi Input--------------------------------------
                    // this.onclickData();
                },
        
        ONCancel: function () {

            this.getView().byId("id_edit_sto_gateentry_h").setValue("");
            this.getView().byId("id_edit_sto_sapuuid_h").setValue("");
            var multiInput = this.getView().byId("id_edit_sto_purchase_document_h");
                    multiInput.removeAllTokens();
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

        onedittokenupdate:function(oEvent){
            sap.ui.core.BusyIndicator.show();
            try{
                var sType = oEvent.getParameter("type");
                let GetTokens = this.getView().byId("id_edit_sto_purchase_document_h").getTokens();
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
                        return new sap.ui.model.Filter("OutboundDelivery", sap.ui.model.FilterOperator.EQ, sValue);
                    });
                }else{
                    var aFilters1 = new sap.ui.model.Filter("OutboundDelivery", sap.ui.model.FilterOperator.EQ, "")
                } 

                    var oTable = this.getView().byId("id_storeceipt_table");
                    var oModel = this.getView().getModel("YY1_ZGE_OUTWARD_OD_ITEM_CDS"); // Replace with your actual OData model name
                    var oFilters = [aFilters1];
                    var that = this;
                    oModel.read("/YY1_ZGE_OUTWARD_OD_ITEM", {
                        filters: oFilters,
                        success: function (oData) {
                            var aItems = oData.results; // The array of read items
                            var oTableModel = new sap.ui.model.json.JSONModel();
                            oTableModel.setData({ items: aItems });
                            oModel.refresh(true);
                            // Set the model on the table and bind the rows
                            oTable.setModel(oTableModel);
                            oTable.bindRows("/items");
                            that.getView().byId("id_storeceipt_table").setVisible(true);
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

        // ===========================================================================
        
            onEditValueHelpRequested: function() {
                try{
                    this.oMultiInputEdit = this.byId("id_edit_sto_purchase_document_h");
                    this.oMultiInputEdit.addValidator(this._onMultiInputValidate);
                    this._oMultiInputEdit = this.oMultiInputEdit;
                }catch (err){
                    console.log(err)
                }

                this._oBasicSearchField = new sap.m.SearchField();
                this.loadFragment({
                    name: "gatepassapp.view.inward.storeceipt.fragment.EditSalesValueHelpDialogFilterbar"
                }).then(function(oDialog) {
                    var oFilterBar = oDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
                    this._oVHD = oDialog;

                    this.getView().addDependent(oDialog);

                    // Set key fields for filtering in the Define Conditions Tab
                    oDialog.setRangeKeyFields([{
                        label: "OutboundDelivery",
                        key: "OutboundDelivery",
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
                                path: "YY1_ZGE_OUTWARD_OD_HEAD_CDS>/YY1_ZGE_OUTWARD_OD_HEAD",
                                events: {
                                    dataReceived: function() {
                                        oDialog.update();
                                    }
                                }
                            });
                            oColumnProductCode = new sap.ui.table.Column({label: new sap.m.Label({text: "Delivery Document"}), template: new sap.m.Text({wrapping: false, text: "{YY1_ZGE_OUTWARD_OD_HEAD_CDS>OutboundDelivery}"})});
                            oColumnProductCode.data({
                                fieldName: "OutboundDelivery"
                            });
                            oColumnProductName = new sap.ui.table.Column({label: new sap.m.Label({text: "Customer"}), template: new sap.m.Text({wrapping: false, text: "{YY1_ZGE_OUTWARD_OD_HEAD_CDS>CustomerName}"})});
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
                                path: "YY1_ZGE_OUTWARD_OD_HEAD_CDS>/YY1_ZGE_OUTWARD_OD_HEAD",
                                template: new sap.m.ColumnListItem({
                                    cells: [new sap.m.Label({text: "{YY1_ZGE_OUTWARD_OD_HEAD_CDS>OutboundDelivery}"}), new sap.m.Label({text: "{YY1_ZGE_OUTWARD_OD_HEAD_CDS>CustomerName}"})]
                                }),
                                events: {
                                    dataReceived: function() {
                                        oDialog.update();
                                    }
                                }
                            });
                            oTable.addColumn(new sap.m.Column({header: new sap.m.Label({text: "Delivery Document"})}));
                            oTable.addColumn(new sap.m.Column({header: new sap.m.Label({text: "Custome Name"})}));
                        }
                        oDialog.update();
                    }.bind(this));

                    oDialog.setTokens(this._oMultiInputEdit.getTokens());
                    oDialog.open();
                }.bind(this));
            },

            onEditValueHelpOkPress: function (oEvent) {
                let OldTokens = [];
                let NewTokens = [];

                var aTokens = oEvent.getParameter("tokens");
                this._oMultiInputEdit.setTokens(aTokens);
                this._oVHD.close();

                var oMultiInput = this.getView().byId("id_edit_sto_purchase_document_h");
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

                var aTokens = this.getView().byId("id_edit_sto_purchase_document_h").getTokens();
                    console.log("aTokens:",aTokens);
                    console.log("this.InitialDelDocNo :",this.InitialDelDocNo);

                    var aMultiInputValues = aTokens.map(function (oToken) {
                        return oToken.getKey();
                    });

                    console.log("aMultiInputValues;", aMultiInputValues)

                    aMultiInputValues.forEach(element => {
                        if (this.InitialDelDocNo.includes(element)) {
                            OldTokens.push(element);
                        } else {
                            NewTokens.push(element);
                        }
                    });
                    
                    // Finding elements in array2 not present in array1
                    this.InitialDelDocNo.forEach(element => {
                        if (!aMultiInputValues.includes(element)) {
                            NewTokens.push(element);
                        }
                    });
                    
                    console.log("Matched: ", OldTokens);
                    console.log("Mismatched: ", NewTokens);

                    if(OldTokens.length > 0){
                        var aFilters2 = OldTokens.map(function (sValue) {
                            return new sap.ui.model.Filter("ReferenceDocument", sap.ui.model.FilterOperator.EQ, sValue);
                        });
                    }else{
                        var aFilters2 = new sap.ui.model.Filter("ReferenceDocument", sap.ui.model.FilterOperator.EQ, "");
                    }

                        var oTable = this.getView().byId("id_storeceipt_table");
                        var oModel1 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS"); // Replace with your actual OData model name
                        var oFilters2 = [aFilters2];
                        var that = this;
                        oModel1.read("/YY1_ITEM_ZGE_INWARD_GATEPASS", {
                            filters: oFilters2,
                            success: function (oData) {
                                var aItems = oData.results; // The array of read items
                                var oTableModel = new sap.ui.model.json.JSONModel();
                                oTableModel.setData({ items: aItems });
                                oModel1.refresh(true);
                                // Set the model on the table and bind the rows
                                oTable.setModel(oTableModel);
                                oTable.bindRows("/items");
                                that.getView().byId("id_storeceipt_table").setVisible(true);
                                sap.ui.core.BusyIndicator.hide();
                            },
                            error: function (oError) {
                                // Handle error
                                console.error("Error reading data: ", oError);
                                sap.ui.core.BusyIndicator.hide();
                            }
                        });


                        if(NewTokens.length > 0){
                            var aFilters1 = NewTokens.map(function (sValue) {
                                return new sap.ui.model.Filter("OutboundDelivery", sap.ui.model.FilterOperator.EQ, sValue);
                            });
                        
                        }else{
                            var aFilters1 = new sap.ui.model.Filter("OutboundDelivery", sap.ui.model.FilterOperator.EQ, "");
                        }

                // var oFilter = new sap.ui.model.Filter("OutboundDelivery", sap.ui.model.FilterOperator.EQ, GetKey);
                var oTable = this.getView().byId("id_storeceipt_table");
                var oModel = this.getView().getModel("YY1_ZGE_OUTWARD_OD_ITEM_CDS"); // Replace with your actual OData model name
                var oFilters = [aFilters1];
                var that = this; 
                oModel.read("/YY1_ZGE_OUTWARD_OD_ITEM", {
                    filters: oFilters,
                    success: function (oData) {
                        var aItems = oData.results; // The array of read items
                        var oTableModel = new sap.ui.model.json.JSONModel();
                        oTableModel.setData({ items: aItems });
                        oModel.refresh(true);
                        // Set the model on the table and bind the rows
                        oTable.setModel(oTableModel);
                        oTable.bindRows("/items");
                        that.getView().byId("id_storeceipt_table").setVisible(true);
                        sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (oError) {
                        // Handle error
                        console.error("Error reading data: ", oError);
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
        },

            onEditValueHelpCancelPress: function () {
                this._oVHD.close();
            },

            onEditValueHelpAfterClose: function () {
                this._oVHD.destroy();
            },

            onEditFilterBarSearch: function (oEvent) {
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
                        new sap.ui.model.Filter({ path: "OutboundDelivery", operator: sap.ui.model.FilterOperator.Contains, value1: sSearchQuery }),
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


        // ===========================================================================

        OnDeliveryDocSuggest: function (oEvent) {
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
                            let oMultiInput20 = that.getView().byId("id_edit_sto_purchase_document_h");
                            
                                model0.read("/YY1_HEADER_ZGE_OUTWARD_GATEPAS", {
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

                            that.getView().byId("id_edit_sto_gateentry_h").setValue(value11.Id);
                            that.getView().byId("id_edit_sto_sapuuid_h").setValue(value11.SAP_UUID);

                            // that.getView().byId("id_edit_sto_purchase_document_h").setTokens(ReferenceDocument)
                            // that.getView().byId("id_edit_sto_plant_h").setValue(PlantCode)
                            // that.getView().byId("id_edit_sto_plant_name_h").setValue(PlantName)
                            // that.getView().byId("id_edit_sto_customer_h").setValue(CustomerCode)
                            // that.getView().byId("id_edit_sto_cust_name_h").setValue(CustomerName)
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
                            that.getView().byId("id_edit_sto_gate_date").setValue(GateEntryDate01)
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
                            
                            model011.read("/YY1_ZGE_INWARD_GATEPASS(guid'" + SAPUIID + "')/to_ITEM", {
                            
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

        },    
        
        
        OnStoChangeDocNoFragOpen:function(oEvent){
            if (!this.StoChangeDocNohead) {
                this.StoChangeDocNohead = sap.ui.xmlfragment(this.getView().getId("STODialogFrag"), "gatepassapp.view.inward.storeceipt.fragment.changedeletedocument", this);
                this.getView().addDependent(this.StoChangeDocNohead);
            }
            this.StoChangeDocNohead.open();
        },

        OnStoGateEntryNoFragOpen:function(oEvent){
            if (!this.SoDocChange) {
                this.SoDocChange = sap.ui.xmlfragment(this.getView().getId("STOGateEntryDocHead01_dialog"), "gatepassapp.view.inward.storeceipt.fragment.gateentrydocno", this);
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

                var multiInput = this.getView().byId("id_edit_sto_purchase_document_h");
                    multiInput.removeAllTokens();
                this.InitialDelDocNo = []; // Delivery Document No Based on create page gatepass no
        
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
                var model0 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                var model011 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                var that = this;
                    model0.read("/YY1_ZGE_INWARD_GATEPASS", {
                        filters: [filter], 
                        success: function (ODat, oRespons) {
                            let oMultiInput20 = that.getView().byId("id_edit_sto_purchase_document_h");
                            
                                model0.read("/YY1_HEADER_ZGE_OUTWARD_GATEPAS", {
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

                            // let ReferenceDocument = value11.ReferenceDocument;
                            // let ReferenceDocumentType = value11.ReferenceDocumentType;
                            // let PlantCode = value11.PlantCode;
                            // let PlantName = value11.PlantName;
                            // let SupplierCode = value11.SupplierCode;
                            // let SupplierName = value11.SupplierName;
                            // let SupplierType = value11.SupplierType;
                            // let CustomerCode = value11.CustomerCode;
                            // let CustomerName = value11.CustomerName;
                            // let CustomerType = value11.CustomerType;
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

                            // that.getView().byId("id_edit_sto_purchase_document_h").setTokens(ReferenceDocument)
                            // that.getView().byId("id_edit_sto_plant_h").setValue(PlantCode)
                            // that.getView().byId("id_edit_sto_plant_name_h").setValue(PlantName)
                            // that.getView().byId("id_edit_sto_customer_h").setValue(CustomerCode)
                            // that.getView().byId("id_edit_sto_cust_name_h").setValue(CustomerName)
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
                            that.getView().byId("id_edit_sto_gate_date").setValue(GateEntryDate01)
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
                            
                            model011.read("/YY1_ZGE_INWARD_GATEPASS(guid'" + SAPUIID + "')/to_ITEM", {
                            
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
            let Id = this.getView().byId("id_edit_sto_gateentry_h").getValue();

            var oFilter = new sap.ui.model.Filter("ItemNo", sap.ui.model.FilterOperator.EQ, DocumentItemNo);
            var oFilter1 = new sap.ui.model.Filter("ReferenceDocument", sap.ui.model.FilterOperator.EQ, DocumentNo);
            var oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'created');
            var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE5');
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
                    var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE5');
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
                    var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE5');
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

        OnUpdateSTO:async function(){
            sap.ui.core.BusyIndicator.show();
            
            let GateEntryNo = this.getView().byId("id_edit_sto_gateentry_h").getValue()
            if(GateEntryNo.trim() === ""){
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Please enter/select Gate Pass No...")
            }else{

                    let getArray = [
                        "id_edit_sto_gateentry_h",
                        "id_edit_sto_purchase_document_h",
                        "id_edit_sto_gate_date",
                        "id_edit_sto_vehicle_type_h",
                        "id_edit_sto_vehno_h",
                        "id_edit_sto_transporter_mode_h",
                        "id_edit_sto_transporter_h",
                        "id_edit_sto_tar_wt_h",
                        "id_edit_sto_net_wt_h",
                        "id_edit_sto_gross_wt_h",
                        "id_edit_sto_remark_h"
                    ];

                    let RequiredMan = '';
                    let ValidationArrayNonDatas = [];
                    for(let kk=0; kk < getArray.length; kk++){
                        let GetThisId = this.getView().byId(getArray[kk]);
                        if(getArray[kk] === "id_edit_sto_purchase_document_h"){
                            let GetTokens = this.getView().byId("id_edit_sto_purchase_document_h").getTokens();
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

                    let GetTokens = this.getView().byId("id_edit_sto_purchase_document_h").getTokens();
                    let Delivery_Document_Array = [];

                    if (GetTokens && GetTokens.length) {
                        GetTokens.map(function (oContext) {
                            Delivery_Document_Array.push(oContext.getKey());
                            return;
                        });
                    }

                let GateEntryNo = this.getView().byId("id_edit_sto_gateentry_h").getValue()
                let SAP_UUID_H = this.getView().byId("id_edit_sto_sapuuid_h").getValue()
                let PlantCode = this.getView().byId("id_edit_sto_plant_h").getValue()
                let PlantName = this.getView().byId("id_edit_sto_plant_name_h").getValue()
                let CustomerCode = this.getView().byId("id_edit_sto_customer_h").getValue()
                let CustomerName = this.getView().byId("id_edit_sto_cust_name_h").getValue()
                let GateEntryDate = this.getView().byId("id_edit_sto_gate_date").getValue()
                //     let DateArr = GateEntryDate00.split("-")
                // let GateEntryDate = DateArr[2] + '-' + DateArr[1] + '-' + DateArr[0];
                // console.log("GateEntryDate00GateEntryDate00", GateEntryDate00)
                // console.log("GateEntryDateGateEntryDate", GateEntryDate00)
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
    
                // if(PlantCode!=="" && CustomerCode!=="" && Transporter!== "" && VehicleNo !==""){
                   
                if (ValidationArrayNonDatas.length === 0 || ValidationArrayNonDatas.length === "0" ){

                         var oEntrySTOHEAD = {
                            Id:GateEntryNo,
                            GateEntryDate: new Date(GateEntryDate),
                            VehicleType: VehicleType,
                            VehicleNo: VehicleNo,
                            TransporterMode: TransporterMode,
                            Transporter: Transporter,
                            TareWeight: TareWeight,
                            NetWeight: NetWeight,
                            GrossWeight: GrossWeight,
                            Remarks: Remarks,
                            Status : "created",
    
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
                            var multiInput = that.getView().byId("id_edit_sto_purchase_document_h");
                                multiInput.removeAllTokens();
                            that.getView().byId("id_edit_sto_sapuuid_h").setValue("")
                            that.getView().byId("id_edit_sto_plant_h").setValue("")
                            that.getView().byId("id_edit_sto_plant_name_h").setValue("")
                            that.getView().byId("id_edit_sto_customer_h").setValue("")
                            that.getView().byId("id_edit_sto_cust_name_h").setValue("")
                            that.getView().byId("id_edit_sto_gate_date").setValue("")
                            that.getView().byId("id_edit_sto_vehicle_type_h").setSelectedItem("")
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
                        sap.m.MessageToast.show("Please Enter Mandatory Fields...")
                    }
                    //  }else{
                    //     sap.ui.core.BusyIndicator.hide();
             
                    //      if(GateEntryNo ===""){
                    //          this.getView().byId("id_edit_sto_gateentry_h").setValueState(sap.ui.core.ValueState.Error);
                    //          this.getView().byId("id_edit_sto_gateentry_h").setValueStateText("Please Select Gate Entry No");
                    //      }else{
                    //          this.getView().byId("id_edit_sto_gateentry_h").setValueState(sap.ui.core.ValueState.None);
                    //          this.getView().byId("id_edit_sto_gateentry_h").setValueStateText("");
                    //      }
             
                    //      if(Transporter ===""){
                    //          this.getView().byId("id_edit_sto_transporter_h").setValueState(sap.ui.core.ValueState.Error);
                    //          this.getView().byId("id_edit_sto_transporter_h").setValueStateText("Please Select Transporter");
                    //      }else{
                    //          this.getView().byId("id_edit_sto_transporter_h").setValueState(sap.ui.core.ValueState.None);
                    //          this.getView().byId("id_edit_sto_transporter_h").setValueStateText("");
                    //      }
             
                    //      if(VehicleNo ===""){
                    //          this.getView().byId("id_edit_sto_vehno_h").setValueState(sap.ui.core.ValueState.Error);
                    //          this.getView().byId("id_edit_sto_vehno_h").setValueStateText("Please Enter ");
                    //      }else{
                    //          this.getView().byId("id_edit_sto_vehno_h").setValueState(sap.ui.core.ValueState.None);
                    //          this.getView().byId("id_edit_sto_vehno_h").setValueStateText("");
                    //      }
                      
                    //  }
    
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
                that.getView().byId("id_storeceipt_table").setVisible(false)

                that.getView().byId("id_edit_sto_gateentry_h").setValue("")
                var multiInput = that.getView().byId("id_edit_sto_purchase_document_h");
                multiInput.removeAllTokens();
                that.getView().byId("id_edit_sto_sapuuid_h").setValue("")
                that.getView().byId("id_edit_sto_plant_h").setValue("")
                that.getView().byId("id_edit_sto_plant_name_h").setValue("")
                that.getView().byId("id_edit_sto_customer_h").setValue("")
                that.getView().byId("id_edit_sto_cust_name_h").setValue("")
                that.getView().byId("id_edit_sto_gate_date").setValue("")
                that.getView().byId("id_edit_sto_vehicle_type_h").setSelectedItem("")
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
                that.getView().byId("id_storeceipt_table").setVisible(false)

                that.getView().byId("id_edit_sto_gateentry_h").setValue("")
                var multiInput = that.getView().byId("id_edit_sto_purchase_document_h");
                    multiInput.removeAllTokens();
                that.getView().byId("id_edit_sto_sapuuid_h").setValue("")
                that.getView().byId("id_edit_sto_plant_h").setValue("")
                that.getView().byId("id_edit_sto_plant_name_h").setValue("")
                that.getView().byId("id_edit_sto_customer_h").setValue("")
                that.getView().byId("id_edit_sto_cust_name_h").setValue("")
                that.getView().byId("id_edit_sto_gate_date").setValue("")
                that.getView().byId("id_edit_sto_vehicle_type_h").setSelectedItem("")
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
        },

        });
    });
