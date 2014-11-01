if (Meteor.isClient) {
  //SimpleSchema.debug = true;
  //UI.registerHelper("Schemas", Schemas);

  
  Meteor.startup(function () {
   

    //Session.set("ses_namefilter", "");
    //Session.set("ses_datefilter", "");

    //var t = Date();

    var todayAt02 = new Date();
    todayAt02.setHours(2,0,0,0);
    //console.log("todayAt02" + todayAt02);

    var treeDaysbefore = new Date();
    treeDaysbefore.setHours(-70,0,0,0);
    //console.log("treeDaysbefore: " + treeDaysbefore);

    var treeDaysafter = new Date();
    //treeDaysafter.setHours(74,0,0,0); // three days + 2h timezone 
    treeDaysafter.setHours(75,0,0,0);   // three days + 2h timezone + 1h
    //console.log("treeDaysafter: " + treeDaysafter);

    Session.set("ses_datefilter", todayAt02);
    Session.set("ses_DaysBefore", treeDaysbefore);
    Session.set("ses_DaysAfter", treeDaysafter);
    Session.set("ses_datenotexist", false);
    Session.set("ses_jobnotexist", false);
    Session.set("ses_statusfilter", false);

    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    });

    $('#filterOrderDate').val(new Date().toDateInputValue());
    
    var filterOrderDateBefore = new Date(treeDaysbefore).toDateInputValue();
    //filterOrderDateBefore = filterOrderDateBefore.setHours(-70,0,0,0);
    //console.log(filterOrderDateBefore);
    $('#filterOrderDateBefore').val(filterOrderDateBefore);

    var filterOrderDateAfter = new Date(treeDaysafter).toDateInputValue();
    //filterOrderDateAfter = filterOrderDateAfter.setHours(75,0,0,0);
    //console.log(filterOrderDateAfter);
    $('#filterOrderDateAfter').val(filterOrderDateAfter);

    // User auth
    var loggedUserId = Session.get("loggedUserId");
    //console.log("ses_loggedUserId: " + loggedUserId);
    var userId = Meteor.userId();
    //console.log("userId: " + userId);

    if (userId || loggedUserId) {
        var User = Meteor.users.findOne({_id: userId});

        Session.set("loggedUserId", User._id);
        Session.set("loggedUserName", User.username);
        console.log("Startup: UserId: " + User._id);
        console.log("Startup: UserName: " + User.username);
    }
  })

  Meteor.autosubscribe(function () {

    var user = Meteor.user();
    //console.log("user: " + user);
    //console.log("_id: " + user._id );
    //console.log("username: " + user.username );

    if (user) {
      var UserId = Meteor.userId();
      var UserA = Meteor.users.findOne({_id: UserId});
      console.log("Autosubscribe = UserA_Id: " + UserA._id);
      console.log("Autosubscribe = UserName: " + UserA.username);

      Session.set("ses_loggedUserId", UserA._id);
      Session.set("ses_loggedUserName", UserA.username);
    }

    var ses_loggedUserName = Session.get("ses_loggedUserName");
    var ses_datefilter = Session.get("ses_datefilter");
    var ses_DaysBefore = Session.get("ses_DaysBefore");
    var ses_DaysAfter = Session.get("ses_DaysAfter");
    var ses_existdate = Session.get("ses_datenotexist");
    var ses_jobnotexist = Session.get("ses_jobnotexist");
    var ses_statusfilter = Session.get("ses_statusfilter");

    //console.log("Autosubcribe sesion: " + ses + " , typeof: " + typeof ses);
    if ((ses_loggedUserName == "cut1") || (ses_loggedUserName == "cut2")){
      Meteor.subscribe('filter_cutter');
    } else if ((ses_loggedUserName == "sp11") || (ses_loggedUserName == "sp12")){
      //Meteor.subscribe('spreader1', Session.get("ses_datefilter"));
      Meteor.subscribe('filter_spreader1');
    } else if ((ses_loggedUserName == "sp21") || (ses_loggedUserName == "sp22")){
      //Meteor.subscribe('spreader2', Session.get("ses_datefilter"));
      Meteor.subscribe('filter_spreader2');

    } else if ( ses_existdate == true ) {
      Meteor.subscribe('filter_orderWithoutDate');
    } else if ( ses_jobnotexist == true ) {
      Meteor.subscribe('filter_orderWithoutJob');

    } else if ( ses_statusfilter) { 
      Meteor.subscribe('filter_statusfilter', ses_statusfilter/*, ses_DaysBefore, ses_DaysAfter*/);

    } else if ( ses_datefilter == "" ) { 
      Meteor.subscribe('filter_orderAll');
    } else if ( (ses_DaysBefore) || (ses_DaysAfter) ) {
      Meteor.subscribe('filter_orderWithDateRange', ses_DaysBefore, ses_DaysAfter);
    } else {
      Meteor.subscribe('filter_orderWithDate', ses_datefilter);
    }

      Meteor.call('method_countPosSp1', function(err, data1) {
        Session.set("ses_countPosSp1", data1);
        //console.log("ses_countPosSp1: " + data1);
      });
      Meteor.call('method_countPosSp2', function(err, data2) {
        Session.set("ses_countPosSp2", data2);
        //console.log("ses_countPosSp2: " + data2);
      });
    
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
    User: function(){
      var userId = Meteor.userId();
      if (userId) {
        var User = Meteor.users.findOne({_id: userId});
        return User;
      }
    }, 
  });
    
  // Reactive-table
  Template.reactiveTebleList.orders = function () {
      return Order.find();
  }

  Template.reactiveTebleList.helpers({
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
    isUserSp: function() {
        //var loggedUserName = Session.get("loggedUserName");
        //console.log(loggedUserName);

        var userId = Meteor.userId();
        if (userId) {
            var User = Meteor.users.findOne({_id: userId});
          if ((User.username == "sp11") || (User.username == "sp12") || (User.username == "sp21") || (User.username == "sp22")) {
            return true;
          } else {
            return false;  
          }
        }
    },
    isUserCut: function() {
        //var loggedUserName = Session.get("loggedUserName");
        //console.log(loggedUserName);

        var userId = Meteor.userId();
        if (userId) {
            var User = Meteor.users.findOne({_id: userId});
          if ((User.username == "cut1") || (User.username == "cut2")) {
            return true;
          } else {
            return false;  
          }
        }
    },
    settingsAdmin: function () {
      return {
        rowsPerPage: 100,
        showFilter: true,
        showNavigation: 'auto',
        fields: [
          //{ key: '_id', label: '_ID' },
          { key: 'No', label: 'No', /*sort: 'descending' */},
          { key: 'Position', label: 'Pos' , sort: 'ascending'},
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
          { key: 'ColorCode', label: 'Color Code' },
          { key: 'ColorDesc', label: 'Color Desc' },
          { key: 'Bagno', label: 'Bagno' },
          { key: 'Layers', label: 'Layers' },
          { key: 'LayersActual', label: 'Layers Actual',
            fn: function (value){
              if (value == 0) {
                return "";
              } else {
                return value ;
              };
            }
          },
          { key: 'Length', label: 'Length (m)' },
          { key: 'Extra', label: 'Extra (cm)' },
          { key: 'LengthSum', label: 'LengthSum (m)' },
          { key: 'Width', label: 'Width (cm)' },
          { key: 'SonLayer', label: 'S on Layer'},
          { key: 'S', label: 'Order S ' },
          { key: 'CutS', label: 'Cut S'},
          { key: 'MonLayer', label: 'M on Layer'},
          { key: 'M', label: 'Order M' },
          { key: 'CutM', label: 'Cut M'},
          { key: 'LonLayer', label: 'L on layer'},
          { key: 'L', label: 'Order L' },
          { key: 'CutL', label: 'Cut L'},
          { key: 'Status', label: 'Status',
            fn: function (value) {
              if (value == "SP 1") {
                return "SP 1";
              }
              else if (value == "SP 2") {
                return "SP 2";
              }
              else if (value == "CUT") {
                return "CUT";
              }
              else if (value == "Finished") {
                return "Finished";
              }
              else if (value == "Not assigned") {
                return "Not assigned";
              }
              else {
                return "Not Defined";
              }
            }
          },
          { key: 'Priority', label: 'Priority' },
          { key: 'Load', label: 'Load',
            /*fn: function (value){ 
              if (value == true) {
                return "Load";
              };
            }*/
          },
          { key: 'Spread', label: 'Spread', 
            /*fn: function (value){
              if (value == true) {
                return "Spread";
              };
            }*/
          },
          { key: 'SpreadDate', label: 'SpreadDate',
             fn: function (value) {
              if (value){
                return moment(value).format("YYYY-MM-DD HH:mm:ss");
              } else {
                return "";
              }
            }
          },
          { key: 'Cut', label: 'Cut' },
          { key: 'CutDate', label: 'CutDate',
             fn: function (value) {
              if (value){
                return moment(value).format("YYYY-MM-DD HH:mm:ss");
              } else {
                return "";
              }
            }
          },
          { key: 'Comment', label: 'Comment' },
        ],

          //useFontAwesome: true,
          //group: 'orderExtra'
          //rowClass: "warning", //warning, danger
          /*rowClass: function(item) {
            var priority = item.Priority;
            var load = item.Load;
            var spread = item.Spread;
            var cut = item.Cut;
            
            // treba da se doradi

            if (cut)  {
              return 'success';
            } else if (spread) {
              return 'info';
            } else if (load) {
              return 'active';
            } else if (priority == 4) {
              return 'warning';
            } else if (priority == 5){
              return 'danger'; //active, success, info, warning, danger
            } else {

            }
          },*/
          rowClass: function(item) {
            var priority = item.Priority;
            var load = item.Load;
            var spread = item.Spread;
            var status = item.Status;
            
            // treba da se doradi

            if (status == "Finished")  {
              return 'success'; // green
            } else if (status == 'CUT') {
              return 'info';    // dark blue
            } else if (load) {
              return 'load';    // greey
            } else if ((status == "SP 1") || (status == "SP 2")) {
              return 'active';  // light blue
            } else if (priority == 4) {
              return 'warning'; // orange
            } else if (priority == 5) {
              return 'danger';  // red
              //active, success, info, warning, danger
            } else {

            }
          },
      };
    },
    settingsUserSp: function () {
      return {
          rowsPerPage: 100,
          showFilter: false,
          showNavigation: 'auto',
          fields: [
            //{ key: '_id', label: '_ID' },
            /*{ key: 'No', label: 'No', sort: 'descending' },*/
            { key: 'Position', label: 'Pos' , sort: 'ascending'},
            /*{ key: 'Date', label: 'Date',
              fn: function (value) {
                if (value){
                  return moment(value).format("DD-MMM");
                } else {
                  return "";
                }
                //return moment(value).format("DD-MM-YYYY");
              }//, sort: 'descending' // ascending
            },*/
            //{ key: 'Created', label: 'Created' },
            { key: 'Komesa', label: 'Komesa' },
            { key: 'Marker', label: 'Marker' },
            /*{ key: 'Style', label: 'Style' },*/
            { key: 'Fabric', label: 'Fabric' },
            { key: 'ColorCode', label: 'Color Code' },
            { key: 'ColorDesc', label: 'Color Desc' },
            { key: 'Bagno', label: 'Bagno' },
            { key: 'Layers', label: 'Layers' },
            { key: 'LayersActual', label: 'Layers Actual',
              fn: function (value){
                if (value == 0) {
                  return "";
                } else {
                  return value ;
                };
              }
            },
            { key: 'Length', label: 'Length (m)' },
            //{ key: 'Extra', label: 'Extra (cm)' },
            { key: 'LengthSum', label: 'LengthSum (m)' },
            { key: 'Width', label: 'Width (cm)' },
            //{ key: 'S', label: 'S' },
            //{ key: 'M', label: 'M' },
            //{ key: 'L', label: 'L' },
            //{ key: 'Status', label: 'Status'},
            { key: 'Priority', label: 'Priority' },
            { key: 'Load', label: 'Load'},
            //{ key: 'Spread', label: 'Spread'},
            //{ key: 'Cut', label: 'Cut' },
            { key: 'Comment', label: 'Comment' },
          ],

            //useFontAwesome: true,
            //group: 'Komesa', 
            //rowClass: "warning", //warning, danger
            rowClass: function(item) {
            var priority = item.Priority;
            var load = item.Load;
            var spread = item.Spread;
            var status = item.Status;
            
            // treba da se doradi

            if (status == "Finished")  {
              return 'success'; // green
            } else if (status == 'CUT') {
              return 'info';    // dark blue
            } else if (load) {
              return 'load';    // greey
            } else if ((status == "SP 1") || (status == "SP 2")) {
              return 'active';  // light blue
            } else if (priority == 4) {
              return 'warning'; // orange
            } else if (priority == 5) {
              return 'danger';  // red
              //active, success, info, warning, danger
            } else {

            }
          },
      };
    },
    settingsUserCut: function () {
      return {
          rowsPerPage: 100,
          showFilter: false,
          showNavigation: 'auto',
          fields: [
            //{ key: '_id', label: '_ID' },
            /*{ key: 'No', label: 'No', sort: 'descending' },*/
            { key: 'Position', label: 'Pos'},
            /*{ key: 'Date', label: 'Date',
              fn: function (value) {
                if (value){
                  return moment(value).format("DD-MMM");
                } else {
                  return "";
                }
                //return moment(value).format("DD-MM-YYYY");
              }//, sort: 'descending' // ascending
            },*/
            
            //{ key: 'Created', label: 'Created' },
            { key: 'Komesa', label: 'Komesa' },
            { key: 'Marker', label: 'Marker' },
            { key: 'Style', label: 'Style' },
            { key: 'Fabric', label: 'Fabric' },
            { key: 'ColorCode', label: 'Color Code' },
            { key: 'ColorDesc', label: 'Color Desc' },
            { key: 'Bagno', label: 'Bagno' },
            { key: 'Layers', label: 'Layers' },
            { key: 'LayersActual', label: 'Layers Actual',
              fn: function (value){
                if (value == 0) {
                  return "";
                } else {
                  return value ;
                };
              }
            },
            { key: 'Length', label: 'Length(m)' },
            //{ key: 'Extra', label: 'Extra (cm)' },
            { key: 'LengthSum', label: 'Length Sum (m)' },
            { key: 'Width', label: 'Width (cm)' },
            //{ key: 'S', label: 'S' },
            //{ key: 'M', label: 'M' },
            //{ key: 'L', label: 'L' },
            //{ key: 'Status', label: 'Status'},
            { key: 'Priority', label: 'Priority', sort: 'descending' },
            /*{ key: 'Load', label: 'Load'},*/
            /*{ key: 'Spread', label: 'Spread'},*/
            { key: 'SpreadDate', label: 'Spread Date',
             fn: function (value) {
              if (value){
                return moment(value).format("YYYY-MM-DD HH:mm:ss");
              } else {
                return "";
              }
            }
          },
            //{ key: 'Cut', label: 'Cut' },
            { key: 'Comment', label: 'Comment' },
          ],

            //useFontAwesome: true,
            //group: 'Komesa', 
            //rowClass: "warning", //warning, danger
            rowClass: function(item) {
            var priority = item.Priority;
            var load = item.Load;
            var spread = item.Spread;
            var status = item.Status;
            
            // treba da se doradi

            if (status == "Finished")  {
              return 'success'; // green
            
            } else if (priority == 4) {
              return 'warning'; // orange
            } else if (priority == 5) {
              return 'danger';  // red
              //active, success, info, warning, danger

            } else if (status == 'CUT') {
              return 'info';    // dark blue
            } else if (load) {
              return 'load';    // greey
            } else if ((status == "SP 1") || (status == "SP 2")) {
              return 'active';  // light blue
            } else {

            }
          },
      };
    },
  });

  // Reactive Table events
  Template.reactiveTebleList.events({
      'click .reactive-table tbody tr': function (event) {
        // set the blog post we'll display details and news for
        var click_id = this._id;
        //console.log('selectedDocId: ', click_id);
        Session.set('selectedDocId', click_id);

        //console.log("ses: " + ses);

        var click_id_pos = this.Position;
        //console.log("click_id_pos: " + click_id_pos );
        var click_id_status = this.Status;
        //console.log("click_id_status: " + click_id_status );

        if (click_id_status == 'SP 1'){
          Meteor.call('method_arrayofPosSp1', function(err,data) {
          Session.set('ses_arrayofPosSp', data);
          console.log("ses_arrayofPosSp: " + data);
          });
        } else if (click_id_status == 'SP 2'){
          Meteor.call('method_arrayofPosSp2', function(err,data) {
          Session.set('ses_arrayofPosSp', data);
          console.log("ses_arrayofPosSp: " + data);
          });
        } else {
          Session.set('ses_arrayofPosSp', '');
          console.log("ses_arrayofPosSp is Empty ");
        }

        Meteor.call('method_arrayofStatus', function(err,data) {
          Session.set('ses_arrayofStatus', data);
          console.log('ses_arrayofStatus: ' + data);
        });

        // Define rd_editorder
        var rd_editorder = ReactiveModal.initDialog(rm_EditOrder);

        // show rd_editorder
        rd_editorder.show();
      }
  });

  //Template.alert.preserve(["tmp_EditOrder"]);

  // Edit Order on click (in table) - Reactive Modal
    var rm_EditOrder = {
    type: 'type-default',   //type-default, type-info, type-primary, 'type-success', 'type-warning' , 'type-danger' 
      //size: '',
      template: Template.tmp_EditOrder, 
      title: "Edit Order",
      //modalBody: "Helll0",
      //modalDialogClass: "modal-dialog", //optional
      //modalBodyClass: "modal-body", //optional
      //modalFooterClass: "modal-footer",//optional
      removeOnHide: true,
      closable: true,
      buttons: {
          "cancel": {
            class: 'btn-danger',
            label: 'Cancel'
          },
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
      },
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
      isUserSp: function() {
        //var loggedUserName = Session.get("loggedUserName");
        //console.log(loggedUserName);

        var userId = Meteor.userId();
        if (userId) {
            var User = Meteor.users.findOne({_id: userId});
          if ((User.username == "sp11") || (User.username == "sp12") || (User.username == "sp21") || (User.username == "sp22")) {
            return true;
          } else {
            return false;  
          }
        }
      },
      isUserCut: function() {
        //var loggedUserName = Session.get("loggedUserName");
        //console.log(loggedUserName);

        var userId = Meteor.userId();
        if (userId) {
            var User = Meteor.users.findOne({_id: userId});
          if ((User.username == "cut1") || (User.username == "cut2")) {
            return true;
          } else {
            return false;  
          }
        }
      },
      User: function() {
        var userId = Meteor.userId();
        if (userId) {
            var User = Meteor.users.findOne({_id: userId});
          if (User.username) {
            return User.username;
          }
        }
      },
      OrderInfo: function () {
        var ses = Session.get("selectedDocId")
        //console.log("ses: " + ses);

        var order = Order.find({_id: ses}).fetch();
        for (var i = 0; i < order.length; i++) {
          var No = order[i].No;
          var Komesa = order[i].Komesa;
          
        }
        var OrderInfo = "No: " + No + " ,Komesa: " + Komesa ;
        return OrderInfo;

      },
      FabricInfo: function () {
        var ses = Session.get("selectedDocId")
        //console.log("ses: " + ses);

        var order = Order.find({_id: ses}).fetch();
        for (var i = 0; i < order.length; i++) {
          var Fabric = order[i].Fabric;
          var Bagno = order[i].Bagno;
          //var ColorCode = order[i].ColorCode;
          var ColorDesc = order[i].ColorDesc;

        }

        var FabricInfo = "Fabric: " + Fabric + " ,Bagno: " + Bagno + " ,Color Desc: " + ColorDesc;
        return FabricInfo;

      },
      isLoaded: function () {
        var ses = Session.get("selectedDocId")

        var order = Order.find({_id: ses}).fetch();
        for (var i = 0; i < order.length; i++) {
          var Loaded = order[i].Load;
          
        }

        //console.log("Loaded: " + Loaded);
        if (Loaded) {
          return false;
        } else {
          return true;
        }
      },
      position: function  (){
        var  arrayofPosSp2 = Session.get('ses_arrayofPosSp');
        //console.log("test: " + test);
        //var ret = [1,2];
        //console.log("ret: " + ret);
    
        return arrayofPosSp2;
      },
      status: function (){
        var  arrayofStasus = Session.get('ses_arrayofStatus');
        return arrayofStasus;
      },
      /*isSpreaded: function () {
        var ses = Session.get("selectedDocId")

        var order = Order.find({_id: ses}).fetch();
        for (var i = 0; i < order.length; i++) {
          var Spreaded = order[i].Spread;
          
        }

        console.log("Spreaded: " + Spreaded);
        if (Spreaded) {
          return false;
        } else {
          return true;
        }
      },*/
      /*Comment: function() {
        var editingDoc = Session.get("selectedDocId");
        if (editingDoc) {
            var editingDocAll = Order.find({_id: editingDoc}).fetch();
            
            for (var i = 0; i < editingDocAll.length; i++) {
              var commentEditing = editingDocAll[0].Comment;
              //console.log(commentEditing);
            }
            //console.log("in Comment: " + editingDocAll.Comment);
            return commentEditing;
        }
      }*/
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
      removeOnHide: true,
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
      closable: true,
      removeOnHide: true,
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
      removeOnHide: true,
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

    
/*
  // Import Order from MD Analytics on click (in nav button) - Reactive Modal
  var rm_ImportOrderAnalyitics = {
      /*template: Template.tmp_ImportOrderAnalytics, 
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
*/

  // Import Order from Planned Markers file (in nav button) - Reactive Modal
  var rm_ImportPlannedMarkers = {
      template: Template.tmp_ImportPlannedMarkers, 
      title: "Import from Planned Markers CSV file",
      //modalDialogClass: "modal-dialog", //optional
      //modalBodyClass: "modal-body", //optional
      //modalFooterClass: "modal-footer",//optional
      closable: false,
      removeOnHide: true,
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

  var rm_Statistics = {
     template: Template.tmp_Statistics, 
      title: "Statistic for order table",
      //modalDialogClass: "modal-dialog", //optional
      //modalBodyClass: "modal-body", //optional
      //modalFooterClass: "modal-footer",//optional
      closable: false,
      removeOnHide: true,
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

  Template.tmp_Statistics.helpers({
    noRolls: function (){
      var noRolls = Order.find();
      //console.log("noRolls: "+ noRolls.count());
      return noRolls.count();
    },
    allLayers: function(){
      //var allLayers = Order.distinct("Layers");
      var order = Order.find().fetch();
     
      var sumLayers = 0;
      for (var i = 0; i < order.length; i++) {
        sumLayers += order[i].Layers;
      }

      //console.log(order);
      //console.log("order count: " + order.length);
      //console.log("sum layers: " + sumLayers);
      return sumLayers;
    },
    allLengths: function(){
      var order = Order.find().fetch();

      var sumLengths = 0;
      for (var i = 0; i < order.length; i++) {
        sumLengths += order[i].LengthSum;
      }
      sumLengths = Number(sumLengths);
      sumLengths = sumLengths.toFixed(3);
      return sumLengths;
    },
    allS: function(){
      var order = Order.find().fetch();

      var sumS = 0;
      for (var i = 0; i < order.length; i++) {
        sumS += order[i].S;
      }
      return sumS;
    },
    allM: function(){
      var order = Order.find().fetch();

      var sumM = 0;
      for (var i = 0; i < order.length; i++) {
        sumM += order[i].M;
      }
      return sumM;
    },
    allL: function(){
      var order = Order.find().fetch();

      var sumL = 0;
      for (var i = 0; i < order.length; i++) {
        sumL += order[i].L;
      }
      return sumL;
    },
    SP1noRolls: function (){
      var order = Order.find({Status: "SP 1"});
      return order.count();
    },
    SP2noRolls: function (){
      var order = Order.find({Status: "SP 2"});
      return order.count();
    },
    SP1noLoadRollsShift1: function (){
      var order = Order.find({Load: "SP 1-1"});
      return order.count();
    },
    SP1noLoadRollsShift2: function (){
      var order = Order.find({Load: "SP 1-2"});
      return order.count();
    },
    SP2noLoadRollsShift1: function (){
      var order = Order.find({Load: "SP 2-1"});
      return order.count();
    },
    SP2noLoadRollsShift2: function (){
      var order = Order.find({Load: "SP 2-2"});
      return order.count();
    },
    SP1noSpreadRollsShift1: function (){
      var order = Order.find({Spread: "SP 1-1"});
      return order.count();
    },
    SP1noSpreadRollsShift2: function (){
      var order = Order.find({Spread: "SP 1-2"});
      return order.count();
    },
    SP2noSpreadRollsShift1: function (){
      var order = Order.find({Spread: "SP 2-1"});
      return order.count();
    },
    SP2noSpreadRollsShift2: function (){
      var order = Order.find({Spread: "SP 2-2"});
      return order.count();
    },
    CutnoRollsShift1: function  (){
      var order = Order.find({Cut: "CUT 1"});
      return order.count();
    },
    CutnoRollsShift2: function  (){
      var order = Order.find({Cut: "CUT 2"});
      return order.count();
    },
    SP1LoadMetShift1: function (){
      var order = Order.find({Load: "SP 1-1"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(3);
      return sum;
    },
    SP1LoadMetShift2: function (){
      var order = Order.find({Load: "SP 1-2"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(3);
      return sum;
    },
    SP2LoadMetShift1: function (){
      var order = Order.find({Load: "SP 2-1"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(3);
      return sum;
    },
    SP2LoadMetShift2: function (){
      var order = Order.find({Load: "SP 2-2"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(3);
      return sum;
    },
    SP1SpreadMetShift1: function (){
      var order = Order.find({Spread: "SP 1-1"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(3);
      return sum;
    },
    SP1SpreadMetShift2: function (){
      var order = Order.find({Spread: "SP 1-2"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(3);
      return sum;
    },
    SP2SpreadMetShift1: function (){
      var order = Order.find({Spread: "SP 2-1"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(3);
      return sum;
    },
    SP2SpreadMetShift2: function (){
      var order = Order.find({Spread: "SP 2-2"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(3);
      return sum;
    },
    CutMetShift1: function (){
      var order = Order.find({Cut: "CUT 1"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(3);
      return sum;
    },
    CutMetShift2: function (){
      var order = Order.find({Cut: "CUT 2"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(3);
      return sum;
    },

  });


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
      Session.set("ses_DaysBefore", "");
      Session.set("ses_DaysAfter", "");

      console.log("Delete - ses_datefilter,ses_DaysBefore,ses_DaysAfter");

      $('#filterOrderDate').val("");
      $('#filterOrderDateBefore').val("");
      $('#filterOrderDateAfter').val("");

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

    'change #filterOrderDateBefore': function (e, t) {
      var datesel = $('#filterOrderDateBefore').val();

      var datesel1 = new Date(datesel);
      datesel1.setHours(1,0,0,0);

      Session.set("ses_DaysBefore", datesel1);
      Session.set("ses_datefilter", datesel1); //just to skip all
      datesel1 = "";
      console.log("Set-ses_DaysBefore: " + Session.get("ses_DaysBefore"));
    },

    'change #filterOrderDateAfter': function (e, t) {
      var datesel = $('#filterOrderDateAfter').val();

      var datesel1 = new Date(datesel);
      datesel1.setHours(3,0,0,0);

      Session.set("ses_DaysAfter", datesel1);
      Session.set("ses_datefilter", datesel1); //just to skip all
      datesel1 = "";
      console.log("Set-ses_DaysAfter: " + Session.get("ses_DaysAfter"));
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
        var layersactual = Number(order_all[i].LayersActual);
        //console.log(layers);
        var sonlayer = Number(order_all[i].SonLayer);
        var monlayer = Number(order_all[i].MonLayer);
        var lonlayer = Number(order_all[i].LonLayer);

        if (layersactual) {
          LayersToCount = layersactual;
        } else {
          LayersToCount = layers;
        }

        //LengthSum
        var sum = Number((length + (extra/100)) * LayersToCount);
        //console.log(sum);
        var sumf =sum.toFixed(3);
        //console.log(sumf);

        if (sumf == "NaN") {
          sumf = 0;
        }

        //S M L 
        var Snew = Number(sonlayer * LayersToCount);
        var Mnew = Number(monlayer * LayersToCount);
        var Lnew = Number(lonlayer * LayersToCount);

        Order.update({_id: order_all[i]._id},
          {
            //$set: { orderLength: 5+5 },
            $set: { LengthSum: sumf, S: Snew, M: Mnew, L: Lnew },
          }, 
          {
            multi: true,
          }
        );
      }
      alert("LengthSum fields are refreshed! \n ______________________________ \n If LengthSum is 0, that's because some fields \n(Length, Extra or Layers) are missing!  ");

    },

    'click #statistics' : function (e, t) {
      //console.log('statistics - click')

      // Define rd_addneworder
      var rd_statistics = ReactiveModal.initDialog(rm_Statistics);


      // Show rd_addneworder
      rd_statistics.show();
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

    'change #not_assigned': function  (e, t) {
      Session.set("ses_statusfilter", "Not assigned");
      console.log("ses_statusfilter: " + Session.get("ses_statusfilter"));
      //$('#filterOrderDateBefore').val("");
      //$('#filterOrderDateAfter').val("");
      //ses_DaysBefore = Session.set("ses_DaysBefore", '');
      //ses_DaysAfter = Session.set("ses_DaysAfter", '');

    },
    'change #sp1': function  (e, t) {
      Session.set("ses_statusfilter", "SP 1");
      console.log("ses_statusfilter: " + Session.get("ses_statusfilter"));
      //$('#filterOrderDateBefore').val("");
      //$('#filterOrderDateAfter').val("");
      //ses_DaysBefore = Session.set("ses_DaysBefore", '01/01/2014');
      //ses_DaysAfter = Session.set("ses_DaysAfter", '01/01/2020');
    },
    'change #sp2': function  (e, t) {
      Session.set("ses_statusfilter", "SP 2");
      console.log("ses_statusfilter: " + Session.get("ses_statusfilter"));
      //$('#filterOrderDateBefore').val("");
      //$('#filterOrderDateAfter').val("");
      //ses_DaysBefore = Session.set("ses_DaysBefore", '');
      //ses_DaysAfter = Session.set("ses_DaysAfter", '');
    },
    'change #cut': function  (e, t) {
      Session.set("ses_statusfilter", "CUT");
      console.log("ses_statusfilter: " + Session.get("ses_statusfilter"));
      //$('#filterOrderDateBefore').val("");
      //$('#filterOrderDateAfter').val("");
      //ses_DaysBefore = Session.set("ses_DaysBefore", '');
      //ses_DaysAfter = Session.set("ses_DaysAfter", '');
    },
    'change #finished': function  (e, t) {
      Session.set("ses_statusfilter", "Finished");
      console.log("ses_statusfilter: " + Session.get("ses_statusfilter"));
      //$('#filterOrderDateBefore').val("");
      //$('#filterOrderDateAfter').val("");
      //ses_DaysBefore = Session.set("ses_DaysBefore", null);
      //ses_DaysAfter = Session.set("ses_DaysAfter", null);
    }
  });

  
  Template.tmp_EditOrder.events({
    'click #deleteOrder': function (e, t) {
      var orderToDelete = Session.get("selectedDocId");
      //console.log("orderToDelete" + orderToDelete);

      if (confirm('Are you sure you want to DELETE this Order?')) {
        // Save it!
        Order.remove({_id: orderToDelete});
        rm_EditOrder.hide();
      } else {
        // Do nothing!
        rm_EditOrder.hide();
      }

    },
    'click #loadOrder': function (){
      //console.log("click load Order");
      var orderToEdit = Session.get("selectedDocId");
      //console.log("orderToEdit: " + orderToEdit);
      var userEdit = Session.get("ses_loggedUserName");
      //console.log("userEdit: " + userEdit);
      var userEditLoad;

      if (userEdit == "sp11"){
        userEditLoad = "SP 1-1";
      } else if (userEdit == "sp12") {
        userEditLoad = "SP 1-2";
      } else if (userEdit == "sp21") {
        userEditLoad = "SP 2-1";
      } else if (userEdit == "sp22") {
        userEditLoad = "SP 2-2";
      }

      
      //var orderToEdit = Order.find({_id: Session.get("selectedDocId")}).fetch();
      //console.log(orderToEdit[0]._id);

      Order.update({_id: orderToEdit},{$set: {Load: userEditLoad}});
      rm_EditOrder.hide();
    },
    'click #spreadOrder': function (){
      var input_actuallaysers = Session.get("ses_change_al");
      //var input_actuallaysers = $('#input_actuallaysers').val();
      //input_actuallaysers = Number(input_actuallaysers);
      console.log("input_actuallaysers form ses: " + input_actuallaysers); // Problem!!

      //console.log("click spread Order");
      var orderToEdit = Session.get("selectedDocId");
      //console.log("orderToEdit: " + orderToEdit);
      var userEdit = Session.get("ses_loggedUserName");
      //console.log("userEdit: " + userEdit);
      var userEditSpread;

      if (userEdit == "sp11"){
        userEditSpread = "SP 1-1";
      } else if (userEdit == "sp12") {
        userEditSpread = "SP 1-2";
      } else if (userEdit == "sp21") {
        userEditSpread = "SP 2-1";
      } else if (userEdit == "sp22") {
        userEditSpread = "SP 2-2";
      }

      var spreadDate = new Date();

      var order = Order.find({_id: orderToEdit}).fetch();
        for (var i = 0; i < order.length; i++) {
          var SonLayer = order[i].SonLayer;
          var MonLayer = order[i].MonLayer;
          var LonLayer = order[i].LonLayer;
          var layers = order[i].Layers;
          var layersactual = order[i].LayersActual;
      }

      if (layersactual) {
          LayersToCount = layersactual;
      } else {
          LayersToCount = layers;
      }

      var CutS = LayersToCount * SonLayer;
      var CutM = LayersToCount * MonLayer;
      var CutL = LayersToCount * LonLayer;

      Order.update({_id: orderToEdit},{$set: {Position: 999,Spread: userEditSpread, SpreadDate: spreadDate, Status: "CUT",LayersActual: input_actuallaysers, CutS: CutS, CutM: CutM, CutL: CutL}});
      delete input_actuallaysers;

      rm_EditOrder.hide();
    },
    'click #cutOrder': function (){
      //console.log("click spread Order");
      var orderToEdit = Session.get("selectedDocId");
      //console.log("orderToEdit: " + orderToEdit);
      var userEdit = Session.get("ses_loggedUserName");
      //console.log("userEdit: " + userEdit);
      var userEditCut;

      if (userEdit == "cut1"){
        userEditCut = "CUT 1";
      } else if (userEdit == "cut2") {
        userEditCut = "CUT 2";
      } 

      var cutDate = new Date();

      Order.update({_id: orderToEdit},{$set: {Cut: userEditCut, CutDate: cutDate, Status: "Finished" }});
      rm_EditOrder.hide();
    },
    /*
    'keyup #input_actuallaysers': function(e){
      Session.set("ses_change_al", "");
      var al = $('#input_actuallaysers').val();
      //al = Number(al);
      console.log("input: " + al);
      Session.set("ses_change_al", al);
      console.log("ses: " + Session.get("ses_change_al"));
      
    },
    */ 
    'click #saveposition': function(e){
      //console.log("saveposition clicked");

      var orderToEdit = Session.get("selectedDocId");
      var order = Order.find({_id: orderToEdit}).fetch();
        for (var i = 0; i < order.length; i++) {
          var actualPosition = order[i].Position;
          var actualStatus = order[i].Status;
          var actual_Id = order[i]._Id;
      }
      console.log("actualPosition: " + actualPosition);
      console.log("actualStatus: " + actualStatus);
      console.log("actual_Id: " + actual_Id);

      var arrayofPosSp = Session.get("ses_arrayofPosSp");
      console.log("ses_arrayofPosSp: " + arrayofPosSp);
      //Session.set("ses_arrayofPosSp", '');

      var uniqarrayofPosSp = $.makeArray($(arrayofPosSp).filter(function(i,itm){ 
        // note: 'index', not 'indexOf'
        return i == $(arrayofPosSp).index(itm);
      }));
      console.log("uniqarrayofPosSp: " + uniqarrayofPosSp);

      var countPosSp1 = Session.get("ses_countPosSp1");
      //console.log("ses_countPosSp1: " + countPosSp1);
      //Session.set("ses_countPosSp1", '');

      var countPosSp2 = Session.get("ses_countPosSp2");
      //console.log("ses_countPosSp2: " + countPosSp2);
      //Session.set("ses_countPosSp2", '');

      var selectedPosition = $('.in #selectPosition').find(":selected").val();
      var selectedPositionN = Number(selectedPosition);
      console.log("selectedPositionN: " + selectedPositionN);

      var selectedStatus = $('.in #selectStatus').find(":selected").text();
      //console.log("selectedStatus: " + selectedStatus);

      /*$(".in #selectPosition").change(function () {
        var selectedStatus2 = "";
          $( ".in #selectPosition:selected" ).each(function() {
            selectedStatus2 = $( ".in selectPosition :selected" ).text()
            console.log("selectedStatus2: " + selectedStatus2)
          })
      console.log("selectedStatus22: " + selectedStatus2);
      })*/

      var arrayofPosSp = Session.get("ses_arrayofPosSp");
      //console.log("array length: "+ arrayofPosSp.length);

      // Izbrisi aktuelnu pozicuju, tj stavi poziciju na 0
      Meteor.call('method_stavipozna0', actualPosition, actualStatus, function(err, data) {
        console.log("method_stavipozna0: " + data);
      }); 
      //console.log('kraj method_stavipozna0')

      // Smanji za jednu poziciju od aktuelne pozicije ispod tj pomeri za jednu poziciju gore sve ispod aktuelne
      /*for (var i = 1; i < arrayofPosSp.length; i++) {
        //console.log(i);
        //console.log("i: " + i + " ,arrayofPosSp[i]: " + arrayofPosSp[i]);
        if (actualPosition < arrayofPosSp[i]){
          Meteor.call('method_smanjizajedan', arrayofPosSp[i], actualStatus, function(err, data) {
            console.log("method_smanjizajedan: " + data);
          });   
        }
      }
      //console.log('kraj method_smanjizajedan')
      */
      Meteor.call('method_smanjizajedan', actualPosition, actualStatus, function(err, data) {
            console.log("method_smanjizajedan: " + data);
      });   

      // Povecaj za jednu poziciju od selektovane pozicije ispod tj pomeri za jednu poziciju dole sve ispod selektovane
      /*for (var i = 1; i < arrayofPosSp.length; i++) {
        //console.log(i);
        //console.log("i: " + i + " ,arrayofPosSp[i]: " + arrayofPosSp[i]);
        if (selectedPositionN <= arrayofPosSp[i]){ // moze da se koristi < sa bi spojili
          Meteor.call('method_povecajzajedan', arrayofPosSp[i], actualStatus, function(err, data) {
            console.log("method_povecajzajedan: " + data);
          });   
        }
      }
      //console.log('kraj method_povecajzajedan')
      */
      Meteor.call('method_povecajzajedan', selectedPositionN, actualStatus, function(err, data) {
            console.log("method_povecajzajedan: " + data);
      }); 
      
      // Stavi zeljnu pozicuju
      Meteor.call('method_ubacinapoz', actualPosition, actualStatus, selectedPosition, function(err, data) {
         console.log("method_ubacinapoz: " + data);
      });
      //console.log('kraj method_ubacinapoz')

        // Define rd_editorder
        //var rd_editorder = ReactiveModal.initDialog(rm_EditOrder);
        // show rd_editorder
        // rd_editorder.show();
      //Template.alert.preserve(["#myModal"]);

      //var selectedStatus3 = $(rd_editorder).find("#selectPosition :selected").text()
      //Meteor.autorun();
      rm_EditOrder.hide();
    },
    /*
    'click #saveCommentOrder': function (){
      console.log("click save Comment");
      var orderToEdit = Session.get("selectedDocId");
  
      var newComment = $('#commentOrder').val();
      console.log("newComment: " + newComment);

      Order.update({_id: orderToEdit},{$set: {Comment: newComment}});
      newComment = ""
      //alert("Comment saved");
      //rm_EditOrder.hide();
    },
    'keyup #commentOrder': function(e, v){
        //console.log("e: " + e);
        //console.log("v: " + v);
        var newComment = $('#commentOrder').val();
        console.log("newComment: " + newComment);
    } */
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
            /*delimiter:"'",
            separator:';',*/
            delimiter:";",
            separator:',',
        });

          for (var i = 0; i < all.length; i++) {
            //console.log(all[i]);

            var no  = Number(all[i]['No']);
            console.log("No: " + no);
            var komesa = all[i]['KOMESA'];
            var marker = all[i]['Marker Name'];
            var style = all[i]['Style'];
            var fabric = all[i]['Fabric'];
            var colorcode = all[i]['Color Code'];
            var colordesc = all[i]['Color Description'];
            var bagno = all[i]['Bagno'];
            var layers = Number(all[i]['Layers']);
            var actuallayers = 0;
            var lengthS = all[i]['Marker Length [mt]'];
            //console.log(lengthS);
            //var lengthR = lengthS.replace(",", ".");
            //console.log(lengthR);
            var length = Number(lengthS);
            //console.log(length);
            var extra = Number(all[i]['Length All. [cm]']);
            var lengthsumX = Number((length + (extra/100)) * layers);
            var lengthsum = Number(lengthsumX).toFixed(3);
            var width = Number(all[i]['Marker Width [cm]']);
            var s = Number(all[i]['tot S']);
            var sonlayer = Number(all[i]['S']);
            var m = Number(all[i]['tot M']);
            var monlayer = Number(all[i]['M']);
            var l = Number(all[i]['tot L']);
            var lonlayer = Number(all[i]['L']);
            var status = Number(all[i]['SPREADER']);
            
            var orderd = all[i]['DATE'];
            //console.log("all[i]['DATE']: " + orderd);
            
            var orderdate = new Date(all[i]['DATE']);
            orderdate.setHours(2,0,0,0);
              
            if (status == "1" ){
              status = 'SP 1';
              //var countSP1 = Order.find({Status: status}); // WRRONG it must be from server side query not form table
              //console.log("countSP1.count(): " + countSP1.count());

              /*Meteor.call('method_countPosSp1', function(err, data) {
                if (err){
                  console.log(err);
                }
              var countSP1set = data;
              console.log("data1: " + data);
              });*/

              var countPosSp1 = Session.get("ses_countPosSp1");
              var countPosSp1 = countPosSp1 + 1;
              console.log("countPosSp1+1: " + countPosSp1);
              setPos = countPosSp1;

              Session.set("ses_countPosSp1", countPosSp1);
            
            } else if (status == "2" ){
              status = 'SP 2';
              //var countSP2 = Order.find({Status: status}); // WRRONG it must be from server side query not form table
              //console.log("countSP2.count(): " + countSP2.count());

              /*Meteor.call('countPosSp2', function(err, data) {
                if (err){
                  console.log(err);
                }
              var countSP2set = data;
              console.log("data2: " + data);
              });*/

              var countPosSp2 = Session.get("ses_countPosSp2");
              var countPosSp2 = countPosSp2 + 1;
              console.log("countPosSp2+1: " + countPosSp2);
              setPos = countPosSp2;

              Session.set("ses_countPosSp2", countPosSp2);
            
            } else {
              status = 'Not assigned';
              setPos = 999;
            }

            // STATUS = ['Not assigned','SP 1','SP 2','CUT','Finish']

           //One by One
            if ((orderd != 0) || (orderd)) { 
              Order.insert({No: no, Position: setPos , Date: orderdate, Komesa: komesa, Marker: marker, Style: style, Fabric: fabric, ColorCode: colorcode , ColorDesc: colordesc, Bagno: bagno, Layers: layers, LayersActual: actuallayers, Length: length, Extra: extra, LengthSum: lengthsum, Width: width, S: s, SonLayer: sonlayer, M: m, MonLayer: monlayer, L: l, LonLayer: lonlayer, Status: status});    
              setPos = 0;
              countSP2set = 0;
              countSP1set = 0; 
            } else {
              Order.insert({No: no, Position: setPos, Komesa: komesa, Marker: marker, Style: style, Fabric: fabric, ColorCode: colorcode , ColorDesc: colordesc, Bagno: bagno, Layers: layers, LayersActual: actuallayers, Length: length, Extra: extra, LengthSum: lengthsum, Width: width, S: s, SonLayer: sonlayer, M: m, MonLayer: monlayer, L: l, LonLayer: lonlayer, Status: status});    
              setPos = 0;
              countSP2set = 0;
              countSP1set = 0;
            }

            //var a = WriteResult.nInserted
            //alert(Orde.hasWriteError());
            //var b = BulkWriteResult.hasWriteError()
            //var c = BulkWriteResult.writeConcernError.errmsg
            //console.log(a +b +c);

            
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

          //console.log("all: "+all);

          for (var i = 0; i < all.length; i++) {
            //console.log(all[i]);

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
            var layersactual = Number(all[i]['LayersActual']);
            var length = Number(all[i]['Length']);
            //var length = lengthS.replace(",", ".");
            var extra = Number(all[i]['Extra']);
            //var lengthsumX = Number((length + extra) * layers);
            //var lengthsum = lengthsumX.toFixed(3);
            var lengthsum = Number(all[i]['LengthSum']);
            var width = Number(all[i]['Width']);
            var s = Number(all[i]['S']);
            var sonlayer = Number(all[i]['SonLayer']);
            var cuts = Number(all[i]['CutS']);
            var m = Number(all[i]['M']);
            var monlayer = Number(all[i]['MonLayer']);
            var cutm = Number(all[i]['CutM']);
            var l = Number(all[i]['L']);
            var lonlayer = Number(all[i]['LonLayer']);
            var cutl = Number(all[i]['CutL']);
            var status = all[i]['Status'];
            var priority = all[i]['Priority'];
            var load = all[i]['Load'];
            var spread = all[i]['Spread'];
            var comment = all[i]['Comment'];

            var priority = Number(all[i]['Priority']);

            var orderDate = all[i]['Date'];
            if (orderDate) {
              var orderDate2 = new Date(orderDate);  
              //var orderDateP = Date.parse(orderDate);
              //var orderDateM = moment(all[i]['Date']).format("DD-MM-YYYY");
              //var orderDateM2 = new Date(orderDateM);
            } else {
              orderDate2 = "";
            }

            var orderCreated = all[i]['Created'];
            var orderCreated2 = new Date(orderCreated);


            //One by One
            //Order.insert({No: no, Date: orderDate, Created: orderCreated, Komesa: all[i]['Komesa'], Marker: all[i]['Marker'], Style: all[i]['Style'], Fabric: all[i]['Fabric'], ColorCode: all[i]['ColorCode'], ColorDesc: all[i]['ColorDesc'], Bagno: all[i]['Bagno'], Layers: layers, Length: length, Extra: extra, LengthSum: lengthsum, Width: width, S: s, M: m, L: l ,Status: all[i]['Status'], Priority: priority});    
            Order.insert({No: no, Date: orderDate2, Komesa: komesa, Marker: marker, Style: style, Fabric: fabric, ColorCode: colorcode , ColorDesc: colordesc, Bagno: bagno, Layers: layers, LayersActual: layersactual, Length: length, Extra: extra, LengthSum: lengthsum, Width: width, S: s, SonLayer: sonlayer, M: m, MonLayer: monlayer, L: l, LonLayer: lonlayer, Status: status, Load: load, Spread: spread, Comment: comment }); 
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

  Meteor.methods({ 
  method_countPosSp1: function() {
    return Order.find({Status: 'SP 1'}).count();
  },
  method_countPosSp2: function() {
    return Order.find({Status: 'SP 2'}).count();
  },
  method_arrayofPosSp1: function() {
    var order = Order.find({Status: 'SP 1'}).fetch();
      var posarray = [];

      for (var i = 0; i < order.length; i++) {
        pos = order[i].Position;
        posarray.push(pos);
      }
      posarray.sort(function(a, b){return a-b});
    return posarray;
  },
  method_arrayofPosSp2: function() {
    var order = Order.find({Status: 'SP 2'}).fetch();
      var posarray = [];

      for (var i = 0; i < order.length; i++) {
        id = order[i]._Id;
        pos = order[i].Position;
        posarray.push(pos);
      }
      posarray.sort(function(a, b){return a-b});
    return posarray;
  },
  method_arrayofStatus: function() {
    /*
    var order = Order.find({Status: { $exists: true}}).fetch();
      var statusarray = [];

      for (var i = 0; i < order.length; i++) {
        sta = order[i].Status;
        statusarray.push(sta);
      }
      statusarray.sort(function(a, b){return a-b});
    */
    //statusarray = ["Not assigned","SP 1","SP 2","CUT","Finished"];
    statusarray = ["Not assigned","SP 1","SP 2","CUT"];
    return statusarray;
  },
  method_smanjizajedan: function(Position, Status){
    var order = Order.find({Position: {$gt: Position}, Status: Status }).fetch();
    for (var i = 0; i < order.length; i++) {
        Order.update({ _id: order[i]._id},
          {$inc: {Position: -1}}, 
          {multi: true}
        );
    }
    return "Done";
    /*
    var order = Order.find({Position: Position, Status: Status }).fetch();
      for (var i = 0; i < order.length; i++) {
        Order.update({ _id: order[i]._id},
          {$inc: {Position: -1}}, 
          {multi: true}
        );
        return order[i].No;
      }
    return "Not found method_smanjizajedan";
    */
  },
  method_povecajzajedan: function(Position, Status){
    var order = Order.find({Position: {$gte: Position}, Status: Status }).fetch();
    for (var i = 0; i < order.length; i++) {
        Order.update({ _id: order[i]._id},
          {$inc: {Position: 1}}, 
          {multi: true}
        );
    }  
    return "Done";
    /*
    var order = Order.find({Position: Position, Status: Status }).fetch();
      for (var i = 0; i < order.length; i++) {
        Order.update({ _id: order[i]._id},
          {$inc: {Position: 1}},
          {multi: true}
      );
        //return order[i].No;
      }
    return "Not Found method_povecajzajedan";
    */
  },
  method_ubacinapoz: function (actualPosition, actualStatus, selectedPosition){
    var order = Order.find({Position: 0, Status: actualStatus }).fetch();
      for (var i = 0; i < order.length; i++) {
        Order.update({ _id: order[i]._id},
          {$set: {Position: selectedPosition}},
          //{$inc: {Position: -1}}, 
          {multi: true}
        ); 
        //return order[i].No;
      }
    return "Not found method_ubacinapoz";
  },
  method_ubacinapozVise: function (actualPosition, actualStatus, selectedPosition){
    var order = Order.find({Position: 0, Status: actualStatus }).fetch();
      for (var i = 0; i < order.length; i++) {
        Order.update({ _id: order[i]._id},
          {$set: {Position: selectedPosition}},
          //{$inc: {Position: -1}}, 
          {multi: true}
        );
        //return order.No;
      }
    return "Not found method_ubacinapozVise";
  },
  method_stavipozna0: function (actualPosition, actualStatus){
    var order = Order.find({Position: actualPosition, Status: actualStatus }).fetch();
      for (var i = 0; i < order.length; i++) {
        Order.update({ _id: order[i]._id},
          {$set: {Position: 0}},
          //{$inc: {Position: -1}}, 
          {multi: true}
        ); 
        //return order[i].No;
      }
    return "Not found method_stavipozna0";
  },
  
});
 
  Meteor.publish("filter_orderAll", function(){
    return Order.find();
  });

  Meteor.publish("filter_orderWithDate", function(dateFilter){
    return Order.find({ Date: dateFilter});
  });

  Meteor.publish("filter_orderWithDateRange", function(Daysbefore , Daysafter) {
    //return Order.find({ Date: {$gte: ISODate(Daysbefore), $lt: ISODate(Daysafter)} });
    return Order.find({ Date: {$gte: Daysbefore, $lt: Daysafter} });
  });

  Meteor.publish("filter_orderWithoutDate", function(){
    return Order.find({ Date: { $exists: false }});
  });

  Meteor.publish("filter_orderWithoutJob", function(){
    return Order.find({ Status: "Not assigned"});
  });

  Meteor.publish("filter_spreader1", function(){
    return Order.find({ Status: "SP 1"});
    /*return Order.find({
    $and : [
        { Status: "SP 1"},
        //{ $or : [ { Spread : "" }, { Spread : { $exists: false }} ] }
    ]
    })*/
  });

  Meteor.publish("filter_spreader2", function(){
    return Order.find({ Status: "SP 2"});
    /*return Order.find({
    $and : [
        { Status: "SP 2"},
        //{ $or : [ { Spread : "" }, { Spread : { $exists: false }} ] }
    ]
    })*/
  });

  Meteor.publish("filter_cutter", function(){
    return Order.find({ Status: "CUT"});
    /*return Order.find({
    $and: [
       { $or: [
          { Status: "CUT" }
        ]},

       /*{ $or: [ 
          { Cut : "" },
          { Cut : { $exists: false }}
          ]},
      ]
    })*/

  });

  Meteor.publish("filter_statusfilter", function(status/*, Daysbefore , Daysafter*/){
    return Order.find({ 
      $and: [
      {Status: status},
      //{Date: {$gte: Daysbefore, $lt: Daysafter}}
      ]
    })
  });

}

var admin = ""; //123123
var sp11 = "";  // 111111
var sp12 = "";  // 121212
var sp21 = "";  // 212121
var sp22 = "";  // 222222
var cut1 = "";  // c1c1c1
var cut2 = "";  // c2c2c2

// kill -9 `ps ax | grep node | grep meteor | awk '{print $1}'`
// export MONGO_URL=mongodb://localhost:27017/spread


// STATUS = ['Not assigned','SP 1','SP 2','CUT','Finished']

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
// meteor add settinghead:auto-nprogress