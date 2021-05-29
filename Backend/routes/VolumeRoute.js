const router = require('express').Router();
const { ObjectId } = require('mongodb');
const SSH=require('../Shell.config')
const Helperfunctions =require('./HelperFunctions');
const collection=process.env.VolumeCollection
//Get all The Storage Volume
router.route('/').get(async(req,res)=>{
    await Helperfunctions.find(collection).then((result)=>{
        res.json(result)
    })
    });
//Delete Storage Volume by id
    router.route("/:id").delete(async(req,res)=>{
        await Helperfunctions.findAndDelete(collection,{_id:ObjectId(req.params.id)}).then((result)=>{
            res.json(result)
        })
    });
//Get Storage Volume by id
    router.route("/:id").get(async(req,res)=>{
        await Helperfunctions.findbyField(Volume,{_id:ObjectId(req.params.id)}).then((result)=>{
            res.json(result);
        })
    })
//get all the Storage Volumes for the Svm
    router.route('/Svm/:svm').get(async(req,res)=>{
        await Helperfunctions.findbyField(Volume,{svm:req.params.svm}).then((result)=>{
            res.json(result);
        })
    })
//create new Volume
    router.route('/add').post(async (req,res) => {  
        console.log(req.body)
        await SSH.createVolume(req.body.svm,req.body.Name,req.body.aggregate,req.body.total,async(result)=>{
            console.log(result)
            if(result.flag===true){
                try{  
                    const VolumeRequest=({
                        locationstring:`${req.body.Cluster}/${req.body.aggregate}/${req.body.svm}/${req.body.Name}`,
                        Cluster:req.body.Cluster,
                        env:req.body.env,
                        aggregate:req.body.aggregate,
                        svm:req.body.svm,
                        Name:req.body.Name,
                        total:req.body.total,
                        used:req.body.used,
                        available:req.body.available,
                        dedupeCapSaved:req.body.dedupeCapSaved,   
                    });
                    console.log(VolumeRequest)
                    
                    await Helperfunctions.CreateNew(collection,VolumeRequest).then(async (result)=>{
                        await SSH.GetShellData((result)=>{console.log(result)}).then((data)=>{
                            res.json(result)
                        })  
                    })
                }
                catch{
                    err=>res.status(500).json('Error'+err);
                }
            }
        })
    })

module.exports=router;