//var express = require('express');
//var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var plantSchema = new Schema({
    fullName: {type:String, unique:true, required:true},
    appearanceDesp: String,
    description: String,
    link:{type:String, unique:true, required:true}
});

mongoose.model('Plant',plantSchema);