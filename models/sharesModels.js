var mongoose = require('mongoose')
var db = require('../lib/db');

var SharesSchema = new mongoose.Schema({
  "shareUser": {
    "shareObjectId": String,
    "shareStuId": String,
    "shareName": String,
    "shareUserImg": String
  },
  "shareTitle": String,
  "shareContent": String,
  "shareImg": String,
  "shareTime": String,
  "deleteTime": String,
  "status": Number,   //-1删除;0未审核;1审核
  "comments": Array
},{versionKey: false});

//创建Model
var SharesModel = mongoose.model('Shares',SharesSchema);
module.exports = SharesModel