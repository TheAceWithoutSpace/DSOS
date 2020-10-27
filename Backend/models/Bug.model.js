const mongoose = require("mongoose");
const Schema= mongoose.Schema;

//Requst Schema
const Bug=new Schema({
    username:{
        type:String,
        required:true,
            },
    email:{
        type:String,
        required:true,
    },
    Description:{
        require:true,
        type:String,
    },
    File:{
        type:String,
    },
    status:{
        type:String, required: true,
    },
    userID:{
        type:String, required: true,
    },
    date: { type: Date, default: Date.now },
},{
    timestamp:true,
});
const BugReport =mongoose.model('Bug',Bug);
module.exports=BugReport;