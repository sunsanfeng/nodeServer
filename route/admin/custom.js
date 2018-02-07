const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const common = require('../../libs/common');
var db = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'learn'
});

const pathLib = require('path');

module.exports = function(){
	var router = express.Router();
	
	router.get('/',function(req,res){
		switch (req.query.act){
			case 'mod':
				db.query(`SELECT * FROM custom_evaluation_table WHERE id=${req.query.id}`,(err,data) => {
					if(err){
						console.log(err);
						res.status(500).send('database error').end();
					}else if(data.length == 0){
						res.status(404).send('数据不存在').end();
					}else{
						db.query(`SELECT * FROM custom_evaluation_table`,(err,evaluation) => {
							if(err){
								console.log(err);
								res.status(500).send('database error').end();
							}else{
								res.render('admin/custom.ejs',{evaluation,mod_data: data[0]});
							}
						});
					}
				});
			break;
			case 'del':
				db.query(`SELECT src FROM custom_evaluation_table WHERE id=${req.query.id}`,(err,data) => {
					if(err){
						console.log(err);
						res.status(500).send('database error').end();
					}else{
						if(data.length ==0){
							res.status(404).send('数据不存在！').end();
						}else{
							fs.unlink("static/"+data[0].src,(err) => {
								if(err){
									console.log(err);
									res.status(500).send('文件操作失败').end();
								}else{
									db.query(`DELETE FROM custom_evaluation_table WHERE id=${req.query.id}`,(err,data) => {
										if(err){
											console.log(err);
											res.status(500).send('database error').end();
										}else{
											res.redirect('/admin/custom');
										}
									});
								}
							})
						}
					}
				});

			break;
			default:
				db.query(`SELECT * FROM custom_evaluation_table`,(err,data) => {
					if(err){
						console.log(err);
						res.status(500).send('database error').end();
					}else{
						res.render('admin/custom.ejs',{evaluation: data});
					}
				});
			break;
		}
		
	});
	router.post('/',function(req,res){
		var title = req.body.title;
		var description = req.body.description;
		//上传文件路径拼接
		var upPath = req.files[0].destination;
		var NewUpPath = upPath.split('/');
		var prefix = "/"+NewUpPath[2]+"/"+NewUpPath[3]+"/";
		//上传文件名操作
		var ext = pathLib.parse(req.files[0].originalname).ext;//得到上传文件的扩展名
		var oldPath = req.files[0].path;
		var newParth = req.files[0].path + ext;
		var newFileName = prefix+req.files[0].filename + ext;
		//移动上传的文件
		fs.rename(oldPath,newParth,(err) => {
			if(err){
				res.status(500).send('上传失败！').end();
			}else{
				if(req.body.mod_id){//修改
			
				}else{//添加
					db.query(`INSERT INTO custom_evaluation_table (title,description,src) VALUE ('${title}','${description}','${newFileName}')`,(err,data) => {
						if(err){
							console.log(err);
							res.status(500).send('database error').end();
						}else{
							res.redirect('/admin/custom');
						}
					});
				}
			}
		});
	})
	return router;
}
