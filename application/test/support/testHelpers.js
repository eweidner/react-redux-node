var complaintDb = require('../../database/complaint-db');

/*
 * Create multiple complaint records from hash (dataArray).
 */
exports.createComplaintRecords = function(dataArray, callback) {
    var numberToCreate = dataArray.length;
    dataArray.forEach(function(data) {
        complaintDb.create(data, function (err, record) {
            if (err) throw err;
            numberToCreate--;
            if (numberToCreate == 0) callback();
        });
    });
}
