var mongoose = require('mongoose');
var db = require('../lib/db');

//一个报修记录模型
var RecordsSchema = new mongoose.Schema({
  "applyUser": {
    "applyObjectId": String,
    "applyStuId": String,
    "applyName": String,
    "applySex": String,
    "applyEmail": String,
    "applyPhoneNum": String,
    "applyQQ": String,
    "applyWechat": String,
    "applyUserImg": String,
    "applyPosition": Object
  },
  "questionTitle": String,
  "questionDesc": String,
  "questionImg": String,
  "applyTime": String,
  "repairTime": String,
  "aCancelTime": String,
  "mCancelTime": String,
  "completeTime": String,
  "deleteTime": String,
  "repairUser": {
    "repairObjectId": String,
    "repairStuId": String,
    "repairName": String,
    "repairSex": String,
    "repairEmail": String,
    "repairPhoneNum": String,
    "repairQQ": String,
    "repairWechat": String,
    "repairUserImg": String,
    "repairPosition": Object,
    "repairNum": Number,
    "repairStars": Number
  },
  "serviceStar": Number,
  "status": Number  //-2删除;-1被取消;0未接单;1接单;2完成
},{versionKey: false});

//创建Model
var RecordsModel = mongoose.model('Records',RecordsSchema);
module.exports = RecordsModel