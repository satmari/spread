Order = new Meteor.Collection("order");
Order.attachSchema(new SimpleSchema({
    'No': {
        type: Number,
        unique: true,
        label: "No",
        optional: false,
        decimal: false, 
        min: 0
    },
    'Position': {
        type: Number,
        label: "Position",
        optional: false,
        decimal: false, 
        //defaultValue: 99,
        //allowedValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 99],
        //max: 100
        /*allowedValues: function() {
            var order = Order.find({Status: 'SP 2'}).fetch();

            var pos;

            for (var i = 0; i < order.length; i++) {
                pos = order[i].Position;
                pos += pos
            }
            console.log("pos: " + pos);
            return pos;
        }*/
    },
    'Status': {
        type: String,
        label: "Status",
        optional: true,
        defaultValue: "Not assigned",
        allowedValues: ["Not assigned", "SP 1", "SP 2", "SP 3", "MS 1", "CUT", "Finished", "TRASH"]
    },
    'Date': {
        //blackbox: true, 
        type: Date,
        label: "Date",
        optional: true
    },
    'Created': {
        type: Date,
        label: "Created",
         autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        }
    },
    'Komesa': {
        type: String,
        label: "Komesa",
        optional: false,
        max: 20
    },
    'Marker': {
        type: String,
        label: "Marker",
        optional: true,
        max: 50
    },
    'Style': {
        type: String,
        label: "Style",
        optional: true,
        max: 30
    },
    'Fabric': {
        type: String,
        label: "Fabric",
        optional: true,
        max: 30
    },
    'ColorCode': {
        type: String,
        label: "ColorCode",
        optional: true,
        max: 30
    },
    'ColorDesc': {
        type: String,
        label: "ColorDesc",
        optional: true,
        max: 50
    },
    'Bagno': {
        type: String,
        label: "Bagno",
        optional: true,
        max: 100
    },
    'Layers': {
        type: Number,
        label: "Layers",
        optional: true,
        decimal: true, 
        min: 0
    },
    'LayersActual': {
        type: Number,
        label: "LayersActual",
        optional: true,
        decimal: true, 
        min: 0
    },
    'LayersBeforeChangeShift': {
        type: Number,
        label: "Layers Before Change Shift",
        optional: true,
        decimal: true, 
        min: 0
    },
    'LayersAfterChangeShift': {
        type: Number,
        label: "Layers After Change Shift",
        optional: true,
        decimal: true, 
        min: -100
    },
    'Length': {
        type: Number,
        label: "Length",
        optional: true, 
        decimal: true, 
        min: 0
    },
    'Extra': {
        type: Number,
        label: "Extra",
        optional: true,
        decimal: true, 
        min: 0
    },
    'LengthSum': {
        type: Number,
        label: "LengthSum", 
        optional: true,
        decimal: true, 
        min: 0,
        /*autoValue:function(){
                var result = (this.siblingField("orderLength").value + this.siblingField("orderExtra").value) * this.siblingField("orderLayers").value;
                //console.log(result);
                return result;
        }*/
    },
    'UsableLength': {
        type: Number,
        label: "UsableLength (cm)",
        optional: true, 
        decimal: false, 
        min: 0
    },
    'PcsBundle': {
        type: Number,
        label: "Nr. Pcs Bundle",
        optional: true,
        decimal: false, 
        min: 0
    },
    'Width': {
        type: Number,
        label: "Width",
        optional: true,
        decimal: true, 
        min: 0
    },
    'S': {
        type: Number,
        label: "S Marker",
        optional: true,
        decimal: true, 
        min: 0
    },
    'SonLayer': {
        type: Number,
        label: "S per Layer",
        optional: true,
        decimal: true, 
        min: 0
    },
    'S_Cut': {
        type: Number,
        label: "S Cut",
        optional: true,
        decimal: true, 
        min: 0
    },
    'M': {
        type: Number,
        label: "M Marker",
        optional: true,
        decimal: true, 
        min: 0
    },
    'MonLayer': {
        type: Number,
        label: "M per Layer",
        optional: true,
        decimal: true, 
        min: 0
    },
    'M_Cut': {
        type: Number,
        label: "M Cut",
        optional: true,
        decimal: true, 
        min: 0
    },
    'L': {
        type: Number,
        label: "L Marker",
        optional: true,
        decimal: true, 
        min: 0
    },
    'LonLayer': {
        type: Number,
        label: "L per Layer",
        optional: true,
        decimal: true, 
        min: 0
    },
    'L_Cut': {
        type: Number,
        label: "L Cut",
        optional: true,
        decimal: true, 
        min: 0
    },
    'XL': {
        type: Number,
        label: "XL Marker",
        optional: true,
        decimal: true, 
        min: 0
    },
    'XLonLayer': {
        type: Number,
        label: "XL per Layer",
        optional: true,
        decimal: true, 
        min: 0
    },
    'XL_Cut': {
        type: Number,
        label: "XL Cut",
        optional: true,
        decimal: true, 
        min: 0
    },
    'XXL': {
        type: Number,
        label: "XXL Marker",
        optional: true,
        decimal: true, 
        min: 0
    },
    'XXLonLayer': {
        type: Number,
        label: "XXL per Layer",
        optional: true,
        decimal: true, 
        min: 0
    },
    'XXL_Cut': {
        type: Number,
        label: "XXL Cut",
        optional: true,
        decimal: true, 
        min: 0
    },
    'Priority': {
        type: Number,
        label: "Priority",
        optional: false,
        defaultValue: 1,
        allowedValues: [1, 2, 3, 4, 5, 6],
        max: 10
    },
    'Load': {
        type: String, 
        label: "Load",
        optional: true,
        defaultValue: "",
        allowedValues: ["", "SP 1-1", "SP 1-2", "SP 1-3", "SP 2-1", "SP 2-2", "SP 2-3", "SP 3-1", "SP 3-2", "SP 3-3", "MS 1-1", "MS 1-2"]
    },
    'Spread': {
        type: String, 
        label: "Spread",
        optional: true,
        defaultValue: "",
        allowedValues: ["", "SP 1-1", "SP 1-2", "SP 1-3", "SP 2-1", "SP 2-2", "SP 2-3", "SP 3-1", "SP 3-2", "SP 3-3", "MS 1-1", "MS 1-2"]
    },
    'SpreadDate': {
        type: Date,
        label: "Spread Date",
        optional: true,
    },
    'SpreadOperator': {
        type: String,
        label: "Spread Operator",
        optional: true,
        defaultValue: "",
        max: 50
    },
    'SpreadOperatorBeforeChangeShift': {
        type: String,
        label: "Spread Operator Before Change Shift",
        optional: true,
        defaultValue: "",
        max: 50
    },
    'Cut': {
        type: String, 
        label: "Cut",
        optional: true,
        defaultValue: "",
        //allowedValues: ["", "CUT 1", "CUT 2"] // Gordon
        //allowedValues: ["", "MOR 1", "MOR 2", "LEC 1", "LEC 2"]  // Zalli
        allowedValues: ["", "CUT 1", "CUT 2", "MOR 1", "MOR 2", "LEC 1", "LEC 2"] 
    },
    'CutDate': {
        type: Date,
        label: "Cut Date",
        optional: true,
    },
    'CutOperator': {
        type: String,
        label: "Cut Operator",
        optional: true,
        defaultValue: "",
        max: 50
    },
    'Comment' : {
        type: String,
        label: "Comment",
        optional: true,
    },
    'OrderLink' : {
        type: Boolean,
        label: "Order Linked",
        optional: true,
        defaultValue: false,
    },
    'SkalaMarker': {
        type: String,
        label: "Skala Marker",
        optional: true,
        defaultValue: "",
        max: 20
    },
    'Sector': {
        type: String,
        label: "Sector",
        optional: true,
        defaultValue: "",
        max: 20
    },
    'Pattern': {
        type: String,
        label: "Pattern",
        optional: true,
        defaultValue: "",
        max: 10
    },
    'Consumption': {
        type: Number,
        label: "Tot Consumption",
        optional: true,
        decimal: true, 
        min: 0
    },
    'LabelPrinted': {
        type: Boolean,
        label: "Marker Printed",
        optional: true,
        defaultValue: false
    },
    'BomConsPerPCS': {
        type: Number,
        label: "BOM Cons. [mt/pcs]",
        optional: true,
        decimal: true,
        //min: 0,
    },
    'MaterialAllowance': {
        type: Number,
        label: "Material Allowance (DiBa) [%]",
        optional: true,
        decimal: false,
        //min: 0
    },
    'BomConsPerPCSwithAll': {
        type: Number,
        label: "BOM Cons. Per PCS with All. [mt/pcs]",
        optional: true,
        decimal: true,
        //min: 0,
    },
    'BomCons': {
        type: Number,
        label: "BOM Cons. [mt]",
        optional: true,
        decimal: true,
        //min: 0
    },
    'BomConswithAll': {
        type: Number,
        label: "BOM Cons. with All [mt]",
        optional: true,
        decimal: true,
        //min: 0
    },
    'Season': {
        type: String,
        label: "Season",
        optional: true,
        defaultValue: "",
        max: 10
    },
    'SpreadingMethod': {
        type: String,
        label: "SpreadingMethod",
        optional: true,
        defaultValue: "",
        max: 20
    },
    'T_Usable_Width': {
        type: Number,
        label: "Theoretical Usable Width",
        optional: true,
        decimal: true,
        //min: 0
    },
    'Stimulation_After': {
        type: Number,
        label: "Stimulation AfterChangeShift",
        optional: true,
        decimal: true,
        //min: 0
    },
    'Stimulation_Before': {
        type: Number,
        label: "Stimulation BeforeChangeShift",
        optional: true,
        decimal: true,
        //min: 0
    }


}));

