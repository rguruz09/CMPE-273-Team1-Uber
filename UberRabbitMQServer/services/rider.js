var mysql = require("./mysql");

function handle_request_addRider(msg, callback){		
	
	var customer_details = {
		"firstname" : msg.firstname,
		"lastname" : msg.lastname,
		"address" : msg.address,
		"city" : msg.city,
		"state" : msg.state,
		"zipcode" : msg.postalcode,
		"phone" : msg.mobile,
		"email" : msg.email,
		"password" : msg.password
	}
	
	var payment_details = {
		"email" : msg.email,
		//"cardnumber" : msg.creditcard,
		"cardnumber_12" : msg.creditcard_12,
		"cardnumber_4" : msg.creditcard_4,
		"cardholdername" : msg.cardholder,
		"month": msg.month,
		"year": msg.year,
		"cvv" : msg.cvv	
	}	
	
	var res = {};	
	console.log("In handle request for rider:"+ msg.firstname);	
	mysql.insert("customer", customer_details, function(err, rows) {		
		if (err) {			
			//res.code = err.code;
			//console.log("Error code: "+ JSON.stringify(err));
			res.statusCode = 401;
			//console.log("Response: "+ JSON.stringify(res));
			console.log("Customer Details Error!");
			callback(true,res);			
		} else {			
			console.log("From Rider Add Customer result of querydb: "	+ JSON.stringify(rows));
			mysql.insert("payment_details", payment_details, function(err, rows) {
				if (err) {
					console.log("Payment Details Error!");
					res.code = err.code;
					res.value = "Failed Rider Signup";
					//throw err;
					console.log(err);					
				} else {
					console.log("Payment Details Added!");
					console.log("From Add Payment method result of querydb: "	+ JSON.stringify(rows));					
					res.code = 200;
					res.value = "Valid Rider Signup";
				}	
				callback(null,res);
			});
			//callback(null,res);
		}		
	});
}

//handle_request_saveNewCard

function handle_request_saveNewCard(msg, callback){		
	var payment_details = {
		"email" : msg.email,
		"cardnumber_12" : msg.creditcard_12,
		"cardnumber_4" : msg.creditcard_4,
		"cardholdername" : msg.cardholder,
		"month": msg.month,
		"year": msg.year,
		"cvv" : msg.cvv
	}	
	
	var res = {};	
	console.log("In handle request for save new card:"+ msg.firstname);	
			mysql.insert("payment_details", payment_details, function(err, rows) {
				if (err) {
					console.log("Payment Details Error!");
					res.code = err.code;
					res.value = "Failed to add card";
					//throw err;
					console.log(err);					
				} else {
					console.log("Payment Details Added!");
					console.log("From save card method result of querydb: "	+ JSON.stringify(rows));					
					res.code = "200";
					res.value = "Valid card details";
				}	
				callback(null,res);
			});
			//callback(null,res);
};

function handle_updateRider_queue(msg,callback) {


	console.log("In handle_updateRider_queue request:"+ msg.email);	
	var json_responses;
	var email = msg.email;	
	var res = {};
	console.log(msg);

	mysql.update("customer",msg,email, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Getting Rider");
			res.code = err.code;
			res.value = "Unexpected Error!";
			console.log(err);			
			callback(null,res);			
		} else {						
			console.log("From Get Rider result of querydb: "	+ JSON.stringify(rows));			
			res.code = "200";
			res.value = "Success";
			res.user = rows[0];						
			callback(null,res);
		}		
	});	
	
}

function handle_login_rider_queue(msg,callback) {
	console.log("In handle_login_rider_queue request:"+ msg.email);	
	var json_responses;
	var email = msg.email;	
	var res = {};

	mysql.authenticate_approval("customer", email, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Rider authentication");
			res.code = err.code;
			res.value = "Unexpected Error!";
			console.log(err);			
			callback(null,res);			
		} else {		
			if(rows.length > 0)		
			{		
			console.log("From Login Rider result of querydb: "	+ JSON.stringify(rows));			
			res.code = "200";
			res.value = "Success";
			res.password = rows[0].password;	
			res.firstname = rows[0].firstname;	
			res.lastname = rows[0].lastname;
			res.isapproved = rows[0].isapproved;
			callback(null,res);
			}
			else
			{
			res.code = "401";
			callback(null,res);
			}
		}		
	});	
}

