var mysql = require('mysql');

function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'pooja',
	    password : 'mypass',
	    database : 'UBER',
	    port	 : '/var/run/mysqld/mysqld.sock'
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
    var sql = "UPDATE  "+tableName+" SET ? WHERE id="+whereParam;
    console.log(sql);
    pool.getConnection(function(err, connection){
        if(err){console.log(err); callback(true); return;}

        connection.query(sql, arr, function(err, results){
            connection.release();
            if(err) { console.log(err); callback(true,err); return; }
            callback(false, results);

        });
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

exports.selectAll = function(tableName,callback) {
	console.log("Getting Details from " + tableName);
	var sql = "SELECT * FROM  " + tableName;
		
	var connection = getConnection();
	connection.query(sql,function(err, results) {
		if (err) {
			console.log(err);
			callback(true, err);
			return;
		}
		callback(false, results);
	});
}