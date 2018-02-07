const express = require('express');
const static = require('express-static');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');
const expressRoute = require('express-route');

var server = express();

server.listen(8080);

var Dates = new Date();
var Year = Dates.getFullYear();
var Month = Dates.getMonth()+1;
var Day = Dates.getDate();
var NewDate = Year +"-"+ Month +"-"+ Day;
const multerObj = multer({dest: './static/upload/'+NewDate});//规定上传文件的路径
//获取请求的数据
server.use(bodyParser.urlencoded());
server.use(multerObj.any());

//cookie、session
server.use(cookieParser());
var keys=[];
for(var i=0;i<100000;i++){
	keys[i] = 'a_'+Math.random();
}
server.use(cookieSession({
	name: 'sess_id',
	keys:  keys,
	maxAge: '20*60*1000'
}))

//模板
server.engine('html',consolidate.ejs);
server.set('views','template');
server.set('view engine','html');

//route
server.use('/',require('./route/web.js')());
server.use('/admin/',require('./route/admin/index.js')());

//default: static
server.use(static('./static/'));









