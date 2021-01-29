const router = require('express').Router();
const MonthDate = require('../models/MonthDate.model');
const Helperfunctions =require('./HelperFunctions');
const schedule=require('node-schedule');

//Get All MonthReports
router.route('/').get((req,res)=>{
    Helperfunctions.find(MonthDate,function(result){
        res.json(result)
    })
    // MonthDate.find()
    //     .then(Request=>res.json(Request))
    //     .catch(err=>res.status(400).json('Error:'+err));
    });
//Delete a MonthReports
    router.route("/:id").delete((req,res)=>{
        Helperfunctions.findByIdAndDelete(MonthDate,{_id:req.params.id},function(result){
            res.json(result)
        })
        // MonthDate.findByIdAndDelete(req.params.id)
        //     .then(()=>res.json('req deleted.'))
        //     .catch(err=>res.status(400).json('Error'+err));
    });
//get a MonthReports by id
    router.route("/:id").get((req,res)=>{
        Helperfunctions.findbyField(MonthDate,{_id:req.params.id},function(result){
            res.json(result)
        })
        // MonthDate.findById(req.params.id)
        //     .then((Req)=>res.json({Req}))
        //     .catch(err=>res.status(400).json('Error'+err));
    })
//get MonthReport by Date
//get all the MonthReports by Month
router.route("/Date/:Date").get((req,res)=>{
    Helperfunctions.findbyField(MonthDate,{Date:req.params.Date},function(result){
        res.json(result)
    })
});
//get all the MonthReports by Month
    router.route("/Month/:Month").get((req,res)=>{
        Helperfunctions.findbyField(MonthDate,{Month:req.params.Month},function(result){
            if(result.err){
                res.status(404).json(result)
            }else{
            res.json(result)}
        })
        // MonthDate.find({Month:req.params.Month})
        //     .then((Req)=>res.json({Req}))
        //     .catch(err=>res.status(400).json('Error'+err));
    })
//get all the valus for range dates
router.route("/range/:startDate/:endDate").get((req,res)=>{
    console.log(req.params.startDate+'||'+req.params.endDate)
    // $gte: new Date(new Date(req.params.startDate).setHours(00, 00, 00))
    // $lt: new Date(new Date(req.params.endDate).setHours(23, 59, 59))
    Helperfunctions.findbyField(MonthDate,{'Date': {"$gte": req.params.startDate ,"$lte":req.params.endDate} },function(result){
        res.json(result)
    })
})
//Update The MonthReports users 
router.route("/users/:Date").post((req,res)=>{
    Helperfunctions.findOneAndUpdateByField(MonthDate,{Date:req.params.Date},{users:1},function(result){
        res.json(result)
    })
    // MonthDate.findOneAndUpdate({Date:req.params.Date},
    //     {$inc:{users:1}},{new:true})
    //     .then((Req)=>res.json({Req}))
    //     .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
})
//Update The MonthReports StorageRequests 
router.route("/StorageRequests/:Date").post((req,res)=>{
    Helperfunctions.findOneAndUpdateByFiled(MonthDate,{Date:req.params.Date},{StorageRequests:1},function(result){
        res.json(result)
    })
    // MonthDate.findOneAndUpdate({Date:req.params.Date},
    //     {$inc:{StorageRequests:1}},{new:true})
    //     .then((Req)=>res.json({Req}))
    //     .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
})
//Update The MonthReports bugReports 
router.route("/bugReports/:Date").post((req,res)=>{
    Helperfunctions.findOneAndUpdateByFiled(MonthDate,{Date:req.params.Date},{bugReports:1},function(result){
        res.json(result)
    })
    // MonthDate.findOneAndUpdate({Date:req.params.Date},
    //     {$inc:{bugReports:1}},{new:true})
    //     .then((Req)=>res.json({Req}))
    //     .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
})
//Update The MonthReports AggreStorageTotal 
router.route("/AggreStorageTotal/:Date").post((req,res)=>{
    Helperfunctions.findOneAndUpdateByFiled(MonthDate,{Date:req.params.Date},{AggreStorageTotal:req.body.AggreStorageTotal},function(result){
        res.json(result)
    })
    // MonthDate.findOneAndUpdate({Date:req.params.Date},
    //     {$inc:{AggreStorageTotal:req.body.AggreStorageTotal}},{new:true})
    //     .then((Req)=>res.json({Req}))
    //     .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
})
//Update The MonthReports AggreStorageUsegeAmmount 
router.route("/AggreStorageUsegeAmmount/:Date").post((req,res)=>{
    Helperfunctions.findOneAndUpdateByFiled(MonthDate,{Date:req.params.Date},{AggreStorageUsegeAmmount:req.body.AggreStorageUsegeAmmount},function(result){
        res.json(result)
    })
    // MonthDate.findOneAndUpdate({Date:req.params.Date},
    //     {$inc:{AggreStorageUsegeAmmount:req.body.AggreStorageUsegeAmmount}},{new:true})
    //     .then((Req)=>res.json({Req}))
    //     .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
})
    //create new Bug Report
    router.route('/add').post(async (req,res) => {
        let ts=Date.now()
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        try{  
            const NewMonthDate=new MonthDate({
                Date:(month+"-"+date+"-"+year),
                Month:month+'.'+year,
                users:0,
                StorageRequests:0,
                bugReports:0,
                AggreStorageTotal:0,
                AggreStorageUsegeAmmount:0,
            });
            Helperfunctions.CreateNew(NewMonthDate,function(result){
                if(!result.err){
                    res.json(result)
                }else{
                    res.status(409).json(result)
                }
            })
            // NewMonthDate.save()
            //     .then(Req=>res.status(201).json(Req))
            //     .catch(err=>res.status(400).json('Error:'+err));
        }
        catch{
            err=>res.status(500).json('Error'+err);
        }
    
    });
    let j=schedule.scheduleJob('0 0 0 * * *', () => {
        let ts=Date.now()
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        try{  
           
            const NewMonthDate=new MonthDate({
                Date:(month+"-"+date+"-"+year),
                Month:month+'.'+year,
                users:0,
                StorageRequests:0,
                bugReports:0,
                AggreStorageTotal:0,
                AggreStorageUsegeAmmount:0,
            });
            Helperfunctions.CreateNew(NewMonthDate,function(result){
                if(!result.err){
                    console.log(result)
                }else{
                   console.log(result)
                }
            })
        }catch{
            err=>console.log('Error'+err);
            }
    })
module.exports=router;