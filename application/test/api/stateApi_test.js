process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();
chai.use(chaiHttp);
var censusDb = require("../../database/census-db");



describe('State API', () => {

    describe('/GET /api/states', () => {
        it('it should return all state names and code', (done) => {
            chai.request(server)
                .get('/api/states')
                .end((err, res) => {
                    res.should.have.status(200);
                    states = res.body.states;
                    states.length.should.be.at.least(50);
                    states[0].name.length.should.be.at.least(1);
                    states[0].code.length.should.be.at.least(2);
                    done();
                });
        });

    });

});
