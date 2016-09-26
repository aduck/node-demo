var express=require('express');
var app=express();
var fs=require('fs');
var multer=require('multer');
var bodyParse=require('body-parser');
var upload=multer({dest:'/uploads/'});

// post参数解析
var urlencodedParser=bodyParse.urlencoded({extended:false})
// 首页
app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html')
})
// 文件中间件
//app.use(express.static('statics'))
app.use(express.static('uploads'))
//app.use(multer({dest:'/uploads/'}))

// get提交
app.get('/form_get',function(req,res){
	res.send('账号:'+req.query.username+'\n密码:'+req.query.password)
})
// post提交
app.post('/form_post',urlencodedParser,function(req,res){
	res.send('账号:'+req.body.username+'\n密码:'+req.body.password)
})
// 文件上传
app.post('/upload',upload.single('upfile'),function(req,res){
	var tmp_path=req.file.path
	console.log(tmp_path)
	var dest_file='uploads/'+req.file.originalname;	
	var src=fs.createReadStream(tmp_path)
	var dest=fs.createWriteStream(dest_file)
	src.pipe(dest)
	src.on('end',function(){
		res.send('<img src="'+req.file.originalname+'"> <br />上传成功')
	})
})

var server=app.listen(3000,function(){
	var host=server.address().address;
	var port=server.address().port;
	console.log('host:'+host+'\nport:'+port)
})