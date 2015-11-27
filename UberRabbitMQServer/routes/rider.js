var bcrypt = require("bcrypt");
var mq_client = require('../rpc/client');

function addRider(req, res) {
	console.log("In addRider client ");
	var email = req.param("email");
	var password = req.param("password");
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var mobile = req.param("mobile");
	var ssn = req.param("ssn");
	var address = req.param("address");
	var city = req.param("city");
	var state = req.param("state");
	var creditcard = req.param("creditcard");
	var cvv = req.param("cvv");
	var month = req.param("month");
	var year = req.param("year");
	var postalcode = req.param("postalcode");
	var cardholder = req.param("cardholder");
	
	var salt1 = bcrypt.genSaltSync(10);
	var passwordHash = bcrypt.hashSync(password, salt1);
	
	var salt2 = bcrypt.genSaltSync(10);
	var ssnHash = bcrypt.hashSync(ssn, salt2);
	
	var salt3 = bcrypt.genSaltSync(10);
	var creditcardHash = bcrypt.hashSync(creditcard, salt3);
	
	var salt4 = bcrypt.genSaltSync(10);
	var cvvHash = bcrypt.hashSync(cvv, salt4);

	var json_responses;

	var msg_payload = {
		"email" : email,
		"password" : passwordHash,
		"firstname" : firstname,
		"lastname" : lastname,
		"mobile" : mobile,
		"ssn" : ssnHash,
		"address" : address,
		"city" : city,
		"state" : state,
		"cardholder":cardholder,
		"creditcard" : creditcardHash,
		"cvv" : cvvHash,
		"month" : month,
		"year" : year,
		"postalcode" : postalcode		
	};	
	
	mq_client.make_request('addRider_queue', msg_payload,
			function(err, results) {
				console.log("RESULTS::" + results.code);
				if (err) {
					throw err;
				} else {
					if (results.code == 200) {
						json_responses = {
							"statusCode" : results.code
						};
						console.log("Valid Signup");
						res.json(json_responses);

					} else if (results.code != 200) {
						json_responses = {
							"statusCode" : results.code
						};
						console.log("Could not Sigin Up");
						res.json(json_responses);
					}
				}
			});
};



function checkRiderLogin (req,res) {
	var email = req.param("email");
	var password = req.param("password");

	//password
	var msg_payload = { "email": email };	
	console.log("In POST Request = UserName:" + email + " " + password);	

	mq_client.make_request('login_rider_queue',msg_payload, function(err,results) {		
		if(err) {
			throw err;
		}
		else {
			console.log("After Queue::" + results.code);
			if(results.code == 200)	{		
				console.log("Authenticating using BCRYPT..");
				if(bcrypt.compareSync(password, results.password) == true) {
					console.log("Done using BCRYPT..");			
					req.session.email = email;
					req.session.firstname = results.firstname;
					req.session.lastname = results.lastname;
					console.log("Valid Login");						
					res.send({"login":"Success"});	
				} else {
					console.log("Invalid Login - Password Mismatch");
					res.send({"login":"Fail"});
				}		
			}
			else {    				
				console.log("Invalid Login");
				res.send({"login":"Fail"});
			}
		}  
	});	
};

function getRiderDetails(req,res) {
	
	console.log("In Get Rider Details");
	var msg_payload = { "email": req.session.email};
	mq_client.make_request('get_rider_queue',msg_payload, function(err,results) {		
		if(err) {
			console.log(err);
		}
		else {
			console.log("After get_rider_queue Queue::" + results.code);
			if(results.code == 200)	{
				res.send({"rider" : results.user});
			}
			else {    				
				console.log("Invalid Login");
				res.send({"login":"Fail"});
			}
		}  
	});	
}

function homePageRider(req, res){
	console.log("In Home Page Rider::" + req.session.email);
	 if (!req.session.email) 
		 res.redirect('/');
	 else
		 res.render('homePageRider',{ "firstname":req.session.firstname,"lastname":req.session.lastname});
};

function bookRide(req, res){
	 if (!req.session.email) 
		 res.redirect('/');
	 else
		 res.render('bookRide',{ "firstname":req.session.firstname,"lastname":req.session.lastname});
};

function tripsPage(req, res){
	 if (!req.session.email) 
		 res.redirect('/');
	 else
		 res.render('tripsPage',{ "firstname":req.session.firstname,"lastname":req.session.lastname});
};

function paymentDetails(req, res){
	 if (!req.session.email) 
		 res.redirect('/');
	 else
		 res.render('paymentDetails',{ "firstname":req.session.firstname,"lastname":req.session.lastname});
};

function logout(req, res){
	req.session.destroy();
	res.redirect('/');
};


exports.getRiderDetails = getRiderDetails;
exports.tripsPage = tripsPage;
exports.homePageRider = homePageRider;
exports.bookRide = bookRide;
exports.logout = logout;
exports.addRider = addRider;
exports.paymentDetails = paymentDetails;
exports.checkRiderLogin = checkRiderLogin;