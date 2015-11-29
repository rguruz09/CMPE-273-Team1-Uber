var bcrypt = require("bcrypt");
var mq_client = require('../rpc/client');

function getAllBills(req, res) {
	var msg_payload = {};
	mq_client.make_request('get_all_bills_queue', msg_payload, function(err,results) {
		if (err) {
			throw err;
		} else {
			console.log("After get_all_bills_queue::" + results.code);
			if (results.code == 200) {
				res.send({	"billList" : results.billList });
			} else {
				console.log("Error in Fetching all billList");
			}
		}
	});
}

function getBillDetails(req, res) {
	var RIDE_ID = req.param("RIDE_ID");
	var msg_payload = { "RIDE_ID" : RIDE_ID };
	
	mq_client.make_request('get_bill_details_queue', msg_payload, function(err,results) {
		if (err) {
			throw err;
		} else {
			console.log("After get_bill_details_queue::" + results.code);
			if (results.code == 200) {
				res.send({
					"billDetails" : results.billDetails
				});

			} else {
				console.log("Error in Fetching all bill Details");
			}
		}
	});
}

exports.getAllBills = getAllBills;
exports.getBillDetails = getBillDetails;