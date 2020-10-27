const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const VolumeSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
        },
    Amount:{
        type:Number,
        required:true
    },
    Svm:{
        type:String,
        required:true
    },
    Aggregate:{
        type:String,
        required:true,
    },
    date: { type: Date, default: Date.now },
},{
    timestamp:true,
});
const Volume =mongoose.model('Volume',VolumeSchema);
module.exports=Volume;