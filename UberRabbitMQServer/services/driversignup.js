var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/UBERDB";
function handle_request(msg, callback){
	var res = {};
	var driver_details = {
			
			"firstname" : msg.firstname,
			"lastname" : msg.lastname,
			"city" : msg.city,
			"zip" : msg.zip,
			"mobile" : msg.mobile,
			"email" : msg.email,
			"password" : msg.password
		}
	console.log("In signup handle request:"+ msg.username);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at driversignup: ' + mongoURL);
		var coll = mongo.collection('drivers');

		coll.insert({firstname:msg.firstname,lastname:msg.lastname,password:msg.password,city:msg.city,zip:msg.zip,mobile:msg.mobile,email:msg.email}, function(err, user){
			
				console.log("results");
				console.log(res.code);
				res.firstname=msg.username;
				res.lastname=msg.lname;
				res.city=msg.city;
				res.zip=msg.zip;
				res.email=msg.email;
				res.mobile=msg.mobile;
				res.code = "200";
				res.value = "Success Signup";
				callback(null, res);

		});
	});
	
	
}
exports.handle_request = handle_request;