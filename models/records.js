var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var recordsSchema = new Schema({
  "applyId": String,
  "maintainId": String,
  "applyTime": Date,
  "maintainTime": Date,
  "completeTime": Date,
  "serviceStar": Number,
  "status": Number,
  "questionTitle": String,
  "questionDes": String,
  "questionImg": Array
},{versionKey: false});

module.exports = mongoose.model('Record',recordsSchema);