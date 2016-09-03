//var mongoose = require('mongoose');
var assert = require('assert');


exports.insertDocument = function(document, collection, callback) {
    // Get the documents collection
    //var coll = db.collection(collection);
    // Insert some documents
    collection.insert(document, function(err, result){
        assert.equal(err, null);
        console.log("Inserted "+result.result.n + " documents into the document collection " + collection);
        callback(result);
    });
};

exports.findDocuments = function(collection, callback){
    // Get the documents collection
    //var coll = db.collection(collection);

    // Find some documents
    collection.find({}).toArray(function(err, docs){
        assert.equal(err, null);
        callback(docs);
    });
};

exports.findDocumentsByCondition = function(condition,collection, callback){
    // Get the documents collection
    //var coll = db.collection(collection);

    //Find some documents by condition
    collection.find(condition).toArray(function(err, docs){
        assert.equal(err, null);
        callback(docs);
    });
};

exports.removeDocument = function(document, collection,callback){
    // Get the documents collection
    //var coll = db. collection(collection);

    // Delete the document
    collection.deleteOne(document, function(err, result){
        assert.equal(err, null);
        console.log("Removed the document "+ document);
        callback(result);
    });
};

exports.updateDocument = function(document, update, collection, callback){
    // Get the documents collection
    //var coll = db.collection(collection);

    // Update document
    collection.updateOne(document,
        {$set:update}, null, function(err, result){
            assert.equal(err, null);
            console.log("Updated the document with "+ update);
            callback(result);
        });
};