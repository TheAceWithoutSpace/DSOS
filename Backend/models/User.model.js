const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true
            },
    Nickname:{
        required:true,
        type:String
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        required:true,
        type:String,
        minlength:2
    },
    Team:{
        require:true,
        type:String,
    },
    Admin:{
        required:true,
        type:Boolean,
    },
    Architect:{
        required:true,
        type:Boolean
    },
    date: { type: Date, default: Date.now },
},{
    timestamp:true,
});
const User =mongoose.model('User',userSchema);
module.exports=User;