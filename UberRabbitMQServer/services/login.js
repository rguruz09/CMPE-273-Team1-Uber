var mysql = require("./mysql");

function handle_request_addRider(msg, callback){
	
	var res = {};	
	res.code = "200";
	res.value = "Succes Login";

	// SQL Code
	// create the query string 
	//use the mysql.js to complete the query
	var addRider="insert into customer(customerid,firstname,lastname,address,city,state,zipcode,phone,email,cardnumber,month,year,cvv) values ('" 
			+msg.ssn+"','"
			+msg.firstName+"','"
			+msg.lastName+"','"
			+msg.address+"','"
			+msg.city+"','"
			+msg.state+"','"
			+msg.PostalCode+"','"
			+msg.mobile+"','"
			+msg.email+"','"
			+msg.CreditCard+"','"
			+msg.month+"','"
			+msg.year+"','"
			+msg.cvv+"')";
	
	console.log("In handle request:"+ msg.firstname);	
	console.log("Query is:"+addRider);
	
	mysql.querydb(addRider, function(err,rows) {
		if(err)
		{
			throw err;
		}
		else
		{	
			console.log("From login.js result of querydb: " +JSON.stringify(rows));
			callback(null,res);
		}
		
		console.log("From login.js Added rider to DB");
	});
}


exports.handle_request_addRider = handle_request_addRider;
