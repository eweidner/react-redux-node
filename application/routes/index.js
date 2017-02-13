'use strict';
var React = require('react');

var util = require('util');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.info("In index");
    res.render('index', { title: 'Items'});
});

module.exports = router;
