var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/users');

//connect mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/maintanceDB');

mongoose.connection.on("connected", function(){
  console.log("success.");
});
mongoose.connection.on("error", function(){
  console.log("fail.");
});
mongoose.connection.on("disconnected", function(){
  console.log("disconnected");
})
/* GET users listing. */
router.post('/', function(req, res, next) {

  var stuId = req.body.stuId;
  var pwd = req.body.pwd;
  User.find({'stuId': stuId},function(err,doc){
    if(err){
      res.json({
        status: '0',
        msg: err.message
      });
    }else{
      var result = doc[0];
      console.log("exist: ",result.exist);
      if(result.exist){
        var returnPwd = result.pwd;
        console.log("returnPwd: ",returnPwd);
        if(pwd===returnPwd){
          res.json({
            status: '1',
            msg: '',
            result: {
              "stuId": result.stuId,
              "stuName": result.stuName,
              "roleId": result.roleId,
              "roleName": result.roleName
            }
          })
        }
      }else {
        res.json({
          status: '0',
          msg: '该用户不存在'
        })
      }
      
    }
  })
});

module.exports = router;
