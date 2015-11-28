/**
 * http://usejsdoc.org/
 */


var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/uberdb";
var mysql = require("./mysql");
var total_count;
var avail_count;

exports.handle_request_getFareEstimate = function(msg,callback){
	var res = {};
	console.log("msg is - "+ msg.time + " "+msg.distance+" "+msg.duration);
	
	//mongo
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at driversignup: ' + mongoURL);
		var coll = mongo.collection('drivers');
		
		coll.find().count(function(err, Tcount){
			if (Tcount) {
				total_count = Tcount;
				console.log("Avail Counr - "+ total_count);
				coll.find({"status" : "0"}).count(function(err, count){
					if (count) {
						console.log("Avail Counr - "+ count);						
						calprice(total_count, count, msg.distance, msg.duration, msg.time, msg.weekend, function(price){
							res.minprice = price*0.9;
							res.code = 200;
							res.maxprice = price*1.1;
							res.value = "Success";
							callback(null, res);
						});											
					} else {
						console.log("Unable to get avail count");
						res.code = 404;
						res.value = "Failed";
						callback(null, res);
					}
				});
				
			}else{
				console.log("Unable to get total count");
				res.code = "401";
				res.value = "Failed";
				callback(null, res);
			}
		});
	});
};

function calprice (totCnt, avlCnt, dist, dur, time, weekend, callback){
	
	console.log("Inside calprice "+ totCnt + " " + avlCnt);
	//callback(20);
	
	var price;
	var minFare;
	var basefare;
	var minutefare;
	var distancefare;
	var ratio;
	var hr;
	var factor;
	
	var peaktime=0; 
	var splittime = time.split(":");	
	
	hr = splittime[0];
	price = 0 ;
	factor = 0;
	
	basefare = 2.2; // base fare	
	minFare = 6; //Minimum fare	
	ratio =  avlCnt / totCnt; //ration of avail drivers/total drivers	
	minutefare=0.26*dur; //price on duration of the ride	
	distancefare= 1.30*dist; //price on distance of the ride
	
	price = basefare + minutefare + distancefare;  

	console.log("Price1 is "+ price);
	
	//calculate factor based on demand and supply
	if (ratio < 0.1) {
		factor = 300;
	} else 
	if(ratio < 0.3){
		factor = 200;
	} else
	if(ratio < 0.5){
		factor = 150
	} else 
	if(ratio <= 0.75){
		factor = 120;
	} else
	if(ratio < 0.8){
		factor = 100;
	}else{
		factor = 90;
	}
	
	console.log("ratio facto - " + factor);
	
	//calculate factor based on time
	if ( (hr>7 && hr<11) ||(hr>15 && hr<20)) {
		factor = factor + 100;
	} else 
	if(hr>=20 && hr<24) {
		factor = factor + 50;
	} else 
	if(hr>=0 && hr<6) {
		factor = factor + 75;
	}
	
	console.log("time facto - " + factor);
	
	if(weekend == 1 ){
		factor = factor + 50;
	}
	
	console.log("weekend facto - " + factor);

	price = price * factor / 100;
	
	if(price < minFare)
		price = minFare;
	
	console.log("Price is "+ price);
	
	callback(price);

};

exports.calprice = calprice ;

