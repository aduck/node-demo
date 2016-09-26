var mongoose=require('mongoose')
var personSchema=require('../schemas/person')

var Person=mongoose.model('Person',personSchema,'persons')

module.exports=Person