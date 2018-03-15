# maintance-back

> a back system about maintain on computer

## Build Setup

``` bash
# install dependencies
npm install

# run system
node bin/www
```

## 2018/3/13

``` bash
# install Mongoose
npm install mongoose --save

# create model
# 创建model

# create router
# 创建路由

# 创建用户模型
# users
```

## 2018/3/15

1. 导出导入数据库: 见[链接](http://blog.csdn.net/djy37010/article/details/69388890)

```bash
# 导出数据表
 .\mongoexport.exe -d maintanceDB -c users -o D:\MongoDB\data\backup\users.json
# -d : 数据库
# -c : 表文档
# -o : 导出文件位置

# 导入数据表
  .\mongoimport.exe -d maintanceDB -c users D:\MongoDB\data\backup\users.json
# 同上
```

2. 数据库命名: maintanceDB
    1. 文档结构: users
    2. 文档结构: records

3. 注册为维修工需要注意的流程
    1. stuId 失焦后就请求验证用户是否被注册,如果已经注册就提示,只有没有被注册的用户才可以上传文件,上传文件后返回imgUrl。点击注册才可以写入数据库

4. 预计：
    1. 16号完善注册的；
    2. 17号完成后台系统的用户展示，增删查改；
    3. 18号报修的申请模块；
    4. 19号维修模块；
    5. 20号后台系统的维修单处理模块；
    6. 21号修修整整准备22号中期检查，注意PPT;中期检查后反思，哪里需要加强修改的进一步调整；
    7. 4月前完成所有项目；
    8. 4月开始写论文和测试修改，以及考虑用weex实现移动端的展示