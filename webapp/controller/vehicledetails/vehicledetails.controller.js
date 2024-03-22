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

        return Controller.extend("gatepassapp.controller.vehicledetails.vehicledetails", {
            onInit: function () {

            },

        });
    });
