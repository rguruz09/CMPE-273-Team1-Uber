var mysql = require('mysql');


var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'raghu',
    database: 'uber',
    connectionLimit: 100,
    supportBigNumbers: true
});

exports.authenticate = function(tableName,email, callback) {
    var sql = "SELECT firstname,lastname,password FROM " + tableName + " where email = ?";
    // get a connection from the pool
    var arr =[email];
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
	connection.query(sql, arr, function(err, results) {
		if (err) {
			console.log(err);
			callback(true, err);
			return;
		}
		callback(false, results);
	});
    });
};

exports.authenticate_approval = function(tableName, email, callback) {
	var sql = "SELECT firstname,lastname,isapproved,password FROM " + tableName
			+ " where email = ?";
	// get a connection from the pool
	var arr = [ email ];
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err);
			callback(true);
			return;
		}
		// make the query
		connection.query(sql, arr, function(err, results) {
			if (err) {
				console.log(err);
				callback(true, err);
				return;
			}
			callback(false, results);
		});
	});
};
exports.insert = function(tableName, arr, callback) {
	var sql = "INSERT into " + tableName + " SET ?";
	console.log(arr);
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
	connection.query(sql, arr, function(err, results) {
		if (err) {
			console.log(err);
			callback(true, err);
			return;
		}
		callback(false, results);
	});
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
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
	connection.query(sql,arr,function(err, results) {
		if (err) {
			console.log(err);
			callback(true, err);
			return;
		}
		callback(false, results);
	});
	});
};


exports.getData = function(tableName, id, whereParam, callback) {
	console.log(tableName + " " + id + " " + whereParam);
	//console.log("connection.escape(whereParam);" + connection.escape(whereParam));
	var sql = "SELECT * FROM  " + tableName + " WHERE " + id + " = \"" + whereParam+"\";";
	console.log(sql);
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
	connection.query(sql,function(err, results) {
		if (err) {
			console.log(err);
			callback(true, err);
			return;
		}
		callback(false, results);
	});
    });
};


exports.deleteData = function(tableName, whereParam1, whereParam2, callback) {
	console.log(tableName + " " + whereParam1 + " " + whereParam2);
	//console.log("connection.escape(whereParam);" + connection.escape(whereParam));
	var sql = "DELETE FROM  " + tableName + " WHERE email =\"" + whereParam1+"\" AND cardnumber_4= \""+ whereParam2 +"\";";
	console.log(sql);
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
	connection.query(sql,function(err, results) {
		if (err) {
			console.log(err);
			callback(true, err);
			return;
		}
		callback(false, results);
	});
    });
};


exports.executeQuerywithParam = function(query, param, callback){
	console.log("In execute query1 "+ query);
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
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
    });
}



//getting driver details
exports.executeQuery = function(query, callback){
	console.log("In execute query - "+ query);
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
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
});
};

exports.getStatsData = function(sql, callback) {
	console.log(sql);
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
	connection.query(sql,function(err, results) {
		if (err) {
			console.log(err);
			callback(true, err);
			return;
		}
		callback(false, results);
	});
    });
};

exports.selectAll = function(tableName,callback) {
	console.log("Getting Details from " + tableName);
	var sql = "SELECT * FROM  " + tableName;
		
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
	connection.query(sql,function(err, results) {
		if (err) {
			console.log(err);
			callback(true, err);
			return;
		}
		callback(false, results);
	});
    });
}



exports.selectAllApproved = function(tableName,callback) {
	console.log("Getting Details from " + tableName );
	var sql = "SELECT * FROM  " + tableName   + " where isapproved = 1";
	
	console.log(sql);
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
	connection.query(sql,function(err, results) {
		if (err) {
			console.log(err);
			callback(true, err);
			return;
		}
		callback(false, results);
	});
    });
}

exports.selectAllUApproved = function(tableName, callback) {
	console.log("Getting Details from " + tableName);
	var sql = "SELECT * FROM  " + tableName + " where isapproved = 0";

	console.log(sql);
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err);
			callback(true);
			return;
		}
		// make the query
		connection.query(sql, function(err, results) {
			if (err) {
				console.log(err);
				callback(true, err);
				return;
			}
			callback(false, results);
		});
	});
}

exports.approveRider = function(tableName,email, callback) {
	console.log("Getting Details from " + tableName);
	var sql = "UPDATE " + tableName + " SET isapproved = 1 " + " where email =\"" + email + "\"";	
	console.log(sql);
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err);
			callback(true);
			return;
		}
		// make the query
		connection.query(sql, function(err, results) {
			if (err) {
				console.log(err);
				callback(true, err);
				return;
			}
			callback(false, results);
		});
	});
}