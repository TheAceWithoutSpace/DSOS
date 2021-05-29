const router = require('express').Router();
// const Aggregate = require('../models/Aggregate.model');
const Helperfunctions =require('./HelperFunctions');
const collection=process.env.AggreCollection
//Get all The Aggregate
router.route('/').get(async(req,res)=>{
    await Helperfunctions.find(collection).then(result=>{
        console.log(result)
        res.json(result)
        })
    });
//Delete Storage Aggregate by id
    router.route("/:id").delete(async(req,res)=>{
        await Helperfunctions.findAndDelete(collection,{_id:req.params.id}).then((result)=>{
            res.json(result);
        })
    });
    //get all the Storage Request for the Svm
    router.route('/Aggre/:AggreName').get(async(req,res)=>{
        await Helperfunctions.findbyField(collection,{Name:req.params.AggreName}).then((result)=>{
            res.json(result)
        })
    })
//Get Storage Aggregate by id
    router.route("/:id").get(async(req,res)=>{
        await Helperfunctions.findbyField(collection,{_id:req.params.id}).then((result)=>{
        res.json(result)})
    })
//Update Aggregatte Amount on new volume create 
    router.route("/Amount/:Name").post(async(req,res)=>{
        await Helperfunctions.findOneAndUpdate(collection,{Name:req.params.Name},{$inc:{Amount:req.body.Amount}}).then((result)=>{
            res.json(result)})
    })
    //**---anable aggregate creation  in the admin deshbord---**
    // router.route('/add').post(async (req,res) => {  
    //     try{  
    //         const NewAggregate=new Aggregate({
    //             Cluster:req.body.Cluster,
    //             Name:req.body.Name
    //             env:req.body.env,
    //             total:req.body.total,
    //             used:req.body.used,
    //             allocated:req.body.allocated,
    //             leftToAllocate:req.body.leftToAllocate,
    //             full:req.body.full,
    //             overSubsPrecent:req.body.overSubsPrecent,
    //         });
    //         Helperfunctions.CreateNew(NewAggregate,function(result){
    //             res.json(result)
    //         })
    //     }
    //     catch{
    //         err=>res.status(500).json('Error'+err);
    //     }
    // })

    
module.exports=router;