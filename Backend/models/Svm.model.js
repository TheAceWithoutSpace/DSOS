const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const SvmSchema=new Schema({
    Cluster:{
        type:String,
        required:true,
        },
    env:{
        type:String,
        required:true
    },
    aggregate:{
        type:String,
        required:true
    },
    Name:{
        type:String,
        required:true,
        unique:true
    },
    total:{
        type:Number,
        required:true
    },
    used:{
        type:Number,
        required:true
    },
    available:{
        type:Number,
        required:true   
    },
    full:{
        type:Number,
        required:true  
    },
    dedupeCapSaved:{//data protection 
        type:Number,
        required:true  
    },
    VolumeCount:{
        type:Number,
        required:true  
    },
    date: { type: Date, default: Date.now },
},{
    timestamp:true,
});
const SVM =mongoose.model('SVM',SvmSchema);
module.exports=SVM;