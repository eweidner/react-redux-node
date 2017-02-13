const util = require('util');
const mongodb = require("mongodb");
const MongoClient = require('mongodb').MongoClient;
const log = require('debug')('omb:mongodb-model');
const error = require('debug')('omb:error');


exports.findDbNameForEnv = function() {
    if (process.env.NODE_ENV == 'test') {
        return "omb_test";
    } else if (process.env.NODE_ENV == 'production') {
        return "omb";
    } else {
        throw new Error("Do not know db name for NODE_ENV: " + process.env.NODE_ENV);
    }
}

const DB_NAME = exports.findDbNameForEnv();

var db;

exports.connection = function() {
    return new Promise((resolve, reject) => {
        if (db) return resolve(db);
        // Connection URL
        var url = "mongodb://mongo/" + DB_NAME;

        // Use connect method to connect to the Server
        MongoClient.connect( url, (err, _db) => {
            if (err) return reject(err);
            db = _db;
            console.info("Connected to db");
            resolve(_db);
        });
    });
};
