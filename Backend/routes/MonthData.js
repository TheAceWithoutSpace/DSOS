const router = require('express').Router();
const MonthDate = require('../models/MonthDate.model');

//Get All MonthReports
router.route('/').get((req,res)=>{
    MonthDate.find()
        .then(Request=>res.json(Request))
        .catch(err=>res.status(400).json('Error:'+err));
    });
//Delete a MonthReports
    router.route("/:id").delete((req,res)=>{
        MonthDate.findByIdAndDelete(req.params.id)
            .then(()=>res.json('req deleted.'))
            .catch(err=>res.status(400).json('Error'+err));
    });
//get a MonthReports by Date
    router.route("/:id").get((req,res)=>{
        MonthDate.findById(req.params.id)
            .then((Req)=>res.json({Req}))
            .catch(err=>res.status(400).json('Error'+err));
    })
//get all the MonthReports by Month
    router.route("/Month/:Month").get((req,res)=>{
        MonthDate.find({Month:req.params.Month})
            .then((Req)=>res.json({Req}))
            .catch(err=>res.status(400).json('Error'+err));
    })
//get all the valus for range dates
router.route("/range/:startDate/:endDate").get((req,res)=>{
    console.log(req.params.startDate+' || '+req.params.endDate)
    MonthDate.find({"Date": {"$gte": req.params.startDate, "$lt": req.params.endDate}})
        .then((Req)=>res.json(Req))
        .catch((err)=>res.json(404).json({err:'Couldent Find data in given date'+err}))
})
//Update The MonthReports users 
router.route("/users/:Date").post((req,res)=>{
    MonthDate.findOneAndUpdate({Month:req.params.Date},
        {$inc:{users:1}},{new:true})
        .then((Req)=>res.json({Req}))
        .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
})
//Update The MonthReports StorageRequests 
router.route("/StorageRequests/:Date").post((req,res)=>{
    MonthDate.findOneAndUpdate({Month:req.params.Date},
        {$inc:{StorageRequests:1}},{new:true})
        .then((Req)=>res.json({Req}))
        .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
})
//Update The MonthReports bugReports 
router.route("/bugReports/:Date").post((req,res)=>{
    MonthDate.findOneAndUpdate({Month:req.params.Date},
        {$inc:{bugReports:1}},{new:true})
        .then((Req)=>res.json({Req}))
        .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
})
//Update The MonthReports AggreStorageTotal 
router.route("/AggreStorageTotal/:Date").post((req,res)=>{
    MonthDate.findOneAndUpdate({Month:req.params.Date},
        {$inc:{AggreStorageTotal:req.body.AggreStorageTotal}},{new:true})
        .then((Req)=>res.json({Req}))
        .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
})
//Update The MonthReports AggreStorageUsegeAmmount 
router.route("/AggreStorageUsegeAmmount/:Date").post((req,res)=>{

    MonthDate.findOneAndUpdate({Month:req.params.Date},
        {$inc:{AggreStorageUsegeAmmount:req.body.AggreStorageUsegeAmmount}},{new:true})
        .then((Req)=>res.json({Req}))
        .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
})
    //create new Bug Report
    router.route('/add').post(async (req,res) => {
        let ts=Date.now()
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        try{  
            const Date=date+"."+month+"."+year;
            const NewMonthDate=new MonthDate({
                Date:Date,
                Month:month+'.'+year,
                users:0,
                StorageRequests:0,
                bugReports:0,
                AggreStorageTotal:0,
                AggreStorageUsegeAmmount:0,
            });
            NewMonthDate.save()
                .then(Req=>res.status(201).json(Req))
                .catch(err=>res.status(400).json('Error:'+err));
        }
        catch{
            err=>res.status(500).json('Error'+err);
        }
    
    });
module.exports=router;