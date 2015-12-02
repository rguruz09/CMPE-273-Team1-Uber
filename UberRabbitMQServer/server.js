var amqp = require('amqp'), util = require('util');

var login = require('./services/login'), 
rider = require('./services/rider'), 
driver = require('./services/driver'),
driversignup = require('./services/driversignup'),
billing = require('./services/billing'),
rides = require('./services/rides'),
admin = require('./services/admin'),
bill = require('./services/bill'),
stats = require('./services/stats'),
driverOperations = require('./services/driverOperations'),
http = require('http');

var cnn = amqp.createConnection({
	host : '127.0.0.1'
});

cnn.on('ready', function() {
	console.log("listening on Uber application");
	
	//Rider Details
	// Signup Rider Queue
	cnn.queue('addRider_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			rider.handle_request_addRider(message, function(err, res) {
				console.log("After Rider Signup Handle" + JSON.stringify(res));
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});	
	
	//getDrvLoc_queue
	cnn.queue('getDrvLoc_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			driver.handle_request_getDrvLoc(message, function(err, res) {
				console.log("After Rider Signup Handle" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});	
	
	//	endRide_queue
	cnn.queue('endRide_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			rides.handle_request_endRide(message, function(err, res) {
				console.log("After Rider Signup Handle" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	
	//getLoc_queue
	cnn.queue('getLoc_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			rides.handle_request_getLoc(message, function(err, res) {
				console.log("After Rider Signup Handle" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	//checkRide_queue
	cnn.queue('checkRide_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			rides.handle_request_checkRide(message, function(err, res) {
				console.log("After Rider Signup Handle" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	

	//Get all drivers list
	cnn.queue('admin_get_all_drivers_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			driverOperations.handle_get_all_drivers_queue(message, function(err, res) {
				console.log("After handle_get_all_drivers_queue" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});


	// Signin Rider Queue
	cnn.queue('login_rider_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			rider.handle_login_rider_queue(message, function(err, res) {
				console.log("After Rider Sign In Handle" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});

	//Get unapproved drivers
	cnn.queue('admin_get_unapproved_drivers_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			driverOperations.handle_admin_get_unapproved_drivers_queue(message, function(err, res) {
				console.log("After handle_admin_get_unapproved_drivers_queue" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	//Get Rider Details
	cnn.queue('get_rider_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			rider.handle_get_rider_queue(message, function(err, res) {
				console.log("After Get Rider Handle" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});


	cnn.queue('admin_approve_driver_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			driverOperations.handle_admin_approve_driver_queue(message, function(err, res) {
				console.log("After handle_admin_approve_driver_queue" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	
	//Get Driver information for pre-populating the form
	cnn.queue('get_driversInfo_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			driver.handle_get_driverInfo_queue(message, function(err, res) {
				console.log("After Get Rider Handle" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});

	//ADMIN
	cnn.queue('login_admin_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			admin.handle_login_admin_queue(message, function(err, res) {
				console.log("After Admin Sign In Handle" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});


	cnn.queue('admin_get_all_riders_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			admin.handle_admin_get_all_riders_queue(message, function(err, res) {
				console.log("After Admin Sign In Handle" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	
	//Get Drivers list 
	cnn.queue('get_drivers_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			driver.handle_get_drivers_queue(message, function(err, res) {
				console.log("After Get Drivers List Handle" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	cnn.queue('addDriver_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			driversignup.handle_request(message, function(err,res){
				console.log("Listening");
				console.log("After Driver Signup" + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	//Get all Bills
	cnn.queue('get_all_bills_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			bill.handle_get_all_bills_queue(message, function(err, res) {
				console.log("After get_all_bill_queue" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('login_Driver_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			driversignup.handle_request_login(message, function(err,res){
				console.log("Listening");
				console.log("After Driver Login" + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('add_carDetails_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			driversignup.handle_request_cardetails(message, function(err,res){
				console.log("After Fetching Car Details" + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	//saveNewCard_queue
	cnn.queue('saveNewCard_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			rider.handle_request_saveNewCard(message, function(err,res){
				console.log("After save new Card Details" + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('get_bill_details_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			bill.handle_get_bill_details_queue(message, function(err, res) {
				console.log("After get_all_bill_queue" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});

	
	//Updating the Driver location -Update_DriverLocation_queue
	cnn.queue('Update_DriverLocation_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			driver.handle_request_updateLoca(message, function(err,res){
				console.log("After Fetching Car Details" + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	//get the driver details - getDriverInfo_queue
	cnn.queue('getDriverInfo_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			driver.handle_request_getDriverDetails(message, function(err,res){
				console.log("After Fetching Car Details" + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	//getting fare estimate: get_FareEstimate_queue
	cnn.queue('get_FareEstimate_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			billing.handle_request_getFareEstimate(message, function(err,res){
				console.log("After Fetching Car Details" + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	//book a ride - bookaRide_queue
	cnn.queue('bookaRide_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			rides.handle_request_bookaRide(message, function(err,res){
				console.log("After Fetching Car Details" + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	//editaRide_queue
	cnn.queue('editaRide_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			rides.handle_request_editaRide(message, function(err,res){
				console.log("After Fetching Car Details" + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
//get the driver details - getDriverInfo_queue
	cnn.queue('getDriverInfo_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			driver.handle_request_getDriverDetails(message, function(err,res){
				console.log("After Fetching Car Details" + res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	
		//updateRider_queue
	cnn.queue('updateRider_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

		rider.handle_updateRider_queue(message, function(err, res) {
			console.log("After  updateRider_queue Handle" + res);
			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});

	
	//confirmRideRequest_queue
	cnn.queue('confirmRideRequest_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			rides.handle_confirmRideRequest_queue(message, function(err, res) {
				console.log("After  updateRider_queue Handle" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	cnn.queue('get_all_trips_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			rider.handle_get_all_trips_queue(message, function(err, res) {
				console.log("After  get_all_trips_queue Handle" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	cnn.queue('get_all_drivertrips_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			rider.handle_get_all_drivertrips_queue(message, function(err, res) {
				console.log("After  get_all_drivertrips_queue Handle" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	
		//get_paymentInfo
	cnn.queue('get_paymentInfo_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

		rider.handle_get_paymentInfo_queue(message, function(err, res) {
			console.log("After  get_paymentInfo Handle" + res);
			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});
	

	//delete_paymentInfo
	cnn.queue('delete_paymentInfo_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			rider.handle_delete_paymentInfo_queue(message, function(err, res) {
				console.log("After  delete_paymentInfo_queue Handle" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});

	//get the ride requests for driver - getRideRequest_queue
//	cnn.queue('getRideRequest_queue', function(q) {
//		q.subscribe(function(message, headers, deliveryInfo, m) {
//			util.log(util.format(deliveryInfo.routingKey, message));
//			util.log("Message: " + JSON.stringify(message));
//			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
//
//			rides.handle_getRideRequest_queue(message, function(err, res) {				
//				console.log("After execute query - "+ res);
//				cnn.publish(m.replyTo, res, {
//					contentType : 'application/json',
//					contentEncoding : 'utf-8',
//					correlationId : m.correlationId
//				});
//			});
//		});
//	});
	
	cnn.queue('getRideRequest_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			rides.handle_getRideRequest_queue(message, function(err,res){
				console.log("After Fetching Car Details" + res);
				//return index sent
				console.log("After execute query - "+ res.code);
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
				console.log("After publish");
			});
		});
	});


	//admin_get_rides_queue
	
	cnn.queue('admin_get_rides_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			admin.handle_admin_get_rides_queue(message, function(err, res) {
				console.log("After admin_get_rides_queue" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});	
	
	
	cnn.queue('ridesperdriver', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			stats.handle_ridesperdriver(message, function(err, res) {
				console.log("After handle_ridesperperson" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});	
	
	cnn.queue('ridesperrider', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			stats.handle_ridesperrider(message, function(err, res) {
				console.log("After handle_ridesperrider" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});	
	
	cnn.queue('timebasedstats', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			stats.handle_timebasedstats(message, function(err, res) {
				console.log("After handle_ridesperrider" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});	
	
	//locationbasedstats
	cnn.queue('locationbasedstats', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			stats.handle_locationbasedstats(message, function(err, res) {
				console.log("After handle_ridesperrider" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});	

		//updateRider_queue
	cnn.queue('updateDriver_queue', function(q) {
	q.subscribe(function(message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

		driver.handle_updateDriver_queue(message, function(err, res) {
			console.log("After  updateDriver_queue Handle" + res);
			// return index sent
			cnn.publish(m.replyTo, res, {
				contentType : 'application/json',
				contentEncoding : 'utf-8',
				correlationId : m.correlationId
			});
		});
	});
});
	
	cnn.queue('admin_get_all_uriders_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			admin.handle_admin_get_all_uriders_queue(message, function(err, res) {
				console.log("After  admin_get_all_uriders_queue Handle" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	cnn.queue('admin_approve_rider_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			admin.handle_admin_approve_rider_queue(message, function(err, res) {
				console.log("After  admin_approve_rider_queue Handle" + res);
				// return index sent
				cnn.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});
	
	
});