var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hierarchySchema = new Schema({
    name: {type:String, unique:true, required:true},
    parentName: String,
    childrenName: String,
    type: String
});

mongoose.model('Hierarchy',hierarchySchema);