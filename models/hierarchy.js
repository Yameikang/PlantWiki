var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hierarchySchema = new Schema({
    name: String,
    parentName: String,
    childrenName: String,
    type: String
});

mongoose.model('Hierarchy',hierarchySchema);