process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
chai.use(chaiHttp);
var censusDb = require("../database/census-db");


function createCensusRecords(dataArray, callback) {
    var numberToCreate = dataArray.length;
    dataArray.forEach(function(data) {
        censusDb.create(data, function (err, record) {
            if (err) throw err
            numberToCreate--;
            if (numberToCreate == 0) callback();
        });
    });
}


describe('Census API', () => {
    beforeEach((done) => { //Before each test we empty the database
        var censusDb = require("../database/census-db");
        censusDb.clear(function(result) {
            var testData = [
                {year: 2016, month: 5, state: "co", pop: 100000, births: 100, deaths: 100, popgrowth: 200},
                {year: 2016, month: 5, state: "ca", pop: 200000, births: 100, deaths: 100, popgrowth: 400},
                {year: 2016, month: 5, state: "ny", pop: 300000, births: 100, deaths: 100, popgrowth: 300},
                {year: 2016, month: 5, state: "nd", pop: 400000, births: 100, deaths: 100, popgrowth: 50},
                {year: 2016, month: 6, state: "nm", pop: 500000, births: 100, deaths: 100, popgrowth: 5000}
                ]
            createCensusRecords(testData, () => {
                done();
            });
        });
    });

    describe('/GET /api/census/topstates', () => {
        it('it should find top 3 states for births', (done) => {
            chai.request(server)
                .get('/api/census/topstates?year=2016&month=5&field=births&limit=3')
                .end((err, res) => {
                    res.should.have.status(200);
                    states = res.body.states;
                    states.length.should.eq(3);
                    states[0].state.should.eq("co");
                    states[0].state_name.should.eq("Colorado");
                    states[1].state.should.eq("ca");
                    states[2].state.should.eq("ny");
                    done();
                });
        });

        it('it should find top 3 states for population', (done) => {
            chai.request(server)
                .get('/api/census/topstates?year=2016&month=5&field=pop&limit=3')
                .end((err, res) => {
                    res.should.have.status(200);
                    states = res.body.states;
                    states.length.should.eq(3);
                    states[0].state.should.eq("nd");
                    states[1].state.should.eq("ny");
                    states[2].state.should.eq("ca");
                    done();
                });
        });

        it('it should return state names for any topstates api call', (done) => {
            chai.request(server)
                .get('/api/census/topstates?year=2016&month=5&field=pop&limit=3')
                .end((err, res) => {
                    res.should.have.status(200);
                    states = res.body.states;
                    states.length.should.eq(3);
                    states[0].state_name.should.eq("North Dakota");
                    states[1].state_name.should.eq("New York");
                    states[2].state_name.should.eq("California");
                    done();
                });
        });

    });

});
