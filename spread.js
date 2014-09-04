if (Meteor.isClient) {

  Meteor.startup(function () {
    //Session.set("ses_namefilter", "");
    //Session.set("ses_datefilter", "");

    var t = Date();

    var todayAt02 = new Date();
    todayAt02.setHours(2,0,0,0);

    //console.log("todayAt02: " + todayAt02 + " typeof: " + typeof todayAt02);
    //$('#filterOrderDate').val("13/10/2014");

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
          //{ key: '_id', label: 'ID' },
          { key: 'orderDate', label: 'Date',
            fn: function (value) {
              if (value){
                return moment(value).format("YYYY-MM-DD");
              } else {
                return "";
              }
              //return moment(value).format("DD-MM-YYYY");
            }, sort: 'descending'
           },
          { key: 'orderName', label: 'Order' },
          //{ key: 'orderCreated', label: 'Order Created' },
          { key: 'orderFileName', label: 'File' },
          { key: 'orderModel', label: 'Model' },
          { key: 'orderFabric', label: 'Fabric' },
          { key: 'orderBagno', label: 'Bagno' },
          { key: 'orderLayers', label: 'Layers' },
          { key: 'orderLength', label: 'Length' },
          { key: 'orderExtra', label: 'Extra' },
          { key: 'orderLengthSum', label: 'Sum' },
          { key: 'orderAssignSpreader', label: 'Assign',
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
          { key: 'orderPriority', label: 'Priority' },
          { key: 'orderLoaded', label: 'Loaded',
            fn: function (value){ 
              if (value == true) {
                return "Loaded";
              };
          } },
          { key: 'orderSpreaded', label: 'Spreaded', 
            fn: function (value){
              if (value == true) {
                return "Spreaded";
              };
          } },
          ],

          useFontAwesome: true,
          //group: 'orderExtra'
          //rowClass: "warning", //warning, danger
          rowClass: function(item) {
            var priority = item.orderPriority;
            var loaded = item.orderLoaded;
            var spreaded = item.orderSpreaded;
            
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
  var rm_ImportOrderAnalyitics = {
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
      console.log('import orders from Analytics - click')

      // Define rd_addneworder
      var rd_importOrderAnalytics = ReactiveModal.initDialog(rm_ImportOrderAnalyitics);
      // Show rd_addneworder
      rd_importOrderAnalytics.show();
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
            /*
            $('#table').before( 
              '<tr>' +
                '<td id="SEQ'         + [i] +'">' + all[i]['SEQ'] + '</td>' +
                '<td id="FILE'        + [i] +'">' + all[i]['FILE'] + '</td>' +
                '<td id="CUT FILE'    + [i] +'">' + all[i]['CUT FILE'] + '</td>' +
                '<td id="MODEL'       + [i] +'">' + all[i]['MODEL'] + '</td>' +
                '<td id="SPREAD TYPE' + [i] +'">' + all[i]['SPREAD TYPE'] + '</td>' +
                '<td id="BAGNO'       + [i] +'">' + all[i]['BAGNO'] + '</td>' +
                '<td id="PLY'         + [i] +'">' + all[i]['PLY'] + '</td>' +
                '</tr>'
            );
            */

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
    return Order.find({orderDate: dateFilter});
  });

  Meteor.publish("orderWithoutDate", function(){
    return Order.find({orderDate: { $exists: false }});
  });

  Meteor.publish("orderWithoutJob", function(){
    return Order.find({orderAssignSpreader: "no"});
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