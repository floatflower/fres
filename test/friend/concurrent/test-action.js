const moment = require('moment');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;

const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
    res.json({connected: true})
});

const Concurrent = require('../../../friend/concurrent');

describe('Test Repository create()', () => {

   it('測試可以正常迸發 10 次請求', (done) => {
       let con = new Concurrent(100);
       let count = 0;
       con.action(() => {
           return new Promise((resolve) => {
                chai.request(app)
                    .get('/')
                    .send()
                    .end((err, res) => {
                        count ++;
                        resolve();
                    })
           })
       })
       .then(() => {
           assert(100 === count, '迸發行為失敗。');
           done();
       })
   });

    it('測試可以正常迸發 100 次請求', (done) => {
        let con = new Concurrent(1000, 100);
        let count = 0;
        con.action((index) => {
            return new Promise((resolve) => {
                chai.request(app)
                    .get('/')
                    .send()
                    .end((err, res) => {
                        count ++;
                        resolve();
                    })
            })
        })
            .then(() => {
                assert(1000 === count, '迸發行為失敗。');
                done();
            })
    });
});