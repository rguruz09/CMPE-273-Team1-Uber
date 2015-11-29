var mq_client = require('../rpc/client');
var request = require('request');

function getDriverBasedStats(req, res) {
    var msg_payload = {};
    mq_client.make_request('ridesperdriver', msg_payload, function(err, results) {
        if (err) {
            throw err;
        } else {
            console.log("After ridesperdriver::" + results.code);
            if (results.code == 200) {
                res.send({
                    "ridesPerDriver": results.ridesPerDriver
                });

            } else {
                console.log("Error in Fetching all riders");
            }
        }
    });
}

function getRiderBasedStats(req, res) {
    var msg_payload = {};
    mq_client.make_request('ridesperrider', msg_payload, function(err, results) {
        if (err) {
            throw err;
        } else {
            console.log("After ridesperrider::" + results.code);
            if (results.code == 200) {
                res.send({
                    "ridesPerRider": results.ridesPerRider
                });

            } else {
                console.log("Error in Fetching all riders");
            }
        }
    });
}

function timebasedstats(req, res) {
    var msg_payload = {};
    mq_client.make_request('timebasedstats', msg_payload, function(err, results) {
        if (err) {
            throw err;
        } else {
            console.log("After timebasedstats::" + results.code);
            if (results.code == 200) {
                res.send({
                    "timebasedstats": results.timebasedstats
                });
            } else {
                console.log("Error in Fetching all riders");
            }
        }
    });
}

function locationbasedstats(req, res) {
    var msg_payload = {};
    var res1 = {};
    mq_client.make_request('locationbasedstats', msg_payload, function(err, results1) {
        if (err) {
            throw err;
        } else {
            console.log("After locationbasedstats::" + results1.code);
            if (results1.code == 200) {
            	 res.send({
                     "revenuebasedstats": results1.revenuebasedstats
                 });
            	/*
                var numCompletedCalls = 0
                for (var i = 0; i < results1.locbasedstats.length; i++) {
                	var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + results1.locbasedstats[i].SOURCE_LAT + "," + results1.locbasedstats[i].SOURCE_LANG + "&sensor=true";
                	console.log("URL" + url);
                    request('http://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=true', function(error, response, body) {
                        numCompletedCalls++;
                        if (!error && response.statusCode == 200) {
                        	console.log(response);
                            if (response.results.length > 0) {
                                res1.push(response.results[0]);
                            }
                            if (numCompletedCalls == elements.length) {
                                console.log(res1);
                            }

                        }
                    });
                }
            */} else {
                console.log("Error in Fetching all riders");
            }
        }
    });
}

function getZips(locs, callback) {
    var res = {};
    for (var i = 0; i < results.locbasedstats.length; i++) {
        var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + results.locbasedstats[i].SOURCE_LAT + "," + results.locbasedstats[i].SOURCE_LANG + "&sensor=true";
        console.log(url);
        request('http://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=true', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(response.results); // Show the HTML for the Google homepage.
                if (response.results.length > 0) {
                    res.push(response.results[0]);
                }
            }
        })
    }
}


exports.getRiderBasedStats = getRiderBasedStats;
exports.getDriverBasedStats = getDriverBasedStats;
exports.timebasedstats = timebasedstats;
exports.locationbasedstats = locationbasedstats;