function handle_get_rider_queue(msg,callback) {

	console.log("In handle_get_rider_queue request:"+ msg.email);	
	var json_responses;
	var email = msg.email;	
	var res = {};

	mysql.getData("customer","email", email, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Getting Rider");
			res.code = err.code;
			res.value = "Unexpected Error!";
			console.log(err);			
			callback(null,res);			
		} else {						
			console.log("From Get Rider result of querydb: "	+ JSON.stringify(rows));			
			res.code = "200";
			res.value = "Success";
			res.user = rows[0];						
			callback(null,res);
		}		
	});	

	
}

function handle_get_paymentInfo_queue(msg,callback) {

	console.log("In handle_get_paymentInfo_queue request:"+ msg.email);	
	var json_responses;
	var email = msg.email;	
	var res = {};

	mysql.getData("payment_details","email", email, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Getting Rider");
			res.code = err.code;
			res.value = "Unexpected Error!";
			console.log(err);			
			callback(null,res);			
		} else {						
			console.log("From Payment Info result of querydb: "	+ JSON.stringify(rows));			
			res.code = "200";
			res.value = "Success";
			res.user = rows;	
			callback(null,res);
		}		
	});	

	
}


//delete payment info

function handle_delete_paymentInfo_queue(msg,callback) {

	console.log("In handle_delete_paymentInfo_queue request:"+ msg.email);	
	var json_responses;
	var email = msg.email;
	var cardnumber_4 = msg.cardnumber_4;
	var res = {};
	console.log();
	mysql.deleteData("payment_details", email, cardnumber_4, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in deleting payment info");
			res.code = err.code;
			res.value = "Unexpected Error!";
			console.log(err);			
			callback(null,res);			
		} else {	
			console.log("card deleted successfully!!");
			console.log("From delete payment info result of querydb: "	+ JSON.stringify(rows));			
			res.code = "200";
			res.value = "Success";
			//res.user = rows[0];						
			callback(null,res);
		}		
	});	

	
}


function handle_get_all_trips_queue(msg, callback) {
	try {
		console.log("In handle_get_all_trips_queue request:");
		var json_responses;
		var res = {};
		var custID = msg.email;
		var query ="SELECT * FROM RIDES WHERE CUSTOMER_ID = '"+custID+"'";
		mysql.executeQuery(query,function(err, rows) {
			if (err) {
				console.log("Unexpected Error in Getting all Trips");
				res.code = err.code;
				res.value = "Unexpected Error!";
				console.log(err);
				callback(null, res);
			} else {
				console.log("From Rides result of querydb: " + JSON.stringify(rows));
				res.code = "200";
				//if(rows.length > 0)
				res.allTripslist = rows;				
				callback(null, res);
			}
		});
	} catch (e) {
		console.log(e.stack);
	}
}

function handle_get_all_drivertrips_queue(msg, callback) {
	try {
		console.log("In handle_get_all_trips_queue request:");
		var json_responses;
		var res = {};
		var DriverID = msg.email;
		var query ="SELECT * FROM RIDES WHERE DRIVER_ID = '"+DriverID+"'";
		console.log(query);
		mysql.executeQuery(query,function(err, rows) {
			if (err) {
				console.log("Unexpected Error in Getting all driver Trips");
				res.code = err.code;
				res.value = "Unexpected Error!";
				console.log(err);
				callback(null, res);
			} else {
				console.log("From Rides result of querydb: " + JSON.stringify(rows));
				res.code = "200";
				//if(rows.length > 0)
				res.alldriverTripslist = rows;	
				console.log(res.alldriverTripslist);
				callback(null, res);
			}
		});
	} catch (e) {
		console.log(e.stack);
	}
}



//
exports.handle_request_saveNewCard = handle_request_saveNewCard;
exports.handle_delete_paymentInfo_queue = handle_delete_paymentInfo_queue;
exports.handle_get_paymentInfo_queue = handle_get_paymentInfo_queue;
exports.handle_updateRider_queue = handle_updateRider_queue;
exports.handle_get_rider_queue = handle_get_rider_queue;
exports.handle_request_addRider = handle_request_addRider;
exports.handle_login_rider_queue = handle_login_rider_queue;
exports.handle_get_all_trips_queue =handle_get_all_trips_queue;
exports.handle_get_all_drivertrips_queue =handle_get_all_drivertrips_queue;