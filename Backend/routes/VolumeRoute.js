const router = require('express').Router();
const Volume = require('../models/Volume.model');
const Helperfunctions =require('./HelperFunctions');
//Get all The Storage Volume
router.route('/').get((req,res)=>{
    Helperfunctions.find(Volume,function(result){
        res.json(result)
    })
    // Volume.find()
    //     .then(Volume=>res.json(Volume))
    //     .catch(err=>res.status(400).json('Error:'+err));
    });
//Delete Storage Volume by id
    router.route("/:id").delete((req,res)=>{
        Helperfunctions.findByIdAndDelete(Volume,{_id:req.params.id},function(result){
            res.json(result)
        })
        // Volume.findByIdAndDelete(req.params.id)
        //     .then(()=>res.json('req deleted.'))
        //     .catch(err=>res.status(400).json('Error'+err));
    });
//Get Storage Volume by id
    router.route("/:id").get((req,res)=>{
        Helperfunctions.findbyField(Volume,{_id:req.params.id},function(result){
            res.json(result);
        })
        // Volume.findById(req.params.id)
        //     .then((Volume)=>res.json({Volume}))
        //     .catch(err=>res.status(400).json('Error'+err));
    })
//get all the Storage Volumes for the Svm
    router.route('/Svm/:svm').get((req,res)=>{
        Helperfunctions.findbyField(Volume,{svm:req.params.svm},function(result){
            res.json(result);
        })
        // Volume.find({Svm:req.params.Svm})
        //     .then((Req)=>res.json({Req}))
        //     .catch(err=>res.status(400).json('Error'+err));
    })
//create new Volume
    router.route('/add').post(async (req,res) => {  
        try{  
            const VolumeRequest=new Volume({
                Cluster:req.body.Cluster,
                env:req.body.env,
                aggregate:req.body.aggregate,
                svm:req.body.svm,
                Name:req.body.Name,
                total:req.body.total,
                used:req.body.used,
                available:req.body.available,
                dedupeCapSaved:req.body.dedupeCapSaved,   
            });
            Helperfunctions.CreateNew(VolumeRequest,function(result){
                res.json(result)
            })
            // VolumeRequest.save()
            //     .then(Volume=>res.status(201).json(Volume._id))
            //     .catch(err=>res.status(400).json('Error:'+err));
        }
        catch{
            err=>res.status(500).json('Error'+err);
        }
    })

module.exports=router;