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






//
exports.handle_request_saveNewCard = handle_request_saveNewCard;
exports.handle_delete_paymentInfo_queue = handle_delete_paymentInfo_queue;
exports.handle_get_paymentInfo_queue = handle_get_paymentInfo_queue;
exports.handle_updateRider_queue = handle_updateRider_queue;
exports.handle_get_rider_queue = handle_get_rider_queue;
exports.handle_request_addRider = handle_request_addRider;
exports.handle_login_rider_queue = handle_login_rider_queue;