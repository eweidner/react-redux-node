process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();
chai.use(chaiHttp);

var complaintDb = require('../../database/complaint-db');
var testHelpers = require('./../support/testHelpers');


describe('Consumer Complaints API - Companies', () => {
    beforeEach((done) => { //Before each test we empty the database
        complaintDb.clear(function(result) {
            var testData = [
                {"id" : "1", "company" : "Bank of America", "year" : 2016, "month" : 6,
                    "state" : "ny", "product" : "Credit Card", "sub_product" : null },
                {"id" : "2", "company" : "Bank of America", "year" : 2016, "month" : 6,
                    "state" : "ny", "product" : "Credit Card", "sub_product" : null },
                {"id" : "2", "company" : "Bank of America", "year" : 2016, "month" : 6,
                    "state" : "ny", "product" : "Mortgage", "sub_product" : null },
                {"id" : "2", "company" : "Bank of America", "year" : 2016, "month" : 2,
                    "state" : "co", "product" : "Payday loan", "sub_product" : null },
                {"id" : "2", "company" : "Big Bank", "year" : 2016, "month" : 2,
                    "state" : "co", "product" : "Payday loan", "sub_product" : null },
                {"id" : "2", "company" : "Bank of America", "year" : 2014, "month" : 3,
                    "state" : "co", "product" : "Some product", "sub_product" : null },
                {"id" : "2", "company" : "ABC Mortgage", "year" : 2015, "month" : 9,
                    "state" : "co", "product" : "Credit Card", "sub_product" : null }
            ]
            testHelpers.createComplaintRecords(testData, () => {
                done();
            });
        });
    });


    describe('/GET /api/complaints/companies', () => {
        it('it should find counts of products with most complaints in one state during a specified period of time', (done) => {
            chai.request(server)
                .get('/api/complaints/companies?year=2016&month=1&months=12&state=ny')
                .end((err, res) => {
                    res.should.have.status(200);
                    var companies = res.body.companies;
                    companies.length.should.eq(1);
                    companies[0].company.should.eq("Bank of America");
                    done();
                });
        });

     });

});
