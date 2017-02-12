'use strict';

const util = require('util');
const mongodb = require("mongodb");
const MongoClient = require('mongodb').MongoClient;
const log = require('debug')('omb:mongodb-model');
const error = require('debug')('omb:error');
const COMPLAINT_COLLECTION_NAME = "complaints";
const DbConnection = require('./db-connection')
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

exports.clear = function() {
    return new Promise((resolve, reject) => {
        exports.connectDB().then( db => {
            var collection = db.collection(COMPLAINT_COLLECTION_NAME);
            collection.drop(function(err, reply) {
                if (err) return resolve(null);
                db.createCollection(COMPLAINT_COLLECTION_NAME);
                resolve(null);
            });
        });
    });
}

exports.create = function(dataHash) {
    return exports.connectDB()
        .then( db => {
            var collection = db.collection(COMPLAINT_COLLECTION_NAME);
            return collection.insertOne(dataHash)
                     .then( result => {
                         return dataHash;
                    });
    });
};


exports.search = function(search) {
    return exports.connectDB()
        .then( db => {
            var collection = db.collection(COMPLAINT_COLLECTION_NAME);

            return collection.findOne({ notekey: key })
                .then( doc => { var note = new Note( doc.notekey, doc.title, doc.body);
                return note;
        });
    });
åå};

