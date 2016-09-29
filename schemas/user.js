var mongoose=require('mongoose')

var UserSchema=new mongoose.Schema({
	username:String,
	password:String
})

UserSchema.statics.checkUser=function(name,password,cb){
	this.findOne({'username':name,'password':password}).exec(cb)
}

module.exports=UserSchema