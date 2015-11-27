/**
 * http://usejsdoc.org/
 */
var mq_client = require('../rpc/client');

exports.bookaride = function(req, res){
	
	var custID = req.session.email;
	var driverID = req.param("driverID");
	var duration = req.param("duration");
	var reqtime = req.param("reqtime");
	var weekend = req.param("weekend");
	var distance = req.param("distance");
	var srcLat = req.param("srcLat");
	var srcLng = req.param("srcLng");
	var descLat = req.param("descLat");
	var descLng = req.param("descLng");
	
	console.log("In book a ride "+driverID+" "+custID);
	
	var msg_payload = {"custID" : custID, "driverID" : driverID, "duration" : duration, 
						"reqtime" : reqtime, "distance" : distance, "weekend" : weekend, 
						"srcLat" : srcLat, "srcLng" : srcLng, "descLat" : descLat, 
						"descLng" : descLng};

	console.log(msg_payload);
	
	mq_client.make_request('bookaRide_queue',msg_payload, function(err,results){
		
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
					code : 404 
				});		
			}
			else {  
				console.log(" fetching success");	
				res.json({
					code : 200,
					minfare : results.minprice,
					maxfare : results.maxprice
				});		
				res.send(res_json);				
			}
		}  
	});
	
	
	
};