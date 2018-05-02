// import { Promise } from 'mongoose';
// import { resolve } from 'path';

//封装常用数据库的CURD
const API = {
    /**
     * 添加数据
     * @param {[type]} data 需要保存的数据对象
     */
    save(Model, data) {
        return new Promise((resolve, reject) => {
            //model.create(保存的对象, callback)
            Model.create(data, (error, doc) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(doc)
                }
            })
        })
    },
    find(Model, data = {}, fields = null, options = {}) {
        return new Promise((resolve, reject) => {
            //model.find(需要查找的对象(如果为空,则查找到所有数据), 属性过滤对象[可选参数], options[可选参数], callback)
            Model.find(data, fields, options, (error, doc) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(doc)
                }
            })
        })
    },
    findOne(Model, data) {
        return new Promise((resolve, reject) => {
            //model.findOne(需要查找的对象, callback)
            Model.findOne(data, (error, doc) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(doc)
                }
            })
        })
    },
    findById(Model, data) {
        return new Promise((resolve, reject) => {
            //model.findById(需要查找的对象, callback)
            Model.findById(data, (error, doc) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(doc)
                }
            })
        })
    },
    update(Model, conditions, update) {
        return new Promise((resolve, reject)=>{
            //model.update(查询条件,更新对象,callback)
            Model.update(conditions,update,(error,doc)=>{
                if(error){
                    reject(error)
                }else{
                    resolve(doc)
                }
            })
        })
    },
    remove(Model,conditions){
        return new Promise((resolve,reject)=>{
            //model.remove(查询条件,callback)
            Model.remove(conditions, (error,doc)=>{
                if(error){
                    reject(error)
                }else{
                    resolve(doc)
                }
            })
        })
    }
};

module.exports = API;