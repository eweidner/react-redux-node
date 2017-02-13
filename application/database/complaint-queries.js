var complaints = require('./complaint-db');
var dbUtils = require('./db-utils');

dbConnections = require('./db-connection');
var db_name = dbConnections.findDbNameForEnv();
var url = "mongodb://mongo/" + db_name;

const db = require('monk')(url);
const complaintsMonk = db.get('complaints');


exports.states = function(params, callback) {
    var minDate = dbUtils.encodeYearMonth(params.year, params.month);
    var maxDate = dbUtils.encodeYearMonthPlusMonths(params.year, params.month, params.months);

    var aggregation = [];

    // Fields that will be processes in aggregation pipeline.
    project = {date: true, state: true};
    if (params.company) project['company'] = true;
    if (params.product) project['product'] = true;
    aggregation.push({ $project: project });

    matcher = {
        date: {$gte: minDate, $lte: maxDate}
    }
    if (params.company) matcher['company'] = params.company;
    if (params.product) matcher['product'] = params.product;

    aggregation.push({$match: matcher});
    aggregation.push({
        $group: {
            _id: '$state',
            count: {$sum: 1}
        }
    });
    aggregation.push({$limit: params.limit});
    aggregation.push({$sort: {"count": -1}});
    count:{$sum:1}

    complaintsMonk.aggregate(aggregation).then((res) => {
        var prettyResults = []
        res.forEach( (result) => {
            prettyResults.push({state: result._id, count: result.count});
        });
        dbUtils.addStateNamesToData(prettyResults);
        callback(prettyResults);
    })
}


exports.products = function(params, callback) {
    var minDate = dbUtils.encodeYearMonth(params.year, params.month);
    var maxDate = dbUtils.encodeYearMonthPlusMonths(params.year, params.month, params.months);

    var aggregation = [];

    // Fields that will be processes in aggregation pipeline.
    project = {date: true, state: true, product: true};
    aggregation.push({ $project: project });

    matcher = {
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
    aggregation.push({$limit: params.limit});
    aggregation.push({$sort: {"count": -1}});
    count:{$sum:1}

    complaintsMonk.aggregate(aggregation).then((res) => {
        var prettyResults = []
        res.forEach( (result) => {
            prettyResults.push({product: result._id, count: result.count});
        });
        callback(prettyResults);
    })

}

