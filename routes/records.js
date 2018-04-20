var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');

var mongoose = require('mongoose');
var Record = require('../models/records');

//connect mongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/maintanceDB');

mongoose.connection.on("connected", function () {
  console.log("success.");
});
mongoose.connection.on("error", function () {
  console.log("fail.");
});
mongoose.connection.on("disconnected", function () {
  console.log("disconnected");
})


/* 提交报修表单,插入数据库 */
router.post('/apply', function (req, res, next) {
  console.log("/apply-req.body: ", req.body);
  var applyId = req.body.applyId;
  var applyStuId = req.body.applyStuId;
  var applyName = req.body.applyName;
  var applyPosition = req.body.applyPosition;
  var tmpImages = req.body.applyForm.tmpImages;
  var images = req.body.applyForm.images;
  var imagesName = images.substring(images.lastIndexOf('/') + 1);
  var theme = req.body.applyForm.theme;
  var content = req.body.applyForm.content;
  var applyTime = req.body.applyTime;


  //操作图片存储
  //文件移动的目录文件夹，不存在时创建目标文件夹  
  var targetDir = path.join(__dirname + '/../public/images/record/', applyStuId);
  if (!fs.existsSync(targetDir)) {
    fs.mkdir(targetDir);
  }

  var targetFile = path.join(targetDir, imagesName);
  fs.renameSync(tmpImages, targetFile, function (err) {
    if (err) {
      console.info(err);
      res.json({
        status: -1,
        message: '操作失败'
      });
    }
  });

  var insertForm = {
    "applyId": applyId,
    "applyStuId": applyStuId,
    "applyName": applyName,
    "applyPosition": applyPosition,
    "applyTime": applyTime,
    "maintainId": null,
    "maintainStuId": null,
    "maintainName": null,
    "maintainPosition": null,
    "maintainTime": null,
    "completeTime": null,
    "serviceStar": null,
    "status": -1, //status为-1表示未接单,为0表示已接单未完成,为1表示此单完成
    "questionTitle": req.body.applyForm.theme,
    "questionDes": req.body.applyForm.content,
    "questionImg": req.body.applyForm.images
  }

  var newRecord = new Record(insertForm);
  newRecord.save(function(insertErr, insertDoc){
    if(insertErr) {
      res.json({
        status: '0',
        msg: insertErr.message
      })
    }else {
      res.json({
        status: 1,
        msg: '报修成功'
      })
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
    //提交的文件的form中上传文件的input名为ApplyImg，从当中获取他们的各自信息
    if (file.ApplyImg) {
      console.log(checkFileExt(file.ApplyImg, '.jpg.jpeg.png.gif'));
      if (checkFileExt(file.ApplyImg, '.jpg.jpeg.png.gif')) {
        fileName = 'ApplyImg' + new Date().getTime() + file.ApplyImg.path.substring(file.ApplyImg.path.lastIndexOf('.'));
        res.json({
          status: 0,
          msg: "上传成功",
          result: {
            imgUrl: 'http://localhost:3000/public/images/record/' + stuId + '/' + fileName,
            tmpUrl: file.ApplyImg.path,
            filename: 'ApplyImg'
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

/* POST user applylist*/
router.post('/getlist', function (req, res, next) {
  var applyStuId = req.body.applyStuId;
  console.log("applyStuId:",applyStuId);
  Record.find({ $or: [ {"applyStuId": req.body.applyStuId, "status": -1}, {"applyStuId": req.body.applyStuId, "status": 0} ] },function (err, doc) {
    if (err) {
      res.json({
        status: '0',
        msg: err.message
      });
    } else {
      if (doc) {
        console.log("applylistdoc: ",doc)
        res.json({
          status: 1,
          msg: "获取所有用户表成功",
          result: doc
        })
      } else {
        res.json({
          status: 0,
          msg: "没有报修"
        })
      }
    }

  })
})

/* POST position */
router.post('/position', function (req, res, next) {
  var position = req.body.position;
  var stuId = req.body.stuId;
  console.log("position: ", position);
  console.log("stuId: ", stuId);

  //更新位置  
  var conditions = {
    stuId: req.body.stuId
  };
  var updates = {
    $set: {
      position: position
    }
  };
  User.update(conditions, updates, function (error) {
    if (error) {
      console.error(error);
    } else {
      console.error("更新位置成功")
      res.cookie("position", {
        lng: position.lng,
        lat: position.lat
      }, {
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

/** Get List */
router.get('/lists', function(req,res,next){
  Record.find(function(err,doc){
    if(err){
      res.json({
        status: '0',
        msg: err.message
      });
    }else {
      if (doc) {
        res.json({
          status: '1',
          msg: "获取所有报修表成功",
          result: doc
        })
      } else {
        res.json({
          status: '0',
          msg: "获取所有报修表失败"
        })
      }
    }

  })
})

module.exports = router;