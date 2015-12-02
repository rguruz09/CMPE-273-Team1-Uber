var redis = require('redis');
client = redis.createClient();

//If redis not required comment the first line
exports.put = function(key,value,timeToKeep){
	//return null;
	
	console.log("In Put for:: " + key);
	var oKey = key;	
	value = JSON.stringify(value);
	var old = client.hgetall(key);
	if(old){
		clearTimeout(old.timeout);
	}
	var expireTime = timeToKeep + currTime();
	var record = {value:value,expireTime : expireTime};

	var timeout = setTimeout(function() {
		exports.del(oKey);
	},timeToKeep);

	record.timeout = timeout;
	client.hmset(key,record);
}

exports.clear = function() {
	client.flushdb();
}

/**
 * Fetch the value from cache.
 */
exports.get = function(callback, key) {
	
	//return null;
	var oKey = key;	
	var recFlag = client.hgetall(key);
	if(recFlag) {	
		client.hgetall(key, function (err, rec) {
			if(rec != null) {
				if(typeof rec != "undefined"){
					if(rec.expireTime>=currTime()){
						console.log("Returned "+key+" from cache at "+ currTime());
						callback(JSON.parse(rec.value));
					}
					else {
						exports.del(oKey);
						callback(null);
					}
				}
			} else {
				callback(null);
			}
		});
	} else {
		callback(null);
	}
}

//Comment below line for not working with cache

//exports.get = function(callback, key) {
//	callback(null);
//}

exports.del = function(key) {	
	if (client.hgetall(key)){
		client.del(key);
		console.log("Deleted from cache "+ key +" at "+currTime());
	}
}


function currTime(){
	return (new Date).getTime();
}