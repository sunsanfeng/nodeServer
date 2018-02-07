const express = require('express');
const mysql = require('mysql');

var db = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'learn'
});
module.exports = function(){
	var router = express.Router();
	
	router.get('/',(req,res)=>{
		switch(req.query.act){
			case 'mod':
			db.query(`SELECT * FROM banner_table WHERE id= ${req.query.id}`,(err,data) => {
				if(err){
					console.log(err);
					res.status(500).send('database error').end();
				}else if(data.length == 0){
					res.status(404).send('未找到该数据！').end();
				}else{
					db.query(`SELECT * FROM banner_table`,(err,banners) =>{
						if(err){
							console.log(err);
							res.status(500).send('database error').end();
						}else{
							res.render('admin/banners.ejs',{banners, mod_data: data[0]});
						}
					});
					//res.render('admin/banners.ejs',{banner: data[0]});
				}
			});
			break;
			case 'del':
			db.query(`DELETE FROM banner_table WHERE id = '${req.query.id}'`,(err,data) => {
				if(err){
					console.log(err);
					res.status(500).send('database error').end();
				}else{
					res.redirect('/admin/banners');
				}
			});
			break;
			default:
				db.query(`SELECT * FROM banner_table`,(err,data) =>{
				if(err){
					console.log(err);
					res.status(500).send('database error').end();
				}else{
					res.render('admin/banners.ejs',{banners: data});
				}
			});
			break;
		}
		
	});
	router.post('/',(req,res)=>{
		var title = req.body.title;
		var description = req.body.description;
		var href = req.body.href;
		if(req.body.mod_id){//修改
			db.query(`UPDATE banner_table SET title='${title}',description='${description}',href='${href}' WHERE id = ${req.body.mod_id}`,(err,data) => {
				if(err){
					console.log(err);
					res.status(500).send('database error').end();
				}else{
					res.redirect('/admin/banners');
				}
				
			})
		}else{ //添加
			if(!title || !description || !href){
				res.status(400).send('参数错误').end();
			}else{
				db.query(`INSERT INTO banner_table (title,description,href) VALUE 
				('${title}','${description}','${href}')`,(err,data)=>{
					if(err){
						console.log(err);
						res.status(500).send('database error').end();
					}else{
						res.redirect('/admin/banners');
					}
				});
			}
		}
	});
	
	return router;
}
