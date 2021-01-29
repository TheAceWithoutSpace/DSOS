const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const VolumeSchema=new Schema({
    locationstring:{
        type:String,
        required:true,
        unique:true
    },
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
        required:true,
    },
    svm:{
        type:String,
        required:true, 
    },
    Name:{
        type:String,
        required:true,
    },
    total:{
        type:Number,
        required:true,
    },
    used:{
        type:Number,
        required:true,
    },
    available:{
        type:Number,
        required:true,
    },
    dedupeCapSaved:{//dataprotection 
        type:Number,
        required:true,
    },
    date: { type: Date, default: Date.now },
},{
    timestamp:true,
});
const Volume =mongoose.model('Volume',VolumeSchema);
module.exports=Volume;