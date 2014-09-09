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


    // User auth
    var loggedUserId = Session.get("loggedUserId");
    console.log("ses_loggedUserId: " + loggedUserId);
    var userId = Meteor.userId();
    console.log("userId: " + userId);

    if (userId || loggedUserId) {
        var User = Meteor.users.findOne({_id: userId});

        Session.set("loggedUserId", User._id);
        Session.set("loggedUserName", User.username);
        console.log("UserId: " + User._id);
        console.log("UserName: " + User.username);
    }

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

    /*
    var UserIdA = Meteor.userId();

    if (UserIdA) {
      var UserA = Meteor.users.findOne({_id: UserIdA});
      console.log("UserId_A: " + UserA._id);
      console.log("UserName_A: " + UserA.username);
    }
    */
    /*
      var userId = Meteor.userId();
      if (userId) {
        var User = Meteor.users.findOne({_id: userId});
        if (User._id == "hzsGmdDpJXrDFiujZ") {
          console.log('admin je ulogovan');
        } else {
          console.log('NIJE admin je ulogovan');
        }
      }
    */
    /*
    if (Session.get("userId") === adminId) {
      console.log("Wellcome admin");
      Session.set("logged", "admin");
    }     
    */     

  });
    
  Template.nav.helpers ({
    isAdmin: function() {
      //var loggedUserName = Session.get("loggedUserName");
      //console.log(loggedUserName);

      var userId = Meteor.userId();
      if (userId) {
        var User = Meteor.users.findOne({_id: userId});
        if (User.username == "admin") {
          return true;
        } else {
          return false;  
        }
      }
    },
  });
    
  // Reactive-table
  Template.reactiveTebleList.orders = function () {
      return Order.find();
  }

  Template.reactiveTebleList.helpers({
    settings: function () {
      return {
          rowsPerPage: 30,
          showFilter: true,
          showNavigation: 'auto',
          fields: [
            //{ key: '_id', label: '_ID' },
            { key: 'No', label: 'No', sort: 'ascending' },
            { key: 'Date', label: 'Date',
              fn: function (value) {
                if (value){
                  return moment(value).format("YYYY-MM-DD");
                } else {
                  return "";
                }
                //return moment(value).format("DD-MM-YYYY");
              }//, sort: 'descending' // ascending
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
              /*fn: function (value){ 
                if (value == true) {
                  return "Loaded";
                };
              }*/
            },
            { key: 'Spreaded', label: 'Spreaded', 
              /*fn: function (value){
                if (value == true) {
                  return "Spreaded";
                };
              }*/
            },
            { key: 'Comment', label: 'Comment' },
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
        var length = Number(order_all[i].Length);
        //console.log(length);
        var extra = Number(order_all[i].Extra);
        //console.log(extra);
        var layers = Number(order_all[i].Layers);
        //console.log(layers);

        var sum = Number((length + extra) * layers);
        //console.log(sum);
        var sumf =sum.toFixed(3);
        //console.log(sumf);

        if (sumf == "NaN") {
          sumf = 0;
        }

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
      alert("LengthSum fields are refreshed! \n ______________________________ \n If LengthSum is 0, that's because some fields \n(Length, Extra or Layers) are missing!  ");
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
      rm_EditOrder.hide();
    }
  });

  Template.tmp_ImportOrderAnalytics.events({
    /*'change #files_analytics': function (e) {
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
      rm_ImportOrderAnalyitics.hide();
    }*/
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
            var komesa = all[i]['Komesa'];
            var marker = all[i]['Marker Name'];
            var style = all[i]['Style'];
            var fabric = all[i]['Fabric'];
            var colorcode = all[i]['Color Code'];
            var colordesc = all[i]['Color Description'];
            var bagno = all[i]['Bagno'];
            var layers = Number(all[i]['Layers']);
            var lengthS = all[i]['Marker Length [mt]'];
            var length = lengthS.replace(",", ".");
            var extra = Number(all[i]['Length All. [cm]']);
            var lengthsumX = Number((length + extra) * layers);
            var lengthsum = lengthsumX.toFixed(3);
            var width = Number(all[i]['Marker Width [cm]']);
            var s = Number(all[i]['tot S']);
            var m = Number(all[i]['tot M']);
            var l = Number(all[i]['tot L']);

            //One by One
            //Order.insert({SEQ: seq, FILE: all[i]['FILE'], CUT_FILE: all[i]['CUT FILE'], MODEL: all[i]['MODEL'], SPREAD_TYPE: all[i]['SPREAD TYPE'], BAGNO: all[i]['BAGNO'], PLY: ply});    
            //Order.insert({orderName: all[i]['FILE'], orderFileName: all[i]['CUT FILE'], orderModel: all[i]['MODEL'], orderFabric: all[i]['SPREAD TYPE'], orderBagno: all[i]['BAGNO'], orderLayers: ply});
            Order.insert({No: no, Komesa: komesa, Marker: marker, Style: style, Fabric: fabric, ColorCode: colorcode , ColorDesc: colordesc, Bagno: bagno, Layers: layers, Length: length, Extra: extra, LengthSum: lengthsum, Width: width, S: s, M: m, L: l });    
          }
      }
      reader.readAsText(file_a);
      rm_ImportPlannedMarkers.hide();
    }
  });

  Template.tmp_ImportOrder.events({
    'change #files': function (e) {
      //alert("Ne radi jos")
      //var files = e.target.files || e.dataTransfer.files;

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

          console.log("all: "+all);

          for (var i = 0; i < all.length; i++) {
            console.log(all[i]);

            var id = all[i]['_id'];
            var no  = Number(all[i]['No']);
            var komesa = all[i]['Komesa'];
            var marker = all[i]['Marker'];
            var style = all[i]['Style'];
            var fabric = all[i]['Fabric'];
            var colorcode = all[i]['ColorCode'];
            var colordesc = all[i]['ColorDesc'];
            var bagno = all[i]['Bagno'];
            var layers = Number(all[i]['Layers']);
            var length = all[i]['Length'];
            //var length = lengthS.replace(",", ".");
            var extra = Number(all[i]['Extra']);
            //var lengthsumX = Number((length + extra) * layers);
            //var lengthsum = lengthsumX.toFixed(3);
            var lengthsum = Number(all[i]['LengthSum']);
            var width = Number(all[i]['Width']);
            var s = Number(all[i]['S']);
            var m = Number(all[i]['M']);
            var l = Number(all[i]['L']);
            var assignespreader = all[i]['AssignSpreader'];
            var priority = all[i]['Priority'];
            var loaded = all[i]['Loaded'];
            var spreaded = all[i]['Spreaded'];
            var comment = all[i]['Comment'];

            var priority = Number(all[i]['Priority']);

            var orderDate = all[i]['Date'];
            var orderDate2 = new Date(orderDate);
            //var orderDateP = Date.parse(orderDate);
            //var orderDateM = moment(all[i]['Date']).format("DD-MM-YYYY");
            //var orderDateM2 = new Date(orderDateM);

            
            //console.log('direct: ' + all[i]['Date'] + " : " + all[i]['Date'].typeof);
            //console.log('orderDate: ' + orderDate + " : " + orderDate.typeof);
            //console.log('orderDate2: ' + orderDate2 + " : " + orderDate2.typeof);
            //console.log('orderDateP: ' + orderDateP + " : " + orderDateP.typeof);
            //console.log('orderDateM: ' + orderDateM + " : " + orderDateM.typeof);
            //console.log('orderDateM2: ' + orderDateM2 + " : " + orderDateM2.typeof);

            var orderCreated = all[i]['Created'];
            var orderCreated2 = new Date(orderCreated);
            //console.log('orderCreated: ' + orderCreated + " : " + orderCreated.typeof);
            //console.log('orderCreated2: ' + orderCreated2 + " : " + orderCreated2.typeof);

            //One by One
            //Order.insert({No: no, Date: orderDate, Created: orderCreated, Komesa: all[i]['Komesa'], Marker: all[i]['Marker'], Style: all[i]['Style'], Fabric: all[i]['Fabric'], ColorCode: all[i]['ColorCode'], ColorDesc: all[i]['ColorDesc'], Bagno: all[i]['Bagno'], Layers: layers, Length: length, Extra: extra, LengthSum: lengthsum, Width: width, S: s, M: m, L: l ,AssignSpreader: all[i]['AssignSpreader'], Priority: priority});    
            Order.insert({No: no, Date: orderDate2, Komesa: komesa, Marker: marker, Style: style, Fabric: fabric, ColorCode: colorcode , ColorDesc: colordesc, Bagno: bagno, Layers: layers, Length: length, Extra: extra, LengthSum: lengthsum, Width: width, S: s, M: m, L: l, AssignSpreader: assignespreader, Loaded: loaded, Spreaded: spreaded, Comment: comment }); 
            // Can not insert order created and _id , this values is automaticali created
            //Created: orderCreated2  
            //_id: id
            
          } 
      }
      reader.readAsText(file_a);
      rm_ImportOrder.hide();
    }
  });

  Template.tmp_ExportOrder.order = function() {
      return Order.find();
  }

  Template.tmp_ExportOrder.events({
      'click #download_from_textarea' : function (e, t) {
        //var json = $.parseJSON($("#json").val());
        //var csv = JSON2CSV(json);
        
        //var listo  = $("#listo").val();
        var textarea_json  = $("#textarea_json").val();
          //console.log(listo);
        window.open("data:text/csv;charset=utf-8," + escape(textarea_json))
        rm_ExportOrder.hide();

      },
      'click #convert1' : function (e, t) {
        /*
          var json = $.parseJSON($("#json").val());
          var csv = JSON2CSV(json);
          $("#csv").val(csv);

          var listo  = $("#listo").val();
          console.log(listo);
        */
      },
      'click #convert2' : function (e, t) {
        /*
          alert('convert2');
          var csv2 = $("#json1").val();
          if (csv2 == "") {
            return alert('empty field');
          } else {
            var json2 = CSV2JSON(csv2);
            $("#json2").val(json2);
          }
        */
      },
      'click #download2' : function (e, t) {
        /*
          alert('download2');
          var csv2 = $("#json1").val();
          alert(csv2)
          if (csv2 == "") {
            return alert('empty field');
          } else {
            var json2 = CSV2JSON(csv2);
            window.open("data:text/json;charset=utf-8," + escape(json2))  
          }
        */
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

var adminId = "nBp5wtNy2nnbYJJKL"; //123123
var sp11 = "";  // 111111
var sp12 = "";  // 121212
var sp21 = "";  // 212121
var sp22 = "";  // 222222

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