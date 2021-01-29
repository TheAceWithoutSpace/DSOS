const mongoose = require("mongoose");
const Schema= mongoose.Schema;

//Requst Schema
const RequstDataSchema=new Schema({
    username:{
        type:String,
        required:true,
            },
    email:{
        type:String,
        required:true,
    },
    Name:{
        C:{//Cluster
            require:true,
            type:String,
        },
        A:{//Aggre
            require:true,
            type:String,
        },
        S:{//Svm
            require:true,
            type:String,
        },
        V:{//vloume
            require:true,
            type:String,
        },
    },
    Location:{
        require:true,
        type:String,
    },
    Amount:{
        required:true,
        type:Number
    },
    File:{
        type:String, required: true,
    },
    status:{
        type:String, required: true,
    },
    type:{
        type:String,required:true,
    },
    userID:{
        type:String, required: true,
    },
    date: { type: Date, default: Date.now },
},{
    timestamp:true,
});
const StorageRequest =mongoose.model('StorageRequest',RequstDataSchema);
module.exports=StorageRequest;