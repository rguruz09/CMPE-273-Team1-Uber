var mq_client = require('../rpc/client');

exports.getTripDetails = function(req,res) {
	console.log("Inside trips");
	var email = req.session.email;
	var msg_payload = {"email":email};
	mq_client.make_request('get_all_trips_queue',msg_payload, function(err,results) {		
		if(err) {
			throw err;
		}
		else {
			console.log("After get_all_trips_queue::" + results.code);
			if(results.code == 200)	{				
				res.send({"allTripslist":results.allTripslist});		
				
			}
			else {    				
				console.log("Error in Fetching all riders");			
			}
		}  
	});	
}

exports.geteachTripDetails = function(req, res) {
	var RIDE_ID = req.param("RIDE_ID");
	var msg_payload = { "RIDE_ID" : RIDE_ID };
	
	mq_client.make_request('get_each_trips_queue', msg_payload, function(err,results) {
		if (err) {
			throw err;
		} else {
			console.log("After get_each_trips_queue::" + results.code);
			if (results.code == 200) {
				res.send({
					"eachTripDetails" : results.eachTripDetails
				});

			} else {
				console.log("Error in Fetching all bill Details");
			}
		}
	});
}

exports.getdriverTripDetails = function(req,res) {
	console.log("Inside trips");
	var email = req.session.driverID;
	console.log(email);
	var msg_payload = {"email":email};
	mq_client.make_request('get_all_drivertrips_queue',msg_payload, function(err,results) {		
		if(err) {
			throw err;
		}
		else {
			console.log("After get_all_drivertrips_queue::" + results.code);
			if(results.code == 200)	{				
				res.send({"alldriverTripslist":results.alldriverTripslist});		
				console.log("successful");
			}
			else {    				
				console.log("Error in Fetching all riders");			
			}
		}  
	});	
}

exports.eachdriverTripDetails = function(req, res) {
	var RIDE_ID = req.param("RIDE_ID");
	var msg_payload = { "RIDE_ID" : RIDE_ID };
	
	mq_client.make_request('get_drivereach_trips_queue', msg_payload, function(err,results) {
		if (err) {
			throw err;
		} else {
			console.log("After get_each_trips_queue::" + results.code);
			if (results.code == 200) {
				res.send({
					"eachdriverTripDetails" : results.eachdriverTripDetails
				});

			} else {
				console.log("Error in Fetching all bill Details");
			}
		}
	});
}