const router = require('express').Router();
const { ObjectId } = require('mongodb');
// const Bug = require('../models/Bug.model');

const Helperfunctions =require('./HelperFunctions');
const Bug=({
    username:"",
    email:"",
    Description:"",
    File:"",
    status:"",
    userID:"",
    date: { type: Date, default: Date.now },
});
const collection=process.env.BugCollection;
//Get All Bug Reports
router.route('/').get(async(req,res)=>{
    await Helperfunctions.find(collection).then((result)=>{
        console.log(result)
        res.json(result)})
    });
//Delete a Bug Report
    router.route("/:id").delete(async(req,res)=>{
        await Helperfunctions.findAndDelete(collection,{_id:ObjectId(req.params.id)}).then((result)=>{
            res.json(result);
        })
    });
//get a Bug Report by id
    router.route("/:id").get(async(req,res)=>{
        await Helperfunctions.findbyField(collection,{_id:ObjectId(req.params.id)}).then((result)=>{
            res.json(result);
        })
    })
//get all the Bug reports by UserID
    router.route("/Userid/:id").get(async(req,res)=>{
        await Helperfunctions.findbyField(collection,{userID:req.params.id}).then((result)=>{
            res.json(result);
        })
    })
//Update The Bug Report Status 

    router.route("/status/:id").post(async(req,res)=>{
        console.log(req.body.status)
        console.log(req.params.id)
        await Helperfunctions.findOneAndUpdate(collection,{_id:ObjectId(req.params.id)},{status:req.body.status}).then((result)=>{
            console.log(result)
            res.json(result)
        })
    })
    //create new Bug Report
    router.route('/add').post(async (req,res) => {
        
        try{  
            const NewBug=({
                username:req.body.username,
                email:req.body.email,
                Description:req.body.Description,
                File:req.body.File,
                status:req.body.status,
                userID:req.body.userID,
            });
            console.log(req.body.userID)
            await Helperfunctions.CreateNew(collection,NewBug).then((result)=>{
                res.json(result)
            })
        }
        catch{
            err=>res.status(500).json('Error'+err);
        }
    
    });
module.exports=router;