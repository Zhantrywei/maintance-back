var mongoose = require("mongoose");
var db = require('../lib/db');

//一个用户模型
var UserSchema = new mongoose.Schema({
  "stuId": {
    type: String,
    required: true
  },  //学号
  "stuName": {
    type: String,
    required: true
  },  //姓名
  "userImg": String,  //用户头像
  "phoneNum": {
    type: String,
    required: true
  }, //联系电话
  "sex": {
    type: String,
    enum: ['boy','girl'],
    required: true
  },
  "email": {
    type: String,
    required: true
  },
  "pwd": {
    type: String,
    required: true
  },
  "age": {
    type: Number,
    min: 1,
    max: 120,
    required: true
  },
  "qq": String,
  "wechat": String,
  "roleId": {
    type: Number,
    enum: [0,1,2],
    required: true
  },
  "roleName": {
    type: String,
    enum: ['管理员','报修用户','维修用户']
  },
  "exist": {
    type: Number,
    enum: [-1,0,1]  //-1表示软删除, 0表示未审核, 1表示已审核
  },
  "status": Boolean,  //true表示在线, false表示不在线
  "IDCardImg": String,
  "StuCardImg": String,
  "position": {
    lng: Number,
    lat: Number
  },  //登录实时位置
  "repairNum": Number,  //接单数
  "averageStar": {
    type: Number,
    min: 0,
    max: 5
  }
}, { versionKey: false });
//创建Model
var UsersModel = mongoose.model("users", UserSchema);
module.exports = UsersModel