var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/users');

//require bcrypt;
var bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

// 加密函数
function encrypt(pwd) {
  var hash = bcrypt.hashSync(pwd, salt);
  console.log("hash: ", hash);
  return hash;
}
// 解密函数
function decrypt(pwd, hash) {
  return bcrypt.compareSync(pwd, hash);
}


//connect mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/maintanceDB');

mongoose.connection.on("connected", function () {
  console.log("success.");
});
mongoose.connection.on("error", function () {
  console.log("fail.");
});
mongoose.connection.on("disconnected", function () {
  console.log("disconnected");
})

/* POST users login. */
router.post('/login', function (req, res, next) {
  // 登录密码加密,后保存到数据库
  // var hashpwd = encrypt(req.body.pwd);
  // console.log("login hashpwd: ",hashpwd);
  var pwd = req.body.pwd;
  User.findOne({
    'stuId': req.body.stuId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '0',
        msg: err.message
      });
    } else {
      console.log("doc: ", doc);
      console.log("输入的明文密码: ", pwd);
      if (doc) {
        if (doc.exist) {
          //如果用户存在,就解密
          if (decrypt(pwd, doc.pwd)) {
            console.log("解密成功");
            res.cookie("stuId", doc.stuId, {
              path: '/',
              maxAge: 1000 * 60 * 60
            })
            res.cookie("roleId", doc.roleId, {
              path: '/',
              maxAge: 1000 * 60 * 60
            })
            res.json({
              status: '1',
              msg: '登录成功',
              result: {
                "stuId": doc.stuId,
                "stuName": doc.stuName,
                "roleId": doc.roleId,
                "roleName": doc.roleName
              }
            })
          } else {
            console.log("解密失败");
            res.json({
              status: '0',
              msg: '密码错误'
            })
          }
        } else {
          res.json({
            status: '0',
            msg: '用户不存在'
          })
        }

      } else {
        res.json({
          status: '0',
          msg: '用户不存在'
        })
      }

    }
  })
});

/* POST users register. */
router.post('/register', function (req, res, next) {
  var registerForm = req.body.registerform;
  var stuId = registerForm.stuId;
  console.log("接收到的registerForm", registerForm);

  //先查询数据库是否已经有这个stuId,如果已经有返回status为0,没有就插入数据
  User.findOne({
    "stuId": stuId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '0',
        msg: err.message
      });
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: "该用户已经存在,请直接登录"
        })
      } else {
        var sqlpwd = encrypt(registerForm.password);
        var roleId = -1;
        var roleName = '';
        switch (registerForm.usertype) {
          case 'applicant':
            roleId = 2;
            roleName = '普通用户';
            break;
          case 'maintainer':
            roleId = 1;
            roleName = '维修用户';
            break;
          default:
            break;
        }
        console.log("roleId:", roleId);
        console.log("roleName:", roleName);


        var insertForm = {
          "stuId": registerForm.stuId,
          "stuName": registerForm.stuName,
          "phoneNum": registerForm.phoneNum,
          "sex": registerForm.sex,
          "email": registerForm.email,
          "pwd": sqlpwd,
          "age": registerForm.age,
          "qq": registerForm.qq,
          "wechat": registerForm.wechat,
          "roleId": roleId,
          "roleName": roleName,
          "exist": roleId == 2 ? true : false,
          "status": false,
          "IDCardImg": registerForm.IDCardImg ? registerForm.IDCardImg : null,
          "StuCardImg": registerForm.StuCardImg ? registerForm.StuCardImg : null
        }

        var newUser = new User(insertForm);
        newUser.save(function(insertErr,insertDoc){
          if(insertErr){
            res.json({
              status: '0',
              msg: insertErr.message
            })
          }else{
            res.json({
              status: '1',
              msg: "注册成功"
            })
          }
        })
      }
    }
  })

})

module.exports = router;