const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const MonthDateModle=new Schema({
    Date:{
        type:Date,
        required:true,
        unique:true
        },
    users:{
        type:Number,
        required:true
    },
    StorageRequests:{
        type:Number,
        required:true
    },
    bugReports:{
        type:Number,
        required:true
    },
    AggreStorageTotal:{
        type:Number,
        required:true
    },
    AggreStorageUsegeAmmount:{
        type:Number,
        required:true
    },
    Month:{
        type:String,
        required:true,
    }
},{
    timestamp:true,
});
const MonthData =mongoose.model('MonthDate',MonthDateModle);
module.exports=MonthData;