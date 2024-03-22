sap.ui.define([
    // "sap/ui/core/mvc/Controller",
    "gatepassapp/controller/outward/subcontracting/editcontroller",
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

        return Controller.extend("gatepassapp.controller.outward.subcontracting.createsubcontracting", {
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
                this.getView().setModel(JSonModel, "JModel1");
               
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

                this.getView().byId("id_sub_gate_date").setValue(this.CurrentDate)
            // ----Start For Current Date -----

                this.JSonModelMadDatas = new sap.ui.model.json.JSONModel({
                    Datas : []
                });
                this.getView().setModel(this.JSonModelMadDatas, "JSonModelMadDatas");


                this.oJSONModel = new sap.ui.model.json.JSONModel({
                    Datas: []
                });
                this.getView().setModel(this.oJSONModel, "oJSONModel");

                this.oJSONModelSub = new sap.ui.model.json.JSONModel({
                    Datas: []
                });
                this.getView().setModel(this.oJSONModelSub, "oJSONModelSub");


                // ---------------For Multi Input--------------------------------------
                var oMultiInput;
                this.oMultiInputEdit;
                oMultiInput = this.byId("id_sub_material_document_h");
                oMultiInput.addValidator(this._onMultiInputValidate);
                this._oMultiInput = oMultiInput;
                try{
                    this.oMultiInputEdit = this.byId("id_edit_sto_purchase_document_h");
                    this.oMultiInputEdit.addValidator(this._onMultiInputValidate);
                    this._oMultiInputEdit = this.oMultiInputEdit;
                }catch (err){
                    console.log(err)
                }
                // this.oProductsModel = this.getView().getModel("YY1_ZGE_INWARD_MD_HEAD_CDS");
                // this.getView().setModel(this.oProductsModel);

                // this.oProductsModelItem = this.getView().getModel("YY1_ZGE_INWARD_MD_ITEM_CDS");
                // this.getView().setModel(this.oProductsModelItem);
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
                                if(item.AppId === "GE11"){
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

                let Get_Mat_Doc_Date = this.getView().byId("id_sub_materialdocyear_h").getValue();
                console.log(Get_Mat_Doc_Date);
                // ====================================================================
                var oFilter1 = new sap.ui.model.Filter("MaterialDocumentYear", sap.ui.model.FilterOperator.EQ, Get_Mat_Doc_Date);
                var oFilter2 = new sap.ui.model.Filter("GoodsMovementType", sap.ui.model.FilterOperator.EQ,"541");
                var oModel1 = this.getView().getModel("YY1_ZGE_INWARD_MD_ITEM_CDS"); // Replace with your actual OData model name
                var oFilters1 = [oFilter1, oFilter2];
                var that = this;

                oModel1.read("/YY1_ZGE_INWARD_MD_ITEM", {

                    filters: oFilters1,

                    success: function (oData) {

                        var aItems = oData.results; // The array of read items

                        const unique = aItems.filter((obj, index) => {
                            return index === aItems.findIndex(o => obj.MaterialDocument === o.MaterialDocument);
                        });

                        console.log(unique);

                        that.oJSONModel = new sap.ui.model.json.JSONModel({
                            Datas: unique
                        });
                        that.getView().setModel(that.oJSONModel, "oJSONModel");
                        console.log("oJSONModeloJSONModel:", that.oJSONModel);
                        // oTable.setModel(that.oJSONModel);


                        that._oBasicSearchField = new sap.m.SearchField();
                        that.loadFragment({
                            name: "gatepassapp.view.outward.subcontracting.fragment.ValueHelpDialogFilterbar"
                        }).then(function(oDialog) {
                            var oFilterBar = oDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
                            that._oVHD = oDialog;
            
                            that.getView().addDependent(oDialog);
            
                            // Set key fields for filtering in the Define Conditions Tab
                            oDialog.setRangeKeyFields([{
                                label: "MaterialDocument",
                                key: "MaterialDocument",
                                type: "string",
                                typeInstance: new sap.ui.model.type.String({}, {
                                    maxLength: 10
                                })
                            }]);
            
                            // Set Basic Search for FilterBar
                            oFilterBar.setFilterBarExpanded(false);
                            oFilterBar.setBasicSearch(that._oBasicSearchField);
            
                            // Trigger filter bar search when the basic search is fired
                            that._oBasicSearchField.attachSearch(function() {
                                oFilterBar.search();
                            });
            
                            oDialog.getTableAsync().then(function (oTable) {
            
                                oTable.setModel(that.oJSONModel);
            
                                // For Desktop and tabled the default table is sap.ui.table.Table
                                if (oTable.bindRows) {
                                    // Bind rows to the ODataModel and add columns
                                    oTable.bindAggregation("rows", {
                                        path: "oJSONModel>/Datas",
                                        events: {
                                            dataReceived: function() {
                                                oDialog.update();
                                            }
                                        }
                                    });
                                    oColumnProductCode = new sap.ui.table.Column({label: new sap.m.Label({text: "Material Document"}), template: new sap.m.Text({wrapping: false, text: "{oJSONModel>MaterialDocument}"})});
                                    oColumnProductCode.data({
                                        fieldName: "MaterialDocument"
                                    });
                                    oColumnProductName = new sap.ui.table.Column({label: new sap.m.Label({text: "Movement Type"}), template: new sap.m.Text({wrapping: false, text: "{oJSONModel>GoodsMovementType}"})});
                                    oColumnProductName.data({
                                        fieldName: "GoodsMovementType"
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
                                            cells: [new sap.m.Label({text: "{oJSONModel>MaterialDocument}"}), new sap.m.Label({text: "{oJSONModel>GoodsMovementType}"})]
                                        }),
                                        events: {
                                            dataReceived: function() {
                                                oDialog.update();
                                            }
                                        }
                                    });
                                    oTable.addColumn(new sap.m.Column({header: new sap.m.Label({text: "Material Document"})}));
                                    oTable.addColumn(new sap.m.Column({header: new sap.m.Label({text: "Movement Type"})}));
                                }
                                oDialog.update();
                            }.bind(that));
            
                            oDialog.setTokens(that._oMultiInput.getTokens());
                            oDialog.open();
                        }.bind(that));
        


                    },

                    error: function (oError) {
                        console.error("Error reading data: ", oError);
                        sap.ui.core.BusyIndicator.hide();

                    }
                
                })
            },


            OnVehDocSuggestFrag : function(oVehicle){
                // alert("get Clicked");
            var oItem = oVehicle.getParameter("selectedItem");
            var Gross_WT = oItem ? oItem.getKey() : "";
            var GetValue = oItem ? oItem.getText() : "";
    
               // Do something with key and text values
               console.log( oItem);
               console.log("Selected Key:", Gross_WT);
               console.log("Selected Text:", GetValue);
    
             this.getView().byId("id_sub_tar_wt_h").setValue(Gross_WT)
    
    
            },

            
            onValueHelpOkPress: function (oEvent) {
                var aTokens = oEvent.getParameter("tokens");
                this._oMultiInput.setTokens(aTokens);
                this._oVHD.close();

                var oMultiInput = this.getView().byId("id_sub_material_document_h");
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

                var aTokens = this.getView().byId("id_sub_material_document_h").getTokens();
                    console.log("aTokens:",aTokens);
                    var aMultiInputValues = aTokens.map(function (oToken) {
                        return oToken.getKey();
                    });
                        if(aTokens.length > 0){
                            var aFilters1 = aMultiInputValues.map(function (sValue) {
                                return new sap.ui.model.Filter("MaterialDocument", sap.ui.model.FilterOperator.EQ, sValue);
                            });
                          
                        }else{
                            var aFilters1 = new sap.ui.model.Filter("MaterialDocument", sap.ui.model.FilterOperator.EQ, "");
                        }

                // var oFilter = new sap.ui.model.Filter("MaterialDocument", sap.ui.model.FilterOperator.EQ, GetKey);
                var oTable = this.getView().byId("TableId");
                var oModel = this.getView().getModel("YY1_ZGE_INWARD_MD_ITEM_CDS"); // Replace with your actual OData model name
                var oFilters = [aFilters1];
                var that = this;
                oModel.read("/YY1_ZGE_INWARD_MD_ITEM", {
                    filters: oFilters,
                    success: function (oData) {
                        var aItems = oData.results; // The array of read items
                        var oTableModel = new sap.ui.model.json.JSONModel();
                        oTableModel.setData({ items: aItems });
                        oModel.refresh(true);
                        // Set the model on the table and bind the rows
                        oTable.setModel(oTableModel);
                        oTable.bindRows("/items");
                        that.getView().byId("TableId").setVisible(true);
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
                        new sap.ui.model.Filter({ path: "MaterialDocument", operator: sap.ui.model.FilterOperator.Contains, value1: sSearchQuery }),
                        new sap.ui.model.Filter({ path: "GoodsMovementType", operator: sap.ui.model.FilterOperator.Contains, value1: sSearchQuery })
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

            OnMatDocDateChange:function(){
                let Mat_Doc_Date = this.getView().byId("id_sub_materialdocyear_h").getValue();
                if(Mat_Doc_Date.trim() !== ""){
                    this.getView().byId("id_sub_material_document_h").setEditable(true);

                    let Get_Mat_Doc_Date = this.getView().byId("id_sub_materialdocyear_h").getValue();
                    console.log(Get_Mat_Doc_Date);
                    // ====================================================================
                    var oFilter1 = new sap.ui.model.Filter("MaterialDocumentYear", sap.ui.model.FilterOperator.EQ, Get_Mat_Doc_Date);
                    var oFilter2 = new sap.ui.model.Filter("GoodsMovementType", sap.ui.model.FilterOperator.EQ,"541");
                    var oModel1 = this.getView().getModel("YY1_ZGE_INWARD_MD_ITEM_CDS"); // Replace with your actual OData model name
                    var oFilters1 = [oFilter1, oFilter2];
                    var that = this;

                    oModel1.read("/YY1_ZGE_INWARD_MD_ITEM", {

                        filters: oFilters1,

                        success: function (oData) {

                            var aItems = oData.results; // The array of read items

                            const unique = aItems.filter((obj, index) => {
                                return index === aItems.findIndex(o => obj.MaterialDocument === o.MaterialDocument);
                            });

                            console.log(unique);

                            that.oJSONModelSub = new sap.ui.model.json.JSONModel({
                                Datas: unique
                            });
                            that.getView().setModel(that.oJSONModelSub, "oJSONModelSub");
                            console.log("oJSONModeloJSONModelSub:", that.oJSONModelSub);

                        }
                    });    

                }else{
                    this.getView().byId("id_sub_material_document_h").setEditable(false);
                }

                let str1 = "GeeksforGeeks";
                let str2 = "Geeks123";
                
                let regex = /^[a-zA-Z]+$/;
                
                console.log(regex.test(str1));
                console.log(regex.test(str2));
                
            },  

            ontokenupdate:function(oEvent){
                sap.ui.core.BusyIndicator.show();
                try{
                    var sType = oEvent.getParameter("type");
                    let GetTokens = this.getView().byId("id_sub_material_document_h").getTokens();
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
                            return new sap.ui.model.Filter("MaterialDocument", sap.ui.model.FilterOperator.EQ, sValue);
                        });
                    }else{
                        var aFilters1 = new sap.ui.model.Filter("MaterialDocument", sap.ui.model.FilterOperator.EQ, "")
                    } 

                        var oTable = this.getView().byId("TableId");
                        var oModel = this.getView().getModel("YY1_ZGE_INWARD_MD_ITEM_CDS"); // Replace with your actual OData model name
                        var oFilters = [aFilters1];
                        var that = this;
                        oModel.read("/YY1_ZGE_INWARD_MD_ITEM", {
                            filters: oFilters,
                            success: function (oData) {
                                var aItems = oData.results; // The array of read items
                                var oTableModel = new sap.ui.model.json.JSONModel();
                                oTableModel.setData({ items: aItems });
                                oModel.refresh(true);
                                // Set the model on the table and bind the rows
                                oTable.setModel(oTableModel);
                                oTable.bindRows("/items");
                                that.getView().byId("TableId").setVisible(true);
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
                        var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE11');
                        var oFilter4 = new sap.ui.model.Filter({
                            filters: [
                                new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, 'created'),
                                new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, '')
                            ],
                            and: false
                        });
                
                        var oModel2 = that.getView().getModel("YY1_ZGE_OUTWARD_GATEPASS_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4];
    
                        var CalData = 0;
                
                        oModel2.read("/YY1_ITEM_ZGE_OUTWARD_GATEPASS", {
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
                        var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE11');
                        var oFilter4 = new sap.ui.model.Filter({
                            filters: [
                                new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, 'created'),
                                new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, '')
                            ],
                            and: false
                        });
                
                        var oModel2 = that.getView().getModel("YY1_ZGE_OUTWARD_GATEPASS_CDS");
                        var oFilters = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4];

                        var CalData = 0;
                
                        oModel2.read("/YY1_ITEM_ZGE_OUTWARD_GATEPASS", {
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

            Quantity_to_Post_InputyLine:function(oEvent){
                let DocumentItemNo = oEvent.getSource().getParent().getCells()[0].getValue(); 
                let DocumentNo = oEvent.getSource().getParent().getCells()[1].getValue(); 
                let Order_Quantity = oEvent.getSource().getParent().getCells()[5].getValue(); 
                let Enter_Quantity = oEvent.getSource().getParent().getCells()[8].getValue(); 
                let Pending_Quantity = oEvent.getSource().getParent().getCells()[7].getValue();
                let Enter_Quantity_Float = parseFloat(Enter_Quantity.trim());
                let Order_Quantity_Float = parseFloat(Order_Quantity.trim());


                var oFilter = new sap.ui.model.Filter("ItemNo", sap.ui.model.FilterOperator.EQ, DocumentItemNo);
                var oFilter1 = new sap.ui.model.Filter("ReferenceDocument", sap.ui.model.FilterOperator.EQ, DocumentNo);
                var oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'created');
                var oFilter3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, 'GE11');
                var oFilter4 = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, 'created'),
                        new sap.ui.model.Filter("ItemsStatus", sap.ui.model.FilterOperator.EQ, '')
                    ],
                    and: false
                });
                var that = this;
                var oModel2 = that.getView().getModel("YY1_ZGE_OUTWARD_GATEPASS_CDS");
                var oFilters = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4];
    
                let Pending_Quantity_Float = 0;
            
                oModel2.read("/YY1_ITEM_ZGE_OUTWARD_GATEPASS", {
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

            OnCancel:function(){
                sap.ui.core.BusyIndicator.show();
                var oTable = this.getView().byId("TableId");
                var oTableModel = new sap.ui.model.json.JSONModel();
                oTableModel.setData({ items: "" });
                oTable.setModel(oTableModel);
                oTable.bindRows("/items");

                this.getView().byId("id_sub_materialdocyear_h").setValue("");
                var multiInput = this.getView().byId("id_sub_material_document_h");
                        multiInput.removeAllTokens();
                this.getView().byId("id_sub_material_document_h").setEditable(false);
                this.getView().byId("id_sub_vehno_h").setValue("");
                // this.getView().byId("id_sub_vehicle_type_h").setValue("");
                this.getView().byId("id_sub_transporter_h").setValue("");
                // this.getView().byId("id_sub_transporter_mode_h").setValue("");
                this.getView().byId("id_sub_tar_wt_h").setValue("");
                this.getView().byId("id_sub_net_wt_h").setValue("");
                this.getView().byId("id_sub_gross_wt_h").setValue("");
                this.getView().byId("id_sub_challan_no_h").setValue("");
                this.getView().byId("id_sub_challan_date_h").setValue("");
                this.getView().byId("id_sub_remark_h").setValue("");
                this.getView().byId("idstotabopqtyge_i").setValue("");
                this.getView().byId("Final_Save_Button").setEnabled(true);
                sap.ui.core.BusyIndicator.hide();

            },

            OnSubmit: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                let Tokensss = this.getView().byId("id_sub_material_document_h").getTokens();
                console.log("Tokensss", Tokensss.length);

                if(Tokensss.length > 0){

                    this.getView().setModel();

                    var that = this; // Preserve the reference to the controller
                    var oFilter11 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, "GE11");
                    var CountoModel = that.getView().getModel("YY1_ZGE_OUTWARD_GATEPASS_CDS");
                    var oFilters11 = [oFilter11];
                        if (CountoModel) {
                            CountoModel.read("/YY1_ZGE_OUTWARD_GATEPASS", {
                                filters: oFilters11,
                                success: async function (oData) {
                                    var aItems = oData.results; // The array of read items
                                    console.log(aItems.length);
                                    let Count = Number(aItems.length) + 1; // This should be a number, no need to use Number()
                                    let CountLen = Count.toString(); // Convert to string to get its length
                                    let AddData = "80000";
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
                                        title: "Vendor Return",
                                        id: "messageBoxId01",
                                        contentWidth: "100px",
                                    });
                                    sap.ui.core.BusyIndicator.hide();
                                },
                                error: function (oError) {
                                    console.error("Error reading data: ", oError);
                                }
                            });
                        } else {
                            console.error("YY1_ZGE_OUTWARD_GATEPASS_CDS model is undefined.");
                    }
                }
                else{
                    sap.m.MessageToast.show("Please enter/select material document");
                    sap.ui.core.BusyIndicator.hide();
                }
            },

            ToSaveFunc:function(GetId){

                return new Promise((resolve, reject) => {

                    let getArray = [
                        "id_sub_materialdocyear_h",
                        "id_sub_material_document_h",
                        "id_sub_gate_date",
                        "id_sub_vehno_h",
                        "id_sub_vehicle_type_h",
                        "id_sub_transporter_h",
                        "id_sub_transporter_mode_h",
                        "id_sub_tar_wt_h",
                        "id_sub_net_wt_h",
                        "id_sub_gross_wt_h",
                        "id_sub_challan_no_h",
                        "id_sub_challan_date_h",
                        "id_sub_remark_h",
                    ];

                    let RequiredMan = '';
                    let ValidationArrayNonDatas = [];
                    for(let kk=0; kk < getArray.length; kk++){
                        let GetThisId = this.getView().byId(getArray[kk]);
                        if(getArray[kk] === "id_sub_material_document_h"){
                            let GetTokens = this.getView().byId("id_sub_material_document_h").getTokens();
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

                    let GetTokens = this.getView().byId("id_sub_material_document_h").getTokens();
                    let Delivery_Document_Array = [];

                    if (GetTokens && GetTokens.length) {
                        GetTokens.map(function (oContext) {
                            Delivery_Document_Array.push(oContext.getKey());
                            return;
                        });
                    }

                    let gateentryno = GetId;
                    let MaterialDocumentYear = this.getView().byId("id_sub_materialdocyear_h").getValue();
                    let Gate_Entry_Date = this.getView().byId("id_sub_gate_date").getValue();
                        let DateArr = Gate_Entry_Date.split("-")
                        Gate_Entry_Date = DateArr[2] + '-' + DateArr[1] + '-' + DateArr[0];
                    let Vehicle_No = this.getView().byId("id_sub_vehno_h").getValue();
                    let Vehicle_Type = this.getView().byId("id_sub_vehicle_type_h").getSelectedItem().getText();
                    let Transporter = this.getView().byId("id_sub_transporter_h").getValue();
                    let Transporter_Mode = this.getView().byId("id_sub_transporter_mode_h").getSelectedItem().getText();
                    let Tare_Wt = this.getView().byId("id_sub_tar_wt_h").getValue();
                    let Net_Wt  = this.getView().byId("id_sub_net_wt_h").getValue();
                    let Gross_Weight = this.getView().byId("id_sub_gross_wt_h").getValue();
                    let ChallanNo = this.getView().byId("id_sub_challan_no_h").getValue();
                    // let ChallanDate = this.getView().byId("id_sub_challan_date_h").getValue();
                    let ChallanDate = this.getView().byId("id_sub_challan_date_h").getValue();
                        if(ChallanDate.trim() !== ""){
                            let DateArr1 = ChallanDate.split("-")
                            ChallanDate = new Date(DateArr1[2] + '-' + DateArr1[1] + '-' + DateArr1[0]);
                        }else{
                            ChallanDate = null;
                        }
                    let Remarks = this.getView().byId("id_sub_remark_h").getValue();
            
                    console.log("gateentryno:", gateentryno);
                    console.log("MaterialDocumentYear:", MaterialDocumentYear);
                    console.log("Gate_Entry_Date:", Gate_Entry_Date);
                    console.log("Vehicle_No:", Vehicle_No);
                    console.log("Vehicle_Type:", Vehicle_Type);
                    console.log("Transporter:", Transporter);
                    console.log("Transporter_Mode:", Transporter_Mode);
                    console.log("Tare_Wt:", Tare_Wt);
                    console.log("Net_Wt:", Net_Wt);
                    console.log("Gross_Weight:", Gross_Weight);
                    console.log("Remarks:", Remarks);

                    console.log("ValidationArrayNonDatas:", ValidationArrayNonDatas)
                    console.log("ValidationArrayNonDatasLength:", ValidationArrayNonDatas.length)

            if (ValidationArrayNonDatas.length === 0 || ValidationArrayNonDatas.length === "0" ){
                
              
                var Table_Id = this.getView().byId("TableId"); // Assuming 'persoTable' is the ID of the Grid Table
                var oModel = Table_Id.getModel();
                var Table_Length = Table_Id.getRows().length;
            
                var headerdata = [];
                var itemData = [];

                for (let kk=0; kk < Delivery_Document_Array.length; kk++){
                    let MaterialDocument = Delivery_Document_Array[kk];

                    headerdata.push({
                        Id:gateentryno,
                        ReferenceDocumentYear:MaterialDocumentYear,
                        ReferenceDocument:MaterialDocument,
                        ReferenceDocumentType:"",
                        PlantCode:"",
                        PlantName:"",
                        SupplierCode:"",
                        SupplierName:"",
                        SupplierType:"",
                        CustomerCode:"",
                        CustomerName:"",
                        CustomerType:"",
                        EWayBill:"",
                        GateEnrtyDate:new Date(Gate_Entry_Date),
                        PostingDate:this.CurrentDate01,
                        VehicleType:Vehicle_Type,
                        VehicleNo:Vehicle_No,
                        InvoiceNo:"",
                        InvoiceDate:"",
                        Transporter:Transporter,
                        TransporterMode:Transporter_Mode,
                        LRNo:"",
                        LRDate:"",
                        GrossWeight:Gross_Weight,
                        WeightTime:"",
                        WeightDate:"",
                        NoOfPackages:"",
                        Remarks:Remarks,
                        Status:"created",
                        DeliveryDocumentNo:"",
                        BillingDocumentNo:"",
                        SalesReturnNo:"",
                        ScreenCode:"GE11",
                        TareWeight:Tare_Wt,
                        NetWeight:Net_Wt,
                        DelDocGrossWeight:"",
                        ChallanNo:ChallanNo,
                        ChallanDate:ChallanDate,
                    });

                }
              
                for (var i = 0; i < Table_Length; i++) {
            
                    // var Customer_Document_No01 = Table_Id.getRows()[1].getCells()[1].getValue();
                    // let Open_Quantity00 = Table_Id.getRows()[i].getCells()[7].getValue();
                    // if(Open_Quantity00 !== "0" || Open_Quantity00 !== 0 ){
                        var Material_Document_No = Table_Id.getRows()[i].getCells()[1].getValue();
                        var Product_Code = Table_Id.getRows()[i].getCells()[2].getValue();
                        var Product_Name = Table_Id.getRows()[i].getCells()[3].getValue();
                        var Product_Type = Table_Id.getRows()[i].getCells()[4].getValue();
                        var Order_Quantity = Table_Id.getRows()[i].getCells()[5].getValue();
                        var UOM = Table_Id.getRows()[i].getCells()[6].getValue();
                        var Open_Quantity = Table_Id.getRows()[i].getCells()[7].getValue();
                        var PoItemNo  = Table_Id.getRows()[i].getCells()[9].getValue();
                        var PoNo  = Table_Id.getRows()[i].getCells()[10].getValue();
                        var PlantCode = Table_Id.getRows()[i].getCells()[11].getValue();
                        var PlantName  = Table_Id.getRows()[i].getCells()[12].getValue();
                        var Supplier_Code  = Table_Id.getRows()[i].getCells()[13].getValue();
                        var Supplier_Name  = Table_Id.getRows()[i].getCells()[14].getValue();
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
                            ReferenceDocumentYear:MaterialDocumentYear,
                            ReferenceDocument:Material_Document_No,
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
                            SupplierCode:Supplier_Code,
                            SupplierName:Supplier_Name,
                            SupplierType:"",
                            CustomerCode:"",
                            CustomerName:"",
                            CustomerType:"",
                            EWayBill:"",
                            GateEntryDate:new Date(Gate_Entry_Date),
                            VehicleType:Vehicle_Type,
                            VehicleNo:Vehicle_No,
                            InvoiceNo:"",
                            InvoiceDate:"",
                            Transporter:Transporter,
                            TransporterMode:Transporter_Mode,
                            LRNo:"",
                            LRDate:"",
                            GrossWeight:Gross_Weight,
                            WeightTime:"",
                            WeightDate:"",
                            NoOfPackages:"",
                            Remarks:Remarks,
                            Status:"created",
                            ItemsStatus:"created",
                            ApproveStatus:"",
                            BillingDocument:"",
                            DeliveryDocumentNo:"",
                            SalesReturnNo:"",
                            ScreenCode:"GE11",
                            TareWeight:Tare_Wt,
                            NetWeight:Net_Wt,
                            DelDocGrossWeight:"",
                            PostingDate:this.CurrentDate01,
                            ChallanNo:ChallanNo,
                            ChallanDate:ChallanDate,                
                        });
                    // }
                
                }
                console.log(headerdata);
                console.log(itemData);
            
                var oEntry = {};
                oEntry.Id = gateentryno;
                oEntry.EWayBill = "";
                oEntry.GateEnrtyDate = new Date(Gate_Entry_Date);
                oEntry.VehicleType = Vehicle_Type;
                oEntry.VehicleNo = Vehicle_No;
                oEntry.InvoiceNo = "";
                oEntry.InvoiceDate = "";
                oEntry.Transporter = Transporter;
                oEntry.TransporterMode = Transporter_Mode;
                oEntry.LRNo = "";
                oEntry.LRDate = "";
                oEntry.GrossWeight = Gross_Weight;
                oEntry.WeightTime = "";
                oEntry.WeightDate = "";
                oEntry.NoOfPackages = "";
                oEntry.Remarks = Remarks;
                oEntry.Status = "created";
                oEntry.ScreenCode = "GE11";
                oEntry.TareWeight = Tare_Wt;
                oEntry.NetWeight = Net_Wt;
                oEntry.DelDocGrossWeight = "";
                oEntry.ChallanNo = ChallanNo;
                oEntry.ChallanDate = ChallanDate;
                oEntry.to_HEADER = headerdata
                oEntry.to_ITEM = itemData,
                                       
                console.log("oEntryoEntry:", oEntry);
                
                this.getView().setModel();
                                    
                var oModelGet = this.getView().getModel("YY1_ZGE_OUTWARD_GATEPASS_CDS");
                var that = this;
            
            oModelGet.create("/YY1_ZGE_OUTWARD_GATEPASS", oEntry, {
                success: function (oData, oResponse) {
               console.log(oData);
               console.log("saved")
               oModelGet.refresh(true);
                    sap.ui.core.BusyIndicator.hide();

                    var oTable = that.getView().byId("TableId");
                    var oTableModel = new sap.ui.model.json.JSONModel();
                    oTableModel.setData({ items: "" });
                    oTable.setModel(oTableModel);
                    oTable.bindRows("/items");
            
                    var multiInput = that.getView().byId("id_sub_material_document_h");
                        multiInput.removeAllTokens();
                    that.getView().byId("id_sub_vehno_h").setValue("");
                    that.getView().byId("id_sub_vehicle_type_h").setSelectedKey("1");
                    that.getView().byId("id_sub_transporter_h").setValue("");
                    that.getView().byId("id_sub_transporter_mode_h").setSelectedItem("ROAD");
                    that.getView().byId("id_sub_tar_wt_h").setValue("");
                    that.getView().byId("id_sub_net_wt_h").setValue("");
                    that.getView().byId("id_sub_gross_wt_h").setValue("");
                    that.getView().byId("id_sub_challan_no_h").setValue("");
                    that.getView().byId("id_sub_challan_date_h").setValue("");
                    that.getView().byId("id_sub_remark_h").setValue("");
                    that.getView().byId("idstotabopqtyge_i").setValue("");
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


    //  -------------------------------------------------------------------------------------------------------------------------

    

        });
    });
