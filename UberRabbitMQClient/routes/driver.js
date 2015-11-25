/**
 * http://usejsdoc.org/
 * This module will handle driver module API calls
 */
var mq_client = require('../rpc/client');
var bcrypt = require("bcrypt");

exports.getDrivers = function(req,res){
	
	var lat = req.param('lat');
	var lang = req.param('lang');
	
	var msg_payload = {"lat" : lat, "lang" : lang};
	
	console.log(msg_payload);
	mq_client.make_request('get_drivers_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			console.log("Result is: " + results.code);
			if(results.code == 404){
				console.log("unable to post");
				res.json({
					members : 0 
				});		
			}
			else {  
				console.log(" fetching success");			
				res_json = results;
				res.send(res_json);				
			}
		}  
	});
};


exports.getDriverInfo = function(req,res){
	console.log(req.param('drivers'));
};

	
exports.addDrivers = function(req,res){
		console.log("In addDriver client ");
		var email = req.param("email");
		var password = req.param("password");
		var firstname = req.param("firstname");
		var lastname = req.param("lastname");
		var mobile = req.param("mobile");
		var city = req.param("city");
		var zip = req.param("zip");
		
		var salt1 = bcrypt.genSaltSync(10);
		var passwordHash = bcrypt.hashSync(password, salt1);

		var json_responses;

		var msg_payload = {
			"email" : email,
			"password" : passwordHash,
			"firstname" : firstname,
			"lastname" : lastname,
			"mobile" : mobile,
			"city" : city,
			"zip" : zip		
		};	
		
		mq_client.make_request('addDriver_queue', msg_payload,
				function(err, results) {
					console.log("RESULTS::" + results.code);
					if (err) {
						throw err;
					} else {
						if (results.code == 200) {
							json_responses = {
								"statusCode" : results.code
							};
							console.log("Valid Signup");
							res.json(json_responses);

						} else if (results.code != 200) {
							json_responses = {
								"statusCode" : results.code
							};
							console.log("Could not Sigin Up");
							res.json(json_responses);
						}
					}
				});
	};

