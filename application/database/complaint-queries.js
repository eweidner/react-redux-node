var complaints = require('./complaint-db');
var dbUtils = require('./db-utils');

dbConnections = require('./db-connection');
var db_name = dbConnections.findDbNameForEnv();
var url = "mongodb://mongo/" + db_name;

const db = require('monk')(url);
const complaintsMonk = db.get('complaints');

debugger

exports.states = function(params, callback) {
    debugger
    complaintsMonk.collection((collection) => {

        var sortHash = new Object()
        sortHash[sortField] = -1;
        console.info("Date key: " + dateKey);
        collection.find({date: dateKey}).sort(sortHash).limit(limit).toArray((err, documents) => {
            if (err) throw new Error("Error searching", err);
            callback(documents);
        });
    });
}
