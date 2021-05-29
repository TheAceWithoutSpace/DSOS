const router = require('express').Router();
const { ObjectId } = require('mongodb');
const SSH = require('../Shell.config');
const Helperfunctions =require('./HelperFunctions');
//Get all The Storage Svm
const collection=process.env.SvmCollection
router.route('/').get(async(req,res)=>{
    await Helperfunctions.find(collection).then((result)=>{
        res.json(result)
    })
});
//Delete Svm by id
    router.route("/:id").delete(async(req,res)=>{
        await Helperfunctions.findAndDelete(collection,{_id:ObjectId(req.params.id)}).then((result)=>{
            res.json(result)
        })
    });
//Get Svm by id
    router.route("/:id").get(async(req,res)=>{
        await Helperfunctions.findbyField(collection,{_id:ObjectId(req.params.id)}).then((result)=>{
            res.json(result)
        })
    })
    //get all the Storage Request for the Svm
    router.route('/SvmByAggreName/:Aggre').get(async(req,res)=>{
        await Helperfunctions.findbyField(collection,{aggregate:req.params.Aggre}).then((result)=>{
            console.log(result)
            res.json(result)
        })
    })
//Uptade Amount
    router.route("/Amount/:Name").post(async(req,res)=>{
        await Helperfunctions.findOneAndUpdate(collection,{Name:req.params.Name},{$inc:{VolumeCount:1}}).then((result)=>{
            console.log(result)
        })
        await Helperfunctions.findOneAndUpdate(collection,{Name:req.params.Name},{$inc:{available:(req.body.Amount*-1)}}).then((result)=>{
            console.log(result)
        })
        await Helperfunctions.findOneAndUpdate(collection,{Name:req.params.Name},{$inc:{used:req.body.Amount}}).then((result)=>{
            res.json(result)
        })
    })
//create new Svm
    router.route('/add').post(async (req,res) => { 
        console.log(req.body) 
        await SSH.createSvm(req.body.Name,req.body.aggregate,async(result)=>{
            console.log(result)  
            if(result.flag===true){ 
                try{  
                    const SvmRequest=({
                        locationstring:`${req.body.Cluster}/${req.body.aggregate}/${req.body.Name}`,
                        Cluster:req.body.Cluster,
                        env:req.body.env,
                        aggregate:req.body.aggregate,
                        Name:req.body.Name,
                        total:req.body.total,
                        used:0,
                        available:req.body.available,
                        full:req.body.full,
                        dedupeCapSaved:req.body.dedupeCapSaved,
                        VolumeCount:0,
                    });
                    await Helperfunctions.CreateNew(collection,SvmRequest).then((result)=>{
                        res.json(result)
                    })
                }
            catch{
                err=>res.status(500).json('Error'+err);
            }
        }else{
            res.status(500).json(result.msg);
        }
        })
    })

module.exports=router;