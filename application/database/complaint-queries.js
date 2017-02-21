"use strict"; 

var complaints = require('./complaint-db');
var dbUtils = require('./db-utils');

var dbConnections = require('./db-connection');
var db_name = dbConnections.findDbNameForEnv();
var url = "mongodb://mongo/" + db_name;

const db = require('monk')(url);
const complaintsMonk = db.get('complaints');

/*
    Return states with the most complaints against the product or company passed.
 */
exports.states = function(params, callback) {
    var minDate = dbUtils.encodeYearMonth(params.year, params.month);
    var maxDate = dbUtils.encodeYearMonthPlusMonths(params.year, params.month, params.months);

    var aggregation = [];

    // Fields that will be processes in aggregation pipeline.
    var project = {date: true, state: true};
    if (params.company) project['company'] = true;
    if (params.product) project['product'] = true;
    aggregation.push({ $project: project });

    var matcher = {
        date: {$gte: minDate, $lte: maxDate}
    }

    // Input params can specify a company or product that documents need to match.
    if (params.company) matcher['company'] = params.company;
    if (params.product) matcher['product'] = params.product;

    aggregation.push({$match: matcher});
    aggregation.push({
        $group: {
            _id: '$state',
            count: {$sum: 1}
        }
    });

    // How many records returned and how to sort.
    aggregation.push({$limit: params.limit});
    aggregation.push({$sort: {"count": -1}});
    count:{$sum:1}

    complaintsMonk.aggregate(aggregation).then((res) => {
        var prettyResults = [];
        res.forEach( (result) => {
            prettyResults.push({state: result._id, count: result.count});
        });
        dbUtils.addStateNamesToData(prettyResults);
        callback(prettyResults);
    }).catch(function(err) {
        console.error("Exception with product aggregate: " + err.message);
        throw err;
    });
}

/*

 */
exports.products = function(params, callback) {
    var minDate = dbUtils.encodeYearMonth(params.year, params.month);
    var maxDate = dbUtils.encodeYearMonthPlusMonths(params.year, params.month, params.months);

    var aggregation = [];

    // Fields that will be processes in aggregation pipeline.
    var project = {date: true, state: true, product: true};
    aggregation.push({ $project: project });

    // Matcher looks for documents inside of passed date range.
    var matcher = {
        date: {$gte: minDate, $lte: maxDate}
    }

    if (params.state) matcher['state'] = params.state;
    aggregation.push({$match: matcher});
    aggregation.push({
        $group: {
            _id: '$product',
            count: {$sum: 1}
        }
    });

    // How many records returned and how to sort.
    aggregation.push({$limit: params.limit});
    aggregation.push({$sort: {"count": -1}});

    // Every record found increments the count by 1.
    count:{$sum:1}
    
    // Do the aggregation
    complaintsMonk.aggregate(aggregation).then((res) => {
        var prettyResults = [];
        res.forEach((result) => {
            prettyResults.push({product: result._id, count: result.count});
        });
        callback(prettyResults);
    }).catch(function(err) {
        console.error("Exception with product aggregate: " + err.message);
        throw err;
    });

}



exports.companies = function(params, callback) {
    var minDate = dbUtils.encodeYearMonth(params.year, params.month);
    var maxDate = dbUtils.encodeYearMonthPlusMonths(params.year, params.month, params.months);

    var aggregation = [];

    // Fields that will be processes in aggregation pipeline.
    var project = {date: true, state: true, company: true};
    aggregation.push({ $project: project });

    var matcher = {
        date: {$gte: minDate, $lte: maxDate}
    }
    if (params.state) matcher['state'] = params.state;
    aggregation.push({$match: matcher});
    aggregation.push({
        $group: {
            _id: '$company',
            count: {$sum: 1}
        }
    });
    aggregation.push({$limit: params.limit});

    // Descending sort
    aggregation.push({$sort: {"count": -1}});

    // Every record found increments the count by 1.
    count:{$sum:1}

    complaintsMonk.aggregate(aggregation).then((res) => {
        var prettyResults = [];
        res.forEach((result) => {
            prettyResults.push({company: result._id, count: result.count});
        });
        callback(prettyResults);
    }).catch(function(err) {
        console.error("Exception with aggregate: " + err.message);
        throw err;
    });

}

