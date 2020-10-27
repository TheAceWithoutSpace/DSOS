const router = require('express').Router();
const Svm = require('../models/Svm.model');
//Get all The Storage Svm
router.route('/').get((req,res)=>{
    Svm.find()
        .then(Svm=>res.json(Svm))
        .catch(err=>res.status(400).json('Error:'+err));
    });
//Delete Svm by id
    router.route("/:id").delete((req,res)=>{
        Svm.findByIdAndDelete(req.params.id)
            .then(()=>res.json('req deleted.'))
            .catch(err=>res.status(400).json('Error'+err));
    });
//Get Svm by id
    router.route("/:id").get((req,res)=>{
        Svm.findById(req.params.id)
            .then((Svm)=>res.json({Svm}))
            .catch(err=>res.status(400).json('Error'+err));
    })
    //get all the Storage Request for the Svm
    router.route('/SvmByAggreName/:AgreName').get((req,res)=>{
        Svm.find({AGGREGATE:req.params.AgreName})
            .then((Req)=>res.json({Req}))
            .catch(err=>res.status(400).json('Error'+err));
    })
//Uptade Amount
    router.route("/Amount/:name").post((req,res)=>{
        Svm.findOneAndUpdate({name:req.params.name},
            {$inc:{Amount:req.body.Amount}},{new:true})
            .then((Req)=>res.json({Req}))
            .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
    })
//create new Svm
    router.route('/add').post(async (req,res) => {  
        try{  
            const name=req.body.Name;
            const AGGREGATE=req.body.AGGREGATE;
            const File=req.body.File;

            const SvmRequest=new Svm({
                name:name,
                Amount:0,
                AGGREGATE:AGGREGATE,
                File:File,
            });
            SvmRequest.save()
                .then(Svm=>res.status(201).json(Svm._id))
                .catch(err=>res.status(400).json('Error:'+err));
        }
        catch{
            err=>res.status(500).json('Error'+err);
        }
    })

module.exports=router;