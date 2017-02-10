'use strict';

const util = require('util');
const Note = require('./Census');

var items = [];

exports.update = exports.create = function(key, title, body) {
    return new Promise((resolve, reject) => {
            items[key] = new Note(key, title, body);
    resolve(items[key]);
});
};

exports.read = function(key) {
    return new Promise((resolve, reject) => {
            if (items[key]) resolve(items[key]);
    else reject(`Census ${key} does not exist`);
});
};

exports.destroy = function(key) {
    return new Promise((resolve, reject) => {
            if (items[key]) {
        delete items[key];
        resolve();
    } else reject(`Census ${key} does not exist`);
});
};

exports.keylist = function() {
    return new Promise((resolve, reject) => {
            resolve(Object.keys(items));
});
};

exports.count   = function()    {
    return new Promise((resolve, reject) => {
            resolve(items.length);
});
};
