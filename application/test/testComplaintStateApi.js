process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
chai.use(chaiHttp);

var complaintDb = require('../database/complaint-db');
var testHelpers = require('./support/testHelpers');



describe('Consumer Complaints API', () => {
    beforeEach((done) => { //Before each test we empty the database
        complaintDb.clear(function(result) {
            var testData = [
                {"id" : "1", "company" : "Bank of America", "year" : 2016, "month" : 6,
                    "state" : "tx", "product" : "Credit card", "sub_product" : null },
                {"id" : "2", "company" : "Bank of America", "year" : 2016, "month" : 6,
                    "state" : "tx", "product" : "Credit card", "sub_product" : null },
                {"id" : "2", "company" : "Bank of America", "year" : 2016, "month" : 2,
                    "state" : "co", "product" : "Payday loan", "sub_product" : null },
                {"id" : "2", "company" : "Big Bank", "year" : 2016, "month" : 2,
                    "state" : "co", "product" : "Payday loan", "sub_product" : null },
                {"id" : "2", "company" : "Bank of America", "year" : 2014, "month" : 3,
                    "state" : "co", "product" : "Payday loan", "sub_product" : null },
                {"id" : "2", "company" : "ABC Mortgage", "year" : 2015, "month" : 9,
                    "state" : "nm", "product" : "Payday loan", "sub_product" : null }
            ]
            testHelpers.createComplaintRecords(testData, () => {
                done();
            });
        });
    });


    describe('/GET /api/complaints/states', () => {
        it('it should find counts for all states that have complaint against company during a specified period of time', (done) => {
            chai.request(server)
                // Period starts on 2015/6 and extends 12 months
                .get('/api/complaints/states?year=2015&month=7&months=12&company=Bank+of+America')
                .end((err, res) => {
                    res.should.have.status(200);
                    states = res.body.states;
                    // NM is disqualified because company is ABC Mortgate
                    // CO has only a count of one because the 2014/9 BofA entry is out of range.
                    states.length.should.eq(2);
                    states[0].state.should.eq("tx");
                    states[0].state_name.should.eq("Texas");
                    states[0].count.should.eq(2);
                    states[1].state.should.eq("co");
                    states[1].count.should.eq(1);
                    done();
                });
        });

        it('it should find counts for all states that have had complaints against product during a specified period of time', (done) => {
            chai.request(server)
                // Period starts on 2015/7 and extends 12 months
                .get('/api/complaints/states?year=2015&month=7&months=12&product=Payday+loan')
                .end((err, res) => {
                    res.should.have.status(200);
                    states = res.body.states;
                    states.length.should.eq(2);
                    states[0].state.should.eq("co");
                    states[0].state_name.should.eq("Colorado");
                    states[0].count.should.eq(2);
                    states[1].state.should.eq("nm");
                    states[1].count.should.eq(1);
                    done();
                });
        });

     });

});
