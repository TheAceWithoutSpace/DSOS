const router = require('express').Router();
const MonthDate = require('../models/MonthDate.model');
const Helperfunctions =require('./HelperFunctions');
const schedule=require('node-schedule');
const { ObjectId } = require('mongodb');
const collection=process.env.MonthDateCollection;
//Get All MonthReports
router.route('/').get(async(req,res)=>{
    await Helperfunctions.find(collection).then((result)=>{
        res.json(result)
    })
});
//Delete a MonthReports
    router.route("/:id").delete(async(req,res)=>{
        await Helperfunctions.findAndDelete(collection,{_id:ObjectId(req.params.id)}).then((result)=>{
            res.json(result)
        })
    });
//get a MonthReports by id
    router.route("/:id").get(async(req,res)=>{
        await Helperfunctions.findbyField(collection,{_id:ObjectId(req.params.id)}).then((result)=>{
            res.json(result)
        })
    })
//get MonthReport by Date
router.route("/Date/:Date").get(async(req,res)=>{
    console.log(req.params.Date)
    await Helperfunctions.findbyField(collection,{Date:req.params.Date}).then((result)=>{
        res.json(result)
    })
});
//get all the MonthReports by Month
    router.route("/Month/:Month").get(async(req,res)=>{
        console.log(req.params.Month)
        await Helperfunctions.findbyField(collection,{Date:req.params.Month}).then((result)=>{
            if(result.err){
                res.status(404).json(result)
            }else{
                if (result.res.length===0){
                    result.err="Cant Find this Month Data pls check the string or db connection for more conntact support ";
                    result.res=null;
                }
            res.json(result)}
        })
    })
//get all the valus for range dates
router.route("/range/:startDate/:endDate").get(async(req,res)=>{
    console.log(req.params.startDate+'||'+req.params.endDate)
    await Helperfunctions.findbyField(collection,{'Date': {"$gte": req.params.startDate ,"$lte":req.params.endDate} }).then((result)=>{
        console.log(result)
        res.json(result)
    })
})
//Update The MonthReports users 
router.route("/users/:Date").post(async(req,res)=>{
    console.log(req.params.Date)
    await Helperfunctions.findOneAndInc(collection,{Date:req.params.Date},{users:1}).then((result)=>{
        console.log(result)
        res.json(result)
    })
})
//Update The MonthReports StorageRequests 
router.route("/StorageRequests/:Date").post(async(req,res)=>{
    await Helperfunctions.findOneAndInc(collection,{Date:req.params.Date}, {StorageRequests:1}).then((result)=>{
        res.json(result)
    })
})
//Update The MonthReports bugReports 
router.route("/bugReports/:Date").post(async(req,res)=>{
    await Helperfunctions.findOneAndInc(collection,{Date:req.params.Date},{bugReports:1}).then((result)=>{
        res.json(result)
    })
})
//Update The MonthReports AggreStorageTotal 
router.route("/StorageTotalFree/:Date").post(async(req,res)=>{
    await Helperfunctions.findOneAndInc(collection,{Date:req.params.Date},{StorageTotalFree:req.body.StorageTotalFree}).then((result)=>{
        res.json(result)
    })
})
//Update The MonthReports AggreStorageUsegeAmmount 
router.route("/StorageUsegeAmmount/:Date").post(async(req,res)=>{
    await Helperfunctions.findOneAndInc(collection,{Date:req.params.Date},
        {StorageUsegeAmmount:req.body.StorageUsegeAmmount}).then((result)=>{
        res.json(result)
    })
})
router.route('/addMonth').post(async (req,res) => {
    let ts=Date.now()
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    try{  
        const NewMonthDate=({
            Month:month,
            year:year,
            Date:`${month}-${year}`,
            Data:[],
            });
            await Helperfunctions.CreateNew(collection,NewMonthDate).then((result)=>{
                res.json(result)
            })
    }catch{
        err=>res.status(500).json('Error'+err);
    }
})
    //create new MonthDataReport Report
    router.route('/add').post(async (req,res) => {
        let ts=Date.now()
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        try{  
            const NewDay=({
                Date:date,
                users:0,
                StorageRequests:0,
                bugReports:0,
                StorageTotalFree:0,
                StorageUsegeAmmount:0,
                StorageRequestsAmount:0,
                StorageRequestsAmmountAccepted:0,
                StorageRequestsAmmountDeclined:0,
            });
            console.log(month+'-'+year)
            await Helperfunctions.PushIntoArray(collection,{Date:month+'-'+year},{Data:NewDay}).then((result)=>{
                    console.log(result);
                    res.json(result)
            })
        }
        catch{
            err=>res.status(500).json('Error'+err);
        }
    
    });
        let j=schedule.scheduleJob('0 0 0 */1 * *', async(fireDate) => {
        let ts=Date.now()
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        console.log(fireDate)
        try{  
            const NewMonthDate=({
                Month:month,
                year:year,
                Date:`${month}-${year}`,
                Data:[],
                });
            await Helperfunctions.CreateNew(collection,NewMonthDate).then((result)=>{
                res.json(result)
            })
        }catch{
            err=>console.log('Error'+err);
            }
    })
module.exports=router;