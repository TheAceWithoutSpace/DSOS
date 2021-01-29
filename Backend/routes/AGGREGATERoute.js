const router = require('express').Router();
const Aggregate = require('../models/Aggregate.model');
const Helperfunctions =require('./HelperFunctions');
//Get all The Aggregate
router.route('/').get((req,res)=>{
    Helperfunctions.find(Aggregate,function(result){
    res.json(result)})
    // Aggregate.find()
    //     .then(Aggregate=>res.json(Aggregate))
    //     .catch(err=>res.status(400).json('Error:'+err));
    });
//Delete Storage Aggregate by id
    router.route("/:id").delete((req,res)=>{
        Helperfunctions.findByIdAndDelete(Aggregate,req.params.id,function(result){
            res.json(result)})
        // Aggregate.findByIdAndDelete(req.params.id)
        //     .then(()=>res.json('Aggregate deleted.'))
        //     .catch(err=>res.status(400).json('Error'+err));
    });
    //get all the Storage Request for the Svm
    router.route('/Aggre/:Cluster').get((req,res)=>{
        Helperfunctions.findbyField(Aggregate,{Cluster:req.params.Cluster},function(result,status){
           console.log(status) 
            res.json(result)
        })
        // Aggregate.find({name:req.params.name})
        //     .then((Req)=>res.json({Req}))
        //     .catch(err=>res.status(400).json('Error'+err));
    })
//Get Storage Aggregate by id
    router.route("/:id").get((req,res)=>{
        Helperfunctions.findbyField(Aggregate,{_id:req.params.id},function(result){
        res.json(result)})
        // Aggregate.findById(req.params.id)
        //     .then((Req)=>res.json({Req}))
        //     .catch(err=>res.status(400).json('Error'+err));
    })
//Update Aggregatte Amount on new volume create 
    router.route("/Amount/:Name").post((req,res)=>{
        Helperfunctions.findOneAndUpdateByField(Aggregate,{Name:req.params.Name},{allocated:req.body.Amount},function(result){
            res.json(result)})
        // Aggregate.findOneAndUpdate({name:req.params.name},
        //     {$inc:{Amount:req.body.Amount}},{new:true})
        //     .then((Req)=>res.json({Req}))
        //     .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
    })
//create new Aggregate ***Delete this***
    // router.route('/add').post(async (req,res) => {  
    //     try{  
    //         const NewAggregate=new Aggregate({
    //             Cluster:req.body.Cluster,
    //             Name:req.body.Name
    //             env:req.body.env,
    //             total:req.body.total,
    //             used:req.body.used,
    //             allocated:req.body.allocated,
    //             leftToAllocate:req.body.leftToAllocate,
    //             full:req.body.full,
    //             overSubsPrecent:req.body.overSubsPrecent,
    //         });
    //         Helperfunctions.CreateNew(NewAggregate,function(result){
    //             res.json(result)
    //         })
    //     }
    //     catch{
    //         err=>res.status(500).json('Error'+err);
    //     }
    // })

    
module.exports=router;