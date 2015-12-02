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


//getting the driver info
exports.getDriverInfo = function(req,res){
	
	var drivers = req.param('drivers');
	console.log(drivers);
	
	
	var json_responses;

	var msg_payload = {
			"drivers" : drivers
	};	
	
	mq_client.make_request('getDriverInfo_queue', msg_payload,
			function(err, results) {
				console.log("RESULTS::" + results.statusCode);
					if (err) {
						throw err;
					} else {
						if (results.statusCode == 200) {
							
							json_responses = {
								"statusCode" : results.code,
								"details" : results.data
							};
							
							console.log("Sending driver data - " + json_responses.details );
							res.json(json_responses);
							
						} else if (results.statusCode != 200) {
								json_responses = {
									"statusCode" : results.code
								};
								console.log("Could not Sigin Up");
								res.json(json_responses);
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
	var address = req.param("address");
	var city = req.param("city");
	var zip = req.param("zip");
	var state = req.param("state");

	var salt1 = bcrypt.genSaltSync(10);
	var passwordHash = bcrypt.hashSync(password, salt1);

	var json_responses;

	var msg_payload = {
			"email" : email,
			"password" : passwordHash,
			"firstname" : firstname,
			"lastname" : lastname,
			"mobile" : mobile,
			"address" : address,
			"city" : city,
			"zip" : zip,
			"state" : state
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
					req.session.driverID = email;
					console.log(req.session.driverID);
					console.log("Valid Login");						
					//res.send({"login":"Success"});	
					console.log("queue Login");
					json_responses = {
							"statusCode" : results.code,
							"email" : email
					};
					console.log("Valid Login");
					res.send(json_responses);
				}else
					{
					json_responses = {
							"statusCode" : 301
					};
					console.log("Passwords do not match");
					res.send(json_responses);
					}
			} else if(results.code === 207) {
				//Unauthorized Driver 
				json_responses = {
						"statusCode" : results.code							
				};
				console.log("Unauthorized Request for user");
				res.send(json_responses);
			} else {
				json_responses = {
						"statusCode" : 301
				};
				console.log("Could not Login: Check your credentials and Login again");
				res.send(json_responses);
			}
		}
	});
};





exports.getDriverDetails = function getDriverDetails(req,res) {
	
	console.log("In Get Driver Details");
	console.log("**************************");
	console.log("session email inside getDriverDetails is : "+req.session.driverID);
	console.log("**************************");
	var msg_payload = { "email": req.session.driverID};
	mq_client.make_request('get_driversInfo_queue',msg_payload, function(err,results) {		
		if(err) {
			console.log(err);
		}
		else {
			console.log("After get_driversInfo_queue Queue::" + results.code);
			if(results.code == 200)	{
				
				console.log("inside driver.js. Result passed is : ");
				console.log(results.user);
				
				res.send({"driver" : results.user});
			}
			else {    				
				console.log("Invalid Login");
				res.send({"login":"Fail"});
			}
		}  
	});	
}








// Update the driver location on login.
exports.updateDriverLoc = function(req, res){
	
	console.log("Updating driver locaion details on login");
	var driverID = req.session.driverID;
	
	//var driverID = req.param("email");
	var lat = req.param("lat");
	var lang = req.param("lang");
	
	var msg_payload = {
			"driverID" : driverID,
			"lat" : lat,
			"lang" : lang	
	};	
	
	console.log("Message : " + msg_payload.driverID + "  " + msg_payload.lat +" "+msg_payload.lang);
	
	var json_responses;
	
	mq_client.make_request('Update_DriverLocation_queue', msg_payload,
			function(err, results) {
		console.log("RESULTS::" + results.code);
		if (err) {
			throw err;
		} else {
			if (results.code == 200) {
				json_responses = {
						"statusCode" : results.code
				};
				console.log("Update successful");
				res.json(json_responses);

			} else if (results.code != 200) {
				json_responses = {
						"statusCode" : results.code
				};
				console.log("Couldnt update location details");
				res.json(json_responses);
			}
		}
	});
	
	
	
};

//getCurDriverLatlng
exports.getCurDriverLatlng = function(req,res){
	
	console.log("In addcarDetails client ");

	//var driverID = req.param("driverID");
	var driverID = req.session.driverID;
	var json_responses  = {};
	
	var msg_payload = {
		"driverID" : driverID
	};	
	
	console.log("Message : " + msg_payload.driverID );
	
	mq_client.make_request('getDrvLoc_queue', msg_payload,
			function(err, results) {
		console.log("RESULTS::" + results.code);
		if (err) {
			throw err;
		} else {
			if (results.code == 200) {
				json_responses = {
						"code" : 200,
						"loc" : results.data
				};
				console.log("Valid CarDetails");
				res.json(json_responses);

			} else if (results.code != 200) {
				json_responses = {
						"code" : 404
				};
				res.json(json_responses);
			}
		}
	});
};



exports.addcarDetails = function(req,res){
	console.log("In addcarDetails client ");

	var email = req.session.driverID;
	var Make = req.param("Make");
	var Year = req.param("Year");
	var color = req.param("color");
	var license = req.param("license");


	var json_responses;

	var msg_payload = {
			"email" : email,
			"Make" : Make,
			"Year" : Year,
			"color" : color,
			"license" : license	
	};	
	
	console.log("Message : " + msg_payload.email + "  " + msg_payload.Make +" "+msg_payload.Year+" "+msg_payload.color+" "+" "+msg_payload.license );
	
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


exports.driverRides = function(req,res){
	 if (!req.session.driverID) 
		 res.redirect('/');
	 else
		 res.render('driverRides',{ "email":req.session.driverID});
};

exports.actionDriverUpdate= function(req, res) {
	
	console.log("In action Update client ");
console.log("session: "+req.session.driverID);
	var email = req.session.driverID;
	
	//if(typeof(req.param("password")) != "undefined")
	//{
	//console.log("Password is: " +req.param("password"));	
	var password = req.param("password");
	//var salt1 = bcrypt.genSaltSync(10);
	//var passwordHash = bcrypt.hashSync(password, salt1);
	//}
	
	
	
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var phone = req.param("mobile");
	var address = req.param("address");
	var city = req.param("city");
	var state = req.param("state");
	var zipcode = req.param("zip");
	//var ssn = req.param("ssn");
	
	console.log("*****************************************************************");
	console.log("Data from angularJS: "+" email: "+email+" password: "+password+" firstname: "+firstname+" lastname:  "+lastname+" phone: "+phone+ " address: "+address+" city: "+city+" state: "+state+" zip: "+zipcode);
	console.log("*****************************************************************");
	
	var json_responses;

	var msg_payload = {
		//	"ssn": ssn,
		"firstname" : firstname,
		"lastname" : lastname,
		"email" : email,
		"phone" : phone,
		"address" : address,
		"city" : city,
		"state" : state,
		"zipcode" : zipcode,
		"password" : password
	};	
	console.log("before request "+JSON.stringify(msg_payload));
	mq_client.make_request('updateDriver_queue', msg_payload,
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



exports.driverlogout = function(req, res){
	req.session.destroy();
	res.redirect('/');
};