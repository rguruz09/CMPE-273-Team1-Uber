var mysql = require('mysql');

function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : 'raghu',
	    database : 'uber'
	});
	return connection;
}

exports.authenticate = function(tableName,email, callback) {
    var sql = "SELECT firstname,lastname,password FROM " + tableName + " where email = ?";
    // get a connection from the pool
    var arr =[email];
    var connection = getConnection();
	connection.query(sql, arr, function(err, results) {
		if (err) {
			console.log(err);
			callback(true, err);
			return;
		}
		callback(false, results);
	});
};


exports.insert = function(tableName, arr, callback) {
	var sql = "INSERT into " + tableName + " SET ?";
	console.log(arr);
	var connection = getConnection();

	connection.query(sql, arr, function(err, results) {
		if (err) {
			console.log(err);
			callback(true, err);
			return;
		}
		callback(false, results);
	});
};

exports.insert1 = function(tableName, arr, callback) {
	var sql = "INSERT into " + tableName + " SET ?";
	console.log(sql);
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err);
			callback(true);
			return;
		}
		connection.query(sql, arr, function(err, results) {
			connection.release();
			if (err) {
				console.log(err);
				callback(true, err);
				return;
			}
			callback(false, results);

		});
	});
};


exports.update = function(tableName,arr,whereParam, callback){
	console.log(arr);
    var sql = "UPDATE  "+tableName+" SET ? WHERE email='"+whereParam+"'"; 
    console.log(sql);
       var connection = getConnection();
	connection.query(sql,arr,function(err, results) {
		if (err) {
			console.log(err);
			callback(true, err);
			return;
		}
		callback(false, results);
	});
};


exports.getData = function(tableName, id, whereParam, callback) {
	console.log(tableName + " " + id + " " + whereParam);
	//console.log("connection.escape(whereParam);" + connection.escape(whereParam));
	var sql = "SELECT * FROM  " + tableName + " WHERE " + id + " = \"" + whereParam+"\";";
	console.log(sql);
	
	//sql = "SELECT * FROM  customer WHERE email = \"manasa@gmail.com\"";
	var connection = getConnection();
	connection.query(sql,function(err, results) {
		if (err) {
			console.log(err);
			callback(true, err);
			return;
		}
		callback(false, results);
	});
};


exports.deleteData = function(tableName, whereParam1, whereParam2, callback) {
	console.log(tableName + " " + whereParam1 + " " + whereParam2);
	//console.log("connection.escape(whereParam);" + connection.escape(whereParam));
	var sql = "DELETE FROM  " + tableName + " WHERE email =\"" + whereParam1+"\" AND cardnumber_4= \""+ whereParam2 +"\";";
	console.log(sql);
	
	//sql = "SELECT * FROM  customer WHERE email = \"manasa@gmail.com\"";
	var connection = getConnection();
	connection.query(sql,function(err, results) {
		if (err) {
			console.log(err);
			callback(true, err);
			return;
		}
		callback(false, results);
	});
};


exports.executeQuerywithParam = function(query, param, callback){
	console.log("In execute query1 "+ query);
	var connection = getConnection();
	if(connection){
		connection.query(query, param, function(err, results) {
			if (err) {
				console.log("Error "+err);
			//	connection.end();
				callback(err, null );
				return;
			}
			//connection.d
			callback(false, results);
		})
	}
	else{
		console.log("Unable to get SQL connection");
		callback(true, null);
	}
}



//getting driver details
exports.executeQuery = function(query, callback){
	console.log("In execute query - "+ query);
	var connection = getConnection();
	if(connection){
		connection.query(query, function(err, results) {
			if (err) {
				console.log("Error "+err);
			//	connection.end();
				callback(err, null );
				return;
			}
			//connection.d
			callback(false, results);
		})
	}
	else{
		console.log("Unable to get SQL connection");
		callback(true, null);
	}
};
