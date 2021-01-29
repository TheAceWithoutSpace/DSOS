const router = require('express').Router();
let User = require('../models/User.model');
const bcrypt = require('bcrypt');
const Helperfunctions =require('./HelperFunctions');

//get all users
router.route('/').get((req,res)=>{
    Helperfunctions.find(User,function(result){
        res.json(result)
    })
// User.find()
//     .then(users=>res.json(users))
//     .catch(err=>res.status(400).json('Error:'+err));
 });
//login
router.route('/login').post((req,res)=>{
    Helperfunctions.findbyField(User,{username:req.body.username}
        ,async function(result){
        if(result==null)
        {
            res.status(400).json('Cant find user');
        }
        try{
           if(await bcrypt.compare(req.body.password,result[0].password))
            {
                
                console.log(result[0])
                res.json({_id:result[0]._id,U:result[0].username,E:result[0].email,A:result[0].Admin,Ar:result[0].Architect,N:result[0].Nickname})
            }else{
                res.status(404).send('Not Allowed');
            }
        }catch{
            res.status(500).send()
        }
        
    })
})

//delete user
router.route("/:id").delete((req,res)=>{
    Helperfunctions.findByIdAndDelete(User,{_id:req.params.id},function(result){
        res.json(result)
    })
    // User.findByIdAndDelete(req.params.id)
    //     .then(()=>res.json('User deleted.'))
    //     .catch(err=>res.status(400).json('Error'+err));
});
//Promote to Architect
router.route("/Architect/:id").post((req,res)=>{
    Helperfunctions.findOneAndUpdateByFieldString(User,{_id:req.params.id},{Architect:req.body.Architect},function(result){
        res.json(result);
    })
    // User.findOneAndUpdate({_id:req.params.id},
    //     {Architect:req.body.Architect},{new:true})
    //     .then((Req)=>res.json({Req}))
    //     .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
})
//create new user
router.route('/add').post(async (req,res) => {
    try{  
        const newUser=new User({
            username:req.body.username,
            Nickname:req.body.NickName,
            email:req.body.email,
            password:await bcrypt.hash(req.body.password,10),
            Team:req.body.Team,
            Admin:true,
            Architect:false,
        });
        console.log(newUser)
        Helperfunctions.CreateNew(newUser,function(result){
            res.json(result)
        })
        // newUser.save()
        //     .then(user=>res.status(201).json(user))
        //     .catch(err=>res.status(400).json('Error:'+err));
    }
    catch{
        err=>res.status(500).json('Error'+err);
    }

});

module.exports=router;