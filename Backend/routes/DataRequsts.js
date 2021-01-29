const router = require('express').Router();
const StorageRequest = require('../models/Requsts.model');
const Helperfunctions =require('./HelperFunctions');
//Get all The Storage Requests
router.route('/').get((req,res)=>{
    Helperfunctions.find(StorageRequest,function(result){
        res.json(result)
    })
    // StorageRequest.find()
    //     .then(Request=>res.json(Request))
    //     .catch(err=>res.status(400).json('Error:'+err));
    });
//Delete Storage Request by id
    router.route("/:id").delete((req,res)=>{
        Helperfunctions.findByIdAndDelete(StorageRequest,function(result){
            res.json(result);
        })
        // StorageRequest.findByIdAndDelete(req.params.id)
        //     .then(()=>res.json('req deleted.'))
        //     .catch(err=>res.status(400).json('Error'+err));
    });
//Get Storage Request by id
    router.route("/:id").get((req,res)=>{
        Helperfunctions.findbyField(StorageRequest,{_id:req.params.id},function(result){
            res.json(result);
        })
        // StorageRequest.findById(req.params.id)
        //     .then((Req)=>res.json({Req}))
        //     .catch(err=>res.status(400).json('Error'+err));
    })
//get all the Requests by UserID
    router.route("/Userid/:id").get((req,res)=>{
        Helperfunctions.findbyField(StorageRequest,{userID:req.params.id},function(result){
            res.json(result)
        })
        // StorageRequest.find({userID:req.params.id})
        //     .then((Req)=>res.json({Req}))
        // .catch(err=>res.status(400).json('Error'+err));
    })

//Update The Storage Request status 
    router.route("/status/:id").post((req,res)=>{
        Helperfunctions.findOneAndUpdateByFieldString(StorageRequest,{_id:req.params.id},{status:req.body.status},function(result){
            res.json(result);
        })
        // StorageRequest.findOneAndUpdate({_id:req.params.id},
        //     {status:req.body.status},{new:true})
        //     .then((Req)=>res.json({Req}))
        //     .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
    })
//create new Storage Request
    router.route('/add').post(async (req,res) => {  
        try{  
            const NewReq=new StorageRequest({
                username:req.body.username,
                email:req.body.email,
                Name:{C:req.body.Name.C,A:req.body.Name.A,S:req.body.Name.S,V:req.body.Name.V},
                Location:req.body.Location,
                Amount:req.body.Amount,
                File:req.body.File,
                status:req.body.status,
                type:req.body.type,
                userID:req.body.userID,
            });
            Helperfunctions.CreateNew(NewReq,function(result){
                res.json(result)
            })
            // NewReq.save()
            //     .then(Req=>res.status(201).json(Req._id))
            //     .catch(err=>res.status(400).json('Error:'+err));
        }
        catch{
            err=>res.status(500).json('Error'+err);
        }
    })
module.exports=router;