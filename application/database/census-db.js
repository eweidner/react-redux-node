'use strict';

const util = require('util');
const mongodb = require("mongodb");
const MongoClient = require('mongodb').MongoClient;
const log = require('debug')('omb:mongodb-model');
const error = require('debug')('omb:error');
const CENSUS_COLLECTION_NAME = "census";
var db;

exports.connectDB = function() {
    return new Promise((resolve, reject) => {
        if (db) return resolve(db);
        // Connection URL
        var url = "mongodb://mongo/omb";

        // Use connect method to connect to the Server
        MongoClient.connect( url, (err, _db) => {
            if (err) return reject(err);
            db = _db;
            console.info("Connected to db");
            resolve(_db);
        });
    });
};


exports.clear = function(callback) {
    var collectionName = CENSUS_COLLECTION_NAME;
    exports.connectDB().then( db => {
        var collection = db.collection(collectionName);
        collection.remove({}, function(err, result) {
            if (err) {
                console.log(err);
                throw Error(err.message)
            }
            callback(result);
        });
    });
}

exports.create = function(dataHash, callback) {
    exports.connectDB().then( db => {
            var collection = db.collection(CENSUS_COLLECTION_NAME);
            collection.insertOne(dataHash, function(err, record) {
                callback(err, record);
                }
            );
    });
};


exports.find = function(search, callback) {
    return exports.connectDB()
        .then( db => {
            var collection = db.collection(CENSUS_COLLECTION_NAME);
            // options = {};
            collection.find(search).toArray(function(err, documents) {
                callback(err, documents);
            });
        });
};

