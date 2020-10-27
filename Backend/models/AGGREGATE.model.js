const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const AGGREGATESchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
        },
    Amount:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    TotalAmount:{
        type:String,
        required:true,
    },
    date: { type: Date, default: Date.now },
},{
    timestamp:true,
});
const AGGREGATE =mongoose.model('AGGREGATE',AGGREGATESchema);
module.exports=AGGREGATE;