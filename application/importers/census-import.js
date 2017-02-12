var censusKey = "54e58ceb2cbb922837bde9d29ff87936a1eff60c";

// 2015 - 2016
// http://api.census.gov/data/2016/pep/components?get=BIRTHS,DEATHS,GEONAME&for=state:*&PERIOD=1&key=54e58ceb2cbb922837bde9d29ff87936a1eff60c
// http://api.census.gov/data/2016/pep/population?get=POP,GEONAME&for=state:*&DATE=8&key=54e58ceb2cbb922837bde9d29ff87936a1eff60c

// http://api.census.gov/data/2015/pep/components?get=BIRTHS,DEATHS,GEONAME&for=state:*&PERIOD=1&key=54e58ceb2cbb922837bde9d29ff87936a1eff60c
// http://api.census.gov/data/2015/pep/population?get=POP,GEONAME&for=state:*&DATE=8&key=54e58ceb2cbb922837bde9d29ff87936a1eff60c

// 2014
// Pop and birth/death - Date seems to be in 2 month increments
// http://api.census.gov/data/2014/pep/natstprc?get=STNAME,POP,BIRTHS,DEATHS,DOM&for=state:*&DATE=6&key=54e58ceb2cbb922837bde9d29ff87936a1eff60c

// 2013
// Pop and birth/death - Date seems to be in 2 month increments
// http://api.census.gov/data/2013/pep/natstprc?get=POP,BIRTHS,DEATHS&for=state:*&DATE=6&key=54e58ceb2cbb922837bde9d29ff87936a1eff60c


// 2012 - none of the above works


function CensusImport(callback) {
    this.censusModel = require('../database/complaint-db');
    clearPromise = this.censusModel.clear();
    clearPromise.then (
        a => {
            this.performRequest(0);
    })
    clearPromise.catch ( function(reason) {
            throw new Error("Clear failed: " + reason);
        }
    )

    this.lastEvent = null;
    this.submitApiRequests(callback);
}

CensusImport.prototype.submitApiRequests = function(callback) {
    this.callback = callback;
    this.numberOfRequestsStarted = 0;
    this.numberOfRequestsCompleted = 0;
    this.numberOfRecordsToSave = 0;
    this.fields = null;
    this.dataHash = new Object();
    this.host = "api.census.gov";
    this.requests = [];

    for (var month = 1; month <= 12; month++) {
        this.requests.push({year: 2013, month: month, period_months: 1, mid_endpoint: "natstprc", fields: "STNAME,POP,BIRTHS,DEATHS", dateField: "DATE"});
        this.requests.push({year: 2014, month: month, period_months: 1, mid_endpoint: "natstprc", fields: "STNAME,POP,BIRTHS,DEATHS", dateField: "DATE"});
        this.requests.push({year: 2015, month: month, period_months: 1, mid_endpoint: "components", fields: "BIRTHS,DEATHS,GEONAME", dateField: "PERIOD"});
        this.requests.push({year: 2015, month: month, period_months: 1, mid_endpoint: "population", fields: "POP,GEONAME", dateField: "DATE"});
        this.requests.push({year: 2016, month: month, period_months: 1, mid_endpoint: "components", fields: "BIRTHS,DEATHS,GEONAME", dateField: "PERIOD"});
        this.requests.push({year: 2016, month: month, period_months: 1, mid_endpoint: "population", fields: "POP,GEONAME", dateField: "DATE"});
    }

    this.numberOfRequestsStarted = this.requests.length;
    this.requests.forEach(function(request) {
        this.performRequest(request);
    }.bind(this));

}

CensusImport.prototype.createStateHash = function(state) {
    this.dataHash[state] = new Object();
    for (var year = 2013; year <= 2016; year++) {
        for (var month = 1; month <= 12; month++) {
            this.dataHash[state][this.monthKey(year, month)] = new Object();
            this.numberOfRecordsToSave++;

        }
    }
}

