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
    'Date': {
        //blackbox: true, 
        type: Date,
        label: "Date",
        optional: true,
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
        max: 10
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
        label: "S",
        optional: true,
        decimal: true, 
        min: 0
    },
    'SonLayer': {
        type: Number,
        label: "SonLayer",
        optional: true,
        decimal: true, 
        min: 0
    },
    'CutS': {
        type: Number,
        label: "Cut S",
        optional: true,
        decimal: true, 
        min: 0
    },
    'M': {
        type: Number,
        label: "M",
        optional: true,
        decimal: true, 
        min: 0
    },
    'MonLayer': {
        type: Number,
        label: "MonLayer",
        optional: true,
        decimal: true, 
        min: 0
    },
    'CutM': {
        type: Number,
        label: "Cut M",
        optional: true,
        decimal: true, 
        min: 0
    },
    'L': {
        type: Number,
        label: "L",
        optional: true,
        decimal: true, 
        min: 0
    },
    'LonLayer': {
        type: Number,
        label: "LonLayer",
        optional: true,
        decimal: true, 
        min: 0
    },
    'CutL': {
        type: Number,
        label: "Cut L",
        optional: true,
        decimal: true, 
        min: 0
    },
    'Status': {
        type: String,
        label: "Status",
        optional: true,
        defaultValue: "Not assigned",
        allowedValues: ["Not assigned", "SP 1", "SP 2","CUT","Finish"]
    },
    'Priority': {
        type: Number,
        label: "Priority",
        optional: false,
        defaultValue: 3,
        allowedValues: [5, 4, 3, 2, 1],
        max: 10
    },
    'Load': {
        type: String, 
        label: "Load",
        optional: true,
        defaultValue: "",
        allowedValues: ["", "SP 1-1", "SP 1-2", "SP 2-1", "SP 2-2"]
    },
    'Spread': {
        type: String, 
        label: "Spread",
        optional: true,
        defaultValue: "",
        allowedValues: ["", "SP 1-1", "SP 1-2", "SP 2-1", "SP 2-2"]
    },
    'SpreadDate': {
        type: Date,
        label: "Spread Date",
        optional: true,
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
        label: "Order Link (OrderDate + Marker + Komesa)",
        defaultValue: false,
    },
    /*
    'OrderLink': {
        type: String,
        label: "OrderLink", 
        optional: false,
        autoValue: function (){
            
            var val = this.siblingField("Komesa").value;
            var val2 = "test";
            if (this.siblingField("Link").value == true) {
                return val.value.split(' ')[0];
                //return val;
            } else {
                this.unset();
                //return val2;
            }
        },      

        /*
        autoform: {
            options: [
            {label: "One", value: "One"},
            {label: "Two", value: "Two"},
            {label: "Three", value: "Three"}
            ],
            noselect: true,
            template: "tmp_EditOrder"
        }
        */
        /*
        allowed: function () {
            var val;
            val = this("Marker");
            return val;
        }

        allowedValues: [" ", allowed],
        */
        /*autoValue:function(){
                var result = (this.siblingField("orderLength").value + this.siblingField("orderExtra").value) * this.siblingField("orderLayers").value;
                //console.log(result);
                return result;
        }*/
    //},

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
CutS
M
MonLayer
CutM
L
LonLayer
CutL
Status
Priority
Load
Spread
SpreadDate
Cut
CutDate
Comment
OrderLink
*/