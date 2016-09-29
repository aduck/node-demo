var express=require('express')
var app=express()
var pug=require('pug')
var path=require('path')
var mongoose=require('mongoose')
var Person=require('./models/person')
var User=require('./models/user')
var bodyParse=require('body-parser')
var cookieParser=require('cookie-parser')
var session=require('express-session')
var urlencodedParser=bodyParse.urlencoded({extended:false})

// 设置模板引擎和视图目录
app.set('views','./views')
app.set('view engine','pug')

// 连接数据库
mongoose.connect('mongodb://localhost/test');

// 中间件
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())
app.use(session({
	secret:'12345',
	name:'username',
  cookie:{maxAge:60*1000},
  resave:true,
  saveUninitialized:false
}))

// session验证函数
function check(req,res,cb){
	if(!req.session.user){
		res.redirect('/login')
	}else{
		cb()
	}
}

// 登陆
app.get('/login',function(req,res){
	if(!req.session.user){
		res.render("login")
	}else{
		res.redirect('/list_1')
	}
})

// 登陆验证
app.post('/loginForm',urlencodedParser,function(req,res){
	var username=req.body.username
	var password=req.body.password
	User.checkUser(username,password,function(err,u){
		if(err){
			console.log(err)
		}else{
			if(u){
				req.session.user=username // 设置session
				res.redirect('/list_1')
			}else{
				res.json({'error':1,'msg':'用户名密码错误'})
			}
		}
	})
})

// 列表页
app.get('/list_:id',function(req,res){
	check(req,res,function(){
		var pid=req.params.id || 1  //当前页码
		var n=5  // 每页显示条数
		var pagenum  // 总页数
		Person.count({},function(err,count){
			if(err){
				console.log(err)
			}
			pagenum=Math.ceil(count/n)
			Person.find({}).limit(n).skip((pid-1)*n).sort({'meta.updateAt':-1}).exec(function(err,ps){
				res.render('list2',{
					title:'列表页_'+pid,
					items:ps,
					count:pagenum,
					currentPage:pid,
					pretty:' '
				})
			})
		})
	}) // 验证session
})

// 详情页
app.get('/list/:id',function(req,res){
	check(req,res,function(){
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
	}) // 验证session
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
			res.redirect('/list_1');
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
			res.redirect('/list_1');
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
			res.redirect('/list_1');
		}
	})
})

var server=app.listen(3000,function(){
	console.log('running at '+server.address().address+':'+server.address().port)
})