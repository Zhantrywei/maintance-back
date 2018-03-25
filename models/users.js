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
  "QQ": String,
  "wechat": String,
  "roleId": Number,
  "roleName": String,
  "exist": Boolean,
  "status": Boolean,
  "IDCardImg": String,
  "StuCardImg": String,
  "position": Object
},{versionKey: false});

module.exports = mongoose.model('User',usersSchema);