//If this is not possible or you don't care to validate the object's properties, use the 
//blackbox: true
//novalidate="novalidate" //inside input
//allowedValues: ['red', 'green', 'blue']

/* Potrebno 
No
Position
Status
Date
Created
Komesa
Marker
Style
Fabric
ColorCode
ColorDesc
Bagno
Layers
LayersActual
Length
Extra
LengthSum
PcsBundle
Width
S
SonLayer
S_Cut
M
MonLayer
M_Cut
L
LonLayer
L_Cut
XL
XLonLayer
XL_Cut
XXL
XXLonLayer
XXL_Cut
Priority
Load
Spread
SpreadDate
SpreadOperator
Cut
CutDate
CutOperator
Comment
OrderLink 
SkalaMarker
Sector
Pattern
Consumption
LabelPrinted
BomConsPerPCS
MaterialAllowance
BomConsPerPCSwithAll
BomCons
BomConswithAll
Season
*/

Operators = new Meteor.Collection("operators");
Operators.attachSchema(new SimpleSchema({
    'OP_Code': {
        type: Number,
        unique: true,
        label: "Operator Code",
        optional: false,
        decimal: false, 
        min: 0
    },
    'OP_Name': {
        type: String,
        label: "Operator Name",
        optional: false,
        defaultValue: "" 
    },
    'Machine': {
        type: String,
        label: "Machine Type",
        optional: true,
        defaultValue: "",
        allowedValues: ["Spreader", "Manual Spreader", "Cutter"]
    },
    'Status': {
        type: String,
        label: "Status",
        optional: true,
        defaultValue: "Active",
        allowedValues: ["Active", "Not active"]
    },
    'Created': {
        type: Date,
        label: "Created",
         autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        }
    }

}));

Table_capacity = new Meteor.Collection("table_capacity");
Table_capacity.attachSchema(new SimpleSchema({
    'Date': {
        type: String,
        label: "Date",
        optional: false,
    },
    'Time': {
        type: String,
        label: "Time",
        optional: false,
    },
    'Markers': {
        type: Number,
        label: "Markers",
        optional: false,
        decimal: false, 
        min: 0
    },
    'Orders': {
        type: Number,
        label: "Orders",
        optional: false,
        decimal: false, 
        min: 0
    },
    'CreationDate': {
        type: Date,
        label: "CreationDate",
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        }
    }
    
}));

Bom = new Meteor.Collection("bom");
Bom.attachSchema(new SimpleSchema({
    'Commessa': {
        type: String,
        label: "Commessa",
        unique: true,
        optional: false,
    },
    'BomConsPerPCS': {
        type: Number,
        label: "BOM Cons. [mt/pcs]",
        optional: false,
        decimal: true,
        min: 0,
    },
    'MaterialAllowance': {
        type: Number,
        label: "Material Allowance (DiBa) [%]",
        optional: false,
        decimal: true,
        min: 0
    },
    'CreationDate': {
        type: Date,
        label: "Creation/Update Date",
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        }
    }
    
}));