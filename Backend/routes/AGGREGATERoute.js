const router = require('express').Router();
const AGGREGATE = require('../models/AGGREGATE.model');
//Get all The AGGREGATE
router.route('/').get((req,res)=>{
    AGGREGATE.find()
        .then(AGGREGATE=>res.json(AGGREGATE))
        .catch(err=>res.status(400).json('Error:'+err));
    });
//Delete Storage AGGREGATE by id
    router.route("/:id").delete((req,res)=>{
        AGGREGATE.findByIdAndDelete(req.params.id)
            .then(()=>res.json('AGGREGATE deleted.'))
            .catch(err=>res.status(400).json('Error'+err));
    });
    //get all the Storage Request for the Svm
    router.route('/Aggre/:name').get((req,res)=>{
        AGGREGATE.find({name:req.params.name})
            .then((Req)=>res.json({Req}))
            .catch(err=>res.status(400).json('Error'+err));
    })
//Get Storage AGGREGATE by id
    router.route("/:id").get((req,res)=>{
        AGGREGATE.findById(req.params.id)
            .then((Req)=>res.json({Req}))
            .catch(err=>res.status(400).json('Error'+err));
    })
//Update Aggregatte Amount on new volume create 
    router.route("/Amount/:name").post((req,res)=>{
        AGGREGATE.findOneAndUpdate({name:req.params.name},
            {$inc:{Amount:req.body.Amount}},{new:true})
            .then((Req)=>res.json({Req}))
            .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
    })
//create new AGGREGATE
    router.route('/add').post(async (req,res) => {  
        console.log(req.body)
        try{  
            const name=req.body.Name;
            const Amount=0;
            const TotalAmount=req.body.Amount;
            const location=req.body.location;

            const NewAGGREGATE=new AGGREGATE({
                name:name,
                Amount:Amount,
                TotalAmount:TotalAmount,
                location:location,
            });
            NewAGGREGATE.save()
                .then(AGGREGATER=>res.status(201).json(AGGREGATER))
                .catch(err=>res.status(400).json('Error:'+err));
        }
        catch{
            err=>res.status(500).json('Error'+err);
        }
    })

    
module.exports=router;