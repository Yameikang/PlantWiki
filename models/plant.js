//var express = require('express');
//var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var plantSchema = new Schema({
    fullName: String,
    appearanceDesp: String,
    description: String
});

mongoose.model('Plant',plantSchema);