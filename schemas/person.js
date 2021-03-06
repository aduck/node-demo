var mongoose=require('mongoose')

var PersonSchema=new mongoose.Schema({
	name:String,
	age:Number,
	meta:{
		createAt:{
			type:Date,
			defaults:Date.now()
		},
		updateAt:{
			type:Date,
			defaults:Date.now()
		}
	}
})

PersonSchema.pre('save',function(next){
	// this指向model实例
	// this.isNew属性判断是否为新数据
	this.meta.createAt=this.meta.updateAt=Date.now()
	next()
})
PersonSchema.pre('update',function(next){
	this.update({},{$set:{'meta.updateAt':Date.now()}})
	next()
})

PersonSchema.methods.test=function(){
	// this指向model实例
	// this.model('Person')指向Person model
	//console.log(this.model('Person'))
}

PersonSchema.statics.fetch=function(cb){
	// this指向model
	// 在这里实现增删改查逻辑
	this.find({}).sort({'meta.updateAt':1}).exec(cb)
}

PersonSchema.statics.findById=function(id,cb){
	this.findOne({_id:id}).select('name age').exec(cb)
}

PersonSchema.statics.updateInfo=function(condition,o,cb){
	this.update(condition,{$set:o},{upsert:true}).exec(cb)
}

PersonSchema.statics.removeInfo=function(condition,cb){
	this.remove(condition).exec(cb)
}

module.exports=PersonSchema