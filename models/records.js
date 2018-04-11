var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var recordsSchema = new Schema({
  "applyId": String,
  "applyStuId": String,
  "applyName": String,
  "applyPosition": Object,
  "applyTime": String,
  "maintainId": String,
  "maintainStuId": String,
  "maintainName": String,
  "maintainPosition": String,
  "maintainTime": String,
  "completeTime": String,
  "serviceStar": Number,
  "status": Number,
  "questionTitle": String,
  "questionDes": String,
  "questionImg": String
},{versionKey: false});

module.exports = mongoose.model('Record',recordsSchema);