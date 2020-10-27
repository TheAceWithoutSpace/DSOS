const router = require('express').Router();
const StorageRequest = require('../models/Requsts.model');
//Get all The Storage Requests
router.route('/').get((req,res)=>{
    StorageRequest.find()
        .then(Request=>res.json(Request))
        .catch(err=>res.status(400).json('Error:'+err));
    });
//Delete Storage Request by id
    router.route("/:id").delete((req,res)=>{
        StorageRequest.findByIdAndDelete(req.params.id)
            .then(()=>res.json('req deleted.'))
            .catch(err=>res.status(400).json('Error'+err));
    });
//Get Storage Request by id
    router.route("/:id").get((req,res)=>{
        StorageRequest.findById(req.params.id)
            .then((Req)=>res.json({Req}))
            .catch(err=>res.status(400).json('Error'+err));
    })
//get all the Requests by UserID
    router.route("/Userid/:id").get((req,res)=>{
        StorageRequest.find({userID:req.params.id})
            .then((Req)=>res.json({Req}))
        .catch(err=>res.status(400).json('Error'+err));
    })

//Update The Storage Request status 
    router.route("/status/:id").post((req,res)=>{
        StorageRequest.findOneAndUpdate({_id:req.params.id},
            {status:req.body.status},{new:true})
            .then((Req)=>res.json({Req}))
            .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
    })
//create new Storage Request
    router.route('/add').post(async (req,res) => {  
        try{  
            console.log(req.body)
            const username=req.body.username;
            const email=req.body.email;
            const Name={A:req.body.Name.A,S:req.body.Name.S,V:req.body.Name.V};
            const Amount=req.body.Amount;
            const File=req.body.File;
            const status=req.body.status;
            const type=req.body.type;
            const userID=req.body.userID;

            const NewReq=new StorageRequest({
                username:username,
                email:email,
                Name:Name,
                Amount:Amount,
                File:File,
                status:status,
                type:type,
                userID:userID,
            });
            NewReq.save()
                .then(Req=>res.status(201).json(Req._id))
                .catch(err=>res.status(400).json('Error:'+err));
        }
        catch{
            err=>res.status(500).json('Error'+err);
        }
    })
module.exports=router;