var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var sharesSchema = new Schema({
  "shareUserId": String,
  "shareStuId": String,
  "shareName": String,
  "shareTitle": Object,
  "shareDesc": String,
  "shareImgs": Array,
  "comments": Array,
  "shareTime": Date
},{versionKey: false});

module.exports = mongoose.model('Share',sharesSchema);