var mysql = require("./mysql");

function handle_request_addRider(msg, callback){		
	
	var customer_details = {
		"ssn" : msg.ssn,
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
		"cardnumber" : msg.creditcard,
		"cardholdername" : msg.cardholder,
		"month": msg.month,
		"year": msg.year,
		"cvv" : msg.cvv	
	}	
	
	var res = {};	
	console.log("In handle request for rider:"+ msg.firstname);	
	mysql.insert("customer", customer_details, function(err, rows) {		
		if (err) {			
			res.code = err.code;
			res.value = "Failed Rider Signup";
			console.log(err);
			console.log("Customer Details Error!");
			callback(null,res);			
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
					res.code = "200";
					res.value = "Valid Rider Signup";
				}	
				callback(null,res);
			});
			//callback(null,res);
		}		
	});
}

function handle_login_rider_queue(msg,callback) {
	console.log("In handle_login_rider_queue request:"+ msg.email);	
	var json_responses;
	var email = msg.email;	
	var res = {};

	mysql.authenticate("customer", email, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Rider authentication");
			res.code = err.code;
			res.value = "Unexpected Error!";
			console.log(err);			
			callback(null,res);			
		} else {						
			console.log("From Login Rider result of querydb: "	+ JSON.stringify(rows));			
			res.code = "200";
			res.value = "Success";
			res.password = rows[0].password;	
			res.firstname = rows[0].firstname;	
			res.lastname = rows[0].lastname;						
			callback(null,res);
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
exports.handle_get_rider_queue = handle_get_rider_queue;
exports.handle_request_addRider = handle_request_addRider;
exports.handle_login_rider_queue = handle_login_rider_queue;