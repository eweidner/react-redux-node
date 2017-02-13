var census = require('./census-db');
var dbUtils = require('./db-utils');

exports.topStates = function(params, callback) {
    census.collection((collection) => {
        var sortHash = new Object()
        sortHash[params.sort_field] = -1;
        collection.find({year: params.year, month: params.month}).sort(sortHash).limit(params.limit).toArray((err, documents) => {
            if (err) throw new Error("Error searching", err);
            dbUtils.addStateNamesToData(documents);
            callback(documents);
        });
    });
}
