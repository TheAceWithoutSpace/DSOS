const mongoose = require("mongoose");

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
  };

module.exports={

    find(dataStructure,callback){
        mongoose.connect(process.env.DB_connection,options)
        .then(()=>{
            console.log(process.env.mongoconnectmsg+" 1");
            dataStructure.find()
            .then(res=>{
                console.log("1 succses");
                callback(res)
                mongoose.connection.close()
            })
            .catch(err=>{
                console.log("1 err");
                callback({err:'404 Couldent find '+err})
                mongoose.connection.close()
            }) 
        })
        .catch((err)=>console.log(err))
    },findByIdAndDelete(dataStructure,id,callback){
        mongoose.connect(process.env.DB_connection,options)
        .then(()=>{
            console.log(process.env.mongoconnectmsg+" 2");
            dataStructure.findByIdAndDelete(id)
            .then(res=>{
                console.log("2 succses");
                callback(res)
                mongoose.connection.close()
            })
            .catch(err=>{
                console.log("2 err");
                callback({err:'404 Couldent find '}) 
                mongoose.connection.close()
            })  
            
        })
        .catch((err)=>console.log(err));
    },findbyField(dataStructure,Field,callback){
        mongoose.connect(process.env.DB_connection,options).then(()=>{
            console.log(process.env.mongoconnectmsg+" 3");
            console.log(Field)
            dataStructure.find(Field)
            .then(res=>{
                console.log("3 sucsess");
                callback(res,{status:200})
                mongoose.connection.close()
            })
            .catch(err=>{
                callback({err:'Couldent find ',status:404})
                mongoose.connection.close()
            })     
        })
        .catch((err)=>console.log(err));
    },findOneAndUpdateByFieldString(dataStructure,Field,UpdateFieldAndValue,callback){
        mongoose.connect(process.env.DB_connection,options)
        .then(()=>{
            console.log(process.env.mongoconnectmsg+" 4");
            dataStructure.findOneAndUpdate(Field,
                UpdateFieldAndValue,{new:true},)
            .then(res=>{
                console.log("4 sucsess");
                callback(res);
                mongoose.connection.close()
            })
            .catch(err=>{
                console.log("4 err");
                callback({err:'404 Couldent find '})
                mongoose.connection.close()
            })
        })
        .catch((err)=>console.log(err));
    },findOneAndUpdateByField(dataStructure,Field,UpdateFieldAndValue,callback){
        mongoose.connect(process.env.DB_connection,options)
            .then(()=>{
            console.log(process.env.mongoconnectmsg+" 5");
            console.log(UpdateFieldAndValue)
            dataStructure.findOneAndUpdate(Field,
            {$inc:UpdateFieldAndValue},{new:true},)
            .then(res=>{
                console.log(res)
                console.log("5 sucsess");
                callback(res);
                mongoose.connection.close()
            })
            .catch(err=>{
                console.log('diconnected 5')
                callback({err:'404 Couldent find '+err})
                mongoose.connection.close()
            })  
        })
        .catch((err)=>console.log(err)) 
    },CreateNew(dataStructure,callback){
        mongoose.connect(process.env.DB_connection,options)
        .then(async()=>{
            console.log(process.env.mongoconnectmsg+" 6");
            console.log(dataStructure)
            await dataStructure.save()
            .then(res=>{
                console.log('All clear 6 ')
                callback(res)
                mongoose.connection.close()
            })
            .catch(err=>{
                console.log('disconected 6')
                callback({err:err})
                mongoose.connection.close()
            })
        })
        .catch((err)=>console.log(err));
    },CreateArray(dataStructure,array,callback){
        mongoose.connect(process.env.DB_connection,options)
        .then(async()=>{
            console.log(process.env.mongoconnectmsg+" 6");
            await dataStructure.insertMany(array)
            .then(res=>{
                console.log('All clear 6 ')
                callback(res)
                mongoose.connection.close()
            })
            .catch(err=>{
                console.log('disconected 6')
                callback({err:err})
                mongoose.connection.close()
            })
        })
        .catch((err)=>console.log(err));
    }
};
