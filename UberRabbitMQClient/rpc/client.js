var amqp = require('amqp');

var connection = amqp.createConnection({host:'127.0.0.1'});
var rpc = new (require('./amqprpc'))(connection);


function make_request(queue_name, msg_payload, callback){
	
	console.log("In client.js");
	rpc.makeRequest(queue_name, msg_payload, function(err, response){
		if(err)
			console.log("Problem with RPC Make request: Please restart the server");
			//console.error(err);
		else{
			console.log("In client.js: Response of makeRequest :: " + JSON.stringify(response));
			callback(null, response);
		}
		//connection.end();
	});
}

exports.make_request = make_request;



