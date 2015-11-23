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
		console.log("In handle_admin_get_all_drivers_queue request:" + msg.email);
		var json_responses;
		var res = {};

		mysql.selectAll("customer",function(err, rows) {
			if (err) {
				console.log("Unexpected Error in Getting all Riders");
				res.code = err.code;
				res.value = "Unexpected Error!";
				console.log(err);
				callback(null, res);
			} else {
				console.log("From Login Admin result of querydb: " + JSON.stringify(rows));
				res.code = "200";
				res.allRidersList = rows;				
				callback(null, res);
			}
		});
	} catch (e) {
		console.log(e.stack);
	}
}

exports.handle_login_admin_queue = handle_login_admin_queue;
exports.handle_admin_get_all_riders_queue = handle_admin_get_all_riders_queue;