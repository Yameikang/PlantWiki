var mongoose = require('mongoose'),
    cheerio = require('cheerio'),
    request = require('superagent'),
    Plant = mongoose.model('Plant'),
    Hierarchy = mongoose.model('Hierarchy');

var assert = require('assert');

var url = 'http://frps.eflora.cn/v/1';
var url1 = 'http://frps.eflora.cn/name/a';

var links = [], wiki = [];

exports.insertDocument = function(db, document, collection, callback) {
    // Get the documents collection
    var coll = db.collection(collection);
    // Insert some documents
    coll.insert(document, function(err, result){
        assert.equal(err, null);
        console.log("Inserted "+result.result.n + " documents into the document collection " + collection);
        callback(result);
    });
};

exports.findDocuments = function(db, collection, callback){
    // Get the documents collection
    var coll = db.collection(collection);

    // Find some documents
    coll.find({}).toArray(function(err, docs){
        assert.equal(err, null);
        callback(docs);
    });
};

exports.findDocumentsByCondition = function(db, condition,collection, callback){
    // Get the documents collection
    var coll = db.collection(collection);

    //Find some documents by condition
    coll.find(condition).toArray(function(err, docs){
        assert.equal(err, null);
        callback(docs);
    });
};

exports.removeDocument = function(db, document, collection,callback){
    // Get the documents collection
    var coll = db. collection(collection);

    // Delete the document
    coll.deleteOne(document, function(err, result){
        assert.equal(err, null);
        console.log("Removed the document "+ document);
        callback(result);
    });
};

exports.updateDocument = function(db, document, update, collection, callback){
    // Get the documents collection
    var coll = db.collection(collection);

    // Update document
    coll.updateOne(document,
        {$set:update}, null, function(err, result){
            assert.equal(err, null);
            console.log("Updated the document with "+ update);
            callback(result);
        });
};