var amqp = require('amqp'), util = require('util');

var login = require('./services/login'), 
rider = require('./services/rider'),
admin = require('./services/admin'),
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
	
});