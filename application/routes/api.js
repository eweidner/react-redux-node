'use strict';

var util = require('util');
var express = require('express');
var router = express.Router();

// Common for all API routes
router.use(function(req, res, next) {
    next(); // go to the next routes and don't stop here
});

router.get('/', function(req, res, next) {
    res.json({ message: 'You have connected to our API.  Consult documentation for endpoints' });
});


// /api/complaints endpoint

router.get('/complaints/import/status', function(req, res, next) {
    var importer = require('../importers/consumer-complaints-import');
    res.json({importing: importer.inProgress()});
});

router.get('/complaints/import', function(req, res, next) {
    var importer = require('../importers/consumer-complaints-import');
    importer.import();
    res.json({importing: true});
});

var complaintsQueries = require('../database/complaint-queries');

/*
 *  Find states with complaints that match either a particular company or particular product over period of time.
 *  Example: /api/complaints/states?year=2015&month=6&months=12&company=Bank+of+America
 */
router.get('/complaints/states', function(req, res, next) {
    var reqData = {
        limit :     parseInt(req.query.limit),
        year :      parseInt(req.query.year),
        month :     parseInt(req.query.month),
        months :    parseInt(req.query.months),
        company :   parseInt(req.query.company),
        product :   parseInt(req.query.product)
    }
    complaintsQueries.states(reqData, (documents) => {
        res.json({states: documents});
    });
});


// ****************************************************************
// /api/census endpoint
// ****************************************************************
router.get('/census/import/status', function(req, res, next) {
    var importer = require('../importers/census-import');
    res.json({importing: importer.inProgress()});
});

router.get('/census/import', function(req, res, next) {
    var importer = require('../importers/census-import');
    importer.import();
    res.json({importing: true});
});


var censusQueries = require('../database/census-queries');

/*
 *  Find top states by population, births, deaths, pop growth on particular month
 *  Example: http://localhost:3000/api/census/topstates?year=2015&month=5&field=popgrowth&limit=10
 */
router.get('/census/topstates/', function(req, res, next) {
    var limit = parseInt(req.query.limit);
    var year = parseInt(req.query.year);
    var month = parseInt(req.query.month);
    censusQueries.topStates(year, month, req.query.field, limit, (documents) => {
        res.json({states: documents});
    });
});





module.exports = router;
