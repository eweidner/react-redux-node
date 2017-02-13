var complaints = require('./complaint-db');
var dbUtils = require('./db-utils');

dbConnections = require('./db-connection');
var db_name = dbConnections.findDbNameForEnv();
var url = "mongodb://mongo/" + db_name;

const db = require('monk')(url);
const complaintsMonk = db.get('complaints');


// sample.col.group(
//     ["status"],
//     {},
//     { "count": 0 },
//     "function (obj,prev) { prev.count++; }",
//     function(err,docs) {
//         if (err) console.log(err);
//         console.log( docs );
//     }
// );

exports.states = function(params, callback) {
    var aggregation = [];
    if (params.company) aggregation.push({ $match: {company: params.company} } );

    debugger
    complaintsMonk.aggregate(aggregation).then((res) => {
        debugger
    })

}
