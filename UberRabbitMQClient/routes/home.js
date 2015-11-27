var bcrypt = require("bcrypt-nodejs");
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

function driverProfile(req,res){
	res.render("driverProfile");
	}




exports.driverSignup= driverSignup;
exports.commonLogin= commonLogin;
exports.driverSignin= driverSignin;
exports.riderSignin= riderSignin;
exports.riderSignup = riderSignup;
exports.driverProfile = driverProfile;