/**
 * http://usejsdoc.org/
 */
var mq_client = require('../rpc/client');

exports.getfareEstimate = function(req, res){
	var time = req.param("time");
	var distance = req.param("distance");
	var duration = req.param("duration");
    var weekend = req.param("weekend");
    var res_json = {};
    
    console.log("User Email is "+ req.session.email);
	console.log("req params - "+ time+" "+distance+" "+duration);
	
	var msg_payload = {"time" : time, "distance" : distance, "duration" : duration, "weekend" : weekend };

	console.log(msg_payload);
	
	mq_client.make_request('get_FareEstimate_queue',msg_payload, function(err,results){
		
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
