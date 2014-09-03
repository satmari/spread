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

	})

	//Meteor.subscribe('order');
	/*Meteor.autosubscribe(function () {
		var ses = Session.get("ses_namefilter");
		console.log(ses);

		if ( ses == "" ){ 
			Meteor.subscribe('orderAll');
		} else {
			Meteor.subscribe('order', Session.get("ses_namefilter"));
		}
	});*/	

	Meteor.autosubscribe(function () {
		var ses_datefilter = Session.get("ses_datefilter");
		var ses_existdate = Session.get("ses_datenotexist");
		//console.log("Autosubcribe sesion: " + ses + " , typeof: " + typeof ses);
		

		if ( ses_existdate == true ) {
			Meteor.subscribe('orderWithoutDate');
		} else if ( ses_datefilter == "" ) { 
			Meteor.subscribe('orderAll');
		} else {
			Meteor.subscribe('order', Session.get("ses_datefilter"));
		}

	});

	// Filter Collection
	OrderFilter = new Meteor.FilterCollections(Order, {
		template: 'orderList',
		name: "orderFilter",

		sort:{
    		//order : ['desc', 'asc'],
    		//defaults: [
      		//	['orderCreated', 'desc'],
      		//]
  		},
  		filters: {
    		"orderName": {
      		orderName: 'orderName',
      		operator: ['$regex', 'i'],
      		condition: '$and',
      		searchable: 'required'
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
        		rowsPerPage: 100,
        		showFilter: true,
    			showNavigation: 'auto',
    			fields: [
    			//{ key: '_id', label: 'ID' },
    			{ key: 'orderDate', label: 'Order Date',
    				fn: function (value) {
    					return moment(value).format("YYYY-MM-DD");
    					//return moment(value).format("DD-MM-YYYY");
    				}, sort: 'descending'
    			 },
    			{ key: 'orderName', label: 'Order Name' },
    			//{ key: 'orderCreated', label: 'Order Created' },
    			{ key: 'orderFileName', label: 'FileName' },
    			{ key: 'orderModel', label: 'Model' },
    			{ key: 'orderFabric', label: 'Fabric' },
    			{ key: 'orderBagno', label: 'Bagno' },
    			{ key: 'orderColor', label: 'Color' },
    			{ key: 'orderLayers', label: 'Layers' },
    			{ key: 'orderLength', label: 'Length' },
    			{ key: 'orderExtra', label: 'Extra' },
    			{ key: 'orderLengthSum', label: 'LengthSum' },
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
    		//	class: 'btn-danger',
    		//	label: 'Cancel'
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
    	modalDialogClass: "modal-dialog", //optional
    	modalBodyClass: "modal-body", //optional
    	modalFooterClass: "modal-footer",//optional
    	closable: false,
    	buttons: {
    		//"cancel": {
    		//	class: 'btn-danger',
    		//	label: 'Cancel'
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
		//type: 'type-info',   //type-default, type-info, type-primary, 'type-success', 'type-warning' , 'type-danger' 
    	//size: '',
    	template: Template.tmp_ExportOrder,	
    	title: "Export order",
    	//modalBody: "Helll0",
    	//modalDialogClass: "modal-dialog", //optional
    	//modalBodyClass: "modal-body", //optional
    	//modalFooterClass: "modal-footer",//optional
    	closable: false,
    	buttons: {
    		//"cancel": {
    		//	class: 'btn-danger',
    		//	label: 'Cancel'
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
		//type: 'type-info',   //type-default, type-info, type-primary, 'type-success', 'type-warning' , 'type-danger' 
    	//size: '',
    	template: Template.tmp_ImportOrder,	
    	title: "Import order",
    	//modalBody: "Helll0",
    	//modalDialogClass: "modal-dialog", //optional
    	//modalBodyClass: "modal-body", //optional
    	//modalFooterClass: "modal-footer",//optional
    	closable: false,
    	buttons: {
    		//"cancel": {
    		//	class: 'btn-danger',
    		//	label: 'Cancel'
      		//},
      		"ok": {
        		closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
        		class: 'btn-info',
        		label: 'Back'
      		}
    	}
	};



	// Reactive table helper (for update/edit orders)
	Template.tmp_AddNewOrder.helpers({
  		//editingDoc: function editingDocHelper() {
    	//	return Order.findOne({_id: Session.get("selectedDocId")});
  		//}
	});

	SimpleSchema.debug = true;
	//UI.registerHelper("Schemas", Schemas);
	
	// Accounts base - Only Username and pass requered
	Accounts.ui.config({
		passwordSignupFields: 'USERNAME_ONLY'
	});

	// Tamplate Order List
	//Template.orderList.orders = function () {
	//	//return Order.find(); 										
	//};

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

	Template.orderForm.showLoadedChecked = function () {
    	//var cLoaded = Session.get('checkbox-orderLoaded', event.target.checked);
		//console.log("cLoaded: " +	cLoaded);

		//if (cLoaded === true) {
		//	return "checked";	
		//}
		//else {
		//	return "";			
		//}	
  	};

	Template.orderForm.showSpreadedChecked = function () {
    	//var cSpreaded = Session.get('checkbox-orderSpreaded', event.target.checked);
		//console.log("cSpreaded: " +	cSpreaded);
		
		//if (cSpreaded === true) {
		//	return "checked";	
		//}
		//else {
		//	return "";			
		//}	
  	};

  	// Datepickers settings (bootstrap3-datepicker) 
	Template.orderForm.rendered = function() {
   	 $('#orderDate').datepicker({
		format: "dd-mm-yyyy",
  		todayBtn: "linked",
    	autoclose: true,
   		todayHighlight: true
		});
	};

	Template.nav.rendered = function() {
    	//$('#filterOrderDate').date({
		//	format: "yyyy-mm-dd",
  		//	todayBtn: "linked",
    	//	autoclose: true,
   		//	todayHighlight: true
		//	});
	};

	Template.orderAutoForm.rendered = function() {
    	$('#orderPickerDate').datepicker({
		format: "yyyy-mm-dd",
  		todayBtn: "linked",
    	autoclose: true,
   		todayHighlight: true
		});
	};

	// Navigation events
	Template.nav.events({
		'click #btnfilterOrderDate': function (e, t) {

			Session.set("ses_datefilter", "");
			console.log("Delete-ses_datefilter: " + Session.get("ses_datefilter"));

			$('#filterOrderDate').val("");
		},

		'change #filterOrderDate': function (e, t) {
			//var datesel = $('#filterOrderDate').datepicker({ dateFormat: 'dd-mm-yyyy' }).val();
			//console.log("filterOrderDate - change: " + datesel);

			//var datesel = $('#filterOrderDate').datepicker().val();
			var datesel = $('#filterOrderDate').val();

			var datesel1 = new Date(datesel); 
			//var date0 = moment(datesel).format('YYYY/MM/DD HH:mm:ss ZZ'); 
			//var date00 = new Date(moment(datesel).format('YYYY/MM/DD HH:mm:ss ZZ')); 
			//var date1 = moment(datesel).format();
			//var date11 = new Date(moment(datesel).format());
			//var date2 = moment(datesel).format('llll');
			//var date22 = new Date(moment(datesel).format('llll'));
			//var date3 = new Date(datesel); //DateTimeZone.forId( "Asia/Manila" ) 
			//var date4 = String(new Date(datesel));
			//var date5 = ISODate(Date(datesel));
			//var date5 = datesel.toISOString();

			//console.log("datesel: " + datesel);
			//console.log("new Date(datesel): " + datesel1);
			//console.log("date0: " + date0 + " , type: " + typeof date0);
			//console.log("date00: " + date00 + " , type: " + typeof date00);
			//console.log("date1: " + date1 + " , type: " + typeof date1);
			//console.log("date11: " + date11 + " , type: " + typeof date11);
			//console.log("date2: " + date2 + " , type: " + typeof date2);
			//console.log("date22: " + date22 + " , type: " + typeof date22);
			//console.log("date3: " + date3 + " , type: " + typeof date3);
			//console.log("date4: " + date4 + " , type: " + typeof date4);
			//console.log("date5: " + date5 + " , type: " + typeof date5);
			//console.log("date4: " + date4 + " , type: " + typeof date4);

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

		/*'keypress #filterName': function  (e, t) {
			if (e.keyCode === 13 ) {
				Session.set("ses_namefilter", e.currentTarget.value); // postavlja se vrednost za limitiranje
				console.log(Session.get("ses_namefilter"));

			}	
		}*/

		'change #orderWithoutDate': function (e, t) {
			//console.log("orderWithoutDate: checked" + this.checked);

			/*if(jQuery(this).checked) {
				console.log("orderWithoutDate: checked");
    		}

    		if (jQuery(this).is(':checked')) {
        			alert("Checked");
    			} 
    		*/	

    		if ($('#orderWithoutDate').prop('checked')){
    			console.log("orderWithoutDate: checked");
    			Session.set("ses_datenotexist", true);
    		} else {
    			console.log("orderWithoutDate: unchecked");
    			Session.set("ses_datenotexist", false);
    		}
        },

        'click #export_orders': function (e) {    
        	console.log("click on Export Orders");
        	//oredrFind = Order.find();
        	orderFetch = Order.find().fetch();
        	//orderFetch_ID = Order.find().fetch()._id;
        	
        	//console.log(orderFetch);
        	//console.log(oredrFind);
        	//console.log(orderFetch_ID);

        	//alert(orderFetch);
        	//alert(oredrFind);
        	//alert(orderFetch_ID);

     		//csv = json2csv(orderFetch, true, true)     

     		//somearray = [{"Id":1,"UserName":"Sam Smith"},
     		//        	   {"Id":2,"UserName":"Fred Frankly"},
			//			   {"Id":3,"UserName":"Zachary Zupers"}];

			//$.each($.parseJSON(somearray), function(k, v) {
  			//	alert(k + ' is ' + v);
			//})


			for (var key in orderFetch) {
				//alert("Key: " + key + " value: " + somearray[key]);

				txtarray = "{"

     			for (var key1 in orderFetch[key]) {
	    			//alert("Key: " + key1 + " ,value: " + orderFetch[key][key1]);

	    			//var fruits = [];
					//fruits.push(key1); 
					//alert(fruits);

					//var textfield 
					//textfield = "{'" + key1 + "':'" + orderFetch[key][key1] + "'}," 
					
					txtarray = txtarray + "'" + key1 + "':'" + orderFetch[key][key1] + "'," 
					//console.log(textfield);
					//var textfieldall = textfield.concat(textfield);
     			}
     			
     			txtarray = txtarray + "}"
     		}

     		//console.log(txtarray);
     		//console.log("SVE: " + textfieldall);

     		csv = json2csv(orderFetch, true, true)     
      		e.target.href = "data:text/csv;charset=utf-8," + escape(csv) ;
      		window.open("data:text/csv;charset=utf-8," + escape(csv));
      		//e.target.download = "orders.csv";    
    	},
    	'click #export_order' : function (e, t) {

			var rd_export_order = ReactiveModal.initDialog(rm_ExportOrder);
			
  			rd_export_order.show();

    	},
    	'click #import_order' : function (e, t) {

    		var rd_import_order = ReactiveModal.initDialog(rm_ImportOrder);
			
  			rd_import_order.show();

    	}
	});
	
	Template.orderForm.events({
		'click #addOrder': function (e, t){
	
			//	Dates
			var oDate = t.find("#orderDate");
			console.log("orderDate: " + orderDate.value);
			
			//var now = new Date();
			//console.log("now: " + now);
			//var oCreatedDate = now.format("dd-m-yy");
			
			//var oCreatedDate = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
			//var oCreatedDate = now.format("dd-mm-yyyy, HH:MM:ss");	
			//console.log("oCreatedDate: " + oCreatedDate);
			
			//var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
			//var d = new Date();
			//var curr_date = d.getDate();
			//var curr_month = d.getMonth();
			//var curr_year = d.getFullYear();
			//var oCreatedDate = curr_date + "-" + m_names[curr_month] + "-" + curr_year;
			//var oCreatedDate = curr_date + "-" + curr_month + "-" + curr_year;
			//console.log("oCreatedDate: " + oCreatedDate);

			// Moment js
			var now = moment();
			//console.log("moment: "+ now);
			var oCreatedDate = now;	
			console.log("oCreatedDate: "+ oCreatedDate);
			var oCreatedDateNumber = Number(oCreatedDate);	
			//var oCreatedDateNumber = parseInt(oCreatedDate,10); // wrong	
			console.log("oCreatedDateNumber: "+ oCreatedDateNumber);

			var oCreatedDateFormat = moment(oCreatedDateFormat).format("YYYY-MM-DD, HH:mm:ss");
			console.log("oCreatedDateFormat: " + oCreatedDateFormat);
		
			//	Data
			var oName = t.find("#orderName");
			var oFileName = t.find("#orderFileName");
			var oModel = t.find("#orderModel");
			var oFabric = t.find("#orderFabric");
			var oBagno = t.find("#orderBagno");
			var oPriority = t.find("#orderPriority");

			// Numbers
			var oLayers = t.find("#orderLayers");
			var oLayersN = parseFloat(oLayers.value, 10);
			//var oLayersN =  parseFloat(Math.round(oLayers.value * 100) / 100).toFixed(2);
			var oLength = t.find("#orderLength");
			var oLengthN = parseFloat(oLength.value, 10);
			//var oLengthN = parseFloat(Math.round(oLength.value * 100) / 100).toFixed(2);
			var oExtra = t.find("#orderExtra");
			var oExtraN = parseFloat(oExtra.value, 10);
			//var oExtraN = parseFloat(Math.round(oExtra.value * 100) / 100).toFixed(2);
			//var oLengthSum = t.find("#orderLengthSum");

			var oLengthSum = (oLengthN + oExtraN) * oLayersN;
			console.log("oLengthSum: " + oLengthSum);
			oLengthSum = parseFloat(Math.round(oLengthSum * 100) / 100).toFixed(2);
			console.log("oLengthSum (format): " + oLengthSum);
			//parseFloat(Math.round(num3 * 100) / 100).toFixed(2);
			
			//	Checkboxes
			var oLoaded = Session.get('checkbox-orderLoaded', event.target.checked);
			var oSpreaded = Session.get('checkbox-orderSpreaded', event.target.checked);
			
			console.log("oLengthN: " + oLengthN);
			console.log("oExtraN: " + oExtraN);
			console.log("oLayersN: " + oLayersN);
			console.log("oLengthSum: " + oLengthSum);

			Order.insert({orderDate: oDate.value,orderCreated:oCreatedDateNumber,orderName:oName.value,orderFileName:oFileName.value,orderModel:oModel.value,orderFabric:oFabric.value,orderBagno:oBagno.value,orderLayers:oLayers.value,orderLength:oLength.value,orderExtra:oExtra.value,orderLengthSum:oLengthSum,orderPriority:oPriority.value,orderLoaded:oLoaded,orderSpreaded:oSpreaded},{validationContext: "insertOrder"},function(error, result) {
  				//console.log("Greska!!!");
				  //The list of errors is available on `error.invalidKeys` or by calling Books.simpleSchema().namedContext().invalidKeys()
					//The list of errors is available by calling Books.simpleSchema().namedContext("insertForm").invalidKeys()
					var err = Order.simpleSchema().namedContext("insertOrder").invalidKeys()
					console.log("err: " + err);
						
			});

			// ako unosis oCreatedDate (now) string - Invalid date (zato sto je vec definisano u MongoDB kao string)
			// ako unosis new Date - objekat je date ali sa -2 sata ISODate("2014-08-17T19:25:35.162Z")
			// ako unosis Number - dobijas double 

			oDate.value = "";
			oCreatedDate = "";
			oName.value = "";
			oFileName.value = "";
			oModel.value = "";
			oFabric.value = "";
			oBagno.value = "";	
			oLayers.value = "";
			oLength.value = "";
			oExtra.value = "";	
			oLengthSum.value = "";
			oPriority = "";
			oLoaded = "";
			oSpreaded = "";

			//Session.set('checkbox-orderLoaded', false);
			//Session.set('checkbox-orderSpreaded', false);

		},

		'click #orderLoaded': function (e,t) {
      //e.preventDefault();
      Session.set('checkbox-orderLoaded', event.target.checked);
			//console.log("Stavlja u sesiju orderLoaded: " + event.target.checked);
		  //console.log('Session orderLoaded status: '+ Session.get('checkbox-orderLoaded'));
		},
		
		'click #orderSpreaded': function (e,t) {
      //e.preventDefault();
      Session.set('checkbox-orderSpreaded', event.target.checked);
			//console.log("Stavlja u sesiju orderSpreaded: " + event.target.checked);
		  //console.log('Session orderSpreaded status: '+ Session.get('checkbox-orderSpreaded'));
		}
	});

	Template.orderList.events({
		'click .orderName': function (e, t) {
			
			Session.set("edit-" + t.data._id, true);
			console.log("set-" + t.data._id, true, e, t);
	
			var input = Order.findOne(t.data);
			console.log(input);
		},
		
		'keypress input': function (e, t){
			if (e.keyCode === 13) {
				var order = Order.findOne(t.data);
				Order.update({_id: order._id}, { $set: { orderName: e.currentTarget.value}});
				Session.set("edit-" + t.data._id, false);

			// greska u tutorijalu			
			}
		},
		
		'click #deleteOrder': function (e, t) {
			var ordertodel = Order.findOne(t.data);
			console.log ("deleted: " + ordertodel._id);
			Order.remove({_id: ordertodel._id});
		},
	});

	Template.orderList.editing = function (){
		return Session.get("edit-" + this._id);
		console.log("edit-" + this._id);
	};

	Template.tmp_EditOrder.events({
		'click #deleteOrder': function (e, t) {
			var orderToDelete = Session.get("selectedDocId");
			//console.log(orderToDelete);	

			Order.remove({_id: orderToDelete});

			//rd_editorder.hide();
		}
	});

	//JSON 2 CSV
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

    Template.tmp_ExportOrder.order = function() {
    	return Order.find();
    }

  //CSV 2 JSON
	Template.tmp_ImportOrder.events({
		'click #convert3' : function (e, t) {
			
			var csv3 = $("#json3").val();
			//alert(csv3)

			if (csv3 == "") {
				return alert('empty field');
			} else {
    			var json3 = CSV2JSON(csv3);
    			$("#json3").val(json3);
    		}

		},
		'click #download3' : function (e, t) {
			
			var csv3 = $("#json3").val();
			//alert(csv2)

			if (csv3 == "") {
				return alert('empty field');
			} else {
				
    			var json3 = CSV2JSON(csv3);
    			window.open("data:text/json;charset=utf-8," + escape(json3))	
    		}

		},
		'click #insert-csv-from-code' : function (e, t){
			//var json3 = $('#json3').val();
			//console.log(json3);

			//for example
        	//Order.insert(
			//		[
			//		{orderName:"import1",orderLayers:"5",orderLength:"5",orderExtra:"5",orderPriority:"5"},
			//		{orderName:"import11",orderLayers:"5",orderLength:"5",orderExtra:"5",orderPriority:"5"}
					//{orderName:"import2",orderLayers:1,orderLength:1,orderExtra:1}
			//		], function (e, r) {
			//			validate: false;
			//		}
        	//);
			// hoce da unese jedan red ali nece array

			//var file = $('#file').name;

			var csv3 = $('#csv3').val();
			console.log(csv3);

			//Meteor.call("uploadFile", csv3);
    }

	});

  function CSVToArray(strData, strDelimiter) {
    	// Check to see if the delimiter is defined. If not,
    	// then default to comma.
    	strDelimiter = (strDelimiter || ",");
    	// Create a regular expression to parse the CSV values.
    	var objPattern = new RegExp((
    	// Delimiters.
    	"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    	// Quoted fields.
    	"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    	// Standard fields.
    	"([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    	// Create an array to hold our data. Give the array
    	// a default empty first row.
    	var arrData = [[]];
    	// Create an array to hold our individual pattern
    	// matching groups.
    	var arrMatches = null;
    	// Keep looping over the regular expression matches
    	// until we can no longer find a match.
    	while (arrMatches = objPattern.exec(strData)) {
        	// Get the delimiter that was found.
        	var strMatchedDelimiter = arrMatches[1];
        	// Check to see if the given delimiter has a length
        	// (is not the start of string) and if it matches
        	// field delimiter. If id does not, then we know
        	// that this delimiter is a row delimiter.
        	if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            	// Since we have reached a new row of data,
            	// add an empty row to our data array.
            	arrData.push([]);
        	}
        	// Now that we have our delimiter out of the way,
        	// let's check to see which kind of value we
        	// captured (quoted or unquoted).
        	if (arrMatches[2]) {
	            // We found a quoted value. When we capture
    	        // this value, unescape any double quotes.
        	    var strMatchedValue = arrMatches[2].replace(
            	new RegExp("\"\"", "g"), "\"");
        	} else {
            	// We found a non-quoted value.
            	var strMatchedValue = arrMatches[3];
        	}
        	// Now that we have our value string, let's add
        	// it to the data array.
        	arrData[arrData.length - 1].push(strMatchedValue);
    	}
    	// Return the parsed data.
    	return (arrData);
	}	

	function CSV2JSON(csv) {
    	var array = CSVToArray(csv);
    	var objArray = [];
    	for (var i = 1; i < array.length; i++) {
	        objArray[i - 1] = {};
        	for (var k = 0; k < array[0].length && k < array[i].length; k++) {
            	var key = array[0][k];
            	objArray[i - 1][key] = array[i][k]
        	}
    	}

    	var json = JSON.stringify(objArray);
    	var str = json.replace(/},/g, "},\r\n");
    	return str;
	}

	//Template.example.events({
  	//	'change input': function(ev) {  
    		//_.each(ev.srcElement.files, function(file) {
    //	  		Meteor.saveFile(file, file.name);
    		//});
  	//	}
  	//});


// Drag and drop
/*
$(document).ready(function() {
    var dd = new dragAndDrop({
        onComplete: function(files) {
            for (var i = 0; i < files.length; i++) {
                // Only process csv files.
                if (!f.type.match('text/csv')) {
                    continue;
                }
                var reader = new FileReader();
                reader.onloadend = function(event) {
                    var all = $.csv.toObjects(event.target.result);
                    // do something with file content
                    _.each(all, function(entry) { 
                         Order.insert(entry);
                         console.log(entry);
                    });
                }
             }
        }
     });

     dd.add('upload-div'); // add to an existing div, turning it into a drop container
});
*/

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

	//Filter Collection (server side)
 	Meteor.FilterCollections.publish(Order, {
  		name: 'orderFilter',
  		callbacks:  {
    		beforeSubscribe: function (query) {
      			console.log("beforeSubscribe")
    		},
    		afterSubscribe: function (subscription) {
      			console.log("afterSubscribe")
    		},
    		beforeResults: function(query){
      			console.log("beforeResults")
    		},
    		afterResults: function(cursor){
      			console.log("afterResults")
      		}
      		},
	});
}


Meteor.methods({
     'uploadFile': function (file) {

      Future = Npm.require('fibers/future');

      //console.log(file.name+"/"+file.type+"/"+file.size);                       

      //file.save('/public',{});
      //var buffer = new Buffer(file.data);
      var buffer = file;

      // Set up the Future
      var fut = new Future(); 

      // Convert buffer (a CSV file) to an array
      CSV().from(
          buffer.toString(),
          {comment: '#', delimiter: ',', quote: ''} 
          )
        	.to.array( function(data){
          var newRecords=[];
          for(var row=0; row<data.length; row++) {
            console.log(data[row]);
            newRecord = {
              //'firstname': data[row][0],
              //'lastname': data[row][1],
              //'email': data[row][2],
              //'emailshort': data[row][3],
              //'emailmain': data[row][4],
              //'domain': data[row][5]
              'orderName' : data[row][1]
            };
            //console.log(newRecord);
            newRecords.push(newRecord);
          }

          // at the end of the CSV callback
          // return newRecords via the Future
          fut['return'](newRecords);
          });

    // Wait for the results of the conversion
    results = fut.wait();
    console.log('results================');
    console.log(results);

    // now insert the new records from the file into our collectiion
    if (results.length) {
        for(i in results) {
            Order.insert(results[i]);
        }
    }

    console.log('Order now looks like =====================');
    console.log(Order.find({}).fetch());

	} // uploadFile

});


Meteor.saveFile = function(blob, name, path, type, callback) {
  var fileReader = new FileReader(),
    method, encoding = 'binary', type = type || 'binary';
  switch (type) {
    case 'text':
      // TODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
      method = 'readAsText';
      encoding = 'utf8';
      break;
    case 'binary': 
      method = 'readAsBinaryString';
      encoding = 'binary';
      break;
    default:
      method = 'readAsBinaryString';
      encoding = 'binary';
      break;
  }
  fileReader.onload = function(file) {
    Meteor.call('saveFile', file.srcElement.result, name, path, encoding, callback);
  }
  fileReader[method](blob);
}

// export MONGO_URL=mongodb://localhost:27017/spread
// kill -9 `ps ax | grep node | grep meteor | awk '{print $1}'`

// meteor add mizzao:bootstrap-3
// meteor add accounts-base
// meteor add accounts-password
// meteor add accounts-ui
// mrt accounts-ui-bootstrap-3
// mrt add jquery
// mrt add moment
//mrt add bootstrap3-datepicker
// meteor add jquery-ui-bootstrap
// mrt add collection2 (sudo)
// mrt add autoform
// mrt add filter-collections
// meteor remove autopublish
// sudo mer add fast-render
// mrt add reactive-table
//mrt add font-awesome?
// mrt add reactive-modal
//mrt add bootstrap-modal?
// mrt add json2csv
//$ npm install -g npm