const router = require('express').Router();
const Svm = require('../models/Svm.model');
const Helperfunctions =require('./HelperFunctions');
//Get all The Storage Svm
router.route('/').get((req,res)=>{
    Helperfunctions.find(Svm,function(result){
        res.json(result)
    })
    // Svm.find()
    //     .then(Svm=>res.json(Svm))
    //     .catch(err=>res.status(400).json('Error:'+err));
    });
//Delete Svm by id
    router.route("/:id").delete((req,res)=>{
        Helperfunctions.findByIdAndDelete(Svm,{_id:req.params.id},function(result){
            res.json(result)
        })
        // Svm.findByIdAndDelete(req.params.id)
        //     .then(()=>res.json('req deleted.'))
        //     .catch(err=>res.status(400).json('Error'+err));
    });
//Get Svm by id
    router.route("/:id").get((req,res)=>{
        Helperfunctions.findbyField(Svm,{_id:req.params.id},function(result){
            res.json(result)
        })
        // Svm.findById(req.params.id)
        //     .then((Svm)=>res.json({Svm}))
        //     .catch(err=>res.status(400).json('Error'+err));
    })
    //get all the Storage Request for the Svm
    router.route('/SvmByAggreName/:aggregate').get((req,res)=>{
        console.log(req.params)
        Helperfunctions.findbyField(Svm,{aggregate:req.params.aggregate},function(result){
            res.json(result)
        })
        // Svm.find({Aggregate:req.params.AgreName})
        //     .then((Req)=>res.json({Req}))
        //     .catch(err=>res.status(400).json('Error'+err));
    })
//Uptade Amount
    router.route("/Amount/:Name").post((req,res)=>{
        Helperfunctions.findOneAndUpdateByField(Svm,{Name:req.params.Name},{VolumeCount:1},function(result){
            console.log(result)
        })
        Helperfunctions.findOneAndUpdateByField(Svm,{Name:req.params.Name},{available:(req.body.Amount*-1)},function(result){
            console.log(result)
        })
        Helperfunctions.findOneAndUpdateByField(Svm,{Name:req.params.Name},{used:req.body.Amount},function(result){
            res.json(result)
        })
        // Svm.findOneAndUpdate({name:req.params.name},
        //     {$inc:{Amount:req.body.Amount}},{new:true})
        //     .then((Req)=>res.json({Req}))
        //     .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
    })
//create new Svm
    router.route('/add').post(async (req,res) => { 
        console.log(req.body) 
        try{  
            const SvmRequest=new Svm({
                Cluster:req.body.Cluster,
                env:req.body.env,
                aggregate:req.body.aggregate,
                Name:req.body.Name,
                total:req.body.total,
                used:0,
                available:req.body.available,
                full:req.body.full,
                dedupeCapSaved:req.body.dedupeCapSaved,
                VolumeCount:0,
            });
            Helperfunctions.CreateNew(SvmRequest,function(result){
                res.json(result)
            })
            // SvmRequest.save()
            //     .then(Svm=>res.status(201).json(Svm._id))
            //     .catch(err=>res.status(400).json('Error:'+err));
        }
        catch{
            err=>res.status(500).json('Error'+err);
        }
    })

module.exports=router;