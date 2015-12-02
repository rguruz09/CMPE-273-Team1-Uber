var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/uberdb";

function handle_get_all_drivers_queue(msg, callback) {
	var res = {};	
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('drivers');
		coll.find({"isapproved":1}).toArray(function(err, result) {
			console.log(result);
			if (err) {
				console.log("Fail :(")
				res.code = "401";
				res.value = "Failed";
			} else {
				res.code = "200";				
				res.allDriversList = result;
			}
			callback(null, res)
		});
	});
}

function handle_admin_get_unapproved_drivers_queue(msg, callback) {
	var res = {};	
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('drivers');
		coll.find({"isapproved":0}).toArray(function(err, result) {
			console.log(result);
			if (err) {
				console.log("Fail :(")
				res.code = "401";
				res.value = "Failed";
			} else {
				res.code = "200";				
				res.allUnapprovedDriversList = result;
			}
			callback(null, res)
		});
	});
	
}

/*
 * db.collection('restaurants').updateOne(
      { "restaurant_id" : "41156888" },
      { $set: { "address.street": "East 31st Street" } },
      function(err, results) {
        console.log(results);
        callback();
   });
 * */

function handle_admin_approve_driver_queue(msg, callback) {	
	var res = {};
	var email = msg.email;	
	console.log("Approving Details of " + email);
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('drivers');
		coll.updateOne({"email":email} , { $set : {"isapproved":1}},function(err, result) {
			console.log(result);
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
	});	
}

exports.handle_admin_approve_driver_queue = handle_admin_approve_driver_queue;
exports.handle_admin_get_unapproved_drivers_queue = handle_admin_get_unapproved_drivers_queue;
exports.handle_get_all_drivers_queue = handle_get_all_drivers_queue;