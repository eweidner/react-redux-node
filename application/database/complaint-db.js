'use strict';

const util = require('util');
const mongodb = require("mongodb");
const MongoClient = require('mongodb').MongoClient;
const log = require('debug')('omb:mongodb-model');
const error = require('debug')('omb:error');
const COMPLAINT_COLLECTION_NAME = "complaints";
var db;

var dbConnection = require('./db-connection')
var dbUtils = require('./db-utils');



exports.clear = function(callback) {
    var collectionName = COMPLAINT_COLLECTION_NAME;
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

exports.ensureIndexes = function(callback) {
    exports.collection((collection) => {
        console.info("Creating indexes on complaints collection...");
        collection.ensureIndex({date: 1}, () => {
            collection.ensureIndex({state: 1}, () => {
                collection.ensureIndex({product: 1}, () => {
                    collection.ensureIndex({company: 1}, () => {
                        console.info("Indexing finished on complaints collection");
                        callback();
                    });
                });
            });
        });
    });
}

exports.create = function(dataHash, callback) {
    dataHash['date'] = dbUtils.encodeYearMonth(dataHash.year, dataHash.month);
    dbConnection.connection().then( db => {
        var collection = db.collection(COMPLAINT_COLLECTION_NAME);
        collection.insertOne(dataHash, function(err, record) {
                callback(err, record);
            }
        );
    });
};

exports.collection = function(callback) {
    dbConnection.connection().then( db => {
        var collection = db.collection(COMPLAINT_COLLECTION_NAME);
        callback(collection);
    });
}



