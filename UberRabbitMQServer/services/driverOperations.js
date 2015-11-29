var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/driver";

function handle_get_all_drivers_queue(msg, callback) {
	var res = {};	
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('driver');
		coll.find({}).toArray(function(err, result) {
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
		var coll = mongo.collection('driver');
		coll.find({"isApproved":"false"}).toArray(function(err, result) {
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

function handle_admin_approve_driver_queue(msg, callback) {	
	var res = {};
	var email = msg.email;	
	console.log("Approving Details of " + email);
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('driver');
		coll.updateOne({"email":email},{$set:{"isApproved":"true"}},function(err, result) {
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