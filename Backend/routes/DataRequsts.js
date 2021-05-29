const router = require('express').Router();
const { ObjectId } = require('mongodb');
const StorageRequest = require('../models/Requsts.model');
const Helperfunctions =require('./HelperFunctions');
//Get all The Storage Requests
const collection=process.env.StorageRequestCollection;
router.route('/').get(async(req,res)=>{
    await Helperfunctions.find(collection).then((result)=>{
        res.json(result)
    })
});
//Delete Storage Request by id
    router.route("/:id").delete(async(req,res)=>{
        await Helperfunctions.findAndDelete(collection,{_id:ObjectId(req.params.id)}).then((result)=>{
            res.json(result);
        })
    });
//Get Storage Request by id
    router.route("/:id").get(async(req,res)=>{
        console.log(req.params.id)
        await Helperfunctions.findbyField(collection,{_id:ObjectId(req.params.id)}).then((result)=>{
            console.log(result)
            res.json(result);
        })
    })
//get all the Requests by UserID
    router.route("/Userid/:id").get(async(req,res)=>{
        await Helperfunctions.findbyField(collection,{userID:req.params.id}).then((result)=>{
            res.json(result)
        })
    })

//Update The Storage Request status 
    router.route("/status/:id").post(async(req,res)=>{
        await Helperfunctions.findOneAndUpdate(collection,{_id:ObjectId(req.params.id)},{status:req.body.status}).then((result)=>{
            res.json(result);
        })
    })
//create new Storage Request
    router.route('/add').post(async (req,res) => {  
        try{  
            const NewReq=({
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
            await Helperfunctions.CreateNew(collection,NewReq).then((result)=>{
                console.log(result)
                res.json(result)
            })
        }
        catch{
            err=>res.status(500).json('Error'+err);
        }
    })
module.exports=router;