CensusImport.prototype.processStateRow = function(year, month, fields, stateRow) {
    var dataHash = this.dataHash;

    indexOfState = fields.indexOf("geoname");
    if (indexOfState < 0) indexOfState = fields.indexOf("stname");
    state = stateRow[indexOfState];

    //  Some years have states like: 'Alabama, East South Central, South, United States'
    state = state.split(",")[0];

    if (dataHash[state] == null) {
        this.createStateHash(state);
    }

    var monthYear = this.monthKey(year, month);
    // if (dataHash[state][monthYear] == null) {
    //     dataHash[state][monthYear] = new Object();
    // }
    stateRow.forEach(function(column, index) {
        columnName = fields[index];
        if ((column) && (columnName != "geoname") && (columnName != "stname") && (columnName != "dom") && (columnName != "period") && (columnName != "state") && (columnName != "date")) {
            dataHash[state][monthYear][columnName] = parseInt(column);
        }
    });
}

CensusImport.prototype.monthKey = function(year, month) {
    monthYear = "" + month;
    while (monthYear.length < 2) {
        monthYear = "0" + monthYear;
    }
    monthYear = "" + year + "-" + monthYear;
    return monthYear;
}


CensusImport.prototype.processRequest = function(year, month, dataOut) {
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

CensusImport.prototype.isDone = function() {
    return ((this.numberOfRequestsCompleted == this.numberOfRequestsStarted) && (this.numberOfRecordsToSave == 0));
}


CensusImport.prototype.performRequest = function(request) {
    method = "GET";
    var endpoint = "/data/" + request.year + "/pep/" + request.mid_endpoint;
    var querystring = require('querystring');
    var http = require('http');
    var dataIn = {
        get: request.fields,
        for: "state:*",
        key: censusKey
    }
    dataIn[request.dateField] = request.month

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
        var responseString = '';
        if (res.statusCode == 200) {
            res.on('data', function(data) {
                responseString += data;
            });

            res.on('end', function() {
                //console.info("Processing: " + responseString);
                var responseObject = JSON.parse(responseString);
                this.processRequest(request.year, request.month, responseObject);
            }.bind(this));
        }
        console.info("Census request: " + this.numberOfRequestsCompleted + " of " + this.numberOfRequestsStarted);
        this.numberOfRequestsCompleted++;
        if (this.numberOfRequestsStarted == this.numberOfRequestsCompleted) {
            this.fillInMissingData(this.dataHash);
            this.writeToDatabase();
        }
    }.bind(this));
    req.write(dataString);
    req.end();
}


/*
    Census api data has gaps in some fields.  Use simple aver bage around missing point to
    fill it in.
 */
CensusImport.prototype.fillInMissingData = function(data, fieldName) {
    for (var key in data) {
        stateData = data[key];
        var lastFields = new Object();
        for (var year = 2013; year <= 2016; year++) {
            for (var month = 1; month <= 12; month++) {
                var monthKey = this.monthKey(year, month);
                var monthData = stateData[monthKey];
                for (var fieldKey in monthData) {
                    if (monthData[fieldKey]) {
                        lastFields[fieldKey] = monthData[fieldKey];
                    }
                }
                for (var fieldKey in lastFields) {
                    if (!monthData[fieldKey]) {
                        monthData[fieldKey] = lastFields[fieldKey];
                    }
                }

            }
        }
    }
}


CensusImport.prototype.writeToDatabase = function(censusImport) {
    censusModel = require('../database/census-db');
    dataHash = this.dataHash;
    censusModel.clear(function(result) {
        for (var stateKey in dataHash) {
            stateData = dataHash[stateKey];
            dateKeys = Object.keys(stateData);
            dateKeys.forEach( function(dateKey) {
                monthData = stateData[dateKey];
                monthData["state"] = stateKey;
                monthData["date"] = dateKey;
                censusModel.create(monthData, function() {
                    console.info("Saved record: (" + monthData.state + monthData.date + ").  " + this.numberOfRecordsToSave + " remaining.");
                    this.numberOfRecordsToSave--;
                    if (this.numberOfRecordsToSave == 0) {
                        this.callback(this);
                    }
                }.bind(this));
            }.bind(this));
        }
    }.bind(this));
}


exports.importIfEmpty = function() {
    censusModel = require('../database/census-db');
    censusModel.find({ state: 'Colorado'}, function(err, documents) {
        if (err) throw new Error("Error searching", err);
        if (documents.length == 0) {
            new CensusImport.new(function() {
                console.info("Done importing records");
            });
        } else {
            console.info("Census data present - no import performed.");
        }
    });
}

exports.import = function() {
    try {
        new CensusImport(function() {
            console.info("Done importing records");
        });
    } catch (err) {
        console.error("Exception in code" + err.stack);
    }
}



