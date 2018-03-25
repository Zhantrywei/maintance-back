var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');

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
            res.cookie("stuName", doc.stuName, {
              path: '/',
              maxAge: 1000 * 60 * 60
            })
            res.cookie("roleName", doc.roleName, {
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

        //只有维修用户才需要操作文件
        if (registerForm.usertype == 'maintainer') {
          console.log("进入操作文件")
          //文件移动的目录文件夹，不存在时创建目标文件夹  
          var targetDir = path.join(__dirname + '/../public/images/user/', registerForm.stuId);
          if (!fs.existsSync(targetDir)) {
            fs.mkdir(targetDir);
          }
          //获取tmpPath
          var tmpIDCardImg = registerForm.tmpIDCardImg;
          // console.log("tmpIDCardImg: ", tmpIDCardImg);
          var tmpStuCardImg = registerForm.tmpStuCardImg;
          // console.log("tmpStuCardImg: ", tmpStuCardImg);
          var IDCardImgName = registerForm.IDCardImg.substring(registerForm.IDCardImg.lastIndexOf('/') + 1);
          // console.log("IDCardImgName: ", IDCardImgName);
          var StuCardImgName = registerForm.StuCardImg.substring(registerForm.StuCardImg.lastIndexOf('/') + 1);
          // console.log("StuCardImgName: ", StuCardImgName);

          var targetIDCardFile = path.join(targetDir, IDCardImgName);
          var targetStuCardFile = path.join(targetDir, StuCardImgName);

          //移动文件  
          fs.renameSync(tmpIDCardImg, targetIDCardFile, function (err) {
            if (err) {
              console.info(err);
              res.json({
                status: -1,
                message: '操作失败'
              });
            }
          });

          //移动文件  
          fs.renameSync(tmpStuCardImg, targetStuCardFile, function (err) {
            if (err) {
              console.info(err);
              res.json({
                status: -1,
                message: '操作失败'
              });
            }
          });
        }



        var newUser = new User(insertForm);
        newUser.save(function (insertErr, insertDoc) {
          if (insertErr) {
            res.json({
              status: '0',
              msg: insertErr.message
            })
          } else {
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

/* POST users checkstuid. */
router.post('/checkstuid', function (req, res, next) {
  console.log("checkstuid: ", req.body.stuId);
  User.findOne({
    "stuId": req.body.stuId
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
          msg: "该用户已经存在"
        })
      } else {
        res.json({
          status: '1',
          msg: "该用户可以被注册"
        })
      }
    }
  })
})

//传入file
function checkFileExt(file, ext) {
  //获取后缀名称
  console.log("文件路径:", file.path);
  console.log("文件类型:", file.type);
  var fileExt1 = file.path.substring(file.path.lastIndexOf('.'));
  console.log("fileExt1:", fileExt1);
  var fileExt2 = '.' + file.type.substring(file.type.lastIndexOf('/') + 1);
  console.log("fileExt2:", fileExt2);
  console.log("校验的后缀名: ", ext);
  if (ext.indexOf(fileExt1.toLowerCase()) !== -1 && ext.indexOf(fileExt2.toLocaleLowerCase()) !== -1) {
    return true;
  } else {
    return false;
  }
}

/* POST files. */
router.post('/upload', function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname + '/../', 'tmp'); //文件保存的临时目录为当前项目下的tmp文件夹
  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdir(form.uploadDir);
  }
  form.maxFieldsSize = 500 * 1024; //大小限制为最大500k
  form.keepExtensions = true; //使用文件的原扩展名  
  form.parse(req, function (err, fields, file) {
    //fields 获取传送过来的data数据对象
    var stuId = fields.stuId;
    //设置路径
    var filePath = '';
    //文件名称
    var fileName = '';
    //提交的文件的form中上传文件的input名分别为IDCardImg和StuCardImg，从当中获取他们的各自信息
    if (file.IDCardImg) {
      console.log(checkFileExt(file.IDCardImg, '.jpg.jpeg.png.gif'));
      if (checkFileExt(file.IDCardImg, '.jpg.jpeg.png.gif')) {
        fileName = 'IDCardImg' + new Date().getTime() + file.IDCardImg.path.substring(file.IDCardImg.path.lastIndexOf('.'));
        res.json({
          status: 0,
          msg: "上传成功",
          result: {
            imgUrl: 'http://localhost:3000/public/images/user/' + stuId + '/' + fileName,
            tmpUrl: file.IDCardImg.path,
            filename: 'IDCardImg'
          }
        })
      } else {
        res.json({
          status: -1,
          msg: '此文件类型不允许上传'
        })
      }
    } else if (file.StuCardImg) {
      console.log(checkFileExt(file.StuCardImg, '.jpg.jpeg.png.gif'));
      if (checkFileExt(file.StuCardImg, '.jpg.jpeg.png.gif')) {
        fileName = 'StuCardImg' + new Date().getTime() + file.StuCardImg.path.substring(file.StuCardImg.path.lastIndexOf('.'));
        res.json({
          status: 0,
          msg: "上传成功",
          result: {
            imgUrl: 'http://localhost:3000/public/images/user/' + stuId + '/' + fileName,
            tmpUrl: file.StuCardImg.path,
            filename: 'StuCardImg'
          }
        })
      } else {
        res.json({
          status: -1,
          msg: '此文件类型不允许上传'
        })
      }
    } else {
      res.json({
        status: -1,
        msg: '上传的文件名有误'
      })
    }
  });
});

/* POST All users*/
router.get('/lists', function(req,res,next){
  User.find(function(err,doc){
    if(err){
      res.json({
        status: '0',
        msg: err.message
      });
    }else {
      if (doc) {
        res.json({
          status: '1',
          msg: "获取所有用户表成功",
          result: doc
        })
      } else {
        res.json({
          status: '0',
          msg: "获取所有用户表失败"
        })
      }
    }

  })
})

/* POST position */
router.post('/position',function(req,res,next){
  var position = req.body.position;
  var stuId = req.body.stuId;
  console.log("position: ",position);
  console.log("stuId: ",stuId);

  //更新位置  
  var conditions = {stuId: req.body.stuId};  
  var updates = {$set: {position: position}};
  User.update(conditions, updates, function (error) {  
      if (error) {  
          console.error(error);  
      } else {  
          console.error("更新位置成功")  
          res.cookie("position", {lng: position.lng, lat: position.lat}, {
            path: '/',
            maxAge: 60
          })
          res.json({
            status: '1',
            msg: '定位修改成功'
          })
      }  
  });  
  //查询更新后的数据  
  // User.findOne({stuId: req.body.stuId}, function (error, doc) {  
  //     if (error) {  
  //         console.error(error)  
  //     } else {  
  //         console.error("更新后数据：", doc)  
  //     }  
  // }); 
})


module.exports = router;