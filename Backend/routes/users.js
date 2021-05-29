const router = require('express').Router();
let User = require('../models/User.model');
const bcrypt = require('bcrypt');
const Helperfunctions =require('./HelperFunctions');
const { ObjectId } = require('mongodb');
const collection=process.env.UserCollection;
//get all users
router.route('/').get(async(req,res)=>{
    await Helperfunctions.find(collection).then((result)=>{
        res.json(result)
    })
 });
//login
router.route('/login').post(async(req,res)=>{
    await Helperfunctions.findbyField(collection,{username:req.body.username}).then(async(UserLLoginData)=>{
        console.log(UserLLoginData);
        const result=UserLLoginData.res;
        let msg=''
        if(UserLLoginData.err===null&&UserLLoginData.res.length!==0)
        {
            try{
                if(await bcrypt.compare(req.body.password,result[0].password))
                    { 
                        console.log(result)
                        res.json({_id:result[0]._id,U:result[0].username,E:result[0].email,A:result[0].Admin,Ar:result[0].Architect,N:result[0].Nickname,Hail:result[0].Hail})
                    }else{
                        console.log("Password")
                        res.status("401").json("Password")
                    }
                }catch{
                    res.status(500).json("server Error")
                }
        }else{
            res.status(404).json('User Name');
        }
    }).catch(err=>{res.status(500).json("Server Error")})
    
})

//delete user
router.route("/:id").delete(async(req,res)=>{
    await Helperfunctions.findAndDelete(collection,{_id:ObjectId(req.params.id)}).then((result)=>{
        res.json(result)
    })
});
//Promote to Architect
router.route("/Architect/:id").post(async(req,res)=>{
    await Helperfunctions.findOneAndUpdate(collection,{_id:ObjectId(req.params.id)},{Architect:req.body.Architect}).then((result)=>{
        res.json(result);
    })
})
//create new user
router.route('/add').post(async (req,res) => {
    try{  
        const newUser=({
            username:req.body.username,
            Nickname:req.body.NickName,
            email:req.body.email,
            password:await bcrypt.hash(req.body.password,10),
            Hail:req.body.Team,
            Admin:false,
            Architect:false,
        });
        let msg='';
        console.log(newUser)
        await Helperfunctions.findbyField(collection,{email:newUser.email}).then(async(result)=>{
            console.log(result.res.length)
            if(result.res.length===0){
                await Helperfunctions.findbyField(collection,{username:newUser.username}).then(async(result)=>{
                    console.log(result.res.length)
                    if(result.res.length===0){
                        await Helperfunctions.CreateNew(collection,newUser).then((result)=>{
                            if(result.err===null){ 
                                res.json(result.res)
                            }else{
                                res.status(500).json("server connection err");
                            }
                        })
                    }else{
                        msg="User Name";
                        console.log(msg)
                    }
                })
            }else{
                msg="Email";
                console.log(msg)
            }
        })
        res.status("401").json(msg)
    }
    catch{
        err=>res.status(500).json('Error'+err);
    }

});

module.exports=router;