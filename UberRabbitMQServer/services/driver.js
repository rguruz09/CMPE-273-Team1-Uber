/**
 * http://usejsdoc.org/
 */
var mysql = require("./mysql");

function handle_get_drivers_queue (msg,callback) {

	console.log("In handle_get_drivers_queue request:"+ msg.lat +" "+msg.lang );	
	
	var lat = msg.lat
	var lang = msg.lang;	
	
	var res = {};
	var query = "SELECT DRIVER_ID, LATITUDE, LANGITUDE, ACOS( SIN( RADIANS( LATITUDE ) ) * SIN( RADIANS("+ lat +") ) + COS( RADIANS( LATITUDE ) ) * COS( RADIANS("+ lat +")) * COS( RADIANS( LANGITUDE ) - RADIANS("+ lang +")) ) * 6380 AS distance FROM DRIVER_LOCATION WHERE ACOS( SIN( RADIANS( LATITUDE ) ) * SIN( RADIANS( " + lat +") ) + COS( RADIANS( LATITUDE ) ) * COS( RADIANS( "+  lat +" )) * COS( RADIANS( LANGITUDE ) - RADIANS( "+ lang+" )) ) * 6380 < 10 ORDER BY distance";
	
	mysql.executeQuery(query, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Getting drivers");
			res.code = 404;	
			res.value = "Fail";
			console.log(err);			
			callback(null,res);			
		} else {						
			console.log("From Get Rider result of querydb: "	+ JSON.stringify(rows));			
			res.code = "200";
			res.value = "Success";
			res.data = rows;
			callback(null,res);
		}		
	});	
}


exports.handle_get_drivers_queue = handle_get_drivers_queue;