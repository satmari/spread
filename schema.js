Order = new Meteor.Collection("order", {
  schema: {
    'orderDate': {
        //blackbox: true, 
        type: Date,
        label: "OrderDate",
    optional: true,
        /* If take value from datepicker
        autoValue:function(){
               var oDate = $('#orderPickerDate').datepicker().val();
                console.log(oDate);
               //console.log(Date(oDate));
                return oDate;
        }*/
    },
  'orderCreated': {
        type: Date,
        label: "OrderCreated",
    autoValue: function() {
            if (this.isInsert) {
                return new Date;
                //console.log("OrderCreated" + new Date);
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
                //console.log("OrderCreated" + new Date);
            } else {
                this.unset();
                //console.log("OrderCreated" + new Date);
            }
        }
    },
    'orderName': {
        type: String,
        label: "OrderName",
    optional: false,
    max: 20
    },
  'orderFileName': {
        type: String,
        label: "FileName",
    optional: true,
        max: 50
    },
    'orderModel': {
        type: String,
        label: "Model",
    optional: true,
    max: 10
    },
  'orderFabric': {
        type: String,
        label: "Fabric",
    optional: true,
        max: 10
    },
    'orderBagno': {
        type: String,
        label: "Bagno",
    optional: true,
    max: 10
    },
    'orderColor': {
        type: String,
        label: "Color",
        optional: true,
        max: 20
    },
    'orderLayers': {
        type: Number,
        label: "Layers",
    optional: true,
    decimal: true, 
        min: 0
    },
    'orderLength': {
        type: Number,
        label: "Length",
    optional: true, 
    decimal: true, 
        min: 0
    },
    'orderExtra': {
        type: Number,
        label: "Extra",
    optional: true,
    decimal: true, 
        min: 0
    },
    'orderLengthSum': {
        type: Number,
        label: "LengthSum", 
    optional: true,
    decimal: true, 
        min: 0,
        //max: 10000,
        /*autoValue:function(){
                var result = (this.siblingField("orderLength").value + this.siblingField("orderExtra").value) * this.siblingField("orderLayers").value;
                //console.log(result);
                return result;
        }*/
    },
  'orderPriority': {
        type: Number,
        label: "Priority",
    optional: false,
    defaultValue: 3,
        allowedValues: [5, 4, 3, 2, 1],
        max: 10
    },
    'orderAssignSpreader': {
        type: String,
        label: "AssignSpreader",
        optional: true,
        defaultValue: "none",
        allowedValues: ["none", "SP 1", "SP 2"]
    },
  'orderLoaded': {
    type: Boolean, 
    label: "OrderLoaded",
    optional: true,
  },
  'orderSpreaded': {
    type: Boolean, 
    label: "OrderSpreaded",
    optional: true,
  },
  }
});

//Order.attachSchema(Schemas.OneOrder);

//If this is not possible or you don't care to validate the object's properties, use the 
//blackbox: true
//novalidate="novalidate" //inside input
//allowedValues: ['red', 'green', 'blue']

// Potrebno 

//_id
//orderDate
//orderCreated 
//orderName
//orderFileName
//orderModel
//orderFabric
//orderBagno
//orderLayers
//orderLength
//orderExtra
//orderLengthSum
//orderPriority
//orderAssignSpreader
//orderLoaded
//orderSpreaded