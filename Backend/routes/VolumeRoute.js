const router = require('express').Router();
const Volume = require('../models/Volume.model');
//Get all The Storage Volume
router.route('/').get((req,res)=>{
    Volume.find()
        .then(Volume=>res.json(Volume))
        .catch(err=>res.status(400).json('Error:'+err));
    });
//Delete Storage Volume by id
    router.route("/:id").delete((req,res)=>{
        Volume.findByIdAndDelete(req.params.id)
            .then(()=>res.json('req deleted.'))
            .catch(err=>res.status(400).json('Error'+err));
    });
//Get Storage Volume by id
    router.route("/:id").get((req,res)=>{
        Volume.findById(req.params.id)
            .then((Volume)=>res.json({Volume}))
            .catch(err=>res.status(400).json('Error'+err));
    })
//get all the Storage Volume for the Svm
    router.route('/Svm/:Svm').get((req,res)=>{
        Volume.find({Svm:req.params.Svm})
            .then((Req)=>res.json({Req}))
            .catch(err=>res.status(400).json('Error'+err));
    })
//create new Volume
    router.route('/add').post(async (req,res) => {  
        try{  
            console.log(req.body)
            const name=req.body.name;
            const Amount=req.body.Amount;
            const Svm=req.body.Svm;
            const Aggregate=req.body.Aggregate;

            const VolumeRequest=new Volume({
                name:name,
                Amount:Amount,
                Svm:Svm,
                Aggregate:Aggregate,
            });
            VolumeRequest.save()
                .then(Volume=>res.status(201).json(Volume._id))
                .catch(err=>res.status(400).json('Error:'+err));
        }
        catch{
            err=>res.status(500).json('Error'+err);
        }
    })

module.exports=router;