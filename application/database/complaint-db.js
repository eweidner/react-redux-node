'use strict';

const util = require('util');
const mongodb = require("mongodb");
const MongoClient = require('mongodb').MongoClient;
const log = require('debug')('omb:mongodb-model');
const error = require('debug')('omb:error');
const COMPLAINT_COLLECTION_NAME = "complaints";
var db;

var dbConnection = require('./db-connection')



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

exports.create = function(dataHash, callback) {
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



