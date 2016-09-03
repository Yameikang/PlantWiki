var assert  = require('assert'),
    mongoose = require('mongoose');
    //cheerio = require('cheerio'),
    //request = require('request');

var Plant = mongoose.model('Plant');
var Hierarchy = mongoose.model('Hierarchy');

var dbops = require('./dbOperations.js');

exports.search = function(query){

};