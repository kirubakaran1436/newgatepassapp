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
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, MessageToast, Fragment, Filter, FilterOperator, JSONModel, UI5Date) {
        "use strict";

        return Controller.extend("gatepassapp.controller.rgp_nrgp.creatergpnrgp", {
            onInit: function () {

                // var CountoModel = this.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                // if (CountoModel) {
                //     CountoModel.read("/YY1_ZRGP_NRGP_HEAD", {
                //         success: function(oData) {
                //             var aItems = oData.results; // The array of read items
                //             console.log(aItems.length);
                //         },
                //         error: function(oError) {
                //             console.error("Error reading data: ", oError);
                //         }
                //     });
                // } else {
                //     console.error("YY1_ZRGP_NRGP_HEAD_CDS model is undefined.");
                // }
                
            // ----Start For Current Date -----
                var today = new Date();
                this.todayDateTime = new Date().toLocaleString().replace(',','');
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
                this.CurrentDatepost = today;
            // ----Start For Current Date -----

                this.count = 1;

                this.mModel = new sap.ui.model.json.JSONModel({
                    Samples : [{
                        ItemNo:this.count, 
                        Product:"" , 
                        ProductName:"" , 
                        Quantity:"" , 
                        UOM:"" , 
                        DueDate:this.CurrentDate, 
                        DispatchDate:this.CurrentDate, 
                        Value:"" , 
                        Remark:"" , 
                        MinDate: new Date()
                        
                    }]	
                    });
                this.getView().setModel(this.mModel, "mModel");

                this.ErrorModel = new sap.ui.model.json.JSONModel({
                    ErrorData : [{
                        FieldData:"", 
                    }]	
                    });
                this.getView().setModel(this.ErrorModel, "ErrorModel");

            },

            OnGatePassType:function(oEvent){

                let Value = oEvent.oSource.getSelectedItem().getText();
                if(Value === "NRGP"){
                    this.getView().byId("id_dispatchdate_visible").setVisible(true)
                    this.getView().byId("id_duedate_visible").setVisible(false)
                    this.count = 1;

                    this.mModel = new sap.ui.model.json.JSONModel({
                        Samples : [{
                            ItemNo:this.count, 
                            Product:"" , 
                            ProductName:"" , 
                            Quantity:"" , 
                            UOM:"" , 
                            DueDate:this.CurrentDate, 
                            DispatchDate:this.CurrentDate, 
                            Value:"" , 
                            Remark:"" , 
                            MinDate: new Date()
                            
                        }]	
                        });
                    this.getView().setModel(this.mModel, "mModel");
                }else{
                    this.getView().byId("id_dispatchdate_visible").setVisible(false)
                    this.getView().byId("id_duedate_visible").setVisible(true)
                    this.count = 1;
                    this.mModel = new sap.ui.model.json.JSONModel({
                        Samples : [{
                            ItemNo:this.count, 
                            Product:"" , 
                            ProductName:"" , 
                            Quantity:"" , 
                            UOM:"" , 
                            DueDate:this.CurrentDate, 
                            DispatchDate:this.CurrentDate, 
                            Value:"" , 
                            Remark:"" , 
                            MinDate: new Date()
                            
                        }]	
                        });
                    this.getView().setModel(this.mModel, "mModel");
                }
                
                           
                
            },

            //  ---------------- Start Plant Fragment & Suggestion Box -----------------------------
            
            OnPlantSuggest:function(oEvent){ // Suggestion FUnction for Plant
                sap.ui.core.BusyIndicator.show();
                var oItem = oEvent.getParameter("selectedItem");
                var GetKey = oItem ? oItem.getKey() : "";
                var GetValue = oItem ? oItem.getText() : "";

                    // Do something with key and text values
                    console.log( oItem);
                    console.log("Selected Key:", GetKey);
                    console.log("Selected Text:", GetValue);
                
                this.byId("id_plantcode_h").setValue(GetValue);
                this.byId("id_plantname_h").setValue(GetKey);
                sap.ui.core.BusyIndicator.hide();

            },

            
            OnPlantFragOpen:function(oEvent){ // Plant Fragment Open
                console.log("Working")
                if(!this._dialog_plant){
                    this._dialog_plant = sap.ui.xmlfragment(this.getView().getId("Plant_dialog"), "gatepassapp.view.rgp_nrgp.fragment.plant", this);
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
                sap.ui.core.BusyIndicator.show();
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);

                let aContexts = oEvent.getParameter("selectedContexts");
                let value1,value2; 

                if(aContexts === undefined){
                    console.log("No Item Present");
                    sap.ui.core.BusyIndicator.hide();
                }else{
                    if (aContexts && aContexts.length) {

                        aContexts.map(function (oContext) {
                            value1 = oContext.getObject().Plant;
                            value2 = oContext.getObject().PlantName;
                            return;
                        });
                        this.byId("id_plantcode_h").setValue(value1);
                        this.byId("id_plantname_h").setValue(value2);
                        sap.ui.core.BusyIndicator.hide();
                    }
                }
            },

        //  ---------------- End Plant Fragment & Suggestion Box -----------------------------

        //  ---------------- Start Supplier Fragment & Suggestion Box -----------------------------
            
            OnSupplierSuggest:function(oEvent){ // Suggestion Function for Supplier
                sap.ui.core.BusyIndicator.show();
                var oItem = oEvent.getParameter("selectedItem");
                var GetKey = oItem ? oItem.getKey() : "";
                var GetValue = oItem ? oItem.getText() : "";

                    // Do something with key and text values
                    console.log( oItem);
                    console.log("Selected Key:", GetKey);
                    console.log("Selected Text:", GetValue);
                
                this.byId("id_suppliercode_h").setValue(GetValue);
                this.byId("id_suppliername_h").setValue(GetKey);
                sap.ui.core.BusyIndicator.hide();

            },

            
            OnSupplierFragOpen:function(oEvent){ // Supplier Fragment Open
                console.log("Working")
                if(!this._dialog_supplier){
                    this._dialog_supplier = sap.ui.xmlfragment(this.getView().getId("Supplier_dialog"), "gatepassapp.view.rgp_nrgp.fragment.supplier", this);
                    this.getView().addDependent(this._dialog_supplier);
                }
                this._dialog_supplier.open()
            },

            OnSupplierSearch:function(oEvent){
                let sValue = oEvent.getParameter("value");
                let oFilter = new Filter("Supplier", FilterOperator.Contains, sValue);
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },
            
            OnSupplierSelect:function(oEvent){
                sap.ui.core.BusyIndicator.show();
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);

                let aContexts = oEvent.getParameter("selectedContexts");
                let value1,value2; 

                if(aContexts === undefined){
                    console.log("No Item Present");
                    sap.ui.core.BusyIndicator.hide();
                }else{
                    if (aContexts && aContexts.length) {

                        aContexts.map(function (oContext) {
                            value1 = oContext.getObject().Supplier;
                            value2 = oContext.getObject().SupplierName;
                            return;
                        });
                        this.byId("id_suppliercode_h").setValue(value1);
                        this.byId("id_suppliername_h").setValue(value2);
                        sap.ui.core.BusyIndicator.hide();
                    }
                }
            },

        //  ---------------- End Supplier Fragment & Suggestion Box -----------------------------

        //  ---------------- Start Customer Fragment & Suggestion Box -----------------------------
            
            OnCustomerSuggest:function(oEvent){ // Suggestion FUnction for Customer
                sap.ui.core.BusyIndicator.show();
                var oItem = oEvent.getParameter("selectedItem");
                var GetKey = oItem ? oItem.getKey() : "";
                var GetValue = oItem ? oItem.getText() : "";

                    // Do something with key and text values
                    console.log( oItem);
                    console.log("Selected Key:", GetKey);
                    console.log("Selected Text:", GetValue);
                
                this.byId("id_customercode_h").setValue(GetValue);
                this.byId("id_customername_h").setValue(GetKey);
                sap.ui.core.BusyIndicator.hide();

            },

            
            OnCustomerFragOpen:function(oEvent){ // Customer Fragment Open
                console.log("Working")
                if(!this.dialog_customer){
                    this.dialog_customer = sap.ui.xmlfragment(this.getView().getId("Customer_dialog"), "gatepassapp.view.rgp_nrgp.fragment.customer", this);
                    this.getView().addDependent(this.dialog_customer);
                }
                this.dialog_customer.open()
            },

            OnCustomerSearch:function(oEvent){
                let sValue = oEvent.getParameter("value");
                let oFilter = new Filter("Customer", FilterOperator.Contains, sValue);
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },
            
            OnCustomerSelect:function(oEvent){
                sap.ui.core.BusyIndicator.show();
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);

                let aContexts = oEvent.getParameter("selectedContexts");
                let value1,value2; 

                if(aContexts === undefined){
                    console.log("No Item Present");
                    sap.ui.core.BusyIndicator.hide();
                }else{
                    if (aContexts && aContexts.length) {

                        aContexts.map(function (oContext) {
                            value1 = oContext.getObject().Customer;
                            value2 = oContext.getObject().CustomerName;
                            return;
                        });
                        this.byId("id_customercode_h").setValue(value1);
                        this.byId("id_customername_h").setValue(value2);
                        sap.ui.core.BusyIndicator.hide();
                    }
                }
            },

        //  ---------------- End Customer Fragment & Suggestion Box -----------------------------

        //  ---------------- Start Product Fragment & Suggestion Box -----------------------------
            
            OnProductSuggest:function(oEvent){ // Suggestion FUnction for Product
                sap.ui.core.BusyIndicator.show();
                var oItem = oEvent.getParameter("selectedItem");
                var GetKey = oItem ? oItem.getKey() : "";
                var GetValue = oItem ? oItem.getText() : "";

                    // Do something with key and text values
                    console.log( oItem);
                    console.log("Selected Key:", GetKey);
                    console.log("Selected Text:", GetValue);

                    let Quantity_to_Post_Input = oEvent.getSource().getParent().getCells()[6].getValue(); 

                    var oFilter1 = new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, GetValue);
                    var oModel1 = this.getView().getModel("YY1_ZGE_PRODUCT_CDS"); // Replace with your actual OData model name
                    
                    var oFilters1 = [oFilter1];
                    var that = this;
                    
                    oModel1.read("/YY1_ZGE_PRODUCT", {
                        filters: oFilters1,
                        success: function(oData) {
                            var aItems = oData.results; // The array of read items
                            oEvent.getSource().getParent().getCells()[2].setValue(aItems[0].ProductName)
                            oEvent.getSource().getParent().getCells()[4].setValue(aItems[0].BaseUnit)
                            oEvent.getSource().getParent().getCells()[5].setValue(aItems[0].StandardPrice)
                            oEvent.getSource().getParent().getCells()[3].setValue("")
                            oEvent.getSource().getParent().getCells()[7].setValue("")
                            that.getView().byId("id_valueininr_h").setValue("");
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function(oError) {
                            // Handle error
                            console.error("Error reading data: ", oError);
                            sap.ui.core.BusyIndicator.hide();
                        }
                    });                    
                

            },

            
            OnProductFragOpen:function(oEvent){ // Product Fragment Open
                this.valueHelpIndex = oEvent.getSource().getParent();
                console.log("Working")
                if(!this.dialog_product){
                    this.dialog_product = sap.ui.xmlfragment(this.getView().getId("Product_dialog"), "gatepassapp.view.rgp_nrgp.fragment.product", this);
                    this.getView().addDependent(this.dialog_product);
                }
                this.dialog_product.open()
            },

            OnProductSearch:function(oEvent){
                let sValue = oEvent.getParameter("value");
                let oFilter = new Filter("Product", FilterOperator.Contains, sValue);
                let oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },
            
            OnProductSelect : function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);

                var aContexts = oEvent.getParameter("selectedContexts");
                var value1, value2, value3, value4, value5;

                if(aContexts === undefined){
                    console.log("No Item Present");
                    sap.ui.core.BusyIndicator.hide();
                }else{
                    if (aContexts && aContexts.length) {

                        aContexts.map(function (oContext) {
                            value1 = oContext.getObject().Product;
                            value2 = oContext.getObject().ProductName;
                            value3 = oContext.getObject().ProductType;
                            value4 = oContext.getObject().BaseUnit;
                            value5 = oContext.getObject().StandardPrice;
                            return;
                        });

                        this.valueHelpIndex.getCells()[1].setValue(value1);
                        this.valueHelpIndex.getCells()[2].setValue(value2);
                        this.valueHelpIndex.getCells()[4].setValue(value4);
                        this.valueHelpIndex.getCells()[5].setValue(value5);

                        this.valueHelpIndex.getCells()[3].setValue("");
                        this.valueHelpIndex.getCells()[7].setValue("");
                        this.getView().byId("id_valueininr_h").setValue("");
                        sap.ui.core.BusyIndicator.hide();
                    }
                }

            },

        //  ---------------- End Customer Fragment & Suggestion Box -----------------------------

        OnTableAddRow:function(oEvent){
            sap.ui.core.BusyIndicator.show();
            var tabledata = this.getView().getModel("mModel").getProperty("/Samples");
            this.count = this.count + 1;

            var datas = {
                ItemNo:this.count, 
                Product:"" , 
                ProductName:"" , 
                Quantity:"" , 
                UOM:"" , 
                DueDate:this.CurrentDate, 
                DispatchDate:this.CurrentDate, 
                Value:"" , 
                Remark:"" ,
                MinDate: new Date()
            };

        tabledata.push(datas);
        this.mModel.refresh();
        sap.ui.core.BusyIndicator.hide()    ;

        },

        OnTableRowRemove: function (oEvent) { 
            var del = oEvent.getSource().getBindingContext("mModel").getObject();
            var mod = this.getView().getModel("mModel");
            var data = mod.getProperty("/Samples");
            var tabledata = this.getView().getModel("mModel").getProperty("/Samples");

            for (var i = 0; i < data.length; i++) {
                if (data[i] === del) {
                    data.splice(i, 1);
                    this.count = this.count - 1;
                    mod.setProperty("/Samples", data);
                    mod.refresh();
                    // await tablecount();
                    var table_id = this.getView().byId("id_rgpnrgp_table");
                    for (var j = 0; j < data.length; j++) {
                        table_id.getItems()[j].getCells()[0].setValue(j + 1);
                    }
                    break;
                }
            }
        },

        OnQuantityCheck:function(oEvent){
            let GetQuantity = oEvent.getSource().getParent().getCells()[3].getValue(); 
            let GetValue = oEvent.getSource().getParent().getCells()[5].getValue(); 
            let ValueInINR = this.getView().byId("id_valueininr_h").getValue();

                if(ValueInINR === ""){
                    ValueInINR = parseFloat(0.00);
                }else{
                    ValueInINR = parseFloat(ValueInINR);
                }

                if(GetQuantity !== "" && GetValue !== ""){
                    let SetValue = parseFloat(GetQuantity) * parseFloat(GetValue);
                    oEvent.getSource().getParent().getCells()[7].setValue(SetValue.toFixed(2));
                    this.getView().byId("id_valueininr_h").setValue((SetValue + ValueInINR).toFixed(2));
                }else{
                    oEvent.getSource().getParent().getCells()[7].setValue();
                    this.getView().byId("id_valueininr_h").setValue("");
                }

        },

        OnNetPriceCheck:function(oEvent){
            let GetQuantity = oEvent.getSource().getParent().getCells()[3].getValue(); 
            let GetValue = oEvent.getSource().getParent().getCells()[5].getValue(); 
            oEvent.getSource().getParent().getCells()[5].setValue(parseFloat(GetValue).toFixed(2));
            let ValueInINR = this.getView().byId("id_valueininr_h").getValue();
            
                if(ValueInINR === ""){
                    ValueInINR = parseFloat(0.00);
                }else{
                    ValueInINR = parseFloat(ValueInINR);
                }

                if(GetQuantity !== "" && GetValue !== ""){
                    let SetValue = parseFloat(GetQuantity) * parseFloat(GetValue);
                    oEvent.getSource().getParent().getCells()[7].setValue(SetValue.toFixed(2));
                    this.getView().byId("id_valueininr_h").setValue((SetValue + ValueInINR).toFixed(2));
                }else{
                    oEvent.getSource().getParent().getCells()[7].setValue();
                    this.getView().byId("id_valueininr_h").setValue("");
                }

        },

        OnSubmit: function (oEvent) {
            sap.ui.core.BusyIndicator.show();

            this.getView().setModel();

            var that = this; // Preserve the reference to the controller

            var CountoModel = this.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
            if (CountoModel) {
                CountoModel.read("/YY1_ZRGP_NRGP_HEAD", {
                    success: async function (oData) {
                        var aItems = oData.results; // The array of read items
                        console.log(aItems.length);
                        let Count = Number(aItems.length) + 1; // This should be a number, no need to use Number()
                        let CountLen = Count.toString(); // Convert to string to get its length
                        let AddData = "90000";
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
                            title: " RGP NRGP ",
                            id: "messageBoxId1",
                            contentWidth: "100px",
                        });
                        sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (oError) {
                        console.error("Error reading data: ", oError);
                    }
                });
            } else {
                console.error("YY1_ZRGP_NRGP_HEAD_CDS model is undefined.");
            }
        },

        OnUOMChange:function(oEvent){
            let DAtaa = oEvent.getSource().getParent().getCells()[4].getValue(); 
            let DAtaa01 = DAtaa.toUpperCase();
            oEvent.getSource().getParent().getCells()[4].setValue(DAtaa01); 
        },

        OnRadioSelect:function(oEVent){
            let SelectedINdex = oEVent.getParameters().selectedIndex;
            if(SelectedINdex === 0){
                console.log("With Code")
                this.getView().byId("id_tablestatus_h").setValue("With Code");
                this.getView().byId("id_producth_i").setWidth("11rem");
                this.getView().byId("id_productdesch_i1").setVisible(true);
                this.getView().byId("id_productdesch_i2").setVisible(false);
                this.getView().byId("id_uom_i1").setVisible(true);
                this.getView().byId("id_uom_i2").setVisible(false);
                this.getView().byId("id_netprice_i1").setVisible(true);
                this.getView().byId("id_netprice_i2").setVisible(false);
                // --------------------------------------------------
                this.count = 1;

                this.mModel = new sap.ui.model.json.JSONModel({
                    Samples : [{
                        ItemNo:this.count, 
                        Product:"" , 
                        ProductName:"" , 
                        Quantity:"" , 
                        UOM:"" , 
                        DueDate:this.CurrentDate, 
                        DispatchDate:this.CurrentDate, 
                        Value:"" , 
                        Remark:"" , 
                        MinDate: new Date()
                        
                    }]	
                    });
                this.getView().setModel(this.mModel, "mModel");
                // --------------------------------------------------
            }else if(SelectedINdex === 1){
                console.log("Without Code")
                this.getView().byId("id_tablestatus_h").setValue("Without Code");
                this.getView().byId("id_producth_i").setWidth("0rem");
                this.getView().byId("id_productdesch_i1").setVisible(false);
                this.getView().byId("id_productdesch_i2").setVisible(true);
                this.getView().byId("id_uom_i1").setVisible(false);
                this.getView().byId("id_uom_i2").setVisible(true);
                this.getView().byId("id_netprice_i1").setVisible(false);
                this.getView().byId("id_netprice_i2").setVisible(true);
                 // --------------------------------------------------
                 this.count = 1;

                 this.mModel = new sap.ui.model.json.JSONModel({
                     Samples : [{
                         ItemNo:this.count, 
                         Product:"" , 
                         ProductName:"" , 
                         Quantity:"" , 
                         UOM:"" , 
                         DueDate:this.CurrentDate, 
                         DispatchDate:this.CurrentDate, 
                         Value:"" , 
                         Remark:"" , 
                         MinDate: new Date()
                         
                     }]	
                     });
                 this.getView().setModel(this.mModel, "mModel");
                 // --------------------------------------------------
            }
        },

            ToSaveFunc:function(GetId){

                return new Promise((resolve, reject) => {

                    let GateEntryNo = GetId;
                    let RGP_NRGP = this.getView().byId("id_rgpnrgp_h").getSelectedItem().getText();
                    let PlantCode = this.getView().byId("id_plantcode_h").getValue();
                    let PlantName = this.getView().byId("id_plantname_h").getValue();
                    let SupplierCode = this.getView().byId("id_suppliercode_h").getValue();
                    let SupplierName = this.getView().byId("id_suppliername_h").getValue();
                    let CustomerCode = this.getView().byId("id_customercode_h").getValue();
                    let CustomerName = this.getView().byId("id_customername_h").getValue();
                    let Requestor = this.getView().byId("id_requestor_h").getValue();
                    let ValueInINR = this.getView().byId("id_valueininr_h").getValue();
                    let PurchaseMaterialDoc = this.getView().byId("id_purchasematerialdoc_h").getValue();
                    let TranporterType = this.getView().byId("id_transporttype_h").getSelectedItem().getText();
                    let VehicleType = this.getView().byId("id_vehicletype_h").getSelectedItem().getText();
                    let VehicleNo = this.getView().byId("id_vehicleno_h").getValue();
                    let Remark = this.getView().byId("id_remark_h").getValue();
                    let TableSTatuss = this.getView().byId("id_tablestatus_h").getValue();
                    let chk = this.getView().byId("id_approvestatus_h").getSelected();
                    if(chk === true){
                        var ApproveStatusH = "pending";
                    }else{
                        var ApproveStatusH = "";
                    }
         
                    console.log(GateEntryNo);
                    console.log(RGP_NRGP);
                    console.log(PlantCode);
                    console.log(PlantName);
                    console.log(SupplierCode);
                    console.log(SupplierName);
                    console.log(CustomerCode);
                    console.log(CustomerName);
                    console.log(Requestor);
                    console.log(ValueInINR);
                    console.log(PurchaseMaterialDoc);
                    console.log(TranporterType);
                    console.log(VehicleType);
                    console.log(VehicleNo);
                    console.log(Remark);
                    console.log(TableSTatuss);
                    console.log(ApproveStatusH);
                    console.log(this.CurrentDatepost);
         
                 if(PlantCode!=="" && Requestor!=="" && ValueInINR!== "" && VehicleNo !==""){
                    
                    this.getView().byId("id_rgpnrgp_h").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("id_rgpnrgp_h").setValueStateText("");
                    this.getView().byId("id_plantcode_h").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("id_plantcode_h").setValueStateText("");
                    this.getView().byId("id_requestor_h").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("id_requestor_h").setValueStateText("");
                    this.getView().byId("id_valueininr_h").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("id_valueininr_h").setValueStateText("");
                    this.getView().byId("id_vehicleno_h").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("id_vehicleno_h").setValueStateText("");                   
         
                 var Table_Id = this.getView().byId("id_rgpnrgp_table"); // Assuming 'persoTable' is the ID of the Grid Table
                 var oModel = Table_Id.getModel();
                 var Table_Length = Table_Id.getRows().length;
         
                 var itemData = [];
                 var ItemNo_array = [];
                 var RefData_array = [];
                 var Product_array = [];
                 var Quantity_array = [];
                 var UOM_array = [];
                 var Amount_array = [];
                 var ProductName_array = [];
                 var Header_Status = "200";
         
                 for (var i = 0; i < Table_Length; i++) {

                    if(TableSTatuss === "With Code"){
                        var Product = Table_Id.getRows()[i].getCells()[1].getValue();
                        var Product01 = Product.trim();
                        if (Product01 !== "") {
                            Product_array.push(Product01);
                            Table_Id.getRows()[i].getCells()[1].setValueState(sap.ui.core.ValueState.None);
            
                        } else {
                            Table_Id.getRows()[i].getCells()[1].setValueState(sap.ui.core.ValueState.Error);
                            Table_Id.getRows()[i].getCells()[1].setValueStateText("Please Enter Product");
                            break;
                        }
               
                        var ProductName = Table_Id.getRows()[i].getCells()[2].getValue();
            
                        var Quantity = Table_Id.getRows()[i].getCells()[3].getValue();
                        var Quantity01 = Quantity.trim();
                        if (Quantity01 !== "") {
                            Quantity_array.push(Quantity01);
                            Table_Id.getRows()[i].getCells()[3].setValueState(sap.ui.core.ValueState.None);
            
                        } else {
                            Table_Id.getRows()[i].getCells()[3].setValueState(sap.ui.core.ValueState.Error);
                            Table_Id.getRows()[i].getCells()[3].setValueStateText("Please Enter Quantity");
                            break;
                        }
            
                        var UOM = Table_Id.getRows()[i].getCells()[4].getValue();
            
                        var Amount = Table_Id.getRows()[i].getCells()[5].getValue();
                        var Amount01 = Amount.trim();
                        if (Amount01 !== "") {
                            Amount_array.push(Amount01);
                            Table_Id.getRows()[i].getCells()[5].setValueState(sap.ui.core.ValueState.None);
            
                        } else {
                            Table_Id.getRows()[i].getCells()[5].setValueState(sap.ui.core.ValueState.Error);
                            Table_Id.getRows()[i].getCells()[5].setValueStateText("Please Enter Value");
                            break;
                        }
   
                        if(RGP_NRGP === "RGP"){
                           var DueDate = Table_Id.getRows()[i].getCells()[6].getValue();
                           let con1 = DueDate.split("-");
                               DueDate = con1[2]+'-'+con1[1]+'-'+con1[0];
                           var DispatchDate = "Null";
                        }else if(RGP_NRGP === "NRGP"){
                           var DispatchDate = Table_Id.getRows()[i].getCells()[6].getValue();
                           var DueDate = "Null";
                        }
                                 
                        var TotalPrice = Table_Id.getRows()[i].getCells()[7].getValue();
                        var RemarksItem = Table_Id.getRows()[i].getCells()[8].getValue();
   
                        var ItemNo = Table_Id.getRows()[i].getCells()[0].getValue();
                        var ItemNo01 = ItemNo.trim();
                        if (ItemNo01 !== "") {
                            ItemNo_array.push(ItemNo01);
                        }
   

                    }else if(TableSTatuss === "Without Code"){
   
                        var Product = Table_Id.getRows()[i].getCells()[1].getValue();
                        var ProductName = Table_Id.getRows()[i].getCells()[2].getValue();
                        var ProductName01 = ProductName.trim();
                        if (ProductName01 !== "") {
                           ProductName_array.push(Product01);
                            Table_Id.getRows()[i].getCells()[2].setValueState(sap.ui.core.ValueState.None);
            
                        } else {
                            Table_Id.getRows()[i].getCells()[2].setValueState(sap.ui.core.ValueState.Error);
                            Table_Id.getRows()[i].getCells()[2].setValueStateText("Please Enter Product Name");
                            break;
                        }
                        
                        var Quantity = Table_Id.getRows()[i].getCells()[3].getValue();
                        var Quantity01 = Quantity.trim();
                        if (Quantity01 !== "") {
                            Quantity_array.push(Quantity01);
                            Table_Id.getRows()[i].getCells()[3].setValueState(sap.ui.core.ValueState.None);
            
                        } else {
                            Table_Id.getRows()[i].getCells()[3].setValueState(sap.ui.core.ValueState.Error);
                            Table_Id.getRows()[i].getCells()[3].setValueStateText("Please Enter Quantity");
                            break;
                        }
            
                        var UOM = Table_Id.getRows()[i].getCells()[4].getValue();
                        var UOM01 = UOM.trim();
                        if (UOM01 !== "") {
                           UOM_array.push(UOM01);
                            Table_Id.getRows()[i].getCells()[4].setValueState(sap.ui.core.ValueState.None);
            
                        } else {
                            Table_Id.getRows()[i].getCells()[4].setValueState(sap.ui.core.ValueState.Error);
                            Table_Id.getRows()[i].getCells()[4].setValueStateText("Please Enter UOM");
                            break;
                        }
            
                        var Amount = Table_Id.getRows()[i].getCells()[5].getValue();
                        var Amount01 = Amount.trim();
                        if (Amount01 !== "") {
                            Amount_array.push(Amount01);
                            Table_Id.getRows()[i].getCells()[5].setValueState(sap.ui.core.ValueState.None);
            
                        } else {
                            Table_Id.getRows()[i].getCells()[5].setValueState(sap.ui.core.ValueState.Error);
                            Table_Id.getRows()[i].getCells()[5].setValueStateText("Please Enter Value");
                            break;
                        }
   
                        if(RGP_NRGP === "RGP"){
                           var DueDate = Table_Id.getRows()[i].getCells()[6].getValue();
                           let con1 = DueDate.split("-");
                               DueDate = con1[2]+'-'+con1[1]+'-'+con1[0];
                           var DispatchDate = "Null";
                        }else if(RGP_NRGP === "NRGP"){
                           var DispatchDate = Table_Id.getRows()[i].getCells()[6].getValue();
                           var DueDate = "Null";
                        }
                                 
                        var TotalPrice = Table_Id.getRows()[i].getCells()[7].getValue();
                        var RemarksItem = Table_Id.getRows()[i].getCells()[8].getValue();
   
                        var ItemNo = Table_Id.getRows()[i].getCells()[0].getValue();
                        var ItemNo01 = ItemNo.trim();
                        if (ItemNo01 !== "") {
                            ItemNo_array.push(ItemNo01);
                        }
                    }
                     
                         itemData.push({
                            id:GateEntryNo,
                            ItemNo:ItemNo,
                            Product:Product,
                            ProductName:ProductName,
                            Quantity:Quantity,
                            UOM:UOM,
                            DueDate:DueDate,
                            DispatchDate:DispatchDate,
                            Value:Amount,
                            Remarks:RemarksItem,
                            Status:"created",
                            ItemsStatus:"created",
                            ApproveStatus:ApproveStatusH,
                            TotalAmount:TotalPrice,
                            GatePassType:RGP_NRGP,
                            Requestor:Requestor,
                            PlantCode:PlantCode,
                            PlantName:PlantName,
                            SupplierCode:SupplierCode,
                            SupplierName:SupplierName,
                            SupplierType:"",
                            CustomerCode:CustomerCode,
                            CustomerName:CustomerName,
                            CustomerType:"",
                            ValueInINR:ValueInINR,
                            VehicleType:VehicleType,
                            VehicleNo:VehicleNo,
                            Transporter:"",
                            TransporterMode:TranporterType,
                            PurchaseOrder:"",
                            MaterialDocument:"",
                            ReferenceDocumentNo:PurchaseMaterialDoc,
                            RemarkHead:Remark,
                            GateStatus:"",
                            ReceivedQuantity:"0",
                            GateType:TableSTatuss,
                            PostingDate:this.CurrentDatepost,
         
                         });
                     }

                     console.log("ItemNo_array.length", ItemNo_array.length)
                     console.log("RefData_array.length", RefData_array.length)
                     console.log("Product_array.length", Product_array.length)
                     console.log("Quantity_array.length", Quantity_array.length)
                     console.log("Amount_array.length", Amount_array.length)
                     console.log("ProductName_array.length", ProductName_array.length)
                     console.log("UOM_array.length", UOM_array.length)

                     if(TableSTatuss === "With Code"){
                        if (Product_array.length > 0 && Quantity_array.length > 0 && Amount_array.length > 0){
                            if (ItemNo_array.length === Product_array.length && ItemNo_array.length === Quantity_array.length && ItemNo_array.length === Amount_array.length){
             
                             
                                var oEntry = {};  
                
                               oEntry.Id = GateEntryNo;
                               oEntry.GatePassType = RGP_NRGP;
                               oEntry.Requestor = Requestor;
                               oEntry.PlantCode = PlantCode;
                               oEntry.PlantName = PlantName;
                               oEntry.SupplierCode = SupplierCode;
                               oEntry.SupplierName = SupplierName;
                               oEntry.SupplierType = "";
                               oEntry.CustomerCode = CustomerCode;
                               oEntry.CustomerName = CustomerName;
                               oEntry.CustomerType = "";
                               oEntry.ValueInINR = ValueInINR;
                               oEntry.VehicleType = VehicleType;
                               oEntry.VehicleNo = VehicleNo;
                               oEntry.Transporter = "";
                               oEntry.TransporterMode = TranporterType;
                               oEntry.PurchaseOrder = "";
                               oEntry.MaterialDocument = "";
                               oEntry.ReferenceDocumentNo = PurchaseMaterialDoc;
                               oEntry.Remarks = Remark;
                               oEntry.Status = "created";
                               oEntry.ApproveStatus = ApproveStatusH;
                               oEntry.GateStatus = "";
                               oEntry.GateType = TableSTatuss;
                               oEntry.PostingDate = this.CurrentDatepost;
                
                                 oEntry.to_ITEMS = itemData;
                                 this.getView().setModel();
                                 var oModel = this.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                
                                 var that = this;
                
                                 oModel.create("/YY1_ZRGP_NRGP_HEAD", oEntry, {
                                     success: function (oData, oResponse) {

                                        that.sendEmail(oEntry)
    
                                        that.getView().byId("id_plantcode_h").setValue("");
                                        that.getView().byId("id_plantname_h").setValue("");
                                        that.getView().byId("id_suppliercode_h").setValue("");
                                        that.getView().byId("id_suppliername_h").setValue("");
                                        that.getView().byId("id_customercode_h").setValue("");
                                        that.getView().byId("id_customername_h").setValue("");
                                        that.getView().byId("id_requestor_h").setValue("");
                                        that.getView().byId("id_valueininr_h").setValue("");
                                        that.getView().byId("id_purchasematerialdoc_h").setValue("");
                                        that.getView().byId("id_vehicleno_h").setValue("");
                                        that.getView().byId("id_remark_h").setValue("");
                                        that.getView().byId("id_approvestatus_h").setSelected(false);
    
                                        that.count = 1;
    
                                        that.mModel = new sap.ui.model.json.JSONModel({
                                            Samples : [{
                                                ItemNo:that.count, 
                                                Product:"" , 
                                                ProductName:"" , 
                                                Quantity:"" , 
                                                UOM:"" , 
                                                DueDate:that.CurrentDate, 
                                                DispatchDate:that.CurrentDate, 
                                                Value:"" , 
                                                Remark:"" , 
                                                
                                            }]	
                                            });
                                            that.getView().setModel(that.mModel, "mModel");
       
                                        resolve(oData);
                                           
                                     }
                                 });
                
                            }else{
                               MessageBox.show("Please Fill the Mandatory Fields ", MessageBox.Icon.ERROR, "");
                               reject(new Error("Validation failed"))
                               sap.ui.core.BusyIndicator.hide();
                            }
                         }else{
                            MessageBox.show("Please Fill the Mandatory Fields ", MessageBox.Icon.ERROR, "");
                            reject(new Error("Validation failed"))
                            sap.ui.core.BusyIndicator.hide();
                         }
    
                     }else if(TableSTatuss === "Without Code" ){
                        if (ProductName_array.length > 0 && Quantity_array.length > 0 && Amount_array.length > 0 && UOM_array.length > 0){
                            if (ItemNo_array.length === ProductName_array.length && ItemNo_array.length === Quantity_array.length && ItemNo_array.length === UOM_array.length && ItemNo_array.length === Amount_array.length){
             
                             
                                var oEntry = {};  
                
                               oEntry.Id = GateEntryNo;
                               oEntry.GatePassType = RGP_NRGP;
                               oEntry.Requestor = Requestor;
                               oEntry.PlantCode = PlantCode;
                               oEntry.PlantName = PlantName;
                               oEntry.SupplierCode = SupplierCode;
                               oEntry.SupplierName = SupplierName;
                               oEntry.SupplierType = "";
                               oEntry.CustomerCode = CustomerCode;
                               oEntry.CustomerName = CustomerName;
                               oEntry.CustomerType = "";
                               oEntry.ValueInINR = ValueInINR;
                               oEntry.VehicleType = VehicleType;
                               oEntry.VehicleNo = VehicleNo;
                               oEntry.Transporter = "";
                               oEntry.TransporterMode = TranporterType;
                               oEntry.PurchaseOrder = "";
                               oEntry.MaterialDocument = "";
                               oEntry.ReferenceDocumentNo = PurchaseMaterialDoc;
                               oEntry.Remarks = Remark;
                               oEntry.Status = "created";
                               oEntry.ApproveStatus = ApproveStatusH;
                               oEntry.GateStatus = "";
                               oEntry.GateType = TableSTatuss;
                               oEntry.PostingDate = this.CurrentDatepost;
                
                                 oEntry.to_ITEMS = itemData;
                                 this.getView().setModel();
                                 var oModel = this.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                
                                 var that = this;
                
                                 oModel.create("/YY1_ZRGP_NRGP_HEAD", oEntry, {
                                     success: function (oData, oResponse) {

                                        that.sendEmail(oEntry);
    
                                        that.getView().byId("id_plantcode_h").setValue("");
                                        that.getView().byId("id_plantname_h").setValue("");
                                        that.getView().byId("id_suppliercode_h").setValue("");
                                        that.getView().byId("id_suppliername_h").setValue("");
                                        that.getView().byId("id_customercode_h").setValue("");
                                        that.getView().byId("id_customername_h").setValue("");
                                        that.getView().byId("id_requestor_h").setValue("");
                                        that.getView().byId("id_valueininr_h").setValue("");
                                        that.getView().byId("id_purchasematerialdoc_h").setValue("");
                                        that.getView().byId("id_vehicleno_h").setValue("");
                                        that.getView().byId("id_remark_h").setValue("");
                                        that.getView().byId("id_approvestatus_h").setSelected(false);
    
                                        that.count = 1;
    
                                        that.mModel = new sap.ui.model.json.JSONModel({
                                            Samples : [{
                                                ItemNo:that.count, 
                                                Product:"" , 
                                                ProductName:"" , 
                                                Quantity:"" , 
                                                UOM:"" , 
                                                DueDate:that.CurrentDate, 
                                                DispatchDate:that.CurrentDate, 
                                                Value:"" , 
                                                Remark:"" , 
                                                
                                            }]	
                                            });
                                            that.getView().setModel(that.mModel, "mModel");
       
                                        resolve(oData);
                                           
                                     }
                                 });
                
                            }else{
                               MessageBox.show("Please Fill the Mandatory Fields ", MessageBox.Icon.ERROR, "");
                               reject(new Error("Validation failed"))
                               sap.ui.core.BusyIndicator.hide();
                            }
                         }else{
                            MessageBox.show("Please Fill the Mandatory Fields ", MessageBox.Icon.ERROR, "");
                            reject(new Error("Validation failed"))
                            sap.ui.core.BusyIndicator.hide();
                         }
    
                     }

         
         
                    
                 }else{
                    reject(new Error("Validation failed"))
                    sap.ui.core.BusyIndicator.hide();
         
                     if(RGP_NRGP ===""){
                         this.getView().byId("id_rgpnrgp_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_rgpnrgp_h").setValueStateText("Please Select Gate Pass Type");
                     }else{
                         this.getView().byId("id_rgpnrgp_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_rgpnrgp_h").setValueStateText("");

                     }
         
                     if(PlantCode ===""){
                         this.getView().byId("id_plantcode_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_plantcode_h").setValueStateText("Please Select Plant");
                     }else{
                         this.getView().byId("id_plantcode_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_plantcode_h").setValueStateText("");
                     }
         
                     if(Requestor ===""){
                         this.getView().byId("id_requestor_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_requestor_h").setValueStateText("Please Select Requestor");
                     }else{
                         this.getView().byId("id_requestor_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_requestor_h").setValueStateText("");
                     }
         
                     if(ValueInINR ===""){
                         this.getView().byId("id_valueininr_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_valueininr_h").setValueStateText("Please ENter Value In INR");
                     }else{
                         this.getView().byId("id_valueininr_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_valueininr_h").setValueStateText("");
                     }
         
                     if(TranporterType ===""){
                         this.getView().byId("id_transporttype_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_transporttype_h").setValueStateText("Please Select Tranporter Type");
                     }else{
                         this.getView().byId("id_transporttype_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_transporttype_h").setValueStateText("");
                     }
         
                     if(VehicleType ===""){
                         this.getView().byId("id_vehicletype_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_vehicletype_h").setValueStateText("Please Select Vehicle Type");
                     }else{
                         this.getView().byId("id_vehicletype_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_vehicletype_h").setValueStateText("");
                     }
         
                     if(VehicleNo ===""){
                         this.getView().byId("id_vehicleno_h").setValueState(sap.ui.core.ValueState.Error);
                         this.getView().byId("id_vehicleno_h").setValueStateText("Please Select VehicleNo");
                     }else{
                         this.getView().byId("id_vehicleno_h").setValueState(sap.ui.core.ValueState.None);
                         this.getView().byId("id_vehicleno_h").setValueStateText("");
                     }
         
                 }
         

                });

            },

            sendEmail: function(GetData) {
                // Construct the email parameters

                let Sign = "This is a system generated email. Please do not reply to this message. "


                var emailParams = {
                        "Body": {
                          "Content": "Hai, \n\n Gate Pass Type :"+GetData.GatePassType+" \n Gate Pass No :"+GetData.Id+" \n"+
                                        "Plant :" +GetData.PlantCode +" - "+GetData.PlantName+" \n"+
                                        "Supplier :" +GetData.SupplierCode +" - "+GetData.SupplierName+" \n"+
                                        "Customer :" +GetData.CustomerCode +" - "+GetData.CustomerName+" \n"+
                                        "Value In INR :" +GetData.ValueInINR+" \n"+
                                        "Vehicle Type :" +GetData.VehicleType+" \n"+
                                        "Vehicle No:"+GetData.VehicleNo+" \n"+
                                        "Creation Date :" +this.todayDateTime+" \n\n\n"+
                                        "Note* :"+Sign+"\n"
                        },
                        "Subject": GetData.GatePassType+"- Gate Pass ("+GetData.Id+") created.",
                        "CcRecipients": [
                          {
                            "EmailAddress": {
                              "Address": "srinivas.katta@castaliaz.co.in",
                              "Name": "Srinivas Katta"
                            }
                          }
                        ],
                        "ToRecipients": [
                          {
                            "EmailAddress": {
                              "Address": "srinivas.nama@castaliaz.co.in",
                              "Name": "Srinivas Nama"
                            }
                          }
                        ]
                };
    
                // Call the function to send the email via Integration Suite
                this.sendEmailViaIntegrationSuite(emailParams);
            },

            sendEmailViaIntegrationSuite: function(emailParams) {
                // Make an AJAX request to the server-side endpoint responsible for sending emails
                $.ajax({
                    url: "https://api.openconnectors.trial.us10.ext.hana.ondemand.com/elements/api-v2/messages", // Replace with the actual endpoint URL
                    method: "POST",
                    headers: {
                        "Authorization": "User GzjrbmqAYmxrdZ0Sbo5SdKMw0VNZz4vueI8jp+lJMFc=, Organization b08b9164a3259b321496c6d53afb26fe, Element v6QlDmyaNvj9zAAjWJzdFwKp872ACTPGU8B5ecnUmx0=",
                        "accept":"application/json", 
                        "Content-Type":"application/json" 
                    },
                    contentType: "application/json",
                    data: JSON.stringify(emailParams),
                    success: function(response) {
                        console.log("response:", response)
                        var messageId = response.id; // Assuming the response includes the ID as a property named "id"

                        // Now you can use the message ID as needed
                        console.log("Message ID:", messageId);
                        console.log("Email sent successfully!");
                    },
                    error: function(xhr, status, error) {
                        console.log("Failed to send email: " + error);
                    }
                });
            },
            

        });
    });
