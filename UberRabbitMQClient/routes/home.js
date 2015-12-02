var bcrypt = require("bcrypt");
var mq_client = require('../rpc/client');

function driverSignup(req,res) {
	res.render("driverSignup");
}

function riderSignup(req,res) {
	res.render("riderSignup");
}

function commonLogin(req,res) {
	res.render("commonLogin");
}

function driverSignin(req,res){
	console.log("In driver signin");
res.render("driverSignin");
}

function riderSignin(req,res){
res.render("riderSignin");
}

function rideHistory(req,res){
	res.render("rideHistory");
	}

function adminSignin(req,res){
	res.render("adminSignin");
	}


function driverProfile(req,res){
	 if (!req.session.driverID) 
		 res.redirect('/');
	 else
		 res.render('driverProfile',{ "email":req.session.driverID});
	}


exports.adminSignin= adminSignin;
exports.driverSignup= driverSignup;
exports.commonLogin= commonLogin;
exports.driverSignin= driverSignin;
exports.riderSignin= riderSignin;
exports.riderSignup = riderSignup;
exports.driverProfile = driverProfile;
exports.rideHistory = rideHistory;