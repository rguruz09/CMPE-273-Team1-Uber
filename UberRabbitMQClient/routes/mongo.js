var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;
var ObjectID = require('mongodb').ObjectID;
var testVar = "hello!";

/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(url, callback){
    MongoClient.connect(url, function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      console.log(connected +" is connected?");
      callback(db);
    });
};

exports.testVar = testVar;
exports.ObjectID = ObjectID;
/**
 * Returns the collection on the selected database
 */
exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.collection(name);
  
};