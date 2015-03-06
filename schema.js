Order = new Meteor.Collection("order", {
  schema: {
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
        allowedValues: ["Not assigned", "SP 1", "SP 2", "MS 1", "CUT", "Finished", "TRASH"]
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
        max: 10
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
        max: 10
    },
    'Fabric': {
        type: String,
        label: "Fabric",
        optional: true,
        max: 10
    },
    'ColorCode': {
        type: String,
        label: "ColorCode",
        optional: true,
        max: 10
    },
    'ColorDesc': {
        type: String,
        label: "ColorDesc",
        optional: true,
        max: 30
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
        allowedValues: [1, 2, 3],
        max: 10
    },
    'Load': {
        type: String, 
        label: "Load",
        optional: true,
        defaultValue: "",
        //allowedValues: ["", "SP 1-1", "SP 1-2", "SP 2-1", "SP 2-2", "MS 1"]
        allowedValues: ["", "SP 1-1", "SP 1-2", "SP 1-3", "SP 2-1", "SP 2-2", "SP 2-3", "MS 1", "MS 1-1", "MS 1-2"]
    },
    'Spread': {
        type: String, 
        label: "Spread",
        optional: true,
        defaultValue: "",
        //allowedValues: ["", "SP 1-1", "SP 1-2", "SP 2-1", "SP 2-2", "MS 1"]
        allowedValues: ["", "SP 1-1", "SP 1-2", "SP 1-3", "SP 2-1", "SP 2-2", "SP 2-3", "MS 1", "MS 1-1", "MS 1-2"]
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
    'Cut': {
        type: String, 
        label: "Cut",
        optional: true,
        defaultValue: "",
        allowedValues: ["", "CUT 1", "CUT 2"]
    },
    'CutDate': {
        type: Date,
        label: "Cut Date",
        optional: true,
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
    
  }
});

//Order.attachSchema(Schemas.OneOrder);

//If this is not possible or you don't care to validate the object's properties, use the 
//blackbox: true
//novalidate="novalidate" //inside input
//allowedValues: ['red', 'green', 'blue']

/* Potrebno 
No
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
Status
Priority
Load
Spread
SpreadDate
SpreadOperator
Cut
CutDate
Comment
OrderLink 
*/

Message = new Meteor.Collection("message",  {
schema: {
    'No': {
        type: Number,
        unique: true,
        label: "No",
        optional: false,
        decimal: false, 
        min: 0
    },
    'Text': {
        type: String,
        label: "Text",
        optional: true,
        defaultValue: "" 
    }, 
    'Type': {
        type: String,
        label: "Type",
        optional: true,
        defaultValue: "",
        allowedValues: ["", "Warning", "Normal"]
    },
    'Status': {
        type: String,
        label: "Status",
        optional: true,
        defaultValue: "Not assigned",
        allowedValues: ["Not assigned", "SP 1", "SP 2","CUT","Finished"]
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
    'Active': {
        type: Boolean,
        label: "Active",
        defaultValue: true,

    }

  }
});


Operators = new Meteor.Collection("operators",  {
schema: {
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
  }
});