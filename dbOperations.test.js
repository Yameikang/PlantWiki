// dbOperations.test.js
var dbOperations = require('../controllers/dbOperations.js');
//var expect = require('chai').expect;

describe('dbOperations的测试', function() {
    it('添加植物Test', function(done) {
        dbOperations.insertDocument('documentest', 'collectiontest', 'callback')
       done();
        });

});