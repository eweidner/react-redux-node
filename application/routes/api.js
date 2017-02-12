'use strict';

var util = require('util');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    debugger
    items.keylist()
        .then(keylist => {
        var keyPromises = [];
        for (var key of keylist) {
            keyPromises.push(
                items.read(key)
                    .then(item => {
                    return { key: item.key, title: item.title };
        })
    );
    }
    return Promise.all(keyPromises);
})
    .then(items => {
        res.render('index', { title: 'Items', items: items});
})
    .catch(err => { next(err); });
});

module.exports = router;
