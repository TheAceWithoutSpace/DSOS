const {MongoClient} = require('mongodb');
require('dotenv').config()
// const client =new MongoClient(process.env.DB_connection,{useNewUrlParser:true,useUnifiedTopology:true});
function createClient(){ 
    const client =new MongoClient(process.env.DB_connection,{useNewUrlParser:true,useUnifiedTopology:true});
    return client
}
async function find(collection){
    const client =createClient();
    let Arr={res:null,err:null};
    try{
        await client.connect().then(async(client)=>{
            console.log("connected to database");
            const db=client.db(process.env.DB);
            const Cursor=await db.collection(collection).find()
            const allValues = await Cursor.toArray();
            Arr.res=allValues;
        }).catch(err =>{ Arr.err=err.stack;})
    }catch(err){
        Arr.err=err.stack;
    }finally{
        await client.close()
        return(Arr)
    }
}
async function findAndDelete(collection,query){
    const client =createClient();
        let Arr={res:null,err:null};
        try{
            client.connect().then(async(client)=>{
                console.log("connected to database");
                const db=client.db(process.env.DB);
                const result = await db.collection(collection).deleteOne(query)
                if(result.deletedCount){
                    console.log("Deleted ")
                    Arr.res="Doc Dleted";
                }else{
                    console.log("404 not found");
                    Arr.err="Doc not found"
                }
            }).catch(err =>{ Arr.err=err.stack;})
        }catch(err){
            Arr.err=err.stack;
        }finally{
            await client.close()
            return(Arr)
        }
    }
    async function findbyField(collection,query){
        const client =createClient();
        let Arr={res:null,err:null};
        console.log(query)
            try{
                await client.connect().then(async(client)=>{
                    console.log("connected to database");
                    const db=client.db(process.env.DB);
                    let obj=await db.collection(collection).find(query);
                    Arr.res=await obj.toArray();
                }).catch(err =>{ Arr.err=err.stack;})
            }catch(err){
                Arr.err=err.stack;
            }finally{
                await client.close()
                console.log("disconected");
                return(Arr);
            }
        }
        async function findOneAndInc(collection,Filter,updateFiled){
            const client =createClient();
            let Arr={res:null,err:null};
            try{
                await client.connect().then(async(client)=>{
                    console.log("connected to database");
                    const db=client.db(process.env.DB);
                    const response=await db.collection(collection).updateOne(Filter,{$inc:updateFiled})
                    Arr.res=response.modifiedCount;
                }).catch(err =>{ Arr.err=err.stack;})
            }catch(err){
                Arr.err=err.stack;
            }finally{
                await client.close()
                return(Arr)
            }
        }
        async function findOneAndUpdate(collection,Filter,updateFiled){
            const client =createClient();
            let Arr={res:null,err:null};
            try{
                await client.connect().then(async(client)=>{
                    console.log("connected to database");
                    const db=client.db(process.env.DB);
                    const response=await db.collection(collection).updateOne(Filter,{$set:updateFiled})
                    console.log(response.upsertedCount);
                    Arr.res=response;
                }).catch(err =>{ Arr.err=err.stack;})
            }catch(err){
                Arr.err=err.stack;
            }finally{
                await client.close()
                return(Arr)
            }
        }
        async function PushIntoArray(collection,Filter,updateFiled){
            const client =createClient();
            let Arr={res:null,err:null};
            try{
                await client.connect().then(async(client)=>{
                    console.log("connected to database");
                    const db=client.db(process.env.DB);
                    const response=await db.collection(collection).updateOne(Filter,{$push:updateFiled})
                    console.log(response.upsertedCount);
                    Arr.res=response.upsertedId;
                }).catch(err =>{ Arr.err=err.stack;})
            }catch(err){
                Arr.err=err.stack;
            }finally{
                await client.close()
                return(Arr)
            }
        }
            async function ArrayDataHendle(collection,Array){
                const client =createClient();
                let Arr={res:null,err:null};
                try{
                    client.connect().then((client)=>{
                        console.log("connected to database");
                        const db=client.db(process.env.DB);
                        let log={true:0,false:0};
                        Array.forEach(async(doc)=> {
                        
                        const result =await db.collection(collection).replaceOne({locationstring:doc.locationstring}, doc, { upsert: true });
                            if (result.modifiedCount === 0 && result.upsertedCount === 0) {
                                log.false++;
                            }else{
                                if (result.matchedCount === 1) {
                                    console.log("Matched " + result.matchedCount + " documents.");
                                }
                                if (result.modifiedCount === 1) {
                                    console.log("Updated one document.");
                                    log.true++;
                                }
                                if (result.upsertedCount === 1) {
                                    console.log("Inserted one new document with an _id of " + result.upsertedId._id);
                                    log.true++;
                                }
                            }
                        })
                        Arr.res=log;
                    }).catch(err =>{Arr.err=err.stack;})
                    
                }catch(err){
                    Arr.err=err.stack;
                }finally{
                    await client.close()
                    return(Arr)
                }
            }
            async function CreateNew(collection,newListing){
                const client =createClient();
                let Arr={res:null,err:null};
                try{
                    await client.connect().then(async(client)=>{
                    console.log("connected to database");
                    const db=client.db(process.env.DB);
                    const response=await db.collection(collection).insertOne(newListing);
                    console.log(response.insertedId);
                    let obj=await db.collection(collection).find({"_id":response.insertedId});
                    Arr.res=await obj.toArray();
                    }).catch(err =>{console.log(err)})
                }catch(err){
                    Arr.err=err.stack;
                }finally{
                    await client.close()
                    console.log("disconected");
                    return(Arr);
                }
            }
            async function createNewArray(collection,Array){
                const client =createClient();
                    let Arr={res:null,err:null};
                    try{
                        await client.connect().then(async(client)=>{
                            console.log("connected to database");
                            const db=client.db(process.env.DB);
                            const result=await db.collection(collection).insertMany(Array, { ordered: false });
                            console.log(result.insertedCount);
                            Arr.res={inseted:result.insertedCount,ducs:Array.length};
                        }).catch(err =>{ Arr.err=err.stack;})
                    }catch(err){
                        Arr.err=err.stack;
                    }finally{
                        await client.close()
                        console.log("disconected");
                        return(Arr);
                    }
                }
module.exports={
    find,
    findAndDelete,
    findbyField,
    findOneAndUpdate,
    findOneAndInc,
    ArrayDataHendle,
    CreateNew,
    createNewArray,
    PushIntoArray,
}
