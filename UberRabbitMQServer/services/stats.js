var mysql = require("./mysql");

function handle_ridesperdriver(msg,callback) {		
	var json_responses;
	var res = {};
	
	var sql = "SELECT DRIVER_ID as label ,COUNT(*) as value,SUM(PRICE) as revenue,DFNAME as firstname,DLNAME as lastname FROM RIDES GROUP BY DRIVER_ID ORDER BY revenue DESC";
	mysql.getStatsData(sql, function(err, rows) {		
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
			res.ridesPerDriver = rows;						
			callback(null,res);
		}		
	});		
}

function handle_ridesperrider(msg,callback) {		
	var json_responses;
	var res = {};
	
	var sql = "SELECT CUSTOMER_ID as label ,COUNT(*) as value,SUM(PRICE) as revenue,CFNAME as firstname,CLNAME as lastname FROM RIDES GROUP BY CUSTOMER_ID ORDER BY revenue DESC";
	mysql.getStatsData(sql, function(err, rows) {		
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
			res.ridesPerRider = rows;						
			callback(null,res);
		}		
	});		
}

function handle_timebasedstats(msg,callback) {		
	var json_responses;
	var res = {};
	
	var sql = "SELECT HOUR(START_TIME) AS label, COUNT(*) as value FROM RIDES GROUP BY label";
	mysql.getStatsData(sql, function(err, rows) {		
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
			res.timebasedstats = rows;	
			
			
			
			callback(null,res);
		}		
	});		
}

function handle_locationbasedstats(msg,callback) {		
	var json_responses;
	var res = {};
	
	//var sql = "SELECT SOURCE_LAT,SOURCE_LANG FROM RIDES";
	var sql = "SELECT SUM(PRICE) as revenue, COUNT(*) as value, year(START_TIME) as label FROM RIDES GROUP BY label";
	mysql.getStatsData(sql, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Getting locbasedstats");
			res.code = err.code;
			res.value = "Unexpected Error!";
			console.log(err);			
			callback(null,res);			
		} else {						
			console.log("From Get Rider result of querydb: "	+ JSON.stringify(rows));			
			res.code = "200";
			res.value = "Success";
			res.revenuebasedstats = rows;				
			callback(null,res);
		}		
	});		
}

exports.handle_locationbasedstats = handle_locationbasedstats;
exports.handle_timebasedstats = handle_timebasedstats;
exports.handle_ridesperrider = handle_ridesperrider;
exports.handle_ridesperdriver = handle_ridesperdriver;