const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const SvmSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
        },
    Amount:{
        type:Number,
        required:true
    },
    AGGREGATE:{
        type:String,
        required:true
    },
    date: { type: Date, default: Date.now },
},{
    timestamp:true,
});
const SVM =mongoose.model('SVM',SvmSchema);
module.exports=SVM;