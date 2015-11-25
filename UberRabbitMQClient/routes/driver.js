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


exports.checkDrivers = function(req,res){
	console.log("In checkDriver Login client ");
	var email = req.param("email");
	var password = req.param("password");

	var json_responses;

	var msg_payload = {
			"email" : email	
	};	
	console.log("RESULTS::" + email);
	mq_client.make_request('login_Driver_queue', msg_payload,
			function(err, results) {
		console.log("RESULTS::" + results.code);
		if (err) {
			throw err;
		} else {
			if (results.code == 200) {
				console.log("Authenticating using BCRYPT..");
				console.log("pwd"+password+"hash"+results.user.password);
				if(bcrypt.compareSync(password, results.user.password) == true) {
					console.log("Done using BCRYPT..");			
					req.session.email = email;
					console.log("Valid Login");						
					res.send({"login":"Success"});	
					console.log("queue Login");
					json_responses = {
							"statusCode" : results.code,
							"email" : email
					};
					console.log("Valid Login");
					res.json(json_responses);
				}
			} else if (results.code != 200) {
				json_responses = {
						"statusCode" : results.code
				};
				console.log("Could not Login: Check your credentials and Login again");
				res.json(json_responses);
			}
		}
	});
};

	exports.addcarDetails = function(req,res){
		console.log("In addcarDetails client ");

		var email = req.param("email");
		var Make = req.param("Make");
		var Year = req.param("Year");
		var Color = req.param("Color");
		var license = req.param("license");


		var json_responses;

		var msg_payload = {
				"email" : email,
				"Make" : Make,
				"Year" : Year,
				"Color" : Color,
				"license" : license	
		};	
		console.log("RESULTS::" + email +Make +Year + Color +license);
		mq_client.make_request('add_carDetails_queue', msg_payload,
				function(err, results) {
			console.log("RESULTS::" + results.code);
			if (err) {
				throw err;
			} else {
				if (results.code == 200) {
					json_responses = {
							"statusCode" : results.code
					};
					console.log("Valid CarDetails");
					res.json(json_responses);

				} else if (results.code != 200) {
					json_responses = {
							"statusCode" : results.code
					};
					console.log("Could not save Car Details");
					res.json(json_responses);
				}
			}
		});
	};

