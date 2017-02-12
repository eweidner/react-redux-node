const csvDownloadAddress = "https://data.consumerfinance.gov/api/views/s6ew-h6mp/rows.csv?accessType=DOWNLOAD";
const CONS_COMPLAINT_TOKEN = "OaSXPtEbfqCcNwLKRyYjhogng";
const CONS_COMPL_API_HOST = "data.consumerfinance.gov";
const CONS_COMPL_API_ENDPOINT = "/resource/jhzv-w97w.json";
const CONS_COMPLAINT_LIMIT = 1000;


// Found this at https://gist.github.com/mshafrir/2646763
const STATES = {
    "AE": "Armed Forces Europe/Canada/Mid East", "AP": "Armed Forces Pacific", "AA": "Armed Forces Americas",
    "AL": "Alabama", "AK": "Alaska", "AS": "American Samoa", "AZ": "Arizona",
    "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware",
    "DC": "District Of Columbia", "FM": "Federated States Of Micronesia", "FL": "Florida", "GA": "Georgia", "GU": "Guam",
    "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky",
    "LA": "Louisiana", "ME": "Maine", "MH": "Marshall Islands", "MD": "Maryland", "MA": "Massachusetts",
    "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska",
    "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York",
    "NC": "North Carolina", "ND": "North Dakota", "MP": "Northern Mariana Islands", "OH": "Ohio", "OK": "Oklahoma",
    "OR": "Oregon", "PW": "Palau", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island",
    "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
    "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin",
    "WY": "Wyoming"
}


function ConsumerComplaintsImport(address) {
    this.complaintModel = require('../database/complaint-db');
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


ConsumerComplaintsImport.prototype.translateState = function(stateCode) {
    var stateName = STATES[stateCode];
    if (stateName == null) {
        throw new Error("Could not find state for code: " + stateCode);
    }
    return stateName
}

ConsumerComplaintsImport.prototype.processRequest = function(offset, dataOut) {
    if (dataOut.length == CONS_COMPLAINT_LIMIT) {
        this.performRequest(offset + CONS_COMPLAINT_LIMIT);
    }
    dataOut.forEach(function(complaint) {
        if (complaint.state != null) {
            dateParts = complaint.date_received.split("-");
            date = dateParts[0] + "-" + dateParts[1];
            data = {
                id:         complaint.complaint_id,
                company:    complaint.company,
                date:       date,
                state:      this.translateState(complaint.state),
                product:    complaint.product,
                sub_product: complaint.sub_product

            };
            this.complaintModel.create(data);
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


function onComplete(status) {
    console.info("Done");
}

importer = new ConsumerComplaintsImport(csvDownloadAddress);