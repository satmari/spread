if (Meteor.isClient) {

  Meteor.startup(function () {
    //Session.set("ses_namefilter", "");
    //Session.set("ses_datefilter", "");

    var t = Date();

    var todayAt02 = new Date();
    todayAt02.setHours(2,0,0,0);

    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    });
    
    $('#filterOrderDate').val(new Date().toDateInputValue());
    Session.set("ses_datefilter", todayAt02);
    Session.set("ses_datenotexist", false);
    Session.set("ses_jobnotexist", false);

  })

  Meteor.autosubscribe(function () {
    var ses_datefilter = Session.get("ses_datefilter");
    var ses_existdate = Session.get("ses_datenotexist");
    var ses_jobnotexist = Session.get("ses_jobnotexist");
    //console.log("Autosubcribe sesion: " + ses + " , typeof: " + typeof ses);
    
    if ( ses_existdate == true ) {
      Meteor.subscribe('orderWithoutDate');
    } else if ( ses_jobnotexist == true ) { 
      Meteor.subscribe('orderWithoutJob');
    } else if ( ses_datefilter == "" ) { 
      Meteor.subscribe('orderAll');
    } else {
      Meteor.subscribe('order', Session.get("ses_datefilter"));
    }

    /*if ( ses_jobnotexist == true ) { 
      Meteor.subscribe('orderWithoutJob');
    }*/

  });

  // Reactive-table
  Template.reactiveTebleList.orders = function () {
      return Order.find();
  }

  Template.reactiveTebleList.helpers({
    settings: function () {
      return {
          rowsPerPage: 50,
          showFilter: true,
          showNavigation: 'auto',
          fields: [
          //{ key: '_id', label: '_ID' },
          { key: 'No', label: 'No' },
          { key: 'Date', label: 'Date',
            fn: function (value) {
              if (value){
                return moment(value).format("YYYY-MM-DD");
              } else {
                return "";
              }
              //return moment(value).format("DD-MM-YYYY");
            }, sort: 'descending'
           },
          //{ key: 'Created', label: 'Created' },
          { key: 'Komesa', label: 'Komesa' },
          { key: 'Marker', label: 'Marker' },
          { key: 'Style', label: 'Style' },
          { key: 'Fabric', label: 'Fabric' },
          { key: 'ColorCode', label: 'ColorCode' },
          { key: 'ColorDesc', label: 'ColorDesc' },
          { key: 'Bagno', label: 'Bagno' },
          { key: 'Layers', label: 'Layers' },
          { key: 'Length', label: 'Length' },
          { key: 'Extra', label: 'Extra' },
          { key: 'LengthSum', label: 'LengthSum' },
          { key: 'Width', label: 'Width' },
          { key: 'S', label: 'S' },
          { key: 'M', label: 'M' },
          { key: 'L', label: 'L' },
          { key: 'AssignSpreader', label: 'Assign',
            fn: function (value) {
              if (value == "SP 1") {
                return "SP 1";
              }
              else if (value == "SP 2") {
                return "SP 2";
              }
              else {
                return "Not Assigned";
              }
            }
           },
          { key: 'Priority', label: 'Priority' },
          { key: 'Loaded', label: 'Loaded',
            fn: function (value){ 
              if (value == true) {
                return "Loaded";
              };
          } },
          { key: 'Spreaded', label: 'Spreaded', 
            fn: function (value){
              if (value == true) {
                return "Spreaded";
              };
          } },
          ],

          //useFontAwesome: true,
          //group: 'orderExtra'
          //rowClass: "warning", //warning, danger
          rowClass: function(item) {
            var priority = item.Priority;
            var loaded = item.Loaded;
            var spreaded = item.Spreaded;
            
            // treba da se doradi

            if (spreaded == true)  {
              return 'success';
            } else if (loaded == true) {
              return 'info';
            } else if (priority == 4) {
              return 'warning';
            } else if (priority == 5){
              return 'danger'; //info, success, active, warning, danger
            } else {

            }
        },
        };
      } 
  });

  // Reactive Table events
  Template.reactiveTebleList.events({
      'click .reactive-table tbody tr': function (event) {
        // set the blog post we'll display details and news for
        var click_id = this._id;
        //console.log('selectedDocId: ', click_id);
        Session.set('selectedDocId', click_id);

        // Define rd_editorder
      var rd_editorder = ReactiveModal.initDialog(rm_EditOrder);
        // show rd_editorder
        rd_editorder.show();
      }
  });

  // Edit Order on click (in table) - Reactive Modal
  var rm_EditOrder = {
    //type: 'type-info',   //type-default, type-info, type-primary, 'type-success', 'type-warning' , 'type-danger' 
      //size: '',
      template: Template.tmp_EditOrder, 
      title: "Edit Order",
      //modalBody: "Helll0",
      modalDialogClass: "modal-dialog", //optional
      modalBodyClass: "modal-body", //optional
      modalFooterClass: "modal-footer",//optional
      closable: false,
      buttons: {
        //"cancel": {
        //  class: 'btn-danger',
        //  label: 'Cancel'
          //},
          "ok": {
            closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
            class: 'btn-info',
            label: 'Back'
          }
      }
  };

  // Reactive table helper (for update/edit orders)
  Template.tmp_EditOrder.helpers({
      editingDoc: function editingDocHelper() {
        return Order.findOne({_id: Session.get("selectedDocId")});
      }
  });

  // Add New Order on click (in nav button) - Reactive Modal
  var rm_AddNewOrder = {
    //type: 'type-info',   //type-default, type-info, type-primary, 'type-success', 'type-warning' , 'type-danger' 
      //size: '',
      template: Template.tmp_AddNewOrder, 
      title: "Add new order",
      //modalBody: "Helll0",
      //modalDialogClass: "modal-dialog", //optional
      //modalBodyClass: "modal-body", //optional
      //modalFooterClass: "modal-footer",//optional
      closable: true,
      buttons: {
        //"cancel": {
        //  class: 'btn-danger',
        //  label: 'Cancel'
          //},
          "ok": {
            closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
            class: 'btn-info',
            label: 'Back'
          }
      }
  };

  // Export Order on click (in nav button) - Reactive Modal
  var rm_ExportOrder = {
      template: Template.tmp_ExportOrder, 
      title: "Export order list",
      //modalDialogClass: "modal-dialog", //optional
      //modalBodyClass: "modal-body", //optional
      //modalFooterClass: "modal-footer",//optional
      closable: false,
      buttons: {
        //"cancel": {
        //  class: 'btn-danger',
        //  label: 'Cancel'
          //},
          "ok": {
            closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
            class: 'btn-info',
            label: 'Back'
          }
      }
  };

  // Import Order on click (in nav button) - Reactive Modal
  var rm_ImportOrder = {
      template: Template.tmp_ImportOrder, 
      title: "Import order list",
      //modalDialogClass: "modal-dialog", //optional
      //modalBodyClass: "modal-body", //optional
      //modalFooterClass: "modal-footer",//optional
      closable: false,
      buttons: {
        //"cancel": {
        //  class: 'btn-danger',
        //  label: 'Cancel'
          //},
          "ok": {
            closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
            class: 'btn-info',
            label: 'Back'
          }
      }
  };

  // Import Order from MD Analytics on click (in nav button) - Reactive Modal
  /*var rm_ImportOrderAnalyitics = {
      template: Template.tmp_ImportOrderAnalytics, 
      title: "Import orders from MD Analytics",
      //modalDialogClass: "modal-dialog", //optional
      //modalBodyClass: "modal-body", //optional
      //modalFooterClass: "modal-footer",//optional
      closable: false,
      buttons: {
        //"cancel": {
        //  class: 'btn-danger',
        //  label: 'Cancel'
          //},
          "ok": {
            closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
            class: 'btn-info',
            label: 'Back'
          }
      }
  };*/

  // Import Order from Planned Markers file (in nav button) - Reactive Modal
  var rm_ImportPlannedMarkers = {
      template: Template.tmp_ImportPlannedMarkers, 
      title: "Import from Planned Markers CSV file",
      //modalDialogClass: "modal-dialog", //optional
      //modalBodyClass: "modal-body", //optional
      //modalFooterClass: "modal-footer",//optional
      closable: false,
      buttons: {
        //"cancel": {
        //  class: 'btn-danger',
        //  label: 'Cancel'
          //},
          "ok": {
            closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
            class: 'btn-info',
            label: 'Back'
          }
      }
  };

  SimpleSchema.debug = true;
  //UI.registerHelper("Schemas", Schemas);
  
  // Accounts base - Only Username and pass requered
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  // Formating Dates (moment)
  var DateFormats = {
       short: "DD MMMM YYYY",
       long:  "DD-MM-YYYY HH:mm"
  };
  // Use UI.registerHelper..
  UI.registerHelper("formatDate", function(datetime, format) {
      if (moment) {
        f = DateFormats[format];
      return moment(datetime).format(f);
      }
      else {
        return datetime;
      }
  });


  // Navigation events
  Template.nav.events({
    'click #btnfilterOrderDate': function (e, t) {

      Session.set("ses_datefilter", "");
      console.log("Delete-ses_datefilter: " + Session.get("ses_datefilter"));

      $('#filterOrderDate').val("");

      //Session.set("ses_datenotexist", false);
      //Session.set("ses_jobnotexist", false);
    },

    'change #filterOrderDate': function (e, t) {
      var datesel = $('#filterOrderDate').val();

      var datesel1 = new Date(datesel); 
      
      Session.set("ses_datefilter", datesel1);
      datesel1 = "";
      console.log("Set-ses_datefilter: " + Session.get("ses_datefilter"));
    },

    'click #new_order': function (e, t) {
      console.log("new_order - click");

      // Define rd_addneworder
      var rd_addneworder = ReactiveModal.initDialog(rm_AddNewOrder);
      // Show rd_addneworder
        rd_addneworder.show();
    },

    'click #import_orders_analytics' : function () {
      /*console.log('import orders from Analytics - click')

      // Define rd_addneworder
      var rd_importOrderAnalytics = ReactiveModal.initDialog(rm_ImportOrderAnalyitics);
      // Show rd_addneworder
      rd_importOrderAnalytics.show();*/
    },

    'click #import_from_planned_markers' : function () {
      console.log('import from planned markers - click')

      // Define rd_addneworder
      var rd_importPlannedMarkers = ReactiveModal.initDialog(rm_ImportPlannedMarkers);
      // Show rd_addneworder
      rd_importPlannedMarkers.show();
    },

    'click #export_orders' : function () {
      console.log('export orders - click')

      // Define rd_addneworder
      var rd_exportOrder = ReactiveModal.initDialog(rm_ExportOrder);
      // Show rd_addneworder
      rd_exportOrder.show();
    },

    'click #import_orders' : function () {
      console.log('import orders - click')

      // Define rd_addneworder
      var rd_importOrder = ReactiveModal.initDialog(rm_ImportOrder);
      // Show rd_addneworder
      rd_importOrder.show();
    },

    'click #refresh_sum' : function () {
      console.log('refresh_sum - click')

      var order_all = Order.find().fetch();

      for (var i = 0; i < order_all.length; i++) {
        //alert("a")
        //console.log(order_all[i])
        //console.log(order_all[i]._id)
        var length = Number(order_all[i].Length)
        var extra = Number(order_all[i].Extra)
        var layers = Number(order_all[i].Layers)

        var sum = Number((length + extra) * layers)
        var sumf =sum.toFixed(3);

        Order.update({_id: order_all[i]._id},
          {
            //$set: { orderLength: 5+5 },
            $set: { LengthSum: sumf },
          }, 
          {
            multi: true,
          }
        );
      }
    },

    'change #orderWithoutDate': function (e, t) {

        if ($('#orderWithoutDate').prop('checked')){
          console.log("orderWithoutDate: checked");
          Session.set("ses_datenotexist", true);
        } else {
          console.log("orderWithoutDate: unchecked");
          Session.set("ses_datenotexist", false);
        }
    },

    'change #orderWithoutJob': function (e, t) {

        if ($('#orderWithoutJob').prop('checked')){
          console.log("orderWithoutJob: checked");
          Session.set("ses_jobnotexist", true);
        } else {
          console.log("orderWithoutJob: unchecked");
          Session.set("ses_jobnotexist", false);
        }
    },

  });
  
  Template.tmp_EditOrder.events({
    'click #deleteOrder': function (e, t) {
      var orderToDelete = Session.get("selectedDocId");
      console.log("orderToDelete" + orderToDelete);

      Order.remove({_id: orderToDelete});
      //rd_editorder.hide();
    }
  });

  Template.tmp_ImportOrderAnalytics.events({
    'change #files_analytics': function (e) {
      //alert("change a")
      //var files_a = e.target.files || e.dataTransfer.files;

      var files_a = e.target.files;
      //console.log("files_a:" + files_a);
      var file_a = files_a[0];           
      //console.log("file_a:" + file_a);

      var reader = new FileReader();

      console.log("pre reader.onload")
          
      reader.onload = function (e) { 
        alert("reader.onloadend");
        var text = e.target.result;
        //alert(text);
        //var all = $.csv.toObjects(text);
        var all = $.csv.toObjects(text, {
            delimiter:"'",
            separator:';',
        });

          for (var i = 0; i < all.length; i++) {
            console.log(all[i]);

            var seq  = Number(all[i]['SEQ']);
            console.log(seq);
            var ply = Number(all[i]['PLY'])
            console.log(ply);
  
            // One by One
            //Order.insert({SEQ: seq, FILE: all[i]['FILE'], CUT_FILE: all[i]['CUT FILE'], MODEL: all[i]['MODEL'], SPREAD_TYPE: all[i]['SPREAD TYPE'], BAGNO: all[i]['BAGNO'], PLY: ply});    
            Order.insert({orderName: all[i]['FILE'], orderFileName: all[i]['CUT FILE'], orderModel: all[i]['MODEL'], orderFabric: all[i]['SPREAD TYPE'], orderBagno: all[i]['BAGNO'], orderLayers: ply});    
          }
      }
      reader.readAsText(file_a);

    }
  });


  Template.tmp_ImportPlannedMarkers.events({
    'change #files_planned_markers': function (e) {
      //alert("change a")
      //var files_a = e.target.files || e.dataTransfer.files;

      var files_a = e.target.files;
      //console.log("files_a:" + files_a);
      var file_a = files_a[0];           
      //console.log("file_a:" + file_a);

      var reader = new FileReader();

      reader.onload = function (e) { 
        //alert("reader.onloadend");
        var text = e.target.result;
        //alert(text);
        //var all = $.csv.toObjects(text);
        var all = $.csv.toObjects(text, {
            delimiter:"'",
            separator:';',
        });

          for (var i = 0; i < all.length; i++) {
            //console.log(all[i]);

            var no  = Number(all[i]['No']);
            var layers = Number(all[i]['Layers']);

            var lengthS = all[i]['Length'];
            length = lengthS.replace(",", ".");
                        
            var extra = Number(all[i]['Extra']);
            var lengthsumX = Number((length + extra) * layers);
            var lengthsum = lengthsumX.toFixed(3);

            var width = Number(all[i]['Width']);
            var s = Number(all[i]['S']);
            var m = Number(all[i]['M']);
            var l = Number(all[i]['L']);

            // One by One
            //Order.insert({SEQ: seq, FILE: all[i]['FILE'], CUT_FILE: all[i]['CUT FILE'], MODEL: all[i]['MODEL'], SPREAD_TYPE: all[i]['SPREAD TYPE'], BAGNO: all[i]['BAGNO'], PLY: ply});    
            //Order.insert({orderName: all[i]['FILE'], orderFileName: all[i]['CUT FILE'], orderModel: all[i]['MODEL'], orderFabric: all[i]['SPREAD TYPE'], orderBagno: all[i]['BAGNO'], orderLayers: ply});
            Order.insert({No: no, Komesa: all[i]['Komesa'], Marker: all[i]['Marker'], Style: all[i]['Style'], Fabric: all[i]['Fabric'], ColorCode: all[i]['ColorCode'], ColorDesc: all[i]['ColorDesc'], Bagno: all[i]['Bagno'], Layers: layers, Length: length, Extra: extra, LengthSum: lengthsum, Width: width, S: s, M: m, L: l });    
          }
      }
      reader.readAsText(file_a);

    }
  });

    Template.tmp_ImportOrder.events({
    'change #files': function (e) {
      //alert("change")
      var files = e.target.files || e.dataTransfer.files;

    }
  });

  Template.tmp_ExportOrder.order = function() {
      return Order.find();
  }

  Template.tmp_ExportOrder.events({
      'click #convert1' : function (e, t) {

          //var json = $.parseJSON($("#json").val());
          //var csv = JSON2CSV(json);
          //$("#csv").val(csv);

          //var listo  = $("#listo").val();
          //console.log(listo);

          //for example
          //Order.insert(
          //[
          //{orderName:"import1",orderLayers:"5",orderLength:"5",orderExtra:"5",orderPriority:"5"},
          //{orderName:"import2",orderLayers:1,orderLength:1,orderExtra:1}
          //]
            //)

      },
      'click #download1' : function (e, t) {
        //var json = $.parseJSON($("#json").val());
        //var csv = JSON2CSV(json);
        
        //var listo  = $("#listo").val();
        var json1  = $("#json1").val();
          //console.log(listo);
        window.open("data:text/csv;charset=utf-8," + escape(json1))

      },
      'click #convert2' : function (e, t) {
        //alert('convert2');
        var csv2 = $("#json1").val();
        //alert(csv2)

        if (csv2 == "") {
          return alert('empty field');
        } else {
            var json2 = CSV2JSON(csv2);
            $("#json2").val(json2);
        }

      },
      'click #download2' : function (e, t) {
        //alert('download2');
        var csv2 = $("#json1").val();
        //alert(csv2)

        if (csv2 == "") {
          return alert('empty field');
        } else {
          var json2 = CSV2JSON(csv2);
          window.open("data:text/json;charset=utf-8," + escape(json2))  
        }
      }
  });

  function JSON2CSV(objArray) {
      var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      var str = '';
      var line = '';

      if ($("#labels").is(':checked')) {
          var head = array[0];
          if ($("#quote").is(':checked')) {
              for (var index in array[0]) {
                  var value = index + "";
                  line += '"' + value.replace(/"/g, '""') + '",';
              }
          } else {
              for (var index in array[0]) {
                  line += index + ',';
              }
          }

          line = line.slice(0, -1);
          str += line + '\r\n';
      }

      for (var i = 0; i < array.length; i++) {
          var line = '';

          if ($("#quote").is(':checked')) {
              for (var index in array[i]) {
                  var value = array[i][index] + "";
                  line += '"' + value.replace(/"/g, '""') + '",';
              }
          } else {
              for (var index in array[i]) {
                  line += array[i][index] + ',';
              }
          }

          line = line.slice(0, -1);
          str += line + '\r\n';
      }
      return str;
  }



}

// Meteor Server side
if (Meteor.isServer) {
 
  Meteor.publish("orderAll", function(){
    return Order.find();
  });

  Meteor.publish("order", function(dateFilter){
    return Order.find({Date: dateFilter});
  });

  Meteor.publish("orderWithoutDate", function(){
    return Order.find({Date: { $exists: false }});
  });

  Meteor.publish("orderWithoutJob", function(){
    return Order.find({AssignSpreader: "none"});
  });

}

// kill -9 `ps ax | grep node | grep meteor | awk '{print $1}'`
// export MONGO_URL=mongodb://localhost:27017/spread

// meteor add accounts-base
// meteor add accounts-password
// meteor add accounts-ui
// meteor add jquery
// meteor mrt:jquery-ui 
// meteor add glasser:jqueryui

// meteor add mrt:bootstrap-3  // meteor add bootstrap
//meteor add mrt:jquery-ui-bootstrap 
//meteor add mrt:accounts-ui-bootstrap-3

// meteor add mrt:moment

// meteor add aldeed:collection2 (sudo)
// meteor add aldeed:simple-schema
// meteor add aldeed:autoform

// meteor remove autopublish

// meteor add meteorhacks:fast-render

// meteor add aslagle:reactive-table
// meteor add pahans:reactive-modal

// meteor add mrt:jquery-csv 