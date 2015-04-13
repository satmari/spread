if (Meteor.isClient) {
  //SimpleSchema.debug = true;
  //UI.registerHelper("Schemas", Schemas);

  Meteor.startup(function () {
    //console.log("startup");
   
    var todayAt02 = new Date();
    todayAt02.setHours(2,0,0,0);
    //console.log("todayAt02" + todayAt02);

    var treeDaysbefore = new Date();
    treeDaysbefore.setHours(-70,0,0,0);
    //console.log("treeDaysbefore: " + treeDaysbefore);

    var treeDaysafter = new Date();
    treeDaysafter.setHours(75,0,0,0);   // three days + 2h timezone + 1h
    //console.log("treeDaysafter: " + treeDaysafter);

    var oneDaybefore = new Date();
    oneDaybefore.setHours(0,0,0,0);
    
    var oneDayafter = new Date();
    oneDayafter.setHours(24,0,0,0);   

    Session.set("ses_datefilter", todayAt02);
    //Session.set("ses_DaysBefore", treeDaysbefore);
    //Session.set("ses_DaysAfter", treeDaysafter);
    Session.set("ses_DaysBefore", oneDaybefore);
    Session.set("ses_DaysAfter", oneDayafter);
    //Session.set("ses_datenotexist", false);
    //Session.set("ses_jobnotexist", false);
    Session.set("ses_allorder_date", false);
    Session.set("ses_allorder_spreaddate", false);
    Session.set("ses_allorder_cutdate", false);
    Session.set("ses_statusfilter", "Not assigned");

    Date.prototype.toDateInputValue = (function() {
      var local = new Date(this);
      local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
      return local.toJSON().slice(0,10);
    });

    $('#filterOrderDate').val(new Date().toDateInputValue());
    
    var filterOrderDateBefore = new Date(oneDaybefore).toDateInputValue();
    //filterOrderDateBefore = filterOrderDateBefore.setHours(-70,0,0,0);
    //console.log("start: " + filterOrderDateBefore);
    $('#filterOrderDateBefore').val(filterOrderDateBefore);

    var filterOrderDateAfter = new Date(oneDayafter).toDateInputValue();
    //filterOrderDateAfter = filterOrderDateAfter.setHours(75,0,0,0);
    //console.log("start: " + filterOrderDateAfter);
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
        //console.log("Startup: UserId: " + User._id);
        //console.log("Startup: UserName: " + User.username);
    }

    Session.set("ses_selectOperatorSpreader", "");
    var selectOperatorSpreader = Session.get("ses_selectOperatorSpreader");
    //console.log("operator is(startup): " + selectOperator);

    Session.set("ses_selectOperatorCutter", "");
    var selectOperatorCutter = Session.get("ses_selectOperatorCutter");
    //console.log("operator is(startup): " + selectOperator);

    if (selectOperatorSpreader) {
      $('.select_operator_spreader').hide();
      $('#changeOperatorSpreader').show();
    } else {
      $('.select_operator_spreader').show();
      $('#selectOperatorSpreader').val($('#selectOperatorSpreader option:first').val());
      $('#changeOperatorSpreader').hide();
    }
    if (selectOperatorCutter) {
      $('.select_operator_cutter').hide();
      $('#changeOperatorCutter').show();
    } else {
      $('.select_operator_cutter').show();
      $('#selectOperatorCutter').val($('#selectOperatorCutter option:first').val());
      $('#changeOperatorCutter').hide();
    }
    /*
    var dateB = $('#filterOrderDateBefore').val();
    var dateA = $('#filterOrderDateAfter').val();

    if (dateB || dateA) {
      $('#btnRefresh').hide();  
      $('#btnfilterOrderDateStart').show(); 
    } else {
      $('#btnRefresh').show();
      $('#btnfilterOrderDateStart').hide(); 
    }
    */

  })

  Meteor.autosubscribe(function () {
    var user = Meteor.user();
    //console.log("autosubscribe");
    //console.log("user: " + user);
    //console.log("_id: " + user._id );
    //console.log("username: " + user.username );

    if (user) {
      var UserId = Meteor.userId();
      var UserA = Meteor.users.findOne({_id: UserId});
      //console.log("Autosubscribe = UserA_Id: " + UserA._id);
      //console.log("Autosubscribe = UserName: " + UserA.username);

      Session.set("ses_loggedUserId", UserA._id);
      Session.set("ses_loggedUserName", UserA.username);
    }

    var ses_loggedUserName = Session.get("ses_loggedUserName");
    var ses_datefilter = Session.get("ses_datefilter");
    var ses_DaysBefore = Session.get("ses_DaysBefore");
    var ses_DaysAfter = Session.get("ses_DaysAfter");
    //var ses_existdate = Session.get("ses_datenotexist");
    //var ses_jobnotexist = Session.get("ses_jobnotexist");
    var ses_allorder_date = Session.get("ses_allorder_date");
    var ses_allorder_spreaddate = Session.get("ses_allorder_spreaddate");
    var ses_allorder_cutdate = Session.get("ses_allorder_cutdate");
    
    var ses_statusfilter = Session.get("ses_statusfilter");

    /*
    if (ses_DaysBefore) {
      Date.prototype.toDateInputValue = (function() {
          var local = new Date(this);
          local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
          return local.toJSON().slice(0,10);
      });
    }
    */
    //var filterOrderDateBefore = new Date(ses_DaysBefore).toDateInputValue();
    //filterOrderDateBefore = filterOrderDateBefore.setHours(-70,0,0,0);
    //console.log("auto: " + filterOrderDateBefore);
    //$('#filterOrderDateBefore').val("2015-07-01");

    //var filterOrderDateAfter = new Date(ses_DaysAfter).toDateInputValue();
    //filterOrderDateAfter = filterOrderDateAfter.setHours(75,0,0,0);
    //console.log("auto: " + filterOrderDateAfter);
    //$('#filterOrderDateAfter').val("2015-08-01");
    
    /*
    var dateB = $('#filterOrderDateBefore').val();
    var dateA = $('#filterOrderDateAfter').val();

    if (dateB) {
      $('#btnRefresh').hide();  
      $('#btnfilterOrderDateStart').show(); 
    } else {
      $('#btnRefresh').show();
      $('#btnfilterOrderDateStart').hide(); 
    }
    */


    //console.log("Autosubcribe sesion: " + ses + " , typeof: " + typeof ses);

    if ((ses_loggedUserName == "cut1") || (ses_loggedUserName == "cut2") || (ses_loggedUserName == "mor1") || (ses_loggedUserName == "mor2") || (ses_loggedUserName == "lec1") || (ses_loggedUserName == "lec2")){
      Meteor.subscribe('filter_cutter');
    } else if ((ses_loggedUserName == "sp11") || (ses_loggedUserName == "sp12") || (ses_loggedUserName == "sp13")){
      //Meteor.subscribe('spreader1', Session.get("ses_datefilter"));
      Meteor.subscribe('filter_spreader1');
    } else if ((ses_loggedUserName == "sp21") || (ses_loggedUserName == "sp22") || (ses_loggedUserName == "sp23")){
      //Meteor.subscribe('spreader2', Session.get("ses_datefilter"));
      Meteor.subscribe('filter_spreader2');
    } else if ((ses_loggedUserName == "sp31") || (ses_loggedUserName == "sp32") || (ses_loggedUserName == "sp33")){
      //Meteor.subscribe('spreader2', Session.get("ses_datefilter"));
      Meteor.subscribe('filter_spreader3');
    } else if ((ses_loggedUserName == "ms11") || (ses_loggedUserName == "ms12")){
      Meteor.subscribe('filter_spreaderm1');
    } else if (ses_loggedUserName == "label"){
      Meteor.subscribe('filter_label', ses_DaysBefore, ses_DaysAfter);
    } else if (ses_loggedUserName == "cons"){
      Meteor.subscribe('filter_cons', ses_DaysBefore, ses_DaysAfter);

    } else if (ses_allorder_date) {
      Meteor.subscribe('filter_allOrderswithDate', ses_DaysBefore, ses_DaysAfter);
    } else if (ses_allorder_spreaddate) {
      Meteor.subscribe('filter_allOrderswithSpreadDate', ses_DaysBefore, ses_DaysAfter);
    } else if (ses_allorder_cutdate) {
      Meteor.subscribe('filter_allOrderswithCutDate', ses_DaysBefore, ses_DaysAfter);
    
    } else if (ses_statusfilter == 'Finished') { 
      Meteor.subscribe('filter_statusfilterwithCutDate', ses_statusfilter, ses_DaysBefore, ses_DaysAfter);
    } else if (ses_statusfilter == 'TRASH') { 
      Meteor.subscribe('filter_statusfilterwithDate', ses_statusfilter, ses_DaysBefore, ses_DaysAfter);
    } else if (ses_statusfilter) { 
      Meteor.subscribe('filter_statusfilter', ses_statusfilter);

    } else if ( ses_datefilter == "" ) { // date filter is always set to today, only if you set date range this session have to be deleted 
      Meteor.subscribe('filter_orderAll');
    } else if ( (ses_DaysBefore) || (ses_DaysAfter) ) {
      Meteor.subscribe('filter_orderWithDateRange', ses_DaysBefore, ses_DaysAfter);
    } else {
      Meteor.subscribe('filter_orderWithDate', ses_datefilter);
    }

    // Operators
    Meteor.subscribe('filter_allOperators');

    var selectOperatorSpreader = Session.get("ses_selectOperatorSpreader");
    var selectOperatorCutter = Session.get("ses_selectOperatorCutter");

    if (selectOperatorSpreader) {
      $('.select_operator_spreader').hide();
      $('#changeOperatorSpreader').show();
    } else {
      $('.select_operator_spreader').show();
      $('#selectOperatorSpreader').val($('#selectOperatorSpreader option:first').val());
      $('#changeOperatorSpreader').hide();
    }
    if (selectOperatorCutter) {
      $('.select_operator_cutter').hide();
      $('#changeOperatorCutter').show();
    } else {
      $('.select_operator_cutter').show();
      $('#selectOperatorCutter').val($('#selectOperatorCutter option:first').val());
      $('#changeOperatorCutter').hide();
    }
      
      
      Meteor.call('method_uniquecountPosNA', function(err, data) {
        //console.log("method_uniquecountPosNA: " + data);
        Session.set("ses_uniquecountPosNA", data);
      });
      Meteor.call('method_uniquecountPosSp1', function(err, data) {
        //console.log("method_uniquecountPosSp1: " + data);
        Session.set("ses_uniquecountPosSp1", data);
      });
      Meteor.call('method_uniquecountPosSp2', function(err, data) {
        //console.log("method_uniquecountPosSp2: " + data);
        Session.set("ses_uniquecountPosSp2", data);
      });
      Meteor.call('method_uniquecountPosSp3', function(err, data) {
        //console.log("method_uniquecountPosSp2: " + data);
        Session.set("ses_uniquecountPosSp3", data);
      });
      Meteor.call('method_uniquecountPosMs1', function(err, data) {
        //console.log("method_uniquecountPosMs1: " + data);
        Session.set("ses_uniquecountPosMs1", data);
      });
      Meteor.call('method_uniquecountPosCUT', function(err, data) {
        //console.log("method_uniquecountPosCUT: " + data);
        Session.set("ses_uniquecountPosCUT", data);
      });
      Meteor.call('method_uniquecountPosF', function(err, data) {
        //console.log("method_uniquecountPosF: " + data);
        Session.set("ses_uniquecountPosF", data);
      });
      Meteor.call('method_uniquecountPosTRASH', function(err, data) {
        //console.log("method_uniquecountPosTRASH: " + data);
        Session.set("ses_uniquecountPosTRASH", data);
      });
    
  });

  Template.nav.helpers ({
    isAdminOrGuest: function() {
      //var loggedUserName = Session.get("loggedUserName");
      //console.log(loggedUserName);

      var userId = Meteor.userId();
      if (userId) {
        var User = Meteor.users.findOne({_id: userId});
        if ((User.username == "admin") || (User.username == "guest")) {
          return true;
        } else {
          return false;  
        }
      }
    },
    isSp: function() {
      var userId = Meteor.userId();
      if (userId) {
        var User = Meteor.users.findOne({_id: userId});
        if ((User.username == "sp11") || (User.username == "sp12") || (User.username == "sp13") || (User.username == "sp21") || (User.username == "sp22") || (User.username == "sp23") || (User.username == "sp31") || (User.username == "sp32") || (User.username == "sp33") || (User.username == "ms11") || (User.username == "ms12")) {
          return true;
        } else {
          return false;  
        }
      }
    },
    isCut: function() {
      var userId = Meteor.userId();
      if (userId) {
        var User = Meteor.users.findOne({_id: userId});
        if ((User.username == "cut1") || (User.username == "cut2") || (User.username == "mor1") || (User.username == "mor2") || (User.username == "lec1") || (User.username == "lec2")) {
          return true;
        } else {
          return false;  
        }
      }
    },
    isLabel: function() {
      var userId = Meteor.userId();
      if (userId) {
        var User = Meteor.users.findOne({_id: userId});
        if (User.username == "label") {
          return true;
        } else {
          return false;  
        }
      }
    },
    isCons: function() {
      var userId = Meteor.userId();
      if (userId) {
        var User = Meteor.users.findOne({_id: userId});
        if (User.username == "cons") {
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
    operatorSelectSpreader: function  (){ // dropdown list
      var userId = Meteor.userId();
      var posarray = [];

      if (userId) {
        var User = Meteor.users.findOne({_id: userId});
        if ((User.username == "sp11") || (User.username == "sp12") || (User.username == "sp13") || (User.username == "sp21") || (User.username == "sp22") || (User.username == "sp23") || (User.username == "sp31") || (User.username == "sp32") || (User.username == "sp33")) {
          var operators = Operators.find({Status: "Active", Machine: "Spreader"}).fetch();

        } else if ((User.username == "ms11") || (User.username == "ms12")) { 
          var operators = Operators.find({Status: "Active", Machine: "Manual Spreader"}).fetch();

        }
      }

      for (var i = 0; i < operators.length; i++) {
        //id = operators[i]._Id;
        pos = operators[i].OP_Name;
        posarray.push(pos);
      }
      posarray.sort(function(a, b){return a-b});
      return posarray;
    }, 
    operatorSelectCutter: function () { // dropdown list
      var userId = Meteor.userId();
      var posarray = [];

      if (userId) {
        var User = Meteor.users.findOne({_id: userId});
        if ((User.username == "cut1") || (User.username == "cut2") || (User.username == "mor1") || (User.username == "mor2") || (User.username == "lec1") || (User.username == "lec2")) {
          var operators = Operators.find({Status: "Active", Machine: "Cutter"}).fetch();
        } 
      }

      for (var i = 0; i < operators.length; i++) {
        //id = operators[i]._Id;
        pos = operators[i].OP_Name;
        posarray.push(pos);
      }
      posarray.sort(function(a, b){return a-b});
      return posarray;
    },
    OperatorSelectedSpreader: function () {
      var operator = Session.get("ses_selectOperatorSpreader");
      return operator;
    },
    OperatorSelectedCutter: function () {
      var operator = Session.get("ses_selectOperatorCutter");
      return operator;
    }
  });

  Template.reactiveTebleList.helpers({
    orders: function () {
      return Order.find();
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
    isUserGuest: function() {
        var userId = Meteor.userId();
        if (userId) {
            var User = Meteor.users.findOne({_id: userId});
          if (User.username == "guest") {
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
          if ((User.username == "sp11") || (User.username == "sp12") || (User.username == "sp13") || (User.username == "sp21") || (User.username == "sp22") || (User.username == "sp23") || (User.username == "sp31") || (User.username == "sp32") || (User.username == "sp33") || (User.username == "ms11") || (User.username == "ms12")){
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
          if ((User.username == "cut1") || (User.username == "cut2") || (User.username == "mor1") || (User.username == "mor2") || (User.username == "lec1") || (User.username == "lec2")) {
            return true;
          } else {
            return false;  
          }
        }
    },
    isUserLabel: function() {
        var userId = Meteor.userId();
        if (userId) {
            var User = Meteor.users.findOne({_id: userId});
          if (User.username == "label") {
            return true;
          } else {
            return false;  
          }
        }
    },
    isUserCons: function() {
        var userId = Meteor.userId();
        if (userId) {
            var User = Meteor.users.findOne({_id: userId});
          if (User.username == "cons") {
            return true;
          } else {
            return false;  
          }
        }
    },
    filter: function() {
        return ses_statusfilter = Session.get("ses_statusfilter");
    },
    settingsAdmin: function () {
      return {
        rowsPerPage: 100,
        showFilter: true,
        showNavigation: 'auto',
        showColumnToggles: true,
        fields: [
          //{ key: '_id', label: '_ID' },
          { key: 'Position', label: 'Pos' , sort: 'ascending'},
          { key: 'No', label: 'No', /*sort: 'descending' */},
          { key: 'OrderLink', label: 'Linked',
           fn: function (value){
              if (value == true) {
                return "Linked";
              } else {
                return "" ;
              };
            }
          },
          /*{ key: 'Date', label: 'Date',
            fn: function (value) {
              if (value){
                return moment(value).format("YYYY-MM-DD");
              } else {
                return "";
              }
              //return moment(value).format("DD-MM-YYYY");
            }//, sort: 'descending' // ascending
          },*/
          //{ key: 'Created', label: 'Created' },
          { key: 'Komesa', label: 'Komesa' },
          { key: 'Marker', label: 'Marker' },
          //{ key: 'Style', label: 'Style' },
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
          { key: 'Length', label: 'Length (m)', 
              fn: function  (value){
                var v = Number(value);
                return v.toFixed(3);
              } 
          },
          { key: 'Extra', label: 'Extra (cm)' },
          { key: 'LengthSum', label: 'Tot Meters Req. (m)',
              fn: function  (value){
                var v = Number(value);
                return v.toFixed(2);
              }
          },
          /*{ key: 'PcsBundle', label: 'Nr. Pcs Bundle',
            fn: function (value){
              if (value == 0) {
                return "";
              } else {
                return value ;
              };
            }
          },*/
          //{ key: 'Width', label: 'Width (cm)' },
          { key: 'SonLayer', label: 'S per Layer'},
          { key: 'S', label: 'S Tot' },
          { key: 'S_Cut', label: 'S Cut'},
          { key: 'MonLayer', label: 'M per Layer'},
          { key: 'M', label: 'M Tot' },
          { key: 'M_Cut', label: 'M Cut'},
          { key: 'LonLayer', label: 'L per Layer'},
          { key: 'L', label: 'L Tot' },
          { key: 'L_Cut', label: 'L Cut'},
          { key: 'XLonLayer', label: 'XL per Layer'},
          { key: 'XL', label: 'XL Tot' },
          { key: 'XL_Cut', label: 'XL Cut'},
          { key: 'XXLonLayer', label: 'XXL per Layer'},
          { key: 'XXL', label: 'XXL Tot' },
          { key: 'XXL_Cut', label: 'XXL Cut'},
          { key: 'Status', label: 'Status',
            fn: function (value) {
              if (value == "SP 1") {
                return "SP 1";
              }
              else if (value == "SP 2") {
                return "SP 2";
              }
              else if (value == "SP 3") {
                return "SP 3";
              }
              else if (value == "MS 1") {
                return "MS 1";
              }
              else if (value == "CUT") {
                return "toCUT";
              }
              else if (value == "Finished") {
                return "Finished";
              }
              else if (value == "Not assigned") {
                return "Not assigned";
              }
              else if (value == "TRASH") {
                return "in TRASH";
              }
              else {
                return "Not Defined";
              }
            }
          },
          { key: 'Priority', label: 'Priority', 
            fn: function (value){
              if (value == 2) {
                return "High";
              } else if (value == 3) {
                return "Top Priority" ;
              } else {
                return "Normal" ;
              }
            }
          },
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
          { key: 'SpreadDate', label: 'Spread Date',
             fn: function (value) {
              if (value){
                return moment(value).format("YYYY-MM-DD HH:mm:ss");
              } else {
                return "";
              }
            }
          },
          { key: 'SpreadOperator', label: 'Spread Operator'},
          { key: 'Cut', label: 'Cut' },
          { key: 'CutDate', label: 'Cut Date',
             fn: function (value) {
              if (value){
                return moment(value).format("YYYY-MM-DD HH:mm:ss");
              } else {
                return "";
              }
            }
          },
          { key: 'CutOperator', label: 'Cut Operator'},
          { key: 'Consumption', label: 'Consumption' },
          { key: 'LabelPrinted', label: 'LabelPrinted', hidden: true},
          { key: 'Comment', label: 'Comment' },
          { key: 'SkalaMarker', label: 'SkalaMarker', hidden: true},
          { key: 'Sector', label: 'Sector', hidden: true},
          { key: 'Pattern', label: 'Pattern', hidden: true},
        ],
          //useFontAwesome: true,
          //group: 'orderExtra'
          //rowClass: "warning", //warning, danger
          
          rowClass: function(item) {
            var priority = item.Priority;
            var load = item.Load;
            var spread = item.Spread;
            var status = item.Status;
            var linked = item.OrderLink;

            /*if (linked == true) {
              return 'linked';    // red
            }*/

            if (status == "Finished")  {
              return 'success'; // green
            //} else if (linked == true) {
            //  return 'linked';    // red
            } else if (status == 'CUT') {
              return 'info';    // dark blue
            } else if (load) {
              return 'load';    // greey
            } else if ((status == "SP 1") || (status == "SP 2") || (status == "SP 3") || (status == "MS 1")) {
              return 'active';  // light blue
            } else if (priority == 2) {
              return 'warning'; // orange
            } else if (priority == 3) {
              return 'danger';  // red
              //active, success, info, warning, danger
            } else {

            }

          },
      };
    },
    settingsGuest: function () {
      return {
        rowsPerPage: 100,
        showFilter: true,
        showNavigation: 'auto',
        showColumnToggles: true,
        fields: [
          //{ key: '_id', label: '_ID' },
          { key: 'Position', label: 'Pos' , sort: 'ascending'},
          { key: 'No', label: 'No', /*sort: 'descending' */},
          { key: 'OrderLink', label: 'Linked',
           fn: function (value){
              if (value == true) {
                return "Linked";
              } else {
                return "" ;
              };
            }
          },
          /*{ key: 'Date', label: 'Date',
            fn: function (value) {
              if (value){
                return moment(value).format("YYYY-MM-DD");
              } else {
                return "";
              }
              //return moment(value).format("DD-MM-YYYY");
            }//, sort: 'descending' // ascending
          },*/
          //{ key: 'Created', label: 'Created' },
          { key: 'Komesa', label: 'Komesa' },
          { key: 'Marker', label: 'Marker' },
          //{ key: 'Style', label: 'Style' },
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
          { key: 'Length', label: 'Length (m)', 
              fn: function  (value){
                var v = Number(value);
                return v.toFixed(3);
              } 
          },
          { key: 'Extra', label: 'Extra (cm)' },
          { key: 'LengthSum', label: 'Tot Meters Req. (m)',
              fn: function  (value){
                var v = Number(value);
                return v.toFixed(2);
              }
          },
          /*{ key: 'PcsBundle', label: 'Nr. Pcs Bundle',
            fn: function (value){
              if (value == 0) {
                return "";
              } else {
                return value ;
              };
            }
          },*/
          //{ key: 'Width', label: 'Width (cm)' },
          { key: 'SonLayer', label: 'S per Layer'},
          { key: 'S', label: 'S Tot' },
          { key: 'S_Cut', label: 'S Cut'},
          { key: 'MonLayer', label: 'M per Layer'},
          { key: 'M', label: 'M Tot' },
          { key: 'M_Cut', label: 'M Cut'},
          { key: 'LonLayer', label: 'L per Layer'},
          { key: 'L', label: 'L Tot' },
          { key: 'L_Cut', label: 'L Cut'},
          { key: 'XLonLayer', label: 'XL per Layer'},
          { key: 'XL', label: 'XL Tot' },
          { key: 'XL_Cut', label: 'XL Cut'},
          { key: 'XXLonLayer', label: 'XXL per Layer'},
          { key: 'XXL', label: 'XXL Tot' },
          { key: 'XXL_Cut', label: 'XXL Cut'},
          { key: 'Status', label: 'Status',
            fn: function (value) {
              if (value == "SP 1") {
                return "SP 1";
              }
              else if (value == "SP 2") {
                return "SP 2";
              }
              else if (value == "SP 3") {
                return "SP 3";
              }
              else if (value == "MS 1") {
                return "MS 1";
              }
              else if (value == "CUT") {
                return "toCUT";
              }
              else if (value == "Finished") {
                return "Finished";
              }
              else if (value == "Not assigned") {
                return "Not assigned";
              }
              else if (value == "TRASH") {
                return "in TRASH";
              }
              else {
                return "Not Defined";
              }
            }
          },
          { key: 'Priority', label: 'Priority', 
            fn: function (value){
              if (value == 2) {
                return "High";
              } else if (value == 3) {
                return "Top Priority" ;
              } else {
                return "Normal" ;
              }
            }
          },
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
          { key: 'SpreadDate', label: 'Spread Date',
             fn: function (value) {
              if (value){
                return moment(value).format("YYYY-MM-DD HH:mm:ss");
              } else {
                return "";
              }
            }
          },
          { key: 'SpreadOperator', label: 'Spread Operator'},
          { key: 'Cut', label: 'Cut' },
          { key: 'CutDate', label: 'Cut Date',
             fn: function (value) {
              if (value){
                return moment(value).format("YYYY-MM-DD HH:mm:ss");
              } else {
                return "";
              }
            }
          },
          { key: 'CutOperator', label: 'Cut Operator'},
          //{ key: 'OrderLink', label: 'Linked' },
          { key: 'Consumption', label: 'Consumption' },
          { key: 'LabelPrinted', label: 'LabelPrinted', hidden: true},
          { key: 'Comment', label: 'Comment' },
          { key: 'SkalaMarker', label: 'SkalaMarker', hidden: true},
          { key: 'Sector', label: 'Sector', hidden: true},
          { key: 'Pattern', label: 'Pattern', hidden: true},
        ],

          //useFontAwesome: true,
          //group: 'orderExtra'
          //rowClass: "warning", //warning, danger
          
          rowClass: function(item) {
            var priority = item.Priority;
            var load = item.Load;
            var spread = item.Spread;
            var status = item.Status;

            if (status == "Finished")  {
              return 'success'; // green
            } else if (status == 'CUT') {
              return 'info';    // dark blue
            } else if (load) {
              return 'load';    // greey
            } else if ((status == "SP 1") || (status == "SP 2") || (status == "SP 3") || (status == "MS 1")) {
              return 'active';  // light blue
            } else if (priority == 2) {
              return 'warning'; // orange
            } else if (priority == 3) {
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
            { key: 'Position', label: 'Pos' , sort: 'ascending'},
            { key: 'No', label: 'No' },
            { key: 'OrderLink', label: 'Linked',
              fn: function (value){
                if (value == true) {
                  return "Linked";
                } else {
                  return "" ;
                };
              }
            },
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
            { key: 'Length', label: 'Length (m)', 
              fn: function  (value){
                var v = Number(value);
                return v.toFixed(3);
              } 
            },
            //{ key: 'Extra', label: 'Extra (cm)' },
            { key: 'LengthSum', label: 'Tot Meters Required (m)',
              fn: function  (value){
                var v = Number(value);
                return v.toFixed(0);
              }
            },
            { key: 'Width', label: 'Width (cm)' },
            //{ key: 'S', label: 'S' },
            //{ key: 'M', label: 'M' },
            //{ key: 'L', label: 'L' },
            //{ key: 'Status', label: 'Status'},
            //{ key: 'Priority', label: 'Priority' },
            { key: 'Load', label: 'Load'},
            //{ key: 'Spread', label: 'Spread'},
            //{ key: 'Cut', label: 'Cut' },
            //{ key: 'OrderLink', label: 'Linked' },
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

            if (status == "Finished")  {
              return 'success'; // green
            } else if (status == 'CUT') {
              return 'info';    // dark blue
            } else if (load) {
              return 'load';    // greey
            } else if ((status == "SP 1") || (status == "SP 2") || (status == "SP 3") || (status == "MS 1")) {
              return 'active';  // light blue
            } else if (priority == 2) {
              return 'warning'; // orange
            } else if (priority == 3) {
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
            { key: 'No', label: 'No'},
            { key: 'Position', label: 'Pos'},
            { key: 'OrderLink', label: 'Linked',
              fn: function (value){
                if (value == true) {
                  return "Linked";
                } else {
                  return "" ;
                };
              }
            },
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
            //{ key: 'Layers', label: 'Layers' },
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
            //{ key: 'LengthSum', label: 'Length Sum (m)' },
            { key: 'Width', label: 'Width (cm)' },
            //{ key: 'S', label: 'S' },
            { key: 'S_Cut', label: 'S Cut'},
            //{ key: 'M', label: 'M' },
            { key: 'M_Cut', label: 'M Cut'},
            //{ key: 'L', label: 'L' },
            { key: 'L_Cut', label: 'L Cut'},
            //{ key: 'XLonLayer', label: 'XL per Layer'},
            //{ key: 'XL', label: 'XL Marker' },
            { key: 'XL_Cut', label: 'XL Cut'},
            //{ key: 'XXLonLayer', label: 'XXL per Layer'},
            //{ key: 'XXL', label: 'XXL Marker' },
            { key: 'XXL_Cut', label: 'XXL Cut'},
            //{ key: 'Status', label: 'Status'},
            { key: 'Priority', label: 'Priority', sort: 'descending' , 
              fn: function (value){
                if (value == 2) {
                  return "High";
                } else if (value == 3) {
                 return "Top Priority" ;
                } else {
                 return "Normal" ;
                }
              }
            },
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
            //{ key: 'OrderLink', label: 'Linked' },
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

            if (status == "Finished")  {
              return 'success'; // green
            
            } else if (priority == 2) {
              return 'warning'; // orange
            } else if (priority == 3) {
              return 'danger';  // red
              //active, success, info, warning, danger

            } else if (status == 'CUT') {
              return 'info';    // dark blue
            } else if (load) {
              return 'load';    // greey
            } else if ((status == "SP 1") || (status == "SP 2") || (status == "SP 3") || (status == "MS 1")) {
              return 'active';  // light blue
            } else {

            }
          },
      };
    },
    settingsUserLabel: function () {
      return {
          rowsPerPage: 50,
          showFilter: true,
          showNavigation: 'auto',
          fields: [
            //{ key: '_id', label: '_ID' },
            { key: 'No', label: 'No'},
            /*{ key: 'Position', label: 'Pos'},*/
            { key: 'OrderLink', label: 'Linked',
              fn: function (value){
                if (value == true) {
                  return "Linked";
                } else {
                  return "" ;
                };
              }
            },
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
            //{ key: 'Layers', label: 'Layers' },
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
            //{ key: 'LengthSum', label: 'Length Sum (m)' },
            { key: 'Width', label: 'Width (cm)' },
            //{ key: 'S', label: 'S' },
            { key: 'S_Cut', label: 'S Cut'},
            //{ key: 'M', label: 'M' },
            { key: 'M_Cut', label: 'M Cut'},
            //{ key: 'L', label: 'L' },
            { key: 'L_Cut', label: 'L Cut'},
            //{ key: 'XLonLayer', label: 'XL per Layer'},
            //{ key: 'XL', label: 'XL Marker' },
            { key: 'XL_Cut', label: 'XL Cut'},
            //{ key: 'XXLonLayer', label: 'XXL per Layer'},
            //{ key: 'XXL', label: 'XXL Marker' },
            { key: 'XXL_Cut', label: 'XXL Cut'},
            //{ key: 'Status', label: 'Status'},
            { key: 'Priority', label: 'Priority',  
              fn: function (value){
                if (value == 2) {
                  return "High";
                } else if (value == 3) {
                 return "Top Priority" ;
                } else {
                 return "Normal" ;
                }
              }
            },
            /*{ key: 'Load', label: 'Load'},*/
            /*{ key: 'Spread', label: 'Spread'},*/
            { key: 'SpreadDate', label: 'Spread Date', sort: 'descending' ,
             fn: function (value) {
              if (value){
                return moment(value).format("YYYY-MM-DD HH:mm:ss");
              } else {
                return "";
              }
            }
          },
            //{ key: 'Cut', label: 'Cut' },
            //{ key: 'OrderLink', label: 'Linked' },
            //{ key: 'Comment', label: 'Comment' },
            //{ key: 'Consumption', label: 'Consumption' },
            { key: 'LabelPrinted', label: 'LabelPrinted' },
          ],
            //useFontAwesome: true,
            //group: 'Komesa', 
            //rowClass: "warning", //warning, danger
            rowClass: function(item) {
            var priority = item.Priority;
            var load = item.Load;
            var spread = item.Spread;
            var status = item.Status;

            if (status == "Finished")  {
              return 'success'; // green
            /*
            } else if (priority == 2) {
              return 'warning'; // orange
            } else if (priority == 3) {
              return 'danger';  // red
              //active, success, info, warning, danger
            */
            } else if (status == 'CUT') {
              return 'info';    // dark blue
            } else if (load) {
              return 'load';    // greey
            } else if ((status == "SP 1") || (status == "SP 2") || (status == "SP 3") || (status == "MS 1")) {
              return 'active';  // light blue
            } else {

            }
          },
      };
    },
    settingsUserCons: function () {
      return {
          rowsPerPage: 50,
          showFilter: true,
          showNavigation: 'auto',
          fields: [
            //{ key: '_id', label: '_ID' },
            { key: 'No', label: 'No'},
            /*{ key: 'Position', label: 'Pos'},*/
            { key: 'OrderLink', label: 'Linked',
              fn: function (value){
                if (value == true) {
                  return "Linked";
                } else {
                  return "" ;
                };
              }
            },
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
            //{ key: 'Layers', label: 'Layers' },
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
            //{ key: 'LengthSum', label: 'Length Sum (m)' },
            { key: 'Width', label: 'Width (cm)' },
            //{ key: 'S', label: 'S' },
            { key: 'S_Cut', label: 'S Cut'},
            //{ key: 'M', label: 'M' },
            { key: 'M_Cut', label: 'M Cut'},
            //{ key: 'L', label: 'L' },
            { key: 'L_Cut', label: 'L Cut'},
            //{ key: 'XLonLayer', label: 'XL per Layer'},
            //{ key: 'XL', label: 'XL Marker' },
            { key: 'XL_Cut', label: 'XL Cut'},
            //{ key: 'XXLonLayer', label: 'XXL per Layer'},
            //{ key: 'XXL', label: 'XXL Marker' },
            { key: 'XXL_Cut', label: 'XXL Cut'},
            //{ key: 'Status', label: 'Status'},
            { key: 'Priority', label: 'Priority', 
              fn: function (value){
                if (value == 2) {
                  return "High";
                } else if (value == 3) {
                 return "Top Priority" ;
                } else {
                 return "Normal" ;
                }
              }
            },
            /*{ key: 'Load', label: 'Load'},*/
            /*{ key: 'Spread', label: 'Spread'},*/
            { key: 'SpreadDate', label: 'Spread Date', sort: 'descending' , 
             fn: function (value) {
              if (value){
                return moment(value).format("YYYY-MM-DD HH:mm:ss");
              } else {
                return "";
              }
            }
          },
            //{ key: 'Cut', label: 'Cut' },
            //{ key: 'OrderLink', label: 'Linked' },
            //{ key: 'Comment', label: 'Comment' },
            { key: 'Consumption', label: 'Total Consumption' },
            //{ key: 'LabelPrinted', label: 'LabelPrinted' },
          ],
            //useFontAwesome: true,
            //group: 'Komesa', 
            //rowClass: "warning", //warning, danger
            rowClass: function(item) {
            var priority = item.Priority;
            var load = item.Load;
            var spread = item.Spread;
            var status = item.Status;

            if (status == "Finished")  {
              return 'success'; // green
            /*
            } else if (priority == 2) {
              return 'warning'; // orange
            } else if (priority == 3) {
              return 'danger';  // red
              //active, success, info, warning, danger
            */
            } else if (status == 'CUT') {
              return 'info';    // dark blue
            } else if (load) {
              return 'load';    // greey
            } else if ((status == "SP 1") || (status == "SP 2") || (status == "SP 3") || (status == "MS 1")) {
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
        Session.set('selectedDocId', this._id);
        //console.log("ses: " + ses);

        var click_id_pos = this.Position;
        //console.log("click_id_pos: " + click_id_pos );
        var click_id_status = this.Status;
        //console.log("click_id_status: " + click_id_status );
        //var statusfilter = Session.get("ses_statusfilter");
        Session.set('click_id_status', click_id_status); 

        Meteor.call('method_uniquecountPosNA', function(err, data) {
          //console.log("method_uniquecountPosNA: " + data);
          Session.set("ses_uniquecountPosNA", data);
        });
        Meteor.call('method_uniquecountPosSp1', function(err, data) {
          //console.log("method_uniquecountPosSp1: " + data);
          Session.set("ses_uniquecountPosSp1", data);
        });
        Meteor.call('method_uniquecountPosSp2', function(err, data) {
          //console.log("method_uniquecountPosSp2: " + data);
          Session.set("ses_uniquecountPosSp2", data);
        });
        Meteor.call('method_uniquecountPosMs1', function(err, data) {
          //console.log("method_uniquecountPosMs1: " + data);
          Session.set("ses_uniquecountPosMs1", data);
        });
        Meteor.call('method_uniquecountPosCUT', function(err, data) {
          //console.log("method_uniquecountPosCUT: " + data);
          Session.set("ses_uniquecountPosCUT", data);
        });
        Meteor.call('method_uniquecountPosF', function(err, data) {
          //console.log("method_uniquecountPosF: " + data);
          Session.set("ses_uniquecountPosF", data);
        });
        Meteor.call('method_uniquecountPosTRASH', function(err, data) {
          //console.log("method_uniquecountPosTRASH: " + data);
          Session.set("ses_uniquecountPosTRASH", data);
        });

        // Define rd_editorder
        var rd_editorder = ReactiveModal.initDialog(rm_EditOrder);

        // show rd_editorder
        rd_editorder.show();
      }
  });

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
      /*buttons: {
          "cancel": {
            class: 'btn-danger',
            label: 'Cancel'
          },
          "ok": {
            closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
            class: 'btn-info',
            label: 'Back',
          }
      }*/
    };

    /*rd_editorder.buttons.ok.on('click', function(button){
      // rd_editorder is not defined
        rd_editorder.show();
    });*/

  // Reactive table helper (for update/edit orders)
  Template.tmp_EditOrder.helpers({
      editingDoc: function editingDocHelper() {
        return Order.findOne({_id: Session.get("selectedDocId")});
        
      },
      isUserAdmin: function() {
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
      isUserGuest: function() {
        var userId = Meteor.userId();
        if (userId) {
            var User = Meteor.users.findOne({_id: userId});
          if (User.username == "guest") {
            return true;
          } else {
            return false;  
          }
        }
      },
      isUserSp: function() {
        var userId = Meteor.userId();
        if (userId) {
            var User = Meteor.users.findOne({_id: userId});
          if ((User.username == "sp11") || (User.username == "sp12") || (User.username == "sp13") || (User.username == "sp21") || (User.username == "sp22") || (User.username == "sp23") || (User.username == "sp31") || (User.username == "sp32") || (User.username == "sp33") || (User.username == "ms11") || (User.username == "ms12")){
            return true;
          } else {
            return false;  
          }
        }
      },
      isUserCut: function() {
        var userId = Meteor.userId();
        if (userId) {
            var User = Meteor.users.findOne({_id: userId});
          if ((User.username == "cut1") || (User.username == "cut2") || (User.username == "mor1") || (User.username == "mor2") || (User.username == "lec1") || (User.username == "lec2")) {
            return true;
          } else {
            return false;  
          }
        }
      },
      isUserLabel: function() {
        var userId = Meteor.userId();
        if (userId) {
            var User = Meteor.users.findOne({_id: userId});
          if (User.username == "label") {
            return true;
          } else {
            return false;  
          }
        }
      },
      isUserCons: function() {
        var userId = Meteor.userId();
        if (userId) {
            var User = Meteor.users.findOne({_id: userId});
          if (User.username == "cons") {
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
      Order_No: function(){
        var ses = Session.get("selectedDocId");
        var order = Order.find({_id: ses}).fetch();
        for (var i = 0; i < order.length; i++) {
          var Order_No = order[i].No;
        }
        return Order_No;
      },
      Order_Komesa: function(){
        var ses = Session.get("selectedDocId");
        var order = Order.find({_id: ses}).fetch();
        for (var i = 0; i < order.length; i++) {
          var Order_Komesa = order[i].Komesa;
        }
        return Order_Komesa;
      },
      Order_Marker: function(){
        var ses = Session.get("selectedDocId");
        var order = Order.find({_id: ses}).fetch();
        for (var i = 0; i < order.length; i++) {
          var Order_Marker = order[i].Marker;
        }
        return Order_Marker;
      },
      CurrentPosition: function (){
        var ses = Session.get("selectedDocId")
        //console.log("ses: " + ses);

        var order = Order.find({_id: ses}).fetch();
        for (var i = 0; i < order.length; i++) {
          var Pos = order[i].Position;       
        }
        var CurrentPosition = "Current Position: " + Pos;
        return CurrentPosition;
      },
      CurrentStatus: function (){
        var ses = Session.get("selectedDocId")
        //console.log("ses: " + ses);

        var order = Order.find({_id: ses}).fetch();
        for (var i = 0; i < order.length; i++) {
          var Stat = order[i].Status;       
        }
        var CurrentStatus = "Current Status: " + Stat;
        return CurrentStatus;
      },
      /*
      makeUniqueID: function  () {
        return "update-" + this._id;_
      },
      optionStatus: function () {
      return  [
            {label: "Not assigned", value: "Not assigned"},
            {label: "SP 1", value: "SP 1"},
            {label: "SP 2", value: "SP 2"},
            {label: "SP 3", value: "SP 3"},
            {label: "MS 1", value: "MS 1"},
            {label: "TRASH", value: "TRASH"}
            ]
      },*/
      Order_Fabric: function () {
        var ses = Session.get("selectedDocId")
        var order = Order.find({_id: ses}).fetch();
        for (var i = 0; i < order.length; i++) {
          var Order_Fabric = order[i].Fabric;
        }
        return Order_Fabric;
      },
      Order_Bagno: function () {
        var ses = Session.get("selectedDocId")
        var order = Order.find({_id: ses}).fetch();
        for (var i = 0; i < order.length; i++) {
          var Order_Bagno = order[i].Bagno;
        }
        return Order_Bagno;
      },
      Order_ColorDesc: function () {
        var ses = Session.get("selectedDocId")
        var order = Order.find({_id: ses}).fetch();
        for (var i = 0; i < order.length; i++) {
          var Order_ColorDesc = order[i].ColorDesc;
        }
        return Order_ColorDesc;
      },
      Order_ActualLayers: function (){
        var ses = Session.get("selectedDocId")
        var order = Order.find({_id: ses}).fetch();
        for (var i = 0; i < order.length; i++) {
          var Order_ActualLayers = order[i].LayersActual;
        }
        return Order_ActualLayers;
      },
      isNotLoaded: function () {
        var ses = Session.get("selectedDocId");

        var order = Order.find({_id: ses}).fetch();
        for (var i = 0; i < order.length; i++) {
          var Loaded = order[i].Load;       
        }
        if (Loaded) {
          return false;
        } else {
          return true;
        }
      },
      positionSelect: function (){

        var click_id_status = Session.get('click_id_status');

        if (click_id_status == 'SP 1'){
          
          Meteor.call('method_arrayofPosSp1', function(err,data) {
            var arrayofPosSp1 = data;
            Session.set('ses_arrayofPosSp1', arrayofPosSp1);
            //console.log("ses_arrayofPosSp1: " + arrayofPosSp1);
          });
          var uniqarrayofPosSp1 = $.makeArray($(Session.get('ses_arrayofPosSp1')).filter(function(i,itm){ 
            return i == $(Session.get('ses_arrayofPosSp1')).index(itm);
          }));
          return uniqarrayofPosSp1;
        
        } else if (click_id_status == 'SP 2'){
          
          Meteor.call('method_arrayofPosSp2', function(err,data) {
            var arrayofPosSp2 = data;
            Session.set('ses_arrayofPosSp2', arrayofPosSp2);
            //console.log("ses_arrayofPosSp2: " + arrayofPosSp2);
          });
          var uniqarrayofPosSp2 = $.makeArray($(Session.get('ses_arrayofPosSp2')).filter(function(i,itm){ 
            return i == $(Session.get('ses_arrayofPosSp2')).index(itm);
          }));

          return uniqarrayofPosSp2;

        } else if (click_id_status == 'SP 3'){
          
          Meteor.call('method_arrayofPosSp3', function(err,data) {
            var arrayofPosSp3 = data;
            Session.set('ses_arrayofPosSp3', arrayofPosSp3);
            //console.log("ses_arrayofPosSp3: " + arrayofPosSp3);
          });
          var uniqarrayofPosSp3 = $.makeArray($(Session.get('ses_arrayofPosSp3')).filter(function(i,itm){ 
            return i == $(Session.get('ses_arrayofPosSp3')).index(itm);
          }));

          return uniqarrayofPosSp3;

        } else if (click_id_status == 'MS 1'){

          Meteor.call('method_arrayofPosMs1', function(err,data) {
            var arrayofPosMs1 = data;
            Session.set('ses_arrayofPosMs1', arrayofPosMs1);
            //console.log("ses_arrayofPosSp2: " + arrayofPosSp2);
          });
          var uniqarrayofPosMs1 = $.makeArray($(Session.get('ses_arrayofPosMs1')).filter(function(i,itm){ 
            return i == $(Session.get('ses_arrayofPosMs1')).index(itm);
          }));

          return uniqarrayofPosMs1;

        } else if (click_id_status == 'Not assigned'){
          
          Meteor.call('method_arrayofPosNA', function(err,data) {
            var arrayofPosNA = data;
            Session.set('ses_arrayofPosNA', arrayofPosNA);
            //console.log("ses_arrayofPosNA: " + arrayofPosNA);
          });
          var uniqarrayofPosNA = $.makeArray($(Session.get('ses_arrayofPosNA')).filter(function(i,itm){ 
            return i == $(Session.get('ses_arrayofPosNA')).index(itm);
          }));

          return uniqarrayofPosNA;

        } else {
          return ['None'];
        }
      },
      statusSelect: function (){      
        var click_id_status = Session.get('click_id_status');
        Meteor.call('method_arrayofStatus', function(err,data) {
          Session.set('ses_arrayofStatus', data); 
        });

        var  arrayofStasus = Session.get('ses_arrayofStatus');
        return arrayofStasus;
      },
      isSPfilter: function (){
        var statusFilter = Session.get("ses_statusfilter");
        if ((statusFilter == "SP 1") || (statusFilter == "SP 2") || (statusFilter == "SP 3") || (statusFilter == "MS 1") || (statusFilter == "Not assigned")) {
          return true;
        } else {
          return false;
        }
      },
      isOperatorNotSlected: function (){
        var OperatorSelectedSpreader = Session.get("ses_selectOperatorSpreader");
        var OperatorSelectedCutter = Session.get("ses_selectOperatorCutter");

        if ((OperatorSelectedSpreader || (OperatorSelectedSpreader != "")) || (OperatorSelectedCutter || (OperatorSelectedCutter != ""))) {
          return false;
        } else {
          return true;
        }
      }

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

  // Add New Order on click (in nav button) - Reactive Modal Dialog
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
      /*buttons: {
        //"cancel": {
        //  class: 'btn-danger',
        //  label: 'Cancel'
          //},
          "ok": {
            closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
            class: 'btn-info',
            label: 'Back'
          }
      }*/
  };

  // Export Order on click (in nav button) - Reactive Modal Dialog
  var rm_ExportOrder = {
      template: Template.tmp_ExportOrder, 
      title: "Export order list",
      //modalDialogClass: "modal-dialog", //optional
      //modalBodyClass: "modal-body", //optional
      //modalFooterClass: "modal-footer",//optional
      closable: true,
      removeOnHide: true,
      /*buttons: {
        //"cancel": {
        //  class: 'btn-danger',
        //  label: 'Cancel'
          //},
          "ok": {
            closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
            class: 'btn-info',
            label: 'Back'
          }
      }*/
  };

  // Import Order on click (in nav button) - Reactive Modal
  var rm_ImportOrder = {
      template: Template.tmp_ImportOrder, 
      title: "Import order list",
      //modalDialogClass: "modal-dialog", //optional
      //modalBodyClass: "modal-body", //optional
      //modalFooterClass: "modal-footer",//optional
      closable: true,
      removeOnHide: true,
      /*buttons: {
        //"cancel": {
        //  class: 'btn-danger',
        //  label: 'Cancel'
          //},
          "ok": {
            closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
            class: 'btn-info',
            label: 'Back'
          }
      }*/
  };

  // Import Order from Planned Markers file (in nav button) - Reactive Modal Dialog
  var rm_ImportPlannedMarkers = {
      template: Template.tmp_ImportPlannedMarkers, 
      title: "Import from Planned Markers CSV file",
      //modalDialogClass: "modal-dialog", //optional
      //modalBodyClass: "modal-body", //optional
      //modalFooterClass: "modal-footer",//optional
      closable: true,
      removeOnHide: true,
      /*buttons: {
        //"cancel": {
        //  class: 'btn-danger',
        //  label: 'Cancel'
          //},
          "ok": {
            closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
            class: 'btn-info',
            label: 'Back'
          }
      }*/
  };

  var rm_Statistics = {
     template: Template.tmp_Statistics, 
      title: "Statistic for actual order table",
      //modalDialogClass: "modal-dialog", //optional
      //modalBodyClass: "modal-body", //optional
      //modalFooterClass: "modal-footer",//optional
      closable: true,
      removeOnHide: true,
      /*buttons: {
        //"cancel": {
        //  class: 'btn-danger',
        //  label: 'Cancel'
          //},
          "ok": {
            closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
            class: 'btn-info',
            label: 'Back'
          }
      }*/
  };

  var rm_Operators = {
     template: Template.tmp_Operators, 
      title: "Operators table",
      //modalDialogClass: "modal-dialog", //optional
      //modalBodyClass: "modal-body", //optional
      //modalFooterClass: "modal-footer",//optional
      closable: true,
      removeOnHide: true,
      /*buttons: {
        //"cancel": {
        //  class: 'btn-danger',
        //  label: 'Cancel'
          //},
          "ok": {
            closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
            class: 'btn-info',
            label: 'Back'
          }
      }*/
  };

  var rm_NewOperators = {
     template: Template.tmp_NewOperators, 
      title: "Add New Operator",
      //modalDialogClass: "modal-dialog", //optional
      //modalBodyClass: "modal-body", //optional
      //modalFooterClass: "modal-footer",//optional
      closable: true,
      removeOnHide: true,
      /*buttons: {
        //"cancel": {
        //  class: 'btn-danger',
        //  label: 'Cancel'
          //},
          "ok": {
            closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
            class: 'btn-info',
            label: 'Back'
          }
      }*/
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
      sumLengths = sumLengths.toFixed(2);
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
    allXL: function(){
      var order = Order.find().fetch();

      var sumXL = 0;
      for (var i = 0; i < order.length; i++) {
        if (order[i].XL){
          sumXL += order[i].XL;
        }
      }
      return sumXL;
    },
    allXXL: function(){
      var order = Order.find().fetch();

      var sumXXL = 0;
      for (var i = 0; i < order.length; i++) {
        if (order[i].XXL){
          sumXXL += order[i].XXL;
        }
      }
      return sumXXL;
    },
    SP1noRolls: function (){
      var order = Order.find({Status: "SP 1"});
      return order.count();
    },
    SP2noRolls: function (){
      var order = Order.find({Status: "SP 2"});
      return order.count();
    },
    SP3noRolls: function (){
      var order = Order.find({Status: "SP 3"});
      return order.count();
    },
    MS1noRolls: function (){
      var order = Order.find({Status: "MS 1"});
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
    SP1noLoadRollsShift3: function (){
      var order = Order.find({Load: "SP 1-3"});
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
    SP2noLoadRollsShift3: function (){
      var order = Order.find({Load: "SP 2-3"});
      return order.count();
    },
    SP3noLoadRollsShift1: function (){
      var order = Order.find({Load: "SP 3-1"});
      return order.count();
    },
    SP3noLoadRollsShift2: function (){
      var order = Order.find({Load: "SP 3-2"});
      return order.count();
    },
    SP3noLoadRollsShift3: function (){
      var order = Order.find({Load: "SP 3-3"});
      return order.count();
    },
    MS1noLoadRollsShift1: function (){
      var order = Order.find({Load: "MS 1-1"});
      return order.count();
    },
    MS1noLoadRollsShift2: function (){
      var order = Order.find({Load: "MS 1-2"});
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
    SP1noSpreadRollsShift3: function (){
      var order = Order.find({Spread: "SP 1-3"});
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
    SP2noSpreadRollsShift3: function (){
      var order = Order.find({Spread: "SP 2-3"});
      return order.count();
    },
    SP3noSpreadRollsShift1: function (){
      var order = Order.find({Spread: "SP 3-1"});
      return order.count();
    },
    SP3noSpreadRollsShift2: function (){
      var order = Order.find({Spread: "SP 3-2"});
      return order.count();
    },
    SP3noSpreadRollsShift3: function (){
      var order = Order.find({Spread: "SP 3-3"});
      return order.count();
    },
    MS1noSpreadRollsShift1: function (){
      var order = Order.find({Spread: "MS 1-1"});
      return order.count();
    },
    MS1noSpreadRollsShift2: function (){
      var order = Order.find({Spread: "MS 1-2"});
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
    MCutnoRollsShift1: function  (){
      var order = Order.find({Cut: "MOR 1"});
      return order.count();
    },
    MCutnoRollsShift2: function  (){
      var order = Order.find({Cut: "MOR 2"});
      return order.count();
    },
    LCutnoRollsShift1: function  (){
      var order = Order.find({Cut: "LEC 1"});
      return order.count();
    },
    LCutnoRollsShift2: function  (){
      var order = Order.find({Cut: "LEC 2"});
      return order.count();
    },
    SP1LoadMetShift1: function (){
      var order = Order.find({Load: "SP 1-1"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP1LoadMetShift2: function (){
      var order = Order.find({Load: "SP 1-2"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP1LoadMetShift3: function (){
      var order = Order.find({Load: "SP 1-3"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP2LoadMetShift1: function (){
      var order = Order.find({Load: "SP 2-1"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP2LoadMetShift2: function (){
      var order = Order.find({Load: "SP 2-2"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP2LoadMetShift3: function (){
      var order = Order.find({Load: "SP 2-3"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP3LoadMetShift1: function (){
      var order = Order.find({Load: "SP 3-1"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP3LoadMetShift2: function (){
      var order = Order.find({Load: "SP 3-2"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP3LoadMetShift3: function (){
      var order = Order.find({Load: "SP 3-3"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    MS1LoadMetShift1: function (){
      var order = Order.find({Load: "MS 1-1"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    MS1LoadMetShift2: function (){
      var order = Order.find({Load: "MS 1-2"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP1SpreadMetShift1: function (){
      var order = Order.find({Spread: "SP 1-1"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP1SpreadMetShift2: function (){
      var order = Order.find({Spread: "SP 1-2"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP1SpreadMetShift3: function (){
      var order = Order.find({Spread: "SP 1-3"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP2SpreadMetShift1: function (){
      var order = Order.find({Spread: "SP 2-1"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP2SpreadMetShift2: function (){
      var order = Order.find({Spread: "SP 2-2"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP2SpreadMetShift3: function (){
      var order = Order.find({Spread: "SP 2-3"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP3SpreadMetShift1: function (){
      var order = Order.find({Spread: "SP 3-1"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP3SpreadMetShift2: function (){
      var order = Order.find({Spread: "SP 3-2"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    SP3SpreadMetShift3: function (){
      var order = Order.find({Spread: "SP 3-3"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    MS1SpreadMetShift1: function (){
      var order = Order.find({Spread: "MS 1-1"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    MS1SpreadMetShift2: function (){
      var order = Order.find({Spread: "MS 1-2"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    CutMetShift1: function (){
      var order = Order.find({Cut: "CUT 1"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    CutMetShift2: function (){
      var order = Order.find({Cut: "CUT 2"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    MCutMetShift1: function (){
      var order = Order.find({Cut: "MOR 1"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    MCutMetShift2: function (){
      var order = Order.find({Cut: "MOR 2"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    LCutMetShift1: function (){
      var order = Order.find({Cut: "LEC 1"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },
    LCutMetShift2: function (){
      var order = Order.find({Cut: "LEC 2"}).fetch();
      var sum = 0;
      for (var i = 0; i < order.length; i++) {
        sum += order[i].LengthSum;
      }
      sum = Number(sum);
      sum = sum.toFixed(2);
      return sum;
    },

  });

  // Accounts base - Only Username and pass requered
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  // Formating Dates (moment)
  var DateFormats = {
       //short: "DD MMMM YYYY",
       //long:  "DD-MM-YYYY HH:mm"
       short: "DD.MM.YYYY",
       long:  "DD.MM.YYYY HH:mm"
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

  // Formating Numbers in Templates
  UI.registerHelper("formatNumber", function(number) {
    var a = Number(number);
    a = a.toFixed(3).toString().replace(".", ",")
    return a;
  });

  UI.registerHelper("formaColorDesc", function(b) {
  b = b.toString();
    return b;
  });

  // Navigation events
  Template.nav.events({
    /*
    'change #filterOrderDate': function (e, t) {
      var datesel = $('#filterOrderDate').val();
      var datesel1 = new Date(datesel); 
      
      Session.set("ses_datefilter", datesel1);
      datesel1 = "";
      //console.log("Set-ses_datefilter: " + Session.get("ses_datefilter"));
    },
    */
    /*
    'change #filterOrderDateBefore': function (e, t) {
      var datesel = $('#filterOrderDateBefore').val();
      var datesel1 = new Date(datesel);
      datesel1.setHours(1,0,0,0);

      Session.set("ses_DaysBefore1", datesel1);
      Session.set("ses_datefilter1", datesel1); //just to skip all
      datesel1 = "";
      //console.log("Set-ses_DaysBefore: " + Session.get("ses_DaysBefore"));
    },

    'change #filterOrderDateAfter': function (e, t) {
      var datesel = $('#filterOrderDateAfter').val();
      var datesel1 = new Date(datesel);
      datesel1.setHours(3,0,0,0);

      Session.set("ses_DaysAfter1", datesel1);
      Session.set("ses_datefilter1", datesel1); //just to skip all
      datesel1 = "";
      //console.log("Set-ses_DaysAfter: " + Session.get("ses_DaysAfter"));
    },
    */
    'click #btnfilterOrderDateStart' : function (e, t) {

      var dateselBefore = $('#filterOrderDateBefore').val();
      var dateselBefore1 = new Date(dateselBefore);
      dateselBefore1.setHours(1,0,0,0);
      //console.log(dateselBefore1);

      Session.set("ses_DaysBefore", dateselBefore1);
      Session.set("ses_datefilter", dateselBefore1); //just to skip all
      dateselBefore1 = "";

      var dateselAfter = $('#filterOrderDateAfter').val();
      var dateselAfter1 = new Date(dateselAfter);
      dateselAfter1.setHours(3,0,0,0);
      //console.log(dateselAfter1);

      Session.set("ses_DaysAfter", dateselAfter1);
      Session.set("ses_datefilter", dateselAfter1); //just to skip all
      dateselAfter1 = "";
    },

    /*'click #new_order': function (e, t) {
      console.log("new_order - click");

      var rd_addneworder = ReactiveModal.initDialog(rm_AddNewOrder);
      rd_addneworder.show();
    },*/

    'click #import_from_planned_markers' : function () {
      //console.log('import from planned markers - click')

      Meteor.call('method_uniquecountPosNA', function(err, data) {
        Session.set("ses_uniquecountPosNA", data);
        //console.log("method_uniquecountPosNA: " + data);
      });
      Meteor.call('method_uniquecountPosSp1', function(err, data) {
        Session.set("ses_uniquecountPosSp1", data);
        //console.log("method_uniquecountPosSp1: " + data);
      });
      Meteor.call('method_uniquecountPosSp2', function(err, data) {
        Session.set("ses_uniquecountPosSp2", data);
        //console.log("method_uniquecountPosSp2: " + data);
      });
       Meteor.call('method_uniquecountPosSp3', function(err, data) {
        Session.set("ses_uniquecountPosSp3", data);
        //console.log("method_uniquecountPosSp3: " + data);
      });
      Meteor.call('method_uniquecountPosMs1', function(err, data) {
        Session.set("ses_uniquecountPosMs1", data);
        //console.log("method_uniquecountPosMs1: " + data);
      });
      Meteor.call('method_uniquecountPosCUT', function(err, data) {
        Session.set("ses_uniquecountPosCUT", data);
        //console.log("method_uniquecountPosCUT: " + data);
      });
      Meteor.call('method_uniquecountPosF', function(err, data) {
        Session.set("ses_uniquecountPosF", data);
        //console.log("method_uniquecountPosF: " + data);
      });
      Meteor.call('method_uniquecountPosTRASH', function(err, data) {
        Session.set("ses_uniquecountPosTRASH", data);
        //console.log("method_uniquecountPosTRASH: " + data);
      });
      
      // Define rd_addneworder
      var rd_importPlannedMarkers = ReactiveModal.initDialog(rm_ImportPlannedMarkers);
      // Show rd_addneworder
      rd_importPlannedMarkers.show();
    },

    'click #export_orders' : function () {
      //console.log('export orders - click')

      // Define rd_addneworder
      var rd_exportOrder = ReactiveModal.initDialog(rm_ExportOrder);
      // Show rd_addneworder
      rd_exportOrder.show();
    },

    'click #import_orders' : function () {
      //console.log('import orders - click')

      // Define rd_addneworder
      var rd_importOrder = ReactiveModal.initDialog(rm_ImportOrder);
      // Show rd_addneworder
      rd_importOrder.show();
    },

    'click #refresh_sum' : function () {
      //console.log('refresh_sum - click')

      Meteor.call('method_refreshSum',function(err, data) {
        //console.log("method_refreshSum: " + data);
      });
    
    },

    'click #statistics' : function (e, t) {
      var rd_statistics = ReactiveModal.initDialog(rm_Statistics);
      rd_statistics.show();
    },

    'click #operators' : function (e, t) {
      var rd_operators = ReactiveModal.initDialog(rm_Operators);
      rd_operators.show();
    },

    'change #allorder_date': function (e, t) {
      if ($('#allorder_date').prop('checked')){
        //console.log("allorder_date: checked");
        Session.set("ses_allorder_date", true);
      } else {
        //console.log("allorder_date: unchecked");
        Session.set("ses_allorder_date", false);
      }
    },

    'change #allorder_spreaddate': function (e, t) {
      if ($('#allorder_spreaddate').prop('checked')){
        //console.log("allorder_spreaddate: checked");
        Session.set("ses_allorder_spreaddate", true);
      } else {
        //console.log("allorder_spreaddate: unchecked");
        Session.set("ses_allorder_spreaddate", false);
      }
    },

    'change #allorder_cutdate': function (e, t) {
      if ($('#allorder_cutdate').prop('checked')){
        //console.log("allorder_cutdate: checked");
        Session.set("ses_allorder_cutdate", true);
      } else {
        //console.log("allorder_cutdate: unchecked");
        Session.set("ses_allorder_cutdate", false);
      }
    },

    'change #not_assigned': function  (e, t) {
      Session.set("ses_statusfilter", "Not assigned");
      //console.log("ses_statusfilter: " + Session.get("ses_statusfilter"));
    },

    'change #sp1': function  (e, t) {
      Session.set("ses_statusfilter", "SP 1");
      //console.log("ses_statusfilter: " + Session.get("ses_statusfilter"));
    },

    'change #sp2': function  (e, t) {
      Session.set("ses_statusfilter", "SP 2");
      //console.log("ses_statusfilter: " + Session.get("ses_statusfilter"));
    },

    'change #sp3': function  (e, t) {
      Session.set("ses_statusfilter", "SP 3");
      //console.log("ses_statusfilter: " + Session.get("ses_statusfilter"));
    },

    'change #ms1': function  (e, t) {
      Session.set("ses_statusfilter", "MS 1");
      //console.log("ses_statusfilter: " + Session.get("ses_statusfilter"));
    },

    'change #cut': function  (e, t) {
      Session.set("ses_statusfilter", "CUT");
      //console.log("ses_statusfilter: " + Session.get("ses_statusfilter"));
    },

    'change #finished': function  (e, t) {
      Session.set("ses_statusfilter", "Finished");
      //console.log("ses_statusfilter: " + Session.get("ses_statusfilter"));
    },

    'click #trash_orders': function  (e, t) {
      Session.set("ses_statusfilter", "TRASH");
      //console.log("ses_statusfilter: " + Session.get("ses_statusfilter"));

      $( ".btn-group label" ).removeClass( "active" );
    },

    'change #selectOperatorSpreader': function (e, t) {
      var selectOperatorSpreader = $('#selectOperatorSpreader').find(":selected").text();
      Session.set("ses_selectOperatorSpreader", selectOperatorSpreader);
      $('.select_operator_spreader').hide();
      $('#changeOperatorSpreader').show();
    },

    'change #selectOperatorCutter': function (e, t) {
      var selectOperatorCutter = $('#selectOperatorCutter').find(":selected").text();
      Session.set("ses_selectOperatorCutter", selectOperatorCutter);
      $('.select_operator_cutter').hide();
      $('#changeOperatorCutter').show();
    },

    'click #changeOperatorSpreader' : function (e, t) {
      Session.set("ses_selectOperatorSpreader", "");
      $('.select_operator_spreader').show();
      $('#selectOperatorSpreader').val($('#selectOperatorSpreader option:first').val());
      $('#changeOperatorSpreader').hide();
    },

    'click #changeOperatorCutter' : function (e, t) {
      Session.set("ses_selectOperatorCutter", "");
      $('.select_operator_cutter').show();
      $('#selectOperatorCutter').val($('#selectOperatorCutter option:first').val());
      $('#changeOperatorCutter').hide();
    },

    'click #login-buttons-logout': function (e, t) {
      Session.set("ses_selectOperatorSpreader", "");
      Session.set("ses_selectOperatorCutter", "");
    }

  });


  Template.tmp_EditOrder.events({
    'click #deleteOrder': function (e, t) {
      var orderToDelete = Session.get("selectedDocId");
      //console.log("orderToDelete" + orderToDelete);
      var order = Order.find({_id: orderToDelete}).fetch();
        for (var i = 0; i < order.length; i++) {
          var actualPosition = order[i].Position;
          var actualStatus = order[i].Status;
          var actual_id = order[i]._id;
        }

      if (confirm('Are you sure you want to DELETE this Order?')) {

        var order = Order.find({Position: actualPosition, Status: actualStatus}).fetch();
        var linked = order.length;
        //console.log("is linked: " + linked);

        if (linked > 1) {
          Order.remove({_id: orderToDelete});

        } else {
          // Smanji za jednu poziciju od aktuelne pozicije ispod tj pomeri za jednu poziciju gore sve ispod aktuelne
          Meteor.call('method_smanjizajedan', actualPosition, actualStatus, function(err, data) {
          //console.log("method_smanjizajedan: " + data);
          });  
          Order.remove({_id: orderToDelete});
        }

      } else {
        // Do nothing!
      }

      rm_EditOrder.hide();
    },

    'click #loadOrder': function (){
      //console.log("click load Order");
      var orderToEdit = Session.get("selectedDocId");
      //console.log("orderToEdit: " + orderToEdit);

      var order = Order.find({_id: orderToEdit}).fetch();
        for (var i = 0; i < order.length; i++) {
          var actualPosition = order[i].Position;
          var actualStatus = order[i].Status;
          var actual_id = order[i]._id;
      }

      var userEdit = Session.get("ses_loggedUserName");
      //console.log("userEdit: " + userEdit);
      var userEditLoad;

      if (userEdit == "sp11"){
        userEditLoad = "SP 1-1";
      } else if (userEdit == "sp12") {
        userEditLoad = "SP 1-2";
      } else if (userEdit == "sp13") {
        userEditLoad = "SP 1-3";
      } else if (userEdit == "sp21") {
        userEditLoad = "SP 2-1";
      } else if (userEdit == "sp22") {
        userEditLoad = "SP 2-2";
      } else if (userEdit == "sp23") {
        userEditLoad = "SP 2-3";
      } else if (userEdit == "sp31") {
        userEditLoad = "SP 3-1";
      } else if (userEdit == "sp32") {
        userEditLoad = "SP 3-2";
      } else if (userEdit == "sp33") {
        userEditLoad = "SP 3-3";
      } else if (userEdit == "ms11") {
        userEditLoad = "MS 1-1";
      } else if (userEdit == "ms12") {
        userEditLoad = "MS 1-2";
      }

      // Dodaj load order u znavisnosti od korisnika 
      Meteor.call('method_loadOrder', actualPosition, actualStatus, userEditLoad, function(err, data) {
        //console.log("method_stavipozna0: " + data);
      }); 
      
      rm_EditOrder.hide();
    },

    'click #spreadOrder': function (){
      //console.log("click spread Order");
      var orderToEdit = Session.get("selectedDocId");
      //console.log("orderToEdit: " + orderToEdit);
      var order = Order.find({_id: orderToEdit}).fetch();
        for (var i = 0; i < order.length; i++) {
          /*
          var SonLayer = order[i].SonLayer;
          var MonLayer = order[i].MonLayer;
          var LonLayer = order[i].LonLayer;
          var XLonLayer = order[i].XLonLayer;
          var XXLonLayer = order[i].XXLonLayer;
          var layers = order[i].Layers;
          var layersactual = order[i].LayersActual;
          */
          var actualPosition = order[i].Position;
          var actualStatus = order[i].Status;
          var actual_id = order[i]._id;
      }

      var userEdit = Session.get("ses_loggedUserName");
      //console.log("userEdit: " + userEdit);
      
      if (userEdit == "sp11"){
        var userEditSpread = "SP 1-1";
      } else if (userEdit == "sp12") {
        var userEditSpread = "SP 1-2";
      } else if (userEdit == "sp13") {
        var userEditSpread = "SP 1-3";
      } else if (userEdit == "sp21") {
        var userEditSpread = "SP 2-1";
      } else if (userEdit == "sp22") {
        var userEditSpread = "SP 2-2";
      } else if (userEdit == "sp23") {
        var userEditSpread = "SP 2-3";
      } else if (userEdit == "sp31") {
        var userEditSpread = "SP 3-1";
      } else if (userEdit == "sp32") {
        var userEditSpread = "SP 3-2";
      } else if (userEdit == "sp33") {
        var userEditSpread = "SP 3-3";
      } else if (userEdit == "ms11") {
        var userEditSpread = "MS 1-1";
      } else if (userEdit == "ms12") {
        var userEditSpread = "MS 1-2";
      }

      var spreadDate = new Date();
      
      // Izbrisi aktuelnu pozicuju, tj stavi poziciju na 0
      Meteor.call('method_stavipozna0', actualPosition, actualStatus, function(err, data) {
        //console.log("method_stavipozna0: " + data);
      }); 

      // Smanji za jednu poziciju od aktuelne pozicije ispod tj pomeri za jednu poziciju gore sve ispod aktuelne
      Meteor.call('method_smanjizajedan', actualPosition, actualStatus, function(err, data) {
        //console.log("method_smanjizajedan: " + data);
      });   

      var actualPosition = 0;
      var selectedStatus = "CUT";
      
      var uniquecountSelected = Session.get("ses_uniquecountPosCUT");
      var uniquecountSelectedPosition = uniquecountSelected + 1;

      var selectedOperatorSpreader = Session.get("ses_selectOperatorSpreader");
      //console.log("selectedOperatorSpreader: " + selectedOperatorSpreader);

      Meteor.call('method_spreadOrder', actualPosition, actualStatus, selectedStatus, uniquecountSelectedPosition, userEditSpread, spreadDate, selectedOperatorSpreader, function(err, data) {
        //console.log("method_spreadOrder: " + data);
      });
      
      //delete input_actuallaysers;
      rm_EditOrder.hide();
    },

    'click #cutOrder': function (){

      var orderToEdit = Session.get("selectedDocId");
      //console.log("orderToEdit: " + orderToEdit);

      var order = Order.find({_id: orderToEdit}).fetch();
        for (var i = 0; i < order.length; i++) {
          
          var actualPosition = order[i].Position;
          var actualStatus = order[i].Status;
          var actual_id = order[i]._id;
      }

      var userEdit = Session.get("ses_loggedUserName");
      //console.log("userEdit: " + userEdit);
      if (userEdit == "cut1"){
        var userEditCut = "CUT 1";
      } else if (userEdit == "cut2") {
        var userEditCut = "CUT 2";
      } else if (userEdit == "mor1") {
        var userEditCut = "MOR 1";
      } else if (userEdit == "mor2") {
        var userEditCut = "MOR 2";
      } else if (userEdit == "lec1") {
        var userEditCut = "LEC 1";
      } else if (userEdit == "lec2") {
        var userEditCut = "LEC 2";
      } 

      var cutDate = new Date();

      //Order.update({_id: orderToEdit},{$set: {Cut: userEditCut, CutDate: cutDate, Status: "Finished" }});
      
      // Izbrisi aktuelnu pozicuju, tj stavi poziciju na 0
      Meteor.call('method_stavipozna0', actualPosition, actualStatus, function(err, data) {
        //console.log("method_stavipozna0: " + data);
      }); 

      // Smanji za jednu poziciju od aktuelne pozicije ispod tj pomeri za jednu poziciju gore sve ispod aktuelne
      Meteor.call('method_smanjizajedan', actualPosition, actualStatus, function(err, data) {
        //console.log("method_smanjizajedan: " + data);
      }); 

      var actualPosition = 0;
      var selectedStatus = "Finished";
      var uniquecountSelected = Session.get("ses_uniquecountPosF");
      var uniquecountSelectedPosition = uniquecountSelected + 1;

      var selectedOperatorCutter = Session.get("ses_selectOperatorCutter");
      //console.log("selectedOperatorCutter: " + selectedOperatorCutter);

      Meteor.call('method_cutOrder', actualPosition, actualStatus, selectedStatus, uniquecountSelectedPosition, userEditCut, cutDate, selectedOperatorCutter, function(err, data) {
        //console.log("method_cutOrder: " + data);
      });

      rm_EditOrder.hide();
    },

    'click #printOrder': function (){
      var orderToEdit = Session.get("selectedDocId");
      //console.log("orderToEdit: " + orderToEdit);

      var order = Order.find({_id: orderToEdit}).fetch();
        for (var i = 0; i < order.length; i++) {
          
          var actualPosition = order[i].Position;
          var actualStatus = order[i].Status;
          var actual_id = order[i]._id;
      }

      Order.update({_id: orderToEdit},{$set: {LabelPrinted: true }});
      
      rm_EditOrder.hide();
    },

    'click #insertposition': function(e){
      //console.log("saveposition clicked");

      var orderToEdit = Session.get("selectedDocId");
      var order = Order.find({_id: orderToEdit}).fetch();
        for (var i = 0; i < order.length; i++) {
          var actualPosition = order[i].Position;
          var actualStatus = order[i].Status;
          var actual_Id = order[i]._Id;
      }

      var selectedPosition = $('.in #selectPosition').find(":selected").val();
      var selectedPositionN = Number(selectedPosition);
      //console.log("selectedPositionN: " + selectedPositionN);
      
      if (actualPosition == selectedPosition) {
        alert("No way!!! \nActual position and Selected position are the same! \n \n:P ");
      } else {

      // Izbrisi aktuelnu pozicuju, tj stavi poziciju na 0
      Meteor.call('method_stavipozna0', actualPosition, actualStatus, function(err, data) {
        //console.log("method_stavipozna0: " + data);
      }); 
      //console.log('kraj method_stavipozna0')

      // Smanji za jednu poziciju od aktuelne pozicije ispod tj pomeri za jednu poziciju gore sve ispod aktuelne
      Meteor.call('method_smanjizajedan', actualPosition, actualStatus, function(err, data) {
        //console.log("method_smanjizajedan: " + data);
      });   

      // Povecaj za jednu poziciju od selektovane pozicije ispod tj pomeri za jednu poziciju dole sve ispod selektovane
      Meteor.call('method_povecajzajedan', selectedPositionN, actualStatus, function(err, data) {
        //console.log("method_povecajzajedan: " + data);
      });
      
      // Stavi zeljnu pozicuju
      Meteor.call('method_ubacinapoz', actualPosition, actualStatus, selectedPositionN, function(err, data) {
        //console.log("method_ubacinapoz: " + data);
      });
      }

      rm_EditOrder.hide();
    },

    'click #linkposition': function(e){

      var orderToEdit = Session.get("selectedDocId");
      var order = Order.find({_id: orderToEdit}).fetch();
        for (var i = 0; i < order.length; i++) {
          var actualPosition = order[i].Position; 
          var actualStatus = order[i].Status;
          var actual_Id = order[i]._Id;
      }

      //Order.update({_id: actual_Id}, {$set: {OrderLink: true}});

      var selectedPosition = $('.in #selectPosition').find(":selected").val();
      var selectedPositionN = Number(selectedPosition);
      //console.log("selectedPositionN: " + selectedPositionN);

      //var selectedPositionChange = $( "#insertorder option:selected" ).text();
      //console.log("selectedPositionChange: " +selectedPositionChange )

      if (actualPosition == selectedPosition) {
        alert("No way!!! \nActual position and Selected position are the same! \n \n:) ");
      } else {

      if (actualPosition < selectedPositionN) {
        selectedPositionN = selectedPositionN - 1;
      }

      // Izbrisi aktuelnu pozicuju, tj stavi poziciju na 0
      Meteor.call('method_stavipozna0', actualPosition, actualStatus, function(err, data) {
        //console.log("method_stavipozna0: " + data);
      }); 
      //console.log('kraj method_stavipozna0')

      // Smanji za jednu poziciju od aktuelne pozicije ispod tj pomeri za jednu poziciju gore sve ispod aktuelne
      Meteor.call('method_smanjizajedan', actualPosition, actualStatus, function(err, data) {
        //console.log("method_smanjizajedan: " + data);
      });   
      /*
      // Povecaj za jednu poziciju od selektovane pozicije ispod tj pomeri za jednu poziciju dole sve ispod selektovane
      Meteor.call('method_povecajzajedan', selectedPositionN, actualStatus, function(err, data) {
        console.log("method_povecajzajedan: " + data);
      });
      */
      // Stavi zeljnu pozicuju
      Meteor.call('method_ubacinapoz', actualPosition, actualStatus, selectedPositionN, function(err, data) {
        //console.log("method_ubacinapoz: " + data);
      });       

      Meteor.call('method_linkpoz', actualStatus, selectedPositionN, function(err, data) {
        console.log("method_linkpoz: " + data);
      }); 
      
      }

      rm_EditOrder.hide();
    },

    'click #unlinkposition' : function(e){
      var orderToEdit = Session.get("selectedDocId");
      var order = Order.find({_id: orderToEdit}).fetch();
        for (var i = 0; i < order.length; i++) {
          var actualPosition = order[i].Position;
          var actualStatus = order[i].Status;
          var actual_id = order[i]._id;
        }

      //Order.update({ _id: actual_Id}, {$set: {OrderLink: false}});

      if (actualStatus == "SP 1"){
        var uniquecountPosSp1 = Session.get("ses_uniquecountPosSp1");
        var uniquecountSelected = uniquecountPosSp1;
      } else if (actualStatus == "SP 2"){
        var uniquecountPosSp2 = Session.get("ses_uniquecountPosSp2");
        var uniquecountSelected = uniquecountPosSp2;
      } else if (actualStatus == "SP 3"){
        var uniquecountPosSp3 = Session.get("ses_uniquecountPosSp3");
        var uniquecountSelected = uniquecountPosSp3;
      } else if (actualStatus == "MS 1"){
        var uniquecountPosMs1 = Session.get("ses_uniquecountPosMs1");
        var uniquecountSelected = uniquecountPosMs1;
      } else if (actualStatus == "Not assigned"){
        var uniquecountPosNA = Session.get("ses_uniquecountPosNA");
        var uniquecountSelected = uniquecountPosNA;
        //var uniquecountSelected = 0;
      } else {
        var uniquecountSelected = '';
      }
      //console.log("uniquecountSelected" + uniquecountSelected);

      Meteor.call('method_unlinkpoz', actualStatus, actualPosition, function(err, data) {
        console.log("method_unlinkpoz: " + data);
      }); 

      var uniquecountSelectedPosition = uniquecountSelected + 1;
      //console.log("uniquecountSelectedPosition: " + uniquecountSelectedPosition);

      // Proveri da li postoji linkovana pozicija i vrati broj
      var order = Order.find({Position: actualPosition, Status: actualStatus }).fetch();
      var linked = order.length;
  
      if (linked > 1 ){
        Order.update({_id: actual_id}, {$set: {Position: uniquecountSelectedPosition}});  
      } else {
        alert("No way!!! \nThis position have only one order! \n:P")
      }

      rm_EditOrder.hide();      
    },

    'click #changestatus': function(e){

      var orderToEdit = Session.get("selectedDocId");
      var order = Order.find({_id: orderToEdit}).fetch();
        for (var i = 0; i < order.length; i++) {
          var actualPosition = order[i].Position;
          var actualStatus = order[i].Status;
          var actual_id = order[i]._id;
        }

      var selectedStatus = $('.in #selectStatus').find(":selected").text();
      console.log("selectedStatus: " + selectedStatus); 

      if (selectedStatus == "SP 1"){
        var uniquecountPosSp1 = Session.get("ses_uniquecountPosSp1");
        var uniquecountSelected = uniquecountPosSp1;
      } else if (selectedStatus == "SP 2"){
        var uniquecountPosSp2 = Session.get("ses_uniquecountPosSp2");
        var uniquecountSelected = uniquecountPosSp2;
      } else if (selectedStatus == "SP 3"){
        var uniquecountPosSp3 = Session.get("ses_uniquecountPosSp3");
        var uniquecountSelected = uniquecountPosSp3;
      } else if (selectedStatus == "MS 1"){
        var uniquecountPosMs1 = Session.get("ses_uniquecountPosMs1");
        var uniquecountSelected = uniquecountPosMs1;
      } else if (selectedStatus == "Not assigned"){
        var uniquecountPosNA = Session.get("ses_uniquecountPosNA");
        var uniquecountSelected = uniquecountPosNA;
      } else if (selectedStatus == "CUT"){
        var uniquecountPosCUT = Session.get("ses_uniquecountPosCUT");
        var uniquecountSelected = uniquecountPosCUT;
      } else if (selectedStatus == "TRASH"){
        var uniquecountPosTRASH = Session.get("ses_uniquecountPosTRASH");
        var uniquecountSelected = uniquecountPosTRASH;
      } else {
        var uniquecountSelected;
      }
      //console.log("uniquecountSelected" + uniquecountSelected);

      var uniquecountSelectedPosition = uniquecountSelected + 1;
      //console.log("uniquecountSelectedPosition: " + uniquecountSelectedPosition);

      if (actualStatus == selectedStatus) {
        alert("Actual status and Selected status are the same, \nselected order will be at last position \n:P")
      }

      // 
      Meteor.call('method_changeStatus', actualPosition, actualStatus, selectedStatus, uniquecountSelectedPosition, function(err, data) {
        //console.log("method_changeStatus: " + data);
      }); 

      // Smanji za jednu poziciju od aktuelne pozicije ispod tj pomeri za jednu poziciju gore sve ispod aktuelne
      Meteor.call('method_smanjizajedan', actualPosition, actualStatus, function(err, data) {
        //console.log("method_smanjizajedan: " + data);
      });  
      
      rm_EditOrder.hide();
    },

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
            var lengthsum = Number(lengthsumX).toFixed(2);

            var pcsbundle = Number(all[i]['Nr. Pcs Bundle']);

            var width = Number(all[i]['Marker Width [cm]']);
            var s = Number(all[i]['tot S']);
            var sonlayer = Number(all[i]['S']);
            var m = Number(all[i]['tot M']);
            var monlayer = Number(all[i]['M']);
            var l = Number(all[i]['tot L']);
            var lonlayer = Number(all[i]['L']);
            var xl = Number(all[i]['tot XL']);
            var xlonlayer = Number(all[i]['XL']);
            var xxl = Number(all[i]['tot XXL']);
            var xxlonlayer = Number(all[i]['XXL']);

            var status = Number(all[i]['SPREADER']);
            
            var orderd = all[i]['DATE'];
            //console.log("all[i]['DATE']: " + orderd);
            var orderdate = new Date(all[i]['DATE']);
            orderdate.setHours(2,0,0,0);

            var skala = all[i]['SKALA marker'];
            var sektor = all[i]['Sector'];
            var pattern = all[i]['Pattern'];
              
            /*
            if (status == "1" ){
              status = 'SP 1';
              var uniquecountPosSp1 = Session.get("ses_uniquecountPosSp1");
              var uniquecountPosSp1 = uniquecountPosSp1 + 1;
              Session.set("ses_uniquecountPosSp1", uniquecountPosSp1);
              setPos = uniquecountPosSp1;
            } else if (status == "2" ){
              status = 'SP 2';
              var uniquecountPosSp2 = Session.get("ses_uniquecountPosSp2");
              var uniquecountPosSp2 = uniquecountPosSp2 + 1;
              Session.set("ses_uniquecountPosSp2", uniquecountPosSp2);
              setPos = uniquecountPosSp2;     
            } else if (status == "3" ){
              status = 'SP 3';
              var uniquecountPosSp3 = Session.get("ses_uniquecountPosSp3");
              var uniquecountPosSp3 = uniquecountPosSp3 + 1;
              Session.set("ses_uniquecountPosSp3", uniquecountPosSp3);
              setPos = uniquecountPosSp3;     
            } else if (status == "4" ){
              status = 'MS 1';
              var uniquecountPosMs1 = Session.get("ses_uniquecountPosMs1");
              var uniquecountPosMs1 = uniquecountPosMs1 + 1;
              Session.set("ses_uniquecountPosMs1", uniquecountPosMs1);
              setPos = uniquecountPosMs1;    
            } else {

              */
              var uniquecountPosNA = Session.get("ses_uniquecountPosNA");
              var uniquecountPosNA = uniquecountPosNA + 1;
              Session.set("ses_uniquecountPosNA", uniquecountPosNA);
              //console.log("set ses_uniquecountPosNA: " + uniquecountPosNA);

              setPos = uniquecountPosNA;                             
              status = 'Not assigned';                            
              //setPos = 999;
            /*}*/

            
            Meteor.call('method_insertOrders', no, setPos, orderdate, komesa, marker, style, fabric, colorcode ,colordesc, bagno, layers, actuallayers, length, extra, lengthsum, pcsbundle, width, s, sonlayer, m, monlayer, l, lonlayer, xl, xlonlayer, xxl, xxlonlayer, status, skala, sektor, pattern, function(err, data) {
              console.log("method_insertOrders: " + data);

            });

           //One by One
           /*
            if ((orderd != 0) || (orderd)) { 
              Order.insert({No: no, Position: setPos , Date: orderdate, Komesa: komesa, Marker: marker, Style: style, Fabric: fabric, ColorCode: colorcode, ColorDesc: colordesc, Bagno: bagno, Layers: layers, LayersActual: actuallayers, Length: length, Extra: extra, LengthSum: lengthsum, PcsBundle: pcsbundle, Width: width, S: s, SonLayer: sonlayer, M: m, MonLayer: monlayer, L: l, LonLayer: lonlayer, XL: xl, XLonLayer: xlonlayer, XXL: xxl, XXLonLayer: xxlonlayer, Status: status, SkalaMarker: skala, Sector: sektor, Pattern: pattern}, 
                function(err, numberAffected, rawResponse) {
                  if (numberAffected == false) {
                    uniquecountPosNA = uniquecountPosNA - 1;                    
                    Session.set("ses_uniquecountPosNA", uniquecountPosNA);
                    console.log("a uniquecountPosNA -1 = " + uniquecountPosNA);

                  } else {

                    Session.set("ses_uniquecountPosNA", uniquecountPosNA);
                    console.log("a uniquecountPosNA +1 = " + uniquecountPosNA);
                  }
                }
              );
              
              setPos = 0;
              countSP2set = 0;
              countSP1set = 0; 

            } else {
              Order.insert({No: no, Position: setPos, Komesa: komesa, Marker: marker, Style: style, Fabric: fabric, ColorCode: colorcode , ColorDesc: colordesc, Bagno: bagno, Layers: layers, LayersActual: actuallayers, Length: length, Extra: extra, LengthSum: lengthsum, PcsBundle: pcsbundle, Width: width, S: s, SonLayer: sonlayer, M: m, MonLayer: monlayer, L: l, LonLayer: lonlayer, XL: xl, XLonLayer: xlonlayer, XXL: xxl, XXLonLayer: xxlonlayer, Status: status, SkalaMarker: skala, Sector: sektor, Pattern: pattern},
              function(err, numberAffected, rawResponse) {
                  if (numberAffected == false) {
                    uniquecountPosNA = uniquecountPosNA - 1;                    
                    Session.set("ses_uniquecountPosNA", uniquecountPosNA);
                    console.log("a uniquecountPosNA -1 = " + uniquecountPosNA);

                  } else {

                    Session.set("ses_uniquecountPosNA", uniquecountPosNA);
                    console.log("a uniquecountPosNA +1 = " + uniquecountPosNA);
                  }
                }
              );

              setPos = 0;
              countSP2set = 0;
              countSP1set = 0;
            }
            */
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

          for (var i = 0; i < all.length; i++) {
            //console.log(all[i]);

            var id = all[i]['_id'];
            var no  = Number(all[i]['No']);
            var position = Number(all[i]['Position']);
            var status = all[i]['Status'];
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
            var pcsbundle = Number(all[i]['PcsBundle'])
            var width = Number(all[i]['Width']);

            var s = Number(all[i]['S']);
            var sonlayer = Number(all[i]['SonLayer']);
            var s_cut = Number(all[i]['S_Cut']);
            var m = Number(all[i]['M']);
            var monlayer = Number(all[i]['MonLayer']);
            var m_cut = Number(all[i]['M_Cut']);
            var l = Number(all[i]['L']);
            var lonlayer = Number(all[i]['LonLayer']);
            var l_cut = Number(all[i]['L_Cut']);
            var xl = Number(all[i]['XL']);
            var xlonlayer = Number(all[i]['XLonLayer']);
            var xl_cut = Number(all[i]['XL_Cut']);
            var xxl = Number(all[i]['XXL']);
            var xxlonlayer = Number(all[i]['XXLonLayer']);
            var xxl_cut = Number(all[i]['XXL_Cut']);
            
            var priority = all[i]['Priority'];
            var priority = Number(all[i]['Priority']);

            var load = all[i]['Load'];
            var spread = all[i]['Spread'];
            var spreaddate = all[i]['SpreadDate'];
            if (spreaddate) {
              var spreaddate2 = new Date(spreaddate);  
              //var orderDateP = Date.parse(orderDate);
              //var orderDateM = moment(all[i]['Date']).format("DD-MM-YYYY");
              //var orderDateM2 = new Date(orderDateM);
            } else {
              spreaddate2 = "";
            }
            var spreadoperator = all[i]['SpreadOperator'];
            var cut = all[i]['Cut'];
            var cutdate = all[i]['CutDate'];
            if (cutdate) {
              var cutdate2 = new Date(cutdate);  
              //var orderDateP = Date.parse(orderDate);
              //var orderDateM = moment(all[i]['Date']).format("DD-MM-YYYY");
              //var orderDateM2 = new Date(orderDateM);
            } else {
              cutdate2 = "";
            }
            var cutoperator = all[i]['CutOperator'];

            var comment = all[i]['Comment'];
            var orderlink = all[i]['OrderLink'];

            var skala = all[i]['SKALA marker'];
            var sektor = all[i]['Sector'];
            var pattern = all[i]['Pattern'];

            var label = all[i]['LabelPrinted'];
            var cons = all[i]['Consumption'];

            //One by One
            //Order.insert({No: no, Date: orderDate, Created: orderCreated, Komesa: all[i]['Komesa'], Marker: all[i]['Marker'], Style: all[i]['Style'], Fabric: all[i]['Fabric'], ColorCode: all[i]['ColorCode'], ColorDesc: all[i]['ColorDesc'], Bagno: all[i]['Bagno'], Layers: layers, Length: length, Extra: extra, LengthSum: lengthsum, Width: width, S: s, M: m, L: l ,Status: all[i]['Status'], Priority: priority});    
            
            Order.insert({No: no, Position: position, Status: status, Date: orderDate2, Komesa: komesa, Marker: marker, Style: style, Fabric: fabric, ColorCode: colorcode, ColorDesc: colordesc, Bagno: bagno, Layers: layers, LayersActual: layersactual, Length: length, Extra: extra, LengthSum: lengthsum, PcsBundle: pcsbundle, Width: width, S: s, SonLayer: sonlayer, S_Cut: s_cut, M: m, MonLayer: monlayer, M_Cut: m_cut, L: l, LonLayer: lonlayer, L_Cut: l_cut, XL: xl, XLonLayer: xlonlayer, XL_Cut: xl_cut, XXL: xxl, XXLonLayer: xxlonlayer, XXL_Cut: xxl_cut, Load: load, Spread: spread, SpreadDate: spreaddate2, SpreadOperator: spreadoperator ,Cut: cut, CutDate: cutdate2, CutOperator: cutoperator,Comment: comment, OrderLink: orderlink, SkalaMarker: skala, Sector: sektor, Pattern: pattern, LabelPrinted: label, Consumption: cons});
            // Can not insert order created and _id , this values is automaticali created
          } 
      }
      reader.readAsText(file_a);
      rm_ImportOrder.hide();
    }
  });

  Template.tmp_ExportOrder.helpers({
    order: function() {
      return Order.find(); // orders form subscribe
    }
  });

  Template.tmp_Operators.helpers({
    operators: function() {
      return Operators.find(); // operators form subscribe                                       
    },
    makeUniqueID: function  () {
      return "update-each-" + this._id;_
    },
    options: function () {
      return  [
            {label: "Active", value: "Active"},
            {label: "Not active", value: "Not active"}
            ]
    },
    isAdmin: function() {
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
    /*
    options: function () {
    return [
      {
        optgroup: "Fun Years",
        options: [
          {label: "Active", value: "Active"},
          {label: "Not active", value: "Not active"}
        ]
      },
      {
        optgroup: "Boring Years",
        options: [
          {label: "2011", value: 2011},
          {label: "2010", value: 2010},
          {label: "2009", value: 2009}
        ]
      }
    ];
    }*/
  });

  Template.tmp_Operators.events({
    'click #newoperators' : function (e, t) {
      var rd_newoperators = ReactiveModal.initDialog(rm_NewOperators);
      rd_newoperators.show();
    }
  });

  Template.tmp_ExportOrder.events({
      'click #download_from_textarea' : function (e, t) {
        //var json = $.parseJSON($("#json").val());
        //var csv = JSON2CSV(json);
        
        //var listo  = $("#listo").val();
        var textarea_json  = $("#textarea_json").val();
          //console.log(listo);
        window.open("data:text/csv;charset=utf-8," + escape(textarea_json));
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
  method_countPosSp3: function() {
    return Order.find({Status: 'SP 3'}).count();
  },
  method_countPosMs1: function() {
    return Order.find({Status: 'MS 1'}).count();
  },
  method_uniquecountPosNA: function() {
    var order = Order.find({Status: 'Not assigned'}).fetch();
    var posarray = [];
    for (var i = 0; i < order.length; i++) {
        pos = order[i].Position;
        posarray.push(pos);
    }
    if (isNaN(posarray[0])) {
      return 0;
    } else {
      var largest = Math.max.apply(null, posarray);
      return largest;
    }
  },
  method_uniquecountPosSp1: function() {
    var order = Order.find({Status: 'SP 1'}).fetch();
    var posarray = [];
    for (var i = 0; i < order.length; i++) {
        pos = order[i].Position;
        posarray.push(pos);
    }
    if (isNaN(posarray[0])) {
      return 0;
    } else {
      var largest = Math.max.apply(null, posarray);
      return largest;
    }
  },
  method_uniquecountPosSp2: function() {
    var order = Order.find({Status: 'SP 2'}).fetch();
    var posarray = [];
    for (var i = 0; i < order.length; i++) {
        pos = order[i].Position;
        posarray.push(pos);
    }
    if (isNaN(posarray[0])) {
      return 0;
    } else {
      var largest = Math.max.apply(null, posarray);
      return largest;
    }
  },
  method_uniquecountPosSp3: function() {
    var order = Order.find({Status: 'SP 3'}).fetch();
    var posarray = [];
    for (var i = 0; i < order.length; i++) {
        pos = order[i].Position;
        posarray.push(pos);
    }
    if (isNaN(posarray[0])) {
      return 0;
    } else {
      var largest = Math.max.apply(null, posarray);
      return largest;
    }
  },
  method_uniquecountPosMs1: function() {
    var order = Order.find({Status: 'MS 1'}).fetch();
    var posarray = [];
    for (var i = 0; i < order.length; i++) {
        pos = order[i].Position;
        posarray.push(pos);
    }
    if (isNaN(posarray[0])) {
      return 0;
    } else {
      var largest = Math.max.apply(null, posarray);
      return largest;
    }
  },
  method_uniquecountPosCUT: function() {
    var order = Order.find({Status: 'CUT'}).fetch();
    var posarray = [];
    for (var i = 0; i < order.length; i++) {
        pos = order[i].Position;
        posarray.push(pos);
    }
    if (isNaN(posarray[0])) {
      return 0;
    } else {
      var largest = Math.max.apply(null, posarray);
      return largest;
    }
  },
  method_uniquecountPosF: function() {
    var order = Order.find({Status: 'Finished'}).fetch();
    var posarray = [];
    for (var i = 0; i < order.length; i++) {
        pos = order[i].Position;
        posarray.push(pos);
    }
    if (isNaN(posarray[0])) {
      return 0;
    } else {
      var largest = Math.max.apply(null, posarray);
      return largest;
    }
  },
  method_uniquecountPosTRASH: function() {
    var order = Order.find({Status: 'TRASH'}).fetch();
    var posarray = [];
    for (var i = 0; i < order.length; i++) {
        pos = order[i].Position;
        posarray.push(pos);
    }
    if (isNaN(posarray[0])) {
      return 0;
    } else {
      var largest = Math.max.apply(null, posarray);
      return largest;
    }
  },
  method_arrayofPosNA: function() {
    var order = Order.find({Status: 'Not assigned'}).fetch();
      var posarray = [];

      for (var i = 0; i < order.length; i++) {
        pos = order[i].Position;
        posarray.push(pos);
      }
    posarray.sort(function(a, b){return a-b});
    return posarray;
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
  method_arrayofPosSp3: function() {
    var order = Order.find({Status: 'SP 3'}).fetch();
      var posarray = [];

      for (var i = 0; i < order.length; i++) {
        id = order[i]._Id;
        pos = order[i].Position;
        posarray.push(pos);
      }
    posarray.sort(function(a, b){return a-b});
    return posarray;
  },
  method_arrayofPosMs1: function() {
    var order = Order.find({Status: 'MS 1'}).fetch();
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
    statusarray = ["Not assigned","SP 1","SP 2","SP 3","MS 1"/*,"CUT"*/, "TRASH"];
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
  },
  method_stavipozna0: function (actualPosition, actualStatus){
    var order = Order.find({Position: actualPosition, Status: actualStatus }).fetch();
      for (var i = 0; i < order.length; i++) {
        Order.update({ _id: order[i]._id},
          {$set: {Position: 0}},
          
          {multi: true}
        ); 
        
      }
    return "Not found method_stavipozna0";
  },
  method_povecajzajedan: function(Position, Status){
    var order = Order.find({Position: {$gte: Position}, Status: Status }).fetch();
    for (var i = 0; i < order.length; i++) {
        Order.update({ _id: order[i]._id},
          {$inc: {Position: 1}}, 
          {multi: true}
        );
    }  
    return "Not found method_povecajzajedan";
  },
  method_ubacinapoz: function (actualPosition, actualStatus, selectedPosition){
    var order = Order.find({Position: 0, Status: actualStatus }).fetch();
      for (var i = 0; i < order.length; i++) {
        Order.update({ _id: order[i]._id},
          {$set: {Position: selectedPosition}},
        
          {multi: true}
        ); 
        
      }
    return "Not found method_ubacinapoz";
  },
  method_linkpoz: function (actualStatus, selectedPosition){
    var order = Order.find({Position: selectedPosition, Status: actualStatus }).fetch();
      for (var i = 0; i < order.length; i++) {
        Order.update({ _id: order[i]._id},
          {$set: {OrderLink: true}},
        
          {multi: true}
        ); 
        
      }
    return "Not found method_linkpoz";
  },
  method_unlinkpoz: function (actualStatus, selectedPosition){
    var order = Order.find({Position: selectedPosition, Status: actualStatus }).fetch();
      for (var i = 0; i < order.length; i++) {
        Order.update({ _id: order[i]._id},
          {$set: {OrderLink: false}},
          
          {multi: true}
        ); 
        
      }
    return "Not found method_unlinkpoz";
  },
  method_ubacinapozVise: function (actualPosition, actualStatus, selectedPosition){
    var order = Order.find({Position: 0, Status: actualStatus }).fetch();
      for (var i = 0; i < order.length; i++) {
        Order.update({ _id: order[i]._id},
          {$set: {Position: selectedPosition}},
        
          {multi: true}
        );
        
      }
    return "Not found method_ubacinapozVise";
  },
  method_changeStatus: function(actualPosition, actualStatus, selectedStatus, uniquecountSelectedPosition){
    var order = Order.find({Position: actualPosition, Status: actualStatus }).fetch();
      for (var i = 0; i < order.length; i++) {
        Order.update({ _id: order[i]._id},
          {$set: {Status: selectedStatus, Position: uniquecountSelectedPosition}},
          
          {multi: true}
        ); 
        
      }
    return "Not found method_changeStatus";
  },
  method_loadOrder: function (actualPosition, actualStatus, userEditLoad){
    var order = Order.find({Position: actualPosition, Status: actualStatus }).fetch();
      for (var i = 0; i < order.length; i++) {
        var layers = order[i].Layers; // set layers to actual layers

        Order.update({ _id: order[i]._id},
          {$set: {Load: userEditLoad, LayersActual: layers}},
           
          {multi: true}
        ); 
        
      }
    return "Not found method_loadOrder";
  }, 
  method_spreadOrder: function (actualPosition, actualStatus, selectedStatus, uniquecountSelectedPosition, userEditSpread, spreadDate, selectedOperatorSpreader) {
    var order = Order.find({Position: actualPosition, Status: actualStatus }).fetch();
      for (var i = 0; i < order.length; i++) {
        var oreder_id = order[i]._id;
        var layers = order[i].Layers;
        var layersactual = order[i].LayersActual;

        if (layersactual) {
          var LayersToCount = layersactual;
        } else {
          var LayersToCount = layers;
        }

        if (order[i].SonLayer) {
          var SonLayer = order[i].SonLayer;
        } else {
          var SonLayer = 0;
          Order.update({ _id: order[i]._id, No: order[i].No}, 
            {$set: {SonLayer: 0}}
          );
        }
        if (order[i].MonLayer) {
          var MonLayer = order[i].MonLayer;
        } else {
          var MonLayer = 0;
          Order.update({ _id: order[i]._id, No: order[i].No}, 
            {$set: {MonLayer: 0}}
          );
        }
        if (order[i].LonLayer) {
          var LonLayer = order[i].LonLayer;  
        } else  {
          var LonLayer = 0;
          Order.update({ _id: order[i]._id, No: order[i].No}, 
            {$set: {LonLayer: 0}}
          );
        }
        if (order[i].XLonLayer) {
          var XLonLayer = order[i].XLonLayer;  
        } else {
          var XLonLayer = 0;
          Order.update({ _id: order[i]._id, No: order[i].No}, 
            {$set: {XLonLayer: 0}}
          );
        }
        if (order[i].XXLonLayer) {
          var XXLonLayer = order[i].XXLonLayer;  
        } else {
          var XXLonLayer = 0;
          Order.update({ _id: order[i]._id, No: order[i].No}, 
            {$set: {XXLonLayer: 0}}
          );
        }

        var S = LayersToCount * SonLayer;
        var M = LayersToCount * MonLayer;
        var L = LayersToCount * LonLayer;
        var XL = LayersToCount * XLonLayer;
        var XXL = LayersToCount * XXLonLayer;
        var S_Cut = S;
        var M_Cut = M;
        var L_Cut = L;
        var XL_Cut = XL;
        var XXL_Cut = XXL;

        Order.update({ _id: order[i]._id},
          {$set: {Position: uniquecountSelectedPosition, Status: selectedStatus, Spread: userEditSpread, SpreadDate: spreadDate, S: S, M: M, L: L, XL: XL, XXL: XXL, S_Cut: S_Cut, M_Cut: M_Cut, L_Cut: L_Cut, XL_Cut: XL_Cut, XXL_Cut: XXL_Cut, SpreadOperator: selectedOperatorSpreader}},
          //{$inc: {Position: -1}}, 
          {multi: true}
        ); 
        //return order[i].No;
      }
    return "Not found method_spreadOrder";
  },
  method_cutOrder: function (actualPosition, actualStatus, selectedStatus, uniquecountSelectedPosition, userEditCut, cutDate, selectedOperatorCutter) {
    var order = Order.find({Position: actualPosition, Status: actualStatus }).fetch();
      for (var i = 0; i < order.length; i++) {
        var oreder_id = order[i]._id;
        var layers = order[i].Layers;
        var layersactual = order[i].LayersActual;
      
        Order.update({ _id: order[i]._id},
          {$set: {Position: uniquecountSelectedPosition, Status: selectedStatus, Cut: userEditCut, CutDate: cutDate, CutOperator: selectedOperatorCutter}},
          //{$inc: {Position: -1}}, 
          {multi: true}
        ); 
        //return order[i].No;
      }
    return "Not found method_cutOrder";
  },
  method_refreshSum: function (){
    var order_all = Order.find().fetch();

      for (var i = 0; i < order_all.length; i++) {
        
        var length = Number(order_all[i].Length);
        var extra = Number(order_all[i].Extra);
        var layers = Number(order_all[i].Layers);
        var layersactual = Number(order_all[i].LayersActual);
        var sonlayer = Number(order_all[i].SonLayer);
        var monlayer = Number(order_all[i].MonLayer);
        var lonlayer = Number(order_all[i].LonLayer);
        var xlonlayer = Number(order_all[i].XLonLayer);
        var xxlonlayer = Number(order_all[i].XXLonLayer);

        if (layersactual || (layersactual != 0)) {
          LayersToCount = layersactual;
        } else {
          LayersToCount = layers;
        }

        var sum = Number((length + (extra/100)) * LayersToCount);
        var sumf =sum.toFixed(2);
       
        if (sumf == "NaN") {
          sumf = 0;
        }

        //S M L XL XXL
        var Snew = Number(sonlayer * LayersToCount);
        var Mnew = Number(monlayer * LayersToCount);
        var Lnew = Number(lonlayer * LayersToCount);
        var XLnew = Number(xlonlayer * LayersToCount);
        var XXLnew = Number(xxlonlayer * LayersToCount);

        Order.update({_id: order_all[i]._id},
          {
            $set: { LengthSum: sumf /*, S: Snew, M: Mnew, L: Lnew, XL: XLnew, XXL: XXLnew */},
          }, 
          {
            multi: true,
          }
        );
      }
      
      return "LengthSum fields are refreshed!";
   },
   method_insertOrders: function (no, setPos, orderdate, komesa, marker, style, fabric, colorcode ,colordesc, bagno, layers, actuallayers, length, extra, lengthsum, pcsbundle, width, s, sonlayer, m, monlayer, l, lonlayer, xl, xlonlayer, xxl, xxlonlayer, status, skala, sektor, pattern) {
    
    var order = Order.find({Status: 'Not assigned'}).fetch();
    var posarray = [];
    for (var i = 0; i < order.length; i++) {
        pos = order[i].Position;
        posarray.push(pos);
    }
    if (isNaN(posarray[0])) {
      var largest =  0;
    } else {
      var largest = Math.max.apply(null, posarray);
      //return largest;
    }

    //var uniquecountPosNA = Session.get("ses_uniquecountPosNA");
    var uniquecountPosNA = largest + 1;
    //Session.set("ses_uniquecountPosNA", uniquecountPosNA);
    console.log("uniquecountPosNA: " + uniquecountPosNA);

    setPos = uniquecountPosNA;                             
    status = 'Not assigned';

    Order.insert({No: no, Position: setPos , Date: orderdate, Komesa: komesa, Marker: marker, Style: style, Fabric: fabric, ColorCode: colorcode, ColorDesc: colordesc, Bagno: bagno, Layers: layers, LayersActual: actuallayers, Length: length, Extra: extra, LengthSum: lengthsum, PcsBundle: pcsbundle, Width: width, S: s, SonLayer: sonlayer, M: m, MonLayer: monlayer, L: l, LonLayer: lonlayer, XL: xl, XLonLayer: xlonlayer, XXL: xxl, XXLonLayer: xxlonlayer, Status: status, SkalaMarker: skala, Sector: sektor, Pattern: pattern}, 
      function(err, numberAffected, rawResponse) {
        if (numberAffected == false) {

          //uniquecountPosNA = uniquecountPosNA - 1;                    
          //Session.set("ses_uniquecountPosNA", uniquecountPosNA);
          //console.log("a uniquecountPosNA -1 = " + uniquecountPosNA);
          console.log("a uniquecountPosNA -1 = " + uniquecountPosNA);

        } else {

          //Session.set("ses_uniquecountPosNA", uniquecountPosNA);
          //console.log("a uniquecountPosNA +1 = " + uniquecountPosNA);
          console.log("a uniquecountPosNA +1 = " + uniquecountPosNA);
        }
      }
    );

   }
  
  
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
  });

  Meteor.publish("filter_spreader2", function(){
    return Order.find({ Status: "SP 2"});
  });

  Meteor.publish("filter_spreader3", function(){
    return Order.find({ Status: "SP 3"});
  });

  Meteor.publish("filter_spreaderm1", function(){
    return Order.find({ Status: "MS 1"});
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

  Meteor.publish("filter_label", function(Daysbefore, Daysafter){
    return Order.find({
    $and: [
      { $or: [
          { Status: "CUT" },
          { Status: "Finished" }
        ]},
      { $or: [ 
          { LabelPrinted: false },  
          { LabelPrinted: { $exists: false }}
        ]},
      { $and: [ 
          {SpreadDate: {$gte: Daysbefore, $lt: Daysafter}}
        ]},
      ]
    })
  });

  Meteor.publish("filter_cons", function(Daysbefore, Daysafter){
    return Order.find({
    $and: [
      { $or: [
          { Status: "CUT" },
          { Status: "Finished" }
        ]},
      { $and: [ 
          {SpreadDate: {$gte: Daysbefore, $lt: Daysafter}}
        ]},
      ]
    })
  });

  Meteor.publish("filter_statusfilter", function(status){
    return Order.find({ 
      $and: [
      {Status: status},
      ]
    })
  });

  Meteor.publish("filter_statusfilterwithCutDate", function(status, Daysbefore , Daysafter){
    return Order.find({ 
      $and: [
      {Status: status},
      {CutDate: {$gte: Daysbefore, $lt: Daysafter}}
      ]
    })
  });

  Meteor.publish("filter_statusfilterwithDate", function(status, Daysbefore , Daysafter){
    return Order.find({ 
      $and: [
      {Status: status},
      {Date: {$gte: Daysbefore, $lt: Daysafter}}
      ]
    })
  });

  Meteor.publish("filter_allOrderswithDate", function(Daysbefore , Daysafter){
    return Order.find({Date: {$gte: Daysbefore, $lt: Daysafter}})
  });

  Meteor.publish("filter_allOrderswithSpreadDate", function(Daysbefore , Daysafter){
    return Order.find({SpreadDate: {$gte: Daysbefore, $lt: Daysafter}})  
  });

  Meteor.publish("filter_allOrderswithCutDate", function(Daysbefore , Daysafter){
    return Order.find({CutDate: {$gte: Daysbefore, $lt: Daysafter}})
  });

  Meteor.publish("filter_allOperators", function(){
    return Operators.find();
  });

  Operators.allow({   
    update: function () {
      return true;
    }
  });


}

var admin = ""; //123123
var guest = ""; // 111111 
var sp11 = "";  // 111111
var sp12 = "";  // 121212
var sp13 = "";  // 131313
var sp21 = "";  // 212121
var sp22 = "";  // 222222
var sp23 = "";  // 232323
var sp31 = "";  // 313131
var sp32 = "";  // 323232 
var sp33 = "";  // 333333
var cut1 = "";  // c1c1c1 //Gordon
var cut2 = "";  // c2c2c2 //Gordon
var mor1 = "";  // m1m1m1 //Zalli
var mor2 = "";  // m2m2m2 //Zalli
var lec1 = "";  // l1l1l1 //Zalli
var lec2 = "";  // l2l2l2 //Zalli
var ms11 = "";  // 111111
var ms12 = "";  // 121212
var label = ""; // llllll
var cons = "";  // cccccc

// kill -9 `ps ax | grep node | grep meteor | awk '{print $1}'`

// Gordon
// export MONGO_URL=mongodb://172.27.161.216:27017/spread  
// export MONGO_URL=mongodb://localhost:27017/spread

// Zalli
// export MONGO_URL=mongodb://172.27.57.181:27017/spread 

// STATUS = ['Not assigned','SP 1','SP 2','SP 3','CUT','Finished']

// meteor add accounts-base
// meteor add accounts-password
// meteor add accounts-ui
// meteor add jquery
// meteor mrt:jquery-ui 
// meteor add glasser:jqueryui

// meteor add mrt:bootstrap-3  // meteor add bootstrap
//meteor add mrt:jquery-ui-bootstrap 
//meteor add mrt:accounts-ui-bootstrap-3
//meteor add ctjp:meteor-bootstrap-switch

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

//meteor add naxio:flash
// meteor add mrt:flash-messages-plus
// meteor add mrt:flash-messages
//meteor add aldeed:delete-button