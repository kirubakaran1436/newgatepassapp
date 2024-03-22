sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
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
    function (Controller, Device, MessageBox, MessageToast, Fragment, Filter, FilterOperator, JSONModel, UI5Date) {
        "use strict";

        return Controller.extend("gatepassapp.controller.Home", {
            onInit: function () {
                this.TotalVal = 0;
                // this.TotalArr = [];
                this.currenttodaydate = new Date();
                this.currenttodaydate.setHours(0, 0, 0, 0);
            },

                onAfterRendering: function() {
                    console.log("this.currenttodaydate22:, ", this.currenttodaydate)
                    let modelINWARD = this.getView().getModel("YY1_ZGE_OUTWARD_GATEPASS_CDS");
                    let modelOUT = this.getView().getModel("YY1_ZGE_OUTWARD_GATEPASS_CDS");
                    let modelRGPNRGP = this.getView().getModel("YY1_ZRGP_NRGP_HEAD_CDS");
                    let FilterDate = new sap.ui.model.Filter("SAP_CreatedDateTime", sap.ui.model.FilterOperator.GE, this.currenttodaydate)
                    let FilterGE3 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, "GE3")
                    let FilterGE4 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, "GE4")
                    let FilterGE5 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, "GE5")
                    let FilterGE21 = new sap.ui.model.Filter("ScreenCode", sap.ui.model.FilterOperator.EQ, "GE21")
                    
                    var that = this;

                    modelINWARD.read("/YY1_ZGE_OUTWARD_GATEPASS", {
                        success: function (oData, oRespons) {
                            console.log(oData);
                            let aItems = oData.results;
                            let Val = Number(aItems.length)
                            that.TotalVal += Val;
                            that.getView().byId("idinwardcount").setText(Val)
                            // console.log("that.TotalVal:", that.TotalVal)
                            // console.log("aItems:", aItems)
                            that.getView().byId("idTotalGateCount").setText(that.TotalVal) 
                        }
                    });
                    modelOUT.read("/YY1_ZGE_OUTWARD_GATEPASS", {
                    success: function (oData, oRespons) {
                        console.log(oData);
                        let aItems = oData.results;
                        that.TotalVal += Number(aItems.length);
                        that.getView().byId("idoutwardcount").setText(Number(aItems.length)) 
                        // console.log("that.TotalVal:", that.TotalVal)
                        that.getView().byId("idTotalGateCount").setText(that.TotalVal)
                    }
                    });
                    modelRGPNRGP.read("/YY1_ZRGP_NRGP_HEAD", {
                        success: function (oData, oRespons) {
                            console.log(oData);
                            let aItems = oData.results;
                            that.TotalVal += Number(aItems.length);
                            that.getView().byId("idrgpnrgpcount").setText(Number(aItems.length)) 
                            // console.log("that.TotalVal:", that.TotalVal)
                            that.getView().byId("idTotalGateCount").setText(that.TotalVal)
                        }
                    });
                    // Donut Chart for INWARD
                        modelINWARD.read("/YY1_ZGE_OUTWARD_GATEPASS", {
                            filters:[FilterDate],
                        success: function (oData, oRespons) {
                            console.log(oData);
                            let aItems = oData.results;

                            var jsonModel = new sap.ui.model.json.JSONModel({
                                employees: aItems
                            });
                            sap.ui.getCore().setModel(jsonModel);
                            var dataArray = jsonModel.getProperty("/employees");
                            var targetDataValues = ["GE3", "GE4", "GE5", "GE21"];
                            var countsArray = targetDataValues.map(targetValue => {
                                var filteredData = dataArray.filter(item => item.ScreenCode === targetValue);
                            
                            return {
                                label: targetValue,
                                value: filteredData.length,
                                displayedValue: filteredData.length
                                };
                            });
                            // Based On Donut Chart
                            var oChart = that.getView().byId("donutChartinward");

                            oChart.removeAllSegments();
                        
                            countsArray.forEach(function (oSegmentData) {
                                if(oSegmentData.label === "GE3"){
                                    var oSegment = new sap.suite.ui.microchart.InteractiveDonutChartSegment({
                                        label: "General Purchase",
                                        value: oSegmentData.value,
                                        displayedValue: oSegmentData.value+" Nos"
                                    });
                                }
                                if(oSegmentData.label === "GE4"){
                                    var oSegment = new sap.suite.ui.microchart.InteractiveDonutChartSegment({
                                        label: "Sales Return",
                                        value: oSegmentData.value,
                                        displayedValue: oSegmentData.value+" Nos"
                                    });
                                }
                                if(oSegmentData.label === "GE5"){
                                    var oSegment = new sap.suite.ui.microchart.InteractiveDonutChartSegment({
                                        label: "Sales STO",
                                        value: oSegmentData.value,
                                        displayedValue: oSegmentData.value+" Nos"
                                    });
                                }
                                if(oSegmentData.label === "GE21"){
                                    var oSegment = new sap.suite.ui.microchart.InteractiveDonutChartSegment({
                                        label: "Subcontracting GR",
                                        value: oSegmentData.value,
                                        displayedValue: oSegmentData.value+" Nos"
                                    });
                                }
                                oChart.addSegment(oSegment);
                            });

                        }
                    });

                    // Donut Chart for OUTWARD
                    modelOUT.read("/YY1_ZGE_OUTWARD_GATEPASS", {
                            filters:[FilterDate],
                        success: function (oData, oRespons) {
                            console.log(oData);
                            let aItems = oData.results;

                            var jsonModel = new sap.ui.model.json.JSONModel({
                                employees: aItems
                            });
                            sap.ui.getCore().setModel(jsonModel);
                            var dataArray = jsonModel.getProperty("/employees");
                            var targetDataValues = ["GE8", "GE9", "GE10", "GE11"];
                            var countsArray = targetDataValues.map(targetValue => {
                                var filteredData = dataArray.filter(item => item.ScreenCode === targetValue);
                            
                            return {
                                label: targetValue,
                                value: filteredData.length,
                                displayedValue: filteredData.length
                                };
                            });
                            // Based On Donut Chart
                            var oChart = that.getView().byId("donutChartoutward");

                            oChart.removeAllSegments();
                        
                            countsArray.forEach(function (oSegmentData) {
                                if(oSegmentData.label === "GE8"){
                                    var oSegment = new sap.suite.ui.microchart.InteractiveDonutChartSegment({
                                        label: "Sales",
                                        value: oSegmentData.value,
                                        displayedValue: oSegmentData.value+" Nos"
                                    });
                                }
                                if(oSegmentData.label === "GE9"){
                                    var oSegment = new sap.suite.ui.microchart.InteractiveDonutChartSegment({
                                        label: "Sales STO",
                                        value: oSegmentData.value,
                                        displayedValue: oSegmentData.value+" Nos"
                                    });
                                }
                                if(oSegmentData.label === "GE10"){
                                    var oSegment = new sap.suite.ui.microchart.InteractiveDonutChartSegment({
                                        label: "Vendor Return",
                                        value: oSegmentData.value,
                                        displayedValue: oSegmentData.value+" Nos"
                                    });
                                }
                                if(oSegmentData.label === "GE11"){
                                    var oSegment = new sap.suite.ui.microchart.InteractiveDonutChartSegment({
                                        label: "Subcontracting GI",
                                        value: oSegmentData.value,
                                        displayedValue: oSegmentData.value+" Nos"
                                    });
                                }
                                oChart.addSegment(oSegment);
                            });


                        }
                    });

                    var model0 = this.getView().getModel("YY1_ZGE_GATEPASS_USER_TABL_CDS");
                    var EntitySet = "/YY1_ZGE_OUTWARD_GATEPASS";
        
                        var that = this;
                        model0.read(""+EntitySet+"", {
                            success: function (oData, oRespons) {
                                console.log(oData);
                                var aItems = oData.results;
                                        for (var i = 0; i < aItems.length; i++) {
                                            // console.log(aItems[i].SAP_UUID)
                                            var SAP_UUID = aItems[i].SAP_UUID;
        
                                            var oModel05 = that.getView().getModel("YY1_ZGE_GATEPASS_USER_TABL_CDS");
                                            oModel05.setHeaders({
                                            "X-Requested-With": "X",
                                            "Content-Type": "application/json"
                                            });
                            
                                            oModel05.remove("/YY1_ZGE_GATEPASS_USER_TABL(guid'" + SAP_UUID + "')", {
                                            success: function(data) {
                                                console.log("Deleted")
                                            },
                                            error: function(error) {
                                                console.error("Error updating header:", error);
                                                console.log("Not Deleted")
                                            }
                                            });
                                        }
                            }
                        });


                    let model001 = this.getView().getModel("YY1_ZGE_GATEPASS_ATU_CDS");
                    
                    var that = this;
                    model001.read("/YY1_ZGE_GATEPASS_ATU", {
                        success: function (oData1, oRespons) { 
                            that.getView().byId("idpagetitle").setTitle("Home Screen -  ("+oData1.results[0].UserName+")")
                        }
                    });   

                },

            // OnClick:function(){
            //     alert("ok");
            // // },

            // let arr = ["YY1_ZRGP_NRGP_HEAD_CDS", "YY1_ZGE_OUTWARD_GATEPASS_CDS", "YY1_ZGE_OUTWARD_GATEPASS_CDS"]
            // let arrEn = ["YY1_ZRGP_NRGP_HEAD_CDS", "YY1_ZGE_OUTWARD_GATEPASS_CDS", "YY1_ZGE_OUTWARD_GATEPASS_CDS"]

            // // OnClick:function(){
            //     var model0 = this.getView().getModel("YY1_ZGE_OUTWARD_GATEPASS_CDS");
            //     var EntitySet = "/YY1_ZGE_OUTWARD_GATEPASS";
    
            //         var that = this;
            //         model0.read(""+EntitySet+"", {
            //             success: function (oData, oRespons) {
            //                 console.log(oData);
            //                 var aItems = oData.results;
            //                         for (var i = 0; i < aItems.length; i++) {
            //                             // console.log(aItems[i].SAP_UUID)
            //                             var SAP_UUID = aItems[i].SAP_UUID;
    
            //                             var oModel05 = that.getView().getModel("YY1_ZGE_OUTWARD_GATEPASS_CDS");
            //                             oModel05.setHeaders({
            //                             "X-Requested-With": "X",
            //                             "Content-Type": "application/json"
            //                             });
                        
            //                             oModel05.remove("/YY1_ZGE_OUTWARD_GATEPASS(guid'" + SAP_UUID + "')", {
            //                             success: function(data) {
            //                                 console.log("Deleted")
            //                             },
            //                             error: function(error) {
            //                                 console.error("Error updating header:", error);
            //                                 console.log("Not Deleted")
            //                             }
            //                             });
            //                         }
            //             }
            //         });
    
            // },

            // onFilterSelect: function (oEvent) {
            //     var oBinding = this.byId("productsTable").getBinding("items");
            //         sKey = oEvent.getParameter("key");
            //         console.log("sKey:", sKey);
            // },
        });
    });
