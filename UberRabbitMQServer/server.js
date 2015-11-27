var amqp = require('amqp'), util = require('util');

var login = require('./services/login'), 
rider = require('./services/rider'), 
driver = require('./services/driver'),
driversignup = require('./services/driversignup'),
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
	
	
	
	
	
	
	
});