var census = require('./census-db');
var dbUtils = require('./db-utils');

exports.topStates = function(year, month, sortField, limit, callback) {
    census.collection((collection) => {
        var sortHash = new Object()
        sortHash[sortField] = -1;
        collection.find({year: year, month: month}).sort(sortHash).limit(limit).toArray((err, documents) => {
            if (err) throw new Error("Error searching", err);
            dbUtils.addStateNamesToData(documents);
            callback(documents);
        });
    });
}
