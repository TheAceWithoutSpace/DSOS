const router = require('express').Router();
const Bug = require('../models/Bug.model');

//Get All Bug Reports
router.route('/').get((req,res)=>{
    Bug.find()
        .then(Request=>res.json(Request))
        .catch(err=>res.status(400).json('Error:'+err));
    });
//Delete a Bug Report
    router.route("/:id").delete((req,res)=>{
        Bug.findByIdAndDelete(req.params.id)
            .then(()=>res.json('req deleted.'))
            .catch(err=>res.status(400).json('Error'+err));
    });
//get a Bug Report by id
    router.route("/:id").get((req,res)=>{
        Bug.findById(req.params.id)
            .then((Req)=>res.json({Req}))
            .catch(err=>res.status(400).json('Error'+err));
    })
//get all the Bug reports by UserID
    router.route("/Userid/:id").get((req,res)=>{
        Bug.find({userID:req.params.id})
            .then((Req)=>res.json({Req}))
            .catch(err=>res.status(400).json('Error'+err));
    })
//Update The Bug Report Status 
    router.route("/status/:id").post((req,res)=>{
        Bug.findOneAndUpdate({_id:req.params.id},
            {status:req.body.status},{new:true})
            .then((Req)=>res.json({Req}))
            .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
    })
    //create new Bug Report
    router.route('/add').post(async (req,res) => {
        
        try{  
            const username=req.body.username;
            const email=req.body.email;
            const Description=req.body.Description;
            const File=req.body.File;
            const status=req.body.status;
            const userID=req.body.userID;

            const NewReq=new Bug({
                username:username,
                email:email,
                Description:Description,
                File:File,
                status:status,
                userID:userID,
            });
            NewReq.save()
                .then(Req=>res.status(201).json(Req._id))
                .catch(err=>res.status(400).json('Error:'+err));
        }
        catch{
            err=>res.status(500).json('Error'+err);
        }
    
    });
module.exports=router;