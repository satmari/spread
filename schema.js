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
    'M': {
        type: Number,
        label: "M",
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
    'AssignSpreader': {
        type: String,
        label: "AssignSpreader",
        optional: true,
        defaultValue: "none",
        allowedValues: ["none", "SP 1", "SP 2"]
    },
    'Priority': {
        type: Number,
        label: "Priority",
        optional: false,
        defaultValue: 3,
        allowedValues: [5, 4, 3, 2, 1],
        max: 10
    },
    'Loaded': {
        type: Boolean, 
        label: "Loaded",
        optional: true,
    },
    'Spreaded': {
        type: Boolean, 
        label: "Spreaded",
        optional: true,
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
Length
Extra
LengthSum
Width
S
M
L
AssignSpreader
Priority
Loaded
Spreaded
*/