/**
 * New node file
 */
var mysql = require("./mysql");

// Admin Login Queue
function handle_login_admin_queue(msg, callback) {
	try {
		console.log("In handle_login_admin_queue request:" + msg.email);

		var json_responses;
		var email = msg.email;
		var res = {};

		mysql.authenticate("admin_details", email, function(err, rows) {
			if (err) {
				console.log("Unexpected Error in Admin authentication");
				res.code = err.code;
				res.value = "Unexpected Error!";
				console.log(err);
				callback(null, res);
			} else {
				console.log("From Login Admin result of querydb: "
						+ JSON.stringify(rows));
				res.code = "200";
				res.value = "Success";
				res.password = rows[0].password;
				res.firstname = rows[0].firstname;
				res.lastname = rows[0].lastname;
				callback(null, res);
			}
		});
	} catch (e) {
		console.log(e.stack);
	}
}

function handle_admin_get_all_riders_queue(msg, callback) {
	try {
		
		var json_responses;
		var res = {};

		mysql.selectAllApproved("customer", function(err, rows) {
			if (err) {
				console.log("Unexpected Error in Getting all Riders");
				res.code = err.code;
				res.value = "Unexpected Error!";
				console.log(err);
				callback(null, res);
			} else {
				console.log("From Login result of querydb: "
						+ JSON.stringify(rows));
				res.code = "200";
				res.allRidersList = rows;
				callback(null, res);
			}
		});
	} catch (e) {
		console.log(e.stack);
	}
}

function handle_admin_get_rides_queue(msg,callback){
	try {		
		var json_responses;
		var res = {};

		mysql.selectAll("RIDES",function(err, rows) {
			if (err) {
				console.log("Unexpected Error in Getting all Riders");
				res.code = err.code;
				res.value = "Unexpected Error!";
				console.log(err);
				callback(null, res);
			} else {
				console.log("From handle_admin_get_rides_queue: " + rows.length);
				res.code = "200";
				res.rides = rows;				
				callback(null, res);
			}
		});
	} catch (e) {
		console.log(e.stack);
	}
}

function handle_admin_get_all_uriders_queue(msg, callback) {
	try {		
		var json_responses;
		var res = {};

		mysql.selectAllUApproved("customer", function(err, rows) {
			if (err) {
				console.log("Unexpected Error in Getting all Unapp Riders");
				res.code = err.code;
				res.value = "Unexpected Error!";
				console.log(err);
				callback(null, res);
			} else {
				console.log("From result of querydb: "
						+ JSON.stringify(rows));
				res.code = "200";
				res.allURidersList = rows;
				callback(null, res);
			}
		});
	} catch (e) {
		console.log(e.stack);
	}
}

function handle_admin_approve_rider_queue(msg, callback) {
	try {
		var json_responses;
		var res = {};
		var email = msg.email;	
		
		mysql.approveRider("customer", email, function(err, rows) {			
			if (err) {
				console.log("Fail")
				res.code = "401";
				res.value = "Failed";
			} else {
				res.code = "200";
				res.value = "Approved";
				console.log("Approved" + email);
			}
			callback(null, res)
		});
	} catch (e) {
		console.log(e.stack);
	}
}

exports.handle_admin_approve_rider_queue = handle_admin_approve_rider_queue;
exports.handle_admin_get_all_uriders_queue = handle_admin_get_all_uriders_queue;
exports.handle_admin_get_rides_queue = handle_admin_get_rides_queue;
exports.handle_login_admin_queue = handle_login_admin_queue;
exports.handle_admin_get_all_riders_queue = handle_admin_get_all_riders_queue;