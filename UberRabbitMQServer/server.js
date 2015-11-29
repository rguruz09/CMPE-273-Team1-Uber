var amqp = require('amqp'), util = require('util');

var login = require('./services/login'), 
rider = require('./services/rider'),
admin = require('./services/admin'),
driver = require('./services/driver'),
driversignup = require('./services/driversignup'),
driverOperations = require('./services/driverOperations'),
bill = require('./services/bill'),
stats = require('./services/stats'),
http = require('http')

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
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
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
});