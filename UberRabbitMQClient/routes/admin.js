/**
 * New node file
 */

var bcrypt = require("bcrypt");
var mq_client = require('../rpc/client');

function checkAdminLogin (req,res) {
	
	console.log("Here in Check Admin");
	var email = req.param("email");
	var password = req.param("password");

	//password
	var msg_payload = { "email": email };	
	console.log("In Admin Login Request = UserName:" + email + " " + password);	

	mq_client.make_request('login_admin_queue',msg_payload, function(err,results) {		
		if(err) {
			throw err;
		}
		else {
			console.log("After login admin queue::" + results.code);
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

function adminDashBoard(req,res) {
	res.render('adminDashBoard',{ "firstname":req.session.firstname,"lastname":req.session.lastname});		
}

function getAllRidersPage(req,res) {
	res.render('getAllRiders',{ "firstname":req.session.firstname,"lastname":req.session.lastname});
}

function getAllRiders(req,res) {
	var msg_payload = {};
	mq_client.make_request('admin_get_all_riders_queue',msg_payload, function(err,results) {		
		if(err) {
			throw err;
		}
		else {
			console.log("After admin_get_all_riders_queue::" + results.code);
			if(results.code == 200)	{				
				res.send({"allRidersList":results.allRidersList});		
				
			}
			else {    				
				console.log("Error in Fetching all riders");			
			}
		}  
	});	
}

function getAllDrivers(req,res) {
	var msg_payload = {};
	mq_client.make_request('admin_get_all_drivers_queue',msg_payload, function(err,results) {		
		if(err) {
			throw err;
		}
		else {
			console.log("After admin_get_all_drivers_queue::" + results.code);
			if(results.code == 200)	{				
				res.send({"allDriversList":results.allDriversList});		
				
			}
			else {    				
				console.log("Error in Fetching all riders");			
			}
		}  
	});	
}

function getAllRidersPage(req,res) {
	res.render('getAllRiders',{ "firstname":req.session.firstname,"lastname":req.session.lastname});
}

function adminViewRider(req,res) {
	res.render('adminViewRider',{ "firstname":req.session.firstname,"lastname":req.session.lastname});
}

function getAllDriversPage(req,res) {
	res.render('getAllDrivers',{ "firstname":req.session.firstname,"lastname":req.session.lastname});
}

function getUnappDrivers(req,res) {
	var msg_payload = {};
	mq_client.make_request('admin_get_unapproved_drivers_queue',msg_payload, function(err,results) {		
		if(err) {
			throw err;
		}
		else {
			console.log("After admin_get_unapproved_drivers_queue::" + results.code);
			if(results.code == 200)	{				
				res.send({"allUnapprovedDriversList":results.allUnapprovedDriversList});						
			}
			else {    				
				console.log("Error in Fetching all riders");			
			}
		}  
	});	
}

function approveDriver(req,res) {
	var email = req.param("email");
	var msg_payload = { "email": email };
	mq_client.make_request('admin_approve_driver_queue',msg_payload, function(err,results) {		
		if(err) {
			throw err;
		}
		else {
			console.log("After admin_get_unapproved_drivers_queue::" + results.code);
			if(results.code == 200)	{				
				console.log("Driver Approved..");
				res.send({"message":"Driver Approved"});						
			}
			else {    				
				console.log("Error in Fetching all riders");			
			}
		}  
	});	
}


function getRides(req,res) {
	var msg_payload = {};
	mq_client.make_request('admin_get_rides_queue',msg_payload, function(err,results) {		
		if(err) {
			throw err;
		}
		else {
			console.log("After admin_get_rides_queue::" + results.code);
			if(results.code == 200)	{				
				res.send({"rides":results.rides});		
				
			}
			else {    				
				console.log("Error in Fetching all riders");			
			}
		}  
	});	
}


exports.getRides = getRides;
exports.approveDriver = approveDriver;
exports.getUnappDrivers = getUnappDrivers;
exports.getAllDrivers = getAllDrivers;
exports.getAllDriversPage = getAllDriversPage;
exports.adminViewRider = adminViewRider;
exports.getAllRiders = getAllRiders;
exports.getAllRidersPage = getAllRidersPage;
exports.checkAdminLogin = checkAdminLogin;
exports.adminDashBoard = adminDashBoard;
