const router = require('express').Router();
const { response } = require('express');
const Bug = require('../models/Bug.model');
const Helperfunctions =require('./HelperFunctions');

//Get All Bug Reports
router.route('/').get((req,res)=>{
    Helperfunctions.find(Bug,function(result){
        console.log(result)
        res.json(result)})
    // Bug.find()
    //     .then(Request=>res.json(Request))
    //     .catch(err=>res.status(400).json('Error:'+err));
    });
//Delete a Bug Report
    router.route("/:id").delete((req,res)=>{
        console.log(req.params.id)
        Helperfunctions.findByIdAndDelete(Bug,req.params.id,function(result){
            res.json(result);
        })
        // Bug.findByIdAndDelete(req.params.id)
        //     .then(()=>res.json('req deleted.'))
        //     .catch(err=>res.status(400).json('Error'+err));
    });
//get a Bug Report by id
    router.route("/:id").get((req,res)=>{
        Helperfunctions.findbyField(Bug,{_id:req.params.id},function(result){
            res.json(result);
        })
        // Bug.findById(req.params.id)
        //     .then((Req)=>res.json({Req}))
        //     .catch(err=>res.status(400).json('Error'+err));
    })
//get all the Bug reports by UserID
    router.route("/Userid/:id").get((req,res)=>{
        console.log(req.params)
        Helperfunctions.findbyField(Bug,{userID:req.params.id},function(result){
            res.json(result);
        })
        // Bug.find({userID:req.params.id})
        //     .then((Req)=>res.json({Req}))
        //     .catch(err=>res.status(400).json('Error'+err));
    })
//Update The Bug Report Status 
    router.route("/status/:id").post((req,res)=>{
        Helperfunctions.findOneAndUpdateByFieldString(Bug,{_id:req.params.id},{status:req.body.status},function(result){
            console.log(result)
            res.json(result)
        })
        // Bug.findOneAndUpdate({_id:req.params.id},
        //     {status:req.body.status},{new:true})
        //     .then((Req)=>res.json({Req}))
        //     .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
    })
    //create new Bug Report
    router.route('/add').post(async (req,res) => {
        
        try{  
            const NewBug=new Bug({
                username:req.body.username,
                email:req.body.email,
                Description:req.body.Description,
                File:req.body.File,
                status:req.body.status,
                userID:req.body.userID,
            });
            console.log(req.body.userID)
            Helperfunctions.CreateNew(NewBug,function(result){
                res.json(result)
            })
            // NewReq.save()
            //     .then(Req=>res.status(201).json(Req._id))
            //     .catch(err=>res.status(400).json('Error:'+err));
        }
        catch{
            err=>res.status(500).json('Error'+err);
        }
    
    });
module.exports=router;