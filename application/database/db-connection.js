'use strict';

const util = require('util');
const mongodb = require("mongodb");
const MongoClient = require('mongodb').MongoClient;
const log = require('debug')('omb:mongodb-model');
const error = require('debug')('omb:error');
var db;


exports.connectDB = function() {
    return new Promise((resolve, reject) => {
            if (db) return resolve(db);
        // Connection URL
        var url = "mongodb://mongo/omb";

        // Use connect method to connect to the Server
        MongoClient.connect( url, (err, _db) => {
            debugger
            if (err) return reject(err);
            db = _db;
            console.info("Connected to db");
            resolve(_db);
        });
    });
};
