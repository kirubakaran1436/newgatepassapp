sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/type/String',
    'sap/m/ColumnListItem',
    'sap/m/Label',
    'sap/m/SearchField',
    'sap/m/Token',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/odata/v2/ODataModel',
    'sap/ui/table/Column',
    'sap/m/Column',
    'sap/m/Text'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, TypeString, ColumnListItem, Label, SearchField, Token, Filter, FilterOperator, ODataModel, UIColumn, MColumn, Text) {
        "use strict";

        return Controller.extend("gatepassapp.controller.gateentryclose.gateentryclose", {
            onInit: function () {

            },

            OnGataPassNoFragment: function () {
                sap.ui.core.BusyIndicator.show()
                var that = this;
                var aCombinedData = [];

                var that = this;
                var oModel1 = that.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                var oModel2 = that.getView().getModel("YY1_ZGE_OUTWARD_GATEPASS_CDS");

                // Function to read data from the first OData model
                var fnReadModel1 = function () {
                    return new Promise(function (resolve, reject) {
                        oModel1.read("/YY1_ZGE_INWARD_GATEPASS", {
                            success: function (oData1) {
                                aCombinedData = aCombinedData.concat(oData1.results);
                                resolve();
                            },
                            error: function (oError1) {
                                reject("Error reading data from YY1_ZGE_INWARD_GATEPASS_CDS: " + oError1);
                            }
                        });
                    }.bind(that));
                };

                // Function to read data from the second OData model
                var fnReadModel2 = function () {
                    return new Promise(function (resolve, reject) {
                        oModel2.read("/YY1_ZGE_OUTWARD_GATEPASS", {
                            success: function (oData2) {
                                aCombinedData = aCombinedData.concat(oData2.results);
                                resolve();
                            },
                            error: function (oError2) {
                                reject("Error reading data from model2: " + oError2);
                            }
                        });
                    }.bind(that));
                };

                // Execute both OData requests in parallel
                Promise.all([fnReadModel1(), fnReadModel2()]).then(function () {
                    // Create a new JSON model and set the combined data
                    that.oJSONModel = new sap.ui.model.json.JSONModel({
                        Datas: aCombinedData
                    });
                    that.getView().setModel(that.oJSONModel, "oJSONModel");


                    that._oBasicSearchField = new sap.m.SearchField();
                    that.loadFragment({
                        name: "gatepassapp.view.gateentryclose.fragment.ValueHelpDialogFilterbar"
                    }).then(function (oDialog) {
                        var oFilterBar = oDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
                        that._oVHD = oDialog;

                        that.getView().addDependent(oDialog);

                        // Set key fields for filtering in the Define Conditions Tab
                        oDialog.setRangeKeyFields([{
                            label: "Id",
                            key: "Id",
                            type: "string",
                            typeInstance: new sap.ui.model.type.String({}, {
                                maxLength: 10
                            })
                        }]);

                        // Set Basic Search for FilterBar
                        oFilterBar.setFilterBarExpanded(false);
                        oFilterBar.setBasicSearch(that._oBasicSearchField);

                        // Trigger filter bar search when the basic search is fired
                        that._oBasicSearchField.attachSearch(function () {
                            oFilterBar.search();
                        });

                        console.log("that.oCombinedModel", that.oJSONModel)

                        oDialog.getTableAsync().then(function (oTable) {

                            oTable.setModel(that.oJSONModel);

                            // For Desktop and tabled the default table is sap.ui.table.Table
                            if (oTable.bindRows) {
                                // Bind rows to the ODataModel and add columns
                                oTable.bindAggregation("rows", {
                                    path: "oJSONModel>/Datas",
                                    events: {
                                        dataReceived: function () {
                                            oDialog.update();
                                        }
                                    }
                                });
                                oColumnProductCode = new sap.ui.table.Column({ label: new sap.m.Label({ text: "Gate Pass No" }), template: new sap.m.Text({ wrapping: false, text: "{oJSONModel>Id}" }) });
                                oColumnProductCode.data({
                                    fieldName: "Id"
                                });
                                oColumnProductName = new sap.ui.table.Column({ label: new sap.m.Label({ text: "SAP_UUID", visible: false }), template: new sap.m.Text({ wrapping: false, text: "{oJSONModel>SAP_UUID}", visible: false }) });
                                oColumnProductName.data({
                                    fieldName: "SAP_UUID"
                                });
                                oTable.addColumn(oColumnProductCode);
                                oTable.addColumn(oColumnProductName);
                            }

                            // For Mobile the default table is sap.m.Table
                            if (oTable.bindItems) {
                                // Bind items to the ODataModel and add columns
                                oTable.bindAggregation("items", {
                                    path: "oJSONModel>/Datas",
                                    template: new sap.m.ColumnListItem({
                                        cells: [new sap.m.Label({ text: "{oJSONModel>Id}" }), new sap.m.Label({ text: "{oJSONModel>SAP_UUID}", visible: false })]
                                    }),
                                    events: {
                                        dataReceived: function () {
                                            oDialog.update();
                                        }
                                    }
                                });
                                oTable.addColumn(new sap.m.Column({ header: new sap.m.Label({ text: "Gate Pass No" }) }));
                                oTable.addColumn(new sap.m.Column({ header: new sap.m.Label({ text: "SAP_UUID" }), visible: false }));
                            }
                            oDialog.update();
                        }.bind(that));

                        // oDialog.setTokens(that._oMultiInput.getTokens());
                        oDialog.open();
                        sap.ui.core.BusyIndicator.hide()
                    }.bind(that));


                }.bind(that)).catch(function (error) {
                    // Handle errors
                    console.error(error);
                    sap.ui.core.BusyIndicator.hide()
                });

            },

            onValueHelpOkPress: function (oEvent) {
                sap.ui.core.BusyIndicator.show()
                var aTokens = oEvent.getParameter("tokens");
                this.getView().byId("id_gate_pass_no").setValue(aTokens[0].getKey());
                let GetStatus = this.getView().byId("id_gateentrystatus");
                let text = aTokens[0].getKey();
                const myArray = text.split("", 1);
                var model0 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                var model1 = this.getView().getModel("YY1_ZGE_OUTWARD_GATEPASS_CDS");
                let Filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, aTokens[0].getKey());
                var that = this;

                if(myArray[0] === '1' || myArray[0] === '2' || myArray[0] === '3' || myArray[0] === '4'){
                    model0.read("/YY1_ZGE_INWARD_GATEPASS", {
                        filters:[Filter],
                        success: function (oData1, oRespons) {
                            console.log("oData1oData1:",oData1);
                            let GetSAP_UUID = oData1.results
                            that.getView().byId("id_sap_uuid").setValue(GetSAP_UUID[0].SAP_UUID);
                            GetStatus.setText(GetSAP_UUID[0].Status)
                            GetStatus.setVisible(true)
                            if(GetSAP_UUID[0].Status === "created"){
                                that.getView().byId("id_close").setVisible(true);
                            }else{
                                that.getView().byId("id_close").setVisible(false); 
                            }
                        }
                    });

                    model0.read("/YY1_ITEM_ZGE_INWARD_GATEPASS", {
                        filters:[Filter],
                        success: function (oData, oRespons) {
                            console.log("oData:",oData);
                            var GPEoutmodel = new sap.ui.model.json.JSONModel({
                                datas: oData.results
                            });
                            that.getView().setModel(GPEoutmodel, "GPEoutmodel");
                            console.log(GPEoutmodel);
                        }
                    });
                }
                else if(myArray[0] === '5' || myArray[0] === '6' || myArray[0] === '7' || myArray[0] === '8'){
                    model1.read("/YY1_ZGE_OUTWARD_GATEPASS", {
                        filters:[Filter],
                        success: function (oData1, oRespons) {
                            console.log("oData1oData2:",oData1);
                            let GetSAP_UUID = oData1.results
                            that.getView().byId("id_sap_uuid").setValue(GetSAP_UUID[0].SAP_UUID);
                            GetStatus.setText(GetSAP_UUID[0].Status)
                            GetStatus.setVisible(true)
                            if(GetSAP_UUID[0].Status === "created"){
                                that.getView().byId("id_close").setVisible(true);
                            }else{
                                that.getView().byId("id_close").setVisible(false); 
                            }
                        }
                    });

                    model1.read("/YY1_ITEM_ZGE_OUTWARD_GATEPASS", {
                        filters:[Filter],
                        success: function (oData, oRespons) {
                            console.log("oData:",oData);
                            var GPEoutmodel = new sap.ui.model.json.JSONModel({
                                datas: oData.results
                            });
                            that.getView().setModel(GPEoutmodel, "GPEoutmodel");
                            console.log(GPEoutmodel);
                        }
                    });
                }

                // const str = aTokens[0].getText();
                // const parts = str.split("(");
                // const part1 = parts[0]; // "5fac16aa-70b5-1ede-b8d7-1e10aad77373 "
                // const part2 = parts[1].slice(0, -1); // "7000000001"
                // that.getView().byId("id_sap_uuid").setValue(part1);
                that._oVHD.destroy();
                sap.ui.core.BusyIndicator.hide()
            },

            onValueHelpCancelPress: function () {
                this._oVHD.close();
            },

            onFilterBarSearch: function (oEvent) {
                console.log(oEvent);
                var sSearchQuery = this._oBasicSearchField.getValue(),
                    aSelectionSet = oEvent.getParameter("selectionSet");

                var aFilters = aSelectionSet && aSelectionSet.reduce(function (aResult, oControl) {
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
                        new sap.ui.model.Filter({ path: "Id", operator: sap.ui.model.FilterOperator.Contains, value1: sSearchQuery }),
                        new sap.ui.model.Filter({ path: "SAP_UUID", operator: sap.ui.model.FilterOperator.Contains, value1: sSearchQuery }),
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

            OnChangeDatas:function(){
                let text = this.getView().byId("id_gate_pass_no").getValue();
                if(text.length === 10){
                    const myArray = text.split("", 1);
                    var model0 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                    var model1 = this.getView().getModel("YY1_ZGE_OUTWARD_GATEPASS_CDS");
                    let Filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, text);
                    var that = this;
    
                    if(myArray[0] === '1' || myArray[0] === '2' || myArray[0] === '3' || myArray[0] === '4'){
                        model0.read("/YY1_ZGE_INWARD_GATEPASS", {
                            filters:[Filter],
                            success: function (oData1, oRespons) {
                                console.log("oData1oData1:",oData1);
                                let GetSAP_UUID = oData1.results
                                that.getView().byId("id_sap_uuid").setValue(GetSAP_UUID[0].SAP_UUID);
                            }
                        });
    
                        model0.read("/YY1_ITEM_ZGE_INWARD_GATEPASS", {
                            filters:[Filter],
                            success: function (oData, oRespons) {
                                console.log("oData:",oData);
                                var GPEoutmodel = new sap.ui.model.json.JSONModel({
                                    datas: oData.results
                                });
                                that.getView().setModel(GPEoutmodel, "GPEoutmodel");
                                console.log(GPEoutmodel);
                            }
                        });
                        that.getView().byId("id_close").setVisible(true); 
                    }
                    else if(myArray[0] === '5' || myArray[0] === '6' || myArray[0] === '7' || myArray[0] === '8'){
                        model1.read("/YY1_ZGE_OUTWARD_GATEPASS", {
                            filters:[Filter],
                            success: function (oData1, oRespons) {
                                console.log("oData1oData2:",oData1);
                                let GetSAP_UUID = oData1.results
                                that.getView().byId("id_sap_uuid").setValue(GetSAP_UUID[0].SAP_UUID);
                            }
                        });
    
                        model1.read("/YY1_ITEM_ZGE_OUTWARD_GATEPASS", {
                            filters:[Filter],
                            success: function (oData, oRespons) {
                                console.log("oData:",oData);
                                var GPEoutmodel = new sap.ui.model.json.JSONModel({
                                    datas: oData.results
                                });
                                that.getView().setModel(GPEoutmodel, "GPEoutmodel");
                                console.log(GPEoutmodel);
                            }
                        });
                        that.getView().byId("id_close").setVisible(true); 
                    }
    
                }else{
                    sap.m.MessageToast.show("Please enter valid gate entry no")
                    this.getView().byId("id_sap_uuid").setValue("");
                    var GPEoutmodel = new sap.ui.model.json.JSONModel({
                        datas: []
                    });
                    this.getView().setModel(GPEoutmodel, "GPEoutmodel");
                    this.getView().byId("id_close").setVisible(false); 
    
                }
            },

            OnClose:function(){
                      
                    let text = this.getView().byId("id_gate_pass_no").getValue();
                    if(text !==""){
                    sap.ui.core.BusyIndicator.show();
                    const myArray = text.split("", 1);

                    if(myArray[0] === '1' || myArray[0] === '2' || myArray[0] === '3' || myArray[0] === '4'){
                        var Model01 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                        var Model02 = this.getView().getModel("YY1_ZGE_INWARD_GATEPASS_CDS");
                        var EntitySetHEAD = "/YY1_ZGE_INWARD_GATEPASS"
                        var EntitySetITEM = "/YY1_ITEM_ZGE_INWARD_GATEPASS"
                    }
                    else if(myArray[0] === '5' || myArray[0] === '6' || myArray[0] === '7' || myArray[0] === '8'){
                        var Model01 = this.getView().getModel("YY1_ZGE_OUTWARD_GATEPASS_CDS");
                        var Model02 = this.getView().getModel("YY1_ZGE_OUTWARD_GATEPASS_CDS");
                        var EntitySetHEAD = "/YY1_ZGE_OUTWARD_GATEPASS"
                        var EntitySetITEM = "/YY1_ITEM_ZGE_OUTWARD_GATEPASS"
                    }
        
                    let gatepassno = this.getView().byId("id_gate_pass_no").getValue();
                    
                        let SAP_UUID_H = this.getView().byId("id_sap_uuid").getValue();
                        var Table_Id = this.getView().byId("Table_Id");
                        var Table_Length = Table_Id.getRows().length;
            
                        for (var i = 0; i < Table_Length; i++) {
                            var SAP_UUID_I = Table_Id.getRows()[i].getCells()[0].getText();
                            if(SAP_UUID_I === ""){
                                break;
                            }
    
                               var itemDataSTO = {
                                    Status:"closed",
                                };
            
                                console.log("itemDataSTO:", itemDataSTO);
            
                                Model02.setHeaders({
                                    "X-Requested-With": "X",
                                    "Content-Type": "application/json"
                                });
                
                                Model02.update(EntitySetITEM+"(guid'" + SAP_UUID_I + "')", itemDataSTO, {
                                    success: function(data) {
                                    console.log("STO Item Updated:", data);
                                    },
                                    error: function(error) {
                                    console.error("Error updating item:", error);
                                    sap.ui.core.BusyIndicator.hide();
                                    }
                                });
                            }
            
                        var oEntry1 = {
                            Status: "closed",
                        };
                        var that = this;
                        Model01.setHeaders({
                        "X-Requested-With": "X",
                        "Content-Type": "application/json"
                        });
                        Model01.update(EntitySetHEAD+"(guid'" + SAP_UUID_H + "')", oEntry1, {
                        success: function(data) {
                            console.log("Header Updated:", data);
                            sap.m.MessageBox.success("Gate Pass No " + gatepassno + " Closed", {
                                title: "Gate Entry Close",
                                id: "messageBoxId1",
                                contentWidth: "100px",
                            });        
                            that.getView().byId("id_gate_pass_no").setValue("");
                            that.getView().byId("id_sap_uuid").setValue("");
                            var GPEoutmodel = new sap.ui.model.json.JSONModel({
                                datas: []
                            });
                            that.getView().setModel(GPEoutmodel, "GPEoutmodel");
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function(error) {
                            console.error("Error updating header:", error);
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show(" "+gatepassno+" Error")
                        }
                        });
        
                    }else{
                        sap.m.MessageToast.show(" Please Enter Valid Gate Entry no")
                        sap.ui.core.BusyIndicator.hide();
                    }
                    
                    // ---------- End Item Level        
            },

            OnCancel:function(){
                this.getView().byId("id_gate_pass_no").setValue("");
                this.getView().byId("id_sap_uuid").setValue("");
                var GPEoutmodel = new sap.ui.model.json.JSONModel({
                    datas: []
                });
                this.getView().setModel(GPEoutmodel, "GPEoutmodel");

            },

        });
    });
