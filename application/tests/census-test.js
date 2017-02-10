const assert = require('assert');


var censusKey = "54e58ceb2cbb922837bde9d29ff87936a1eff60c";

// http://api.census.gov/data/2016/pep/components?get=BIRTHS,DEATHS,GEONAME&for=state:*&PERIOD=1&key=54e58ceb2cbb922837bde9d29ff87936a1eff60c


var Promise = require('promise');

var querystring = require('querystring');
var http = require('http');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/omb');


function CensusWriter(callback) {
    this.callback = callback;
    this.numberOfRequestsStarted = 0;
    this.numberOfRequestsCompleted = 0;
    this.fields = null;
    this.dataHash = new Object();
    this.host = "api.census.gov"

    var requests = [];
    for (var year = 2013; year <= 2016; year++) {
        for (var month = 1; month <= 12; month++) {
            requests.push( { month: month, year: year });
        }
    }
    this.numberOfRequestsStarted = requests.length;
    requests.forEach(function(request) {
        this.performRequest(request.year, request.month);
    }.bind(this));
}

CensusWriter.prototype.processStateRow = function(year, month, fields, stateRow) {
    var dataHash = this.dataHash;
    indexOfState = fields.indexOf("geoname");
    state = stateRow[indexOfState];

    //  Some years have states like: 'Alabama, East South Central, South, United States'
    state = state.split(",")[0];

    if (dataHash[state] == null) {
        dataHash[state] = new Object();
    }
    monthYear = "" + month;
    while (monthYear.length < 2) {
        monthYear = "0" + monthYear;
    }
    monthYear = "" + year + "." + monthYear;
    if (dataHash[state][monthYear] == null) {
        dataHash[state][monthYear] = new Object();
    }

    //        var stateMonthData = new Object();
    stateRow.forEach(function(column, index) {
        columnName = fields[index];
        if (columnName != "geoname") {
            dataHash[state][monthYear][columnName] = column;
        }
    });
}


CensusWriter.prototype.processRequest = function(year, month, dataOut) {
    fields = [];
    headerRow = dataOut[0];
    headerRow.forEach(function(column, index) {
        fieldName = column.toLowerCase();
        fields.push(fieldName);
    });

    for(i = 1; i < dataOut.length - 1; i++) {
        stateRow = dataOut[i];
        this.processStateRow(year, month, fields, stateRow);
    }
}

CensusWriter.prototype.isDone = function() {
    return (this.numberOfRequestsCompleted == this.numberOfRequestsStarted);
}

CensusWriter.prototype.performRequest = function(year, month) {
    method = "GET";
    var endpoint = "/data/" + year + "/pep/components"

    var dataIn = {
        get: "BIRTHS,DEATHS,GEONAME",
        for: "state:*",
        PERIOD: month,
        key: censusKey
    }

    console.info("Host: " + this.host + "  Data: " + dataIn.toString());
    var dataString = JSON.stringify(dataIn);
    var headers = {};

    if (method == 'GET') {
        endpoint += '?' + querystring.stringify(dataIn);
    } else {
        headers = {
            'Content-Type': 'application/json',
            'Content-Length': dataString.length
        };
    }
    var options = {
        host: this.host,
        path: endpoint,
        method: method,
        headers: headers
    };
    this.requestInProgressCount++;

    var req = http.request(options, function(res) {
        res.setEncoding('utf-8');
        console.info("RESPONSE - " + options.path + " Status code: " + res.statusCode);
        var responseString = '';
        if (res.statusCode == 200) {
            res.on('data', function(data) {
                responseString += data;
            });

            res.on('end', function() {
                var responseObject = JSON.parse(responseString);
                this.processRequest(year, month, responseObject);
            }.bind(this));
        }
        this.numberOfRequestsCompleted++;
        console.info("Requested: " + this.numberOfRequestsStarted + "  Finished: " + this.numberOfRequestsCompleted);
        if (this.isDone()) {
            this.callback("done");
        }
    }.bind(this));
    req.write(dataString);
    req.end();

}


function onComplete(status) {
    debugger;
    console.info("Done");
}

censusWriter = new CensusWriter(onComplete);




