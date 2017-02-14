process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();
chai.use(chaiHttp);

var complaintDb = require('../../database/complaint-db');
var testHelpers = require('./../support/testHelpers');


describe('Consumer Complaints API - Products', () => {
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


    describe('/GET /api/complaints/products', () => {
        it('it should find counts of products with most complaints in one state during a specified period of time', (done) => {
            chai.request(server)
                .get('/api/complaints/products?year=2016&month=1&months=12&state=ny')
                .end((err, res) => {
                    res.should.have.status(200);
                    var products = res.body.products;
                    products.length.should.eq(2);
                    products[0].product.should.eq("Credit Card");
                    products[0].count.should.eq(2);
                    products[1].product.should.eq("Mortgage");
                    products[1].count.should.eq(1);
                    done();
                });
        });
        it('it should find counts of all products with complaints in entire nation', (done) => {
            chai.request(server)
                .get('/api/complaints/products?year=2016&month=1&months=12')
                .end((err, res) => {
                    res.should.have.status(200);
                    var products = res.body.products;
                    products.length.should.eq(3);
                    products[0].product.should.eq("Payday loan");
                    products[0].count.should.eq(2);
                    products[1].product.should.eq("Credit Card");
                    products[1].count.should.eq(2);
                    products[2].product.should.eq("Mortgage");
                    products[2].count.should.eq(1);
                    done();
                });
        });

     });

});
