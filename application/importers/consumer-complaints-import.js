const csvDownloadAddress = "https://data.consumerfinance.gov/api/views/s6ew-h6mp/rows.csv?accessType=DOWNLOAD";
const CONS_COMPLAINT_TOKEN = "OaSXPtEbfqCcNwLKRyYjhogng";
const CONS_COMPL_API_HOST = "data.consumerfinance.gov";
const CONS_COMPL_API_ENDPOINT = "/resource/jhzv-w97w.json";
const CONS_COMPLAINT_LIMIT = 1000;


var dbUtils = require('../database/db-utils');


function ConsumerComplaintsImport(address) {
    this.working = true;
    this.complaintModel = require('../database/complaint-db');
    this.requestsAllSent = false;
    this.requestsNeedingToBeSaved = 0;
    this.lastEvent = null;
    clearPromise = this.complaintModel.clear();
    clearPromise.then (
         a => {
            this.performRequest(0);
        }
    )
    clearPromise.catch ( function(reason) {
           throw new Error("Clear failed: " + reason);
        }
    )
}

ConsumerComplaintsImport.prototype.isDone = function() {
    return ((this.requestsAllSent) && (this.requestsNeedingToBeSaved <= 0))
}


// ConsumerComplaintsImport.prototype.translateState = function(stateCode) {
//     var stateName = STATES[stateCode];
//     if (stateName == null) {
//         throw new Error("Could not find state for code: " + stateCode);
//     }
//     return stateName
// }

ConsumerComplaintsImport.prototype.processRequest = function(offset, dataOut) {
    if (dataOut.length == CONS_COMPLAINT_LIMIT) {
        this.performRequest(offset + CONS_COMPLAINT_LIMIT);
    } else {
        this.requestsAllSent = true;
    }
    this.requestsNeedingToBeSaved += dataOut.length;
    dataOut.forEach(function(complaint) {
        if (complaint.state != null) {
            dateParts = complaint.date_received.split("-");
            data = {
                id:         complaint.complaint_id,
                company:    complaint.company,
                year:       parseInt(dateParts[0]),
                month:      parseInt(dateParts[1]),
                state:      complaint.state.toLowerCase(),
                product:    complaint.product,
                sub_product: complaint.sub_product
            };
            this.complaintModel.create(data, function() {
                this.requestsNeedingToBeSaved--;
            }.bind(this));
            eventDescription = "Complaint saved: " + data.date + "  " + data.state + "  " + data.company;
            this.lastEvent = eventDescription;
        }
    }.bind(this));
}

ConsumerComplaintsImport.prototype.performRequest = function(offset) {
    method = "GET";
    var endpoint = CONS_COMPL_API_ENDPOINT;
    var querystring = require('querystring');
    var http = require('http');
    var dataIn = {
        "$$app_token": CONS_COMPLAINT_TOKEN,
        "$limit" : CONS_COMPLAINT_LIMIT,
        "$offset" : offset
    };

    var dataString = JSON.stringify(dataIn);

    endpoint += '?' + querystring.stringify(dataIn);
    var options = {
        host: CONS_COMPL_API_HOST,
        path: endpoint,
        method: "GET",
        headers: {}
    };
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
                this.processRequest(offset, responseObject);
            }.bind(this));
        } else {
            throw new Error("API call returned error code: " + res.statusCode);
        }
    }.bind(this));
    req.write(dataString);
    req.end();
}

// census.collection((collection) => {
//     collection.find({date: "2015-04"}).sort({pop: -1}).limit(10).toArray((err, documents) => {
//         if (err) throw new Error("Error searching", err);
//         console.info("Found: " + documents.length);
//         documents.forEach((stateData) => {
//             console.info("State: " + stateData["state"] + "  Population: " + stateData['pop']);
//         });
//
//     });
// });


var _complaintsImporter = null;

exports.importIfEmpty = function() {
    var complaint = require('../database/complaint-db');
    complaint.collection((collection) => {

        collection.count({}, (err, count) => {
            if (count == 0) {
                _complaintsImporter = new ConsumerComplaintsImport(function() {
                    console.info("Done importing complaint records");
                });
            } else {
                console.info("Complaint data saved, no import performed.");
            }
        });
    });

}

exports.import = function() {
    try {
        _complaintsImporter = new ConsumerComplaintsImport(function() {
            console.info("Done importing complainy records");
        });
    } catch (err) {
        console.error("Exception in code" + err.stack);
    }
}

exports.inProgress = function() {
    return ((_complaintsImporter != null) && (_complaintsImporter.isDone() == false));
}
