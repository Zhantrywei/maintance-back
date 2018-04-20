var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  "stuId": String,
  "stuName": String,
  "phoneNum": String,
  "sex": String,
  "email": String,
  "pwd": String,
  "age": Number,
  "qq": String,
  "wechat": String,
  "roleId": Number,
  "roleName": String,
  "exist": Number,
  "status": Boolean,
  "IDCardImg": String,
  "StuCardImg": String,
  "position": Object,
  "stars": Number
},{versionKey: false});

module.exports = mongoose.model('User',usersSchema);