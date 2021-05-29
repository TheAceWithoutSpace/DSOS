const {MongoClient} = require('mongodb');
require('dotenv').config()
async function main(){
const uri=process.env.DB_connection;
console.log(uri);
const client =new MongoClient(uri,{useUnifiedTopology:true,useNewUrlParser:true});

let month={
    Month:5,
    year:2021,
    Date:"5-2021",
    Data:[]
}
try {
let i=1;
    while(i<=16){
        const NewMonthDate=({
            Date:i,
            users:Math.floor(Math.random() * 10),
            StorageRequests:Math.floor(Math.random() * 10),
            bugReports:Math.floor(Math.random() * 10),
            StorageTotalFree:Math.floor(Math.random() * 10)+15,
            StorageUsegeAmmount:Math.floor(Math.random() * 10),
            StorageRequestsAmount:Math.floor(Math.random() * 10),
            StorageRequestsAmmountAccepted:Math.floor(Math.random() * 10),
            StorageRequestsAmmountDeclined:Math.floor(Math.random() * 10),
        });
        i++
        month.Data.push(NewMonthDate);
    }
    console.log(month.Data);
    await client.connect();
    // await find(client,"listingsAndReviews") 
    // await Delete(client,{Name:"ale"},"listingsAndReviews")
    // await listDatabases(client);
    // await findOneListingByName(client,"listingsAndReviews",{Name:"Ben"})
    //   await createListing(client,"listingsAndReviews",{Name:'G',Password:"G"});
    //  await ArrayDataHendle("MonthDate",month)
    // await find(client,"listingsAndReviews")
      await update(client,"MonthDate",{Date:month.Date},month)
    // await updatemeny(client,"listingsAndReviews",{Name:"blop"},{Name:"alex"})
     await find(client,"listingsAndReviews")    
} catch (e) {
    console.error(e);
}finally {
    await client.close();
}


}
main().catch(console.error);
//DB's
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
//FindoneByName
async function findOneListingByName(client,collection,nameOfListing) {
    result = await client.db(process.env.DB).collection(collection)
                        .findOne(nameOfListing);
    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}
//Find

async function find(client,collection){
    Cursor=await client.db(process.env.DB).collection(collection)
                    .find()
    const allValues = await Cursor.toArray();
    console.log(allValues);
}
//Delete
async function Delete(client,query,collection){
    const result = await client.db(process.env.DB).collection(collection).deleteOne(query)
    if(result.deletedCount){
        console.log("Deleted ")
    }else{
        console.log("404 not found");
    }
}
//create
async function createListing(client,collection,newListing){
    try{
        console.log(newListing.Name)

    const result = await client.db(process.env.DB).collection(collection).insertOne(newListing);
    const obj=result.ops;
    console.log(`New listing created with the following id: ${obj}`);
    }catch{
        console.log('err')
    }
}
//updateOne
async function ArrayDataHendle(collection,Array){
    const uri=process.env.DB_connection;
    const client =new MongoClient(uri,{useUnifiedTopology:true,useNewUrlParser:true});
    let Arr={res:null,err:null};
    try{
        client.connect().then((client)=>{
            console.log("connected to database");
            const db=client.db(process.env.DB);
            let log={true:0,false:0};;
            Array.forEach(async(doc)=> {
            
            const result =await db.collection(collection).replaceOne({Date:doc.Date}, doc, { upsert: true });    
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
async function update(client,collection,Filter,updateFiled){
    const options = { upsert: true };
    const result =await client.db(process.env.DB).collection(collection)
                        .replaceOne(Filter, updateFiled, options);
    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      console.log("No changes made to the collection.");
    } else {
      if (result.matchedCount === 1) {
        console.log("Matched " + result.matchedCount + " documents.");
      }
      if (result.modifiedCount === 1) {
        console.log("Updated one document.");
      }
      if (result.upsertedCount === 1) {
        console.log(
          "Inserted one new document with an _id of " + result.upsertedId._id
        );
      }
    }
    // const result= await client.db(process.env.DB).collection(collection)
    //                     .updateOne(Filter,{$set:updateFiled},options)
    // console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,)
}
//updatemeny
async function updatemeny(Client,collection,Filter,updateQurry){
    const result =await Client.db(process.env.DB).collection(collection)
                        .updateMany(Filter,{$set:updateQurry});
    console.log(result);
}