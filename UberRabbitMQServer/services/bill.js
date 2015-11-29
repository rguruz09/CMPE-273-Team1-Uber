var mysql = require("./mysql");

function handle_get_bill_details_queue(msg,callback) {	
	var json_responses;
	var RIDE_ID = msg.RIDE_ID;	
	var res = {};

	mysql.getData("RIDES","RIDE_ID", RIDE_ID, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in bill details");
			res.code = err.code;
			res.value = "Unexpected Error!";
			console.log(err);			
			callback(null,res);			
		} else {						
			console.log("From bill result of querydb: "	+ JSON.stringify(rows));			
			res.code = "200";
			res.value = "Success";
			
			if(rows.length > 0)
				res.billDetails = rows[0];			
			callback(null,res);
		}		
	});	
}

function handle_get_all_bills_queue(msg,callback) {
	console.log("In handle_get_all_bills_queue request:");	
	var json_responses;		
	var res = {};

	mysql.selectAll("RIDES", function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Getting Bills");
			res.code = err.code;
			res.value = "Unexpected Error!";
			console.log(err);			
			callback(null,res);			
		} else {						
			console.log("From Get bill result of querydb: "	+ JSON.stringify(rows));			
			res.code = "200";
			res.value = "Success";
			res.billList = rows;						
			callback(null,res);
		}		
	});	
}

exports.handle_get_bill_details_queue = handle_get_bill_details_queue;
exports.handle_get_all_bills_queue = handle_get_all_bills_queue;