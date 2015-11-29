var mq_client = require('../rpc/client');
var request = require('request');

function getDriverBasedStats(req,res) {
	var msg_payload = {};
	mq_client.make_request('ridesperdriver',msg_payload, function(err,results) {		
		if(err) {
			throw err;
		}
		else {
			console.log("After ridesperdriver::" + results.code);
			if(results.code == 200)	{				
				res.send({"ridesPerDriver":results.ridesPerDriver});		
				
			}
			else {    				
				console.log("Error in Fetching all riders");			
			}
		}  
	});	
}

function getRiderBasedStats(req,res) {
	var msg_payload = {};
	mq_client.make_request('ridesperrider',msg_payload, function(err,results) {		
		if(err) {
			throw err;
		}
		else {
			console.log("After ridesperrider::" + results.code);
			if(results.code == 200)	{				
				res.send({"ridesPerRider":results.ridesPerRider});		
				
			}
			else {    				
				console.log("Error in Fetching all riders");			
			}
		}  
	});	
}

function timebasedstats(req,res) {
	var msg_payload = {};
	mq_client.make_request('timebasedstats',msg_payload, function(err,results) {		
		if(err) {
			throw err;
		}
		else {
			console.log("After timebasedstats::" + results.code);
			if(results.code == 200)	{				
				res.send({"timebasedstats":results.timebasedstats});				
			}
			else {    				
				console.log("Error in Fetching all riders");			
			}
		}  
	});	
}

function locationbasedstats(req,res) {
	var msg_payload = {};
	mq_client.make_request('locationbasedstats',msg_payload, function(err,results) {		
		if(err) {
			throw err;
		}
		else {
			console.log("After timebasedstats::" + results.code);
			if(results.code == 200)	{								
				res.send({"timebasedstats":results.timebasedstats});
				  //http://maps.googleapis.com/maps/api/geocode/json with parameters latlng=40.714224,-73.961452&sensor=true
				  request('http://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=true', function (error, response, body) {
				  if (!error && response.statusCode == 200) {
				    console.log(response.results); // Show the HTML for the Google homepage.
				  }
				})				
			}
			else {    				
				console.log("Error in Fetching all riders");			
			}
		}  
	});	
}





exports.getRiderBasedStats = getRiderBasedStats;
exports.getDriverBasedStats = getDriverBasedStats;
exports.timebasedstats = timebasedstats;
exports.locationbasedstats = locationbasedstats;