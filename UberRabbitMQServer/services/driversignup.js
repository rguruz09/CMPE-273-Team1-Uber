var mongo = require("./mongo");

var mongoURL = "mongodb://localhost:27017/uberdb";
var autoIncrement = require("mongodb-autoincrement");

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
	mongo.connect(mongoURL, function(db){
		var coll = mongo.collection('drivers');
		autoIncrement.getNextSequence(db, coll, function (err, autoIndex) {
		console.log('Connected to mongo at driversignup: ' + mongoURL);

		var coll = mongo.collection('drivers');

		coll.insert({_id: autoIndex,firstname:msg.firstname,lastname:msg.lastname,password:msg.password,city:msg.city,zip:msg.zip,mobile:msg.mobile,email:msg.email}, function(err, user){
			
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
	
	}	);
}


function handle_request_login(msg, callback){
	var res = {};
	var driver_login = {
			"email" : msg.email,
			"password" : msg.password
		}
	console.log("In Driver Login handle request:"+ msg.email);
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('drivers');

		coll.findOne({email: msg.email}, function(err, user){
			if (user) {
				console.log("Inside success");
				res.code = "200";
				res.user=user;
				res.value = "Success Login";
				callback(null, res);

			} else {
				console.log("Inside failure");
				res.code = "401";
				res.value = "Failed Login";
			}
		});
	});
	
	
}

function handle_request_cardetails(msg, callback){
	var res = {};

	console.log("In Car Details handle request:"+ msg.email+msg.Make+msg.Color+msg.Year+msg.license);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at driverlogin: ' + mongoURL);
		var coll = mongo.collection('drivers');
		//db.users.update({email: msg.email},{$set : {"car": {"Make":msg.Make,"Color":msg.Color,"Year":msg.Year,"license":msg.license}}});
		
		coll.update({email:"david@gmail.com"},{$set : {"car": {"Make":msg.Make,"Color":msg.Color,"Year":msg.Year,"license":msg.license}}}, 
			//	coll.insert({email:msg.email},	
				function(err, user){
			if (user) {
				console.log("Car Details insert success");
				res.code = "200";
				res.user=user;
				res.value = "Success Login";
				callback(null, res);

			} else {
				console.log("Car Details insert failed");
				res.code = "401";
				res.value = "Failed Login";
			}
		});
	});
	
	
}



exports.handle_request = handle_request;

exports.handle_request_login = handle_request_login;

exports.handle_request_cardetails = handle_request_cardetails;