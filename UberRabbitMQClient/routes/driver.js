/**
 * http://usejsdoc.org/
 * This module will handle driver module API calls
 */
var mq_client = require('../rpc/client');


exports.getDrivers = function(req,res){
	
	var lat = req.param('lat');
	var lang = req.param('lang');
	
	var msg_payload = {"lat" : lat, "lang" : lang};
	
	console.log(msg_payload);
	mq_client.make_request('get_drivers_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			console.log("Result is: " + results.code);
			if(results.code == 404){
				console.log("unable to post");
				res.json({
					members : 0 
				});		
			}
			else {  
				console.log(" fetching success");			
				res_json = results;
				res.send(res_json);				
			}
		}  
	});
}