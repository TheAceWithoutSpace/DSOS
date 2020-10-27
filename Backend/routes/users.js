
const router = require('express').Router();
let User = require('../models/User.model');
const bcrypt = require('bcrypt');

//get all users
router.route('/').get((req,res)=>{
User.find()
    .then(users=>res.json(users))
    .catch(err=>res.status(400).json('Error:'+err));
});
//login
router.route('/login').post((req,res)=>{
    User.find({username:req.body.username})
        .then(async user=>{
            if (user==null){
                res.status(400).json('Cant find user');
            }
            try{
               const match=await checkUser(req.body.password,user[0].password)
               console.log(match)
                if(match)
                {
                    res.json(user)
                }else
                {
                    res.status(404).send('Not Allowed');
                }
            } catch{
                res.status(500).send()
            }
        })
});
//delete user
router.route("/:id").delete((req,res)=>{
    User.findByIdAndDelete(req.params.id)
        .then(()=>res.json('User deleted.'))
        .catch(err=>res.status(400).json('Error'+err));
});
//Promote to Architect
router.route("/Architect/:id").post((req,res)=>{
    User.findOneAndUpdate({_id:req.params.id},
        {Architect:req.body.Architect},{new:true})
        .then((Req)=>res.json({Req}))
        .catch((err)=>res.status(404).json({err:'Couldent Find The File '+err}))
})
//create new user
router.route('/add').post(async (req,res) => {
    try{  
        const username=req.body.username;
        const email=req.body.email;
        const Team=req.body.Team;
        const NickName=req.body.NickName;
        const password=await bcrypt.hash(req.body.password,10)

        const newUser=new User({
            username:username,
            Nickname:NickName,
            email:email,
            password:password,
            Team:Team,
            Admin:false,
            Architect:false,
        });
        newUser.save()
            .then(user=>res.status(201).json(user))
            .catch(err=>res.status(400).json('Error:'+err));
    }
    catch{
        err=>res.status(500).json('Error'+err);
    }

});
//encript password
async function checkUser(inputPassword,dbPassword){
    const match=await bcrypt.compare(inputPassword,dbPassword);
    return match;
}


module.exports=router;