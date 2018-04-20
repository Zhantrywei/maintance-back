var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var sharesSchema = new Schema({
  "shareUserId": String,
  "shareStuId": String,
  "shareName": String,
  "shareTitle": String,
  "shareDesc": String,
  "shareImgs": Array,
  "comments": Array,
  "shareTime": Date,
  "status": Number
},{versionKey: false});

module.exports = mongoose.model('Share',sharesSchema);