var bcrypt = require("bcrypt");
var mq_client = require('../rpc/client');

function addRider(req, res) {
	console.log("In addRider client ");
	var email = req.param("email");
	var password = req.param("password");
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var mobile = req.param("mobile");
	var address = req.param("address");
	var city = req.param("city");
	var state = req.param("state");
	//var creditcard = req.param("creditcard");
	var creditcard_12 = req.param("creditcard_12");
	var creditcard_4 = req.param("creditcard_4");
	var cvv = req.param("cvv");
	var month = req.param("month");
	var year = req.param("year");
	var postalcode = req.param("postalcode");
	var cardholder = req.param("cardholder");
	
	var salt1 = bcrypt.genSaltSync(10);
	var passwordHash = bcrypt.hashSync(password, salt1);
	
		
	var salt3 = bcrypt.genSaltSync(10);
	//var creditcardHash = bcrypt.hashSync(creditcard, salt3);
	var creditcardHash = bcrypt.hashSync(creditcard_12, salt3);
	
	var salt4 = bcrypt.genSaltSync(10);
	var cvvHash = bcrypt.hashSync(cvv, salt4);

	var json_responses;

	var msg_payload = {
		"email" : email,
		"password" : passwordHash,
		"firstname" : firstname,
		"lastname" : lastname,
		"mobile" : mobile,
		"address" : address,
		"city" : city,
		"state" : state,
		"cardholder":cardholder,
		//"creditcard" : creditcardHash,
		"creditcard_12" : creditcardHash,
		"creditcard_4" : creditcard_4,
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
							"statusCode" : 200
						};
						console.log("Valid Signup");
						res.json(json_responses);

					}
					else {
						json_responses = {
							"statusCode" : 401
						};
						console.log("Could not Sign Up");
						res.json(json_responses);
					}
				
				}
			});
};


//addcard

function saveNewCard(req, res) {
	console.log("In saev new card client ");
	var email = req.session.email;
	var creditcard_12 = req.param("cardnumber_12");
	var creditcard_4 = req.param("cardnumber_4");
	
	var cvv = req.param("cvv");
	var month = req.param("month");
	var year = req.param("year");
	var cardholder = req.param("cardholder");
	var salt3 = bcrypt.genSaltSync(10);
	//var creditcardHash = bcrypt.hashSync(creditcard, salt3);
	var creditcardHash = bcrypt.hashSync(creditcard_12, salt3);
	
	var salt4 = bcrypt.genSaltSync(10);
	var cvvHash = bcrypt.hashSync(cvv, salt4);

	var json_responses;

	var msg_payload = {
		"email" : email,
		"creditcard_12" : creditcardHash,
		"creditcard_4" : creditcard_4,
		"cvv" : cvvHash,
		"month" : month,
		"year" : year,
		"cardholder" : cardholder
	};	
	
	mq_client.make_request('saveNewCard_queue', msg_payload,
			function(err, results) {
				console.log("RESULTS::" + results.code);
				if (err) {
					throw err;
				} else {
					if (results.code == 200) {
						json_responses = {
							"statusCode" : results.code
						};
						console.log("Added card successfully");
						res.send(json_responses);

					} else if (results.code != 200) {
						json_responses = {
							"statusCode" : results.code
						};
						console.log("Could not Add card");
						res.send(json_responses);
					}
				}
			});
};



function actionUpdate(req, res) {
	console.log("In action Update client ");
	var email = req.param("email");
	var password = req.param("password");
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var phone = req.param("phone");
	var address = req.param("address");
	var city = req.param("city");
	var state = req.param("state");
	var zipcode = req.param("zipcode");
	//var salt1 = bcrypt.genSaltSync(10);
	//var passwordHash = bcrypt.hashSync(password, salt1);
	
	

	var json_responses;

	var msg_payload = {
		"firstname" : firstname,
		"lastname" : lastname,
		"email" : email,
		"phone" : phone,
		"address" : address,
		"city" : city,
		"state" : state,
		"zipcode" : zipcode,
		"password" : password
	};	
	console.log("before request "+msg_payload);
	mq_client.make_request('updateRider_queue', msg_payload,
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
					if(results.isapproved == 0)
						res.send({"login":"Unappoved","statusCode":207});
					else {
						req.session.email = email;
						req.session.firstname = results.firstname;
						req.session.lastname = results.lastname;
						console.log("Valid Login");								
						res.send({"login":"Success","statusCode":results.code});	
					}
				} else {
					console.log("Invalid Login - Password Mismatch");
					res.send({"login":"Fail","statusCode":401});
				}		
			}
			else {    				
				console.log("Invalid Login");
				res.send({"login":"Fail","statusCode":401});
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

//
function paymentInfo(req,res) {
	
	console.log("In paymentInfo Details");
	var msg_payload = { "email": req.session.email};
	mq_client.make_request('get_paymentInfo_queue',msg_payload, function(err,results) {		
		if(err) {
			console.log(err);
		}
		else {
			console.log("After get_paymentInfo_queue Queue::" + results.code);
			if(results.code == 200)	{
				console.log("inside paymentInfo details of rider.js "+ JSON.stringify(results.user));
				res.send({"rider" : results.user});
			}
			else {    				
				console.log("Invalid Login");
				res.send({"login":"Fail"});
			}
		}  
	});	
}


function paymentDelete(req,res) {
	var cardnumber_4= req.param("cardnumber_4");
	console.log("In payment delete");
	var msg_payload = { "email": req.session.email, "cardnumber_4": cardnumber_4};
	mq_client.make_request('delete_paymentInfo_queue',msg_payload, function(err,results) {		
		if(err) {
			console.log(err);
		}
		else {
			console.log("After delete payment info Queue::" + results.code);
			if(results.code == 200)	{
				res.send({"delete":"Success"});
			}
			else {    				
				console.log("Delete failed");
				res.send({"delete":"Fail"});
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

function paymentPage(req, res){
	console.log("In Payment page of Rider::" + req.session.email);
	 if (!req.session.email) 
		 res.redirect('/');
	 else
		 res.render('paymentPage',{ "firstname":req.session.firstname,"lastname":req.session.lastname});
};

function logout(req, res){
	req.session.destroy();
	res.redirect('/');
};

exports.saveNewCard = saveNewCard;
exports.paymentDelete = paymentDelete;
exports.paymentInfo = paymentInfo;
exports.paymentPage = paymentPage;
exports.actionUpdate = actionUpdate;
exports.getRiderDetails = getRiderDetails;
exports.tripsPage = tripsPage;
exports.homePageRider = homePageRider;
exports.bookRide = bookRide;
exports.logout = logout;
exports.addRider = addRider;
exports.paymentDetails = paymentDetails;
exports.checkRiderLogin = checkRiderLogin;