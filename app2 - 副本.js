var express=require('express')
var app=express()
var pug=require('pug')
var path=require('path')
var mongoose=require('mongoose')
var Person=require('./models/person')
var bodyParse=require('body-parser')
var urlencodedParser=bodyParse.urlencoded({extended:false})

// 设置模板引擎和视图目录
app.set('views','./views')
app.set('view engine','pug')
app.use(express.static(path.join(__dirname,'public')))

// 连接数据库
mongoose.connect('mongodb://localhost/test');

// 列表页
app.get('/list',function(req,res){
	Person.fetch(function(err,persons){
		if(err){
			console.log(err)
		}else{
			res.render('list',{
				title:'列表页',
				items:persons,
				pretty:' '
			})
		}
	})   
})

// 详情页
app.get('/list/:id',function(req,res){
	var id=req.params.id
	Person.findById(id,function(err,p){
		if(err){
			console.log(err)
		}else{
			res.render('detail',{
				title:'详请页',
				item:p,
				pretty:' '
			})
		}
	})
})

// 录入
app.get('/add',function(req,res){
	res.render('add',{
		title:'录入',
		item:null,
		pretty:' '
	})
})

// 修改
app.get('/update/:id',function(req,res){
	var id=req.params.id
	Person.findById(id,function(err,p){
		if(err){
			console.log(err)
		}else{
			res.render('add',{
				title:'年龄更新',
				item:p,
				pretty:' '
			})
		}
	})
})

// 录入逻辑
app.post('/addInfo',urlencodedParser,function(req,res){
	var name=req.body.username
	var age=req.body.age
	if(name.trim()=='' || age.trim()==''){
		res.json({"error":1,"msg":"用户名和年龄不能为空"})
		return;
	}
	if(isNaN(age)){
		res.json({"error":1,"msg":"年龄不是数字"})
		return;
	}
	var p=new Person({name:name,age:age})
	p.save(function(err){
		if(err){
			console.log(err)
		}else{
			console.log('添加成功');
			res.redirect('/list');
		}
	})
})

// 修改逻辑
app.post('/updateInfo',urlencodedParser,function(req,res){
	var id=req.body.uid
	var age=req.body.age
	Person.updateInfo({"_id":id},{'age':age},function(err){
		if(err){
			console.log(err)
		}else{
			res.redirect('/list');
		}
	})
})

// 删除
app.get('/remove/:id',function(req,res){
	var id=req.params.id
	Person.removeInfo({"_id":id},function(err){
		if(err){
			console.log(err)
		}else{
			console.log('删除成功');
			res.redirect('/list');
		}
	})
})

var server=app.listen(3000,function(){
	console.log('running at '+server.address().address+':'+server.address().port)
})