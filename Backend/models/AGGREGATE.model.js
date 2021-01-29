const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const AggregateSchema=new Schema({
    Name:{       
         type:String,
         required:true, 
         unique:true,
        },
    Cluster:{
        type:String,
        required:true,
        },
    env:{//envierment 
        type:String,
        required:true
    },
    total:{//total ammount allday
        type:Number,
        required:true,
    },
    used:{//שימוש
        type:Number,
        required:true,
    },
    allocated:{//הוקצה
        type:Number,
        required:true,
    },
    leftToAllocate:{//Total X1.2 left to allocate
        type:Number,
        required:true,
    },
    full:{//1-100% used
        type:Number,
        required:true,
    },
    overSubsPrecent:{//over 100 
        type:Number,
        required:true
    },
    date: { type: Date, default: Date.now },
},{
    timestamp:true,
});
const Aggregate =mongoose.model('Aggregate',AggregateSchema);
module.exports=Aggregate;