sap.ui.define([
    "gatepassapp/controller/outward/sales/createsales"
], function(BaseController) {
    return BaseController.extend("gatepassapp.controller.outward.sales.editsales", {
        onInit: function() {
            BaseController.prototype.onInit.apply(this, arguments);
        },

        onEditValueHelpRequested:function(){
            alert("Hai");
        }

    });
});