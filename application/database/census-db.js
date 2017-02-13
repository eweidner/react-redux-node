'use strict';

const util = require('util');
const mongodb = require("mongodb");
const MongoClient = require('mongodb').MongoClient;
const CENSUS_COLLECTION_NAME = "census";

var dbConnection = require('./db-connection')
var dbUtils = require('./db-utils');

exports.clear = function(callback) {
    var collectionName = CENSUS_COLLECTION_NAME;
    dbConnection.connection().then( db => {
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
    dbConnection.connection().then( db => {
        var collection = db.collection(CENSUS_COLLECTION_NAME);
        dataHash['date'] = dbUtils.encodeYearMonth(dataHash.year, dataHash.month);
        collection.insertOne(dataHash, function(err, record) {
            callback(err, record);
            }
        );
    });
};

exports.collection = function(callback) {
    dbConnection.connection().then( db => {
        var collection = db.collection(CENSUS_COLLECTION_NAME);
        callback(collection);
    });
}


exports.find = function(search, callback) {
    return dbConnection.connection()
        .then( db => {
            var collection = db.collection(CENSUS_COLLECTION_NAME);
            // options = {};
            collection.find(search).toArray(function(err, documents) {
                callback(err, documents);
            });
        });
};


