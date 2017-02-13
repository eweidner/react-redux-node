'use strict';

const util = require('util');
const mongodb = require("mongodb");
const MongoClient = require('mongodb').MongoClient;
const log = require('debug')('omb:mongodb-model');
const error = require('debug')('omb:error');
const COMPLAINT_COLLECTION_NAME = "complaints";
var db;

var dbConnection = require('./db-connection')

exports.clear = function() {
    return new Promise((resolve, reject) => {
        dbConnection.connection().then( db => {
            var collection = db.collection(COMPLAINT_COLLECTION_NAME);
            collection.drop(function(err, reply) {
                if (err) return resolve(null);
                db.createCollection(COMPLAINT_COLLECTION_NAME);
                resolve(null);
            });
        });
    });
}

exports.create = function(dataHash, callback) {
    return dbConnection.connection()
        .then( db => {
            var collection = db.collection(COMPLAINT_COLLECTION_NAME);
            return collection.insertOne(dataHash)
                .then( result => {
                    callback(dataHash);
        });
    });
};

exports.collection = function(callback) {
    dbConnection.connection().then( db => {
        var collection = db.collection(COMPLAINT_COLLECTION_NAME);
        callback(collection);
    });
}



