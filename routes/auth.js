const express = require("express");
const user = require("../models/user");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require("../middleware/fetchUser");

const jwt_secret = "toextendwarentycall18004254999";

router.use(express.json());


//ROUTE 1 : user creation
router.post("/createUser",[
    body('email','Enter a valid email').isEmail(),
    body('password','password must be atleast 3 character').isLength({ min: 3 }),
    body('name','name must be atleast 3 character').isLength({ min: 3 })
  ],async (req,res)=>{
    try{
      let success = false;
        // if there are errors, return bad request and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).send({success:false, errors: errors.array() });
        }
        // check wether the user with the email exists already
        let User = await user.findOne({email:req.body.email});
        if(User){
          return res.status(400).send({success:false, error:"Sorry a user with this email is already exists"})
        }

        //hashing the password
        const salt = await bcrypt.genSaltSync(10);
        const hashPass = await bcrypt.hashSync(req.body.password, salt);

        // creating a new user
        User = await user.create({
            name: req.body.name,
            password: hashPass,
            email: req.body.email
          })
        
        // data={
        //   id:User.id
        // }
        const token = jwt.sign({id:User.id}, jwt_secret);

        // res.send(User);
        success=true;
        res.send({success,token});
    }
    catch(err){
          console.log(err);
          res.status(500).send({error:"some error occured",message:err.message})
        }
  }
)


//ROUTE 2 : user login
router.post("/login",[
  body('email','Enter a valid email').isEmail(),
  body('password','password can not be empty').isLength({ min: 1 })
],async (req,res)=>{

  try{
    let success = false;
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).send({success:false, errors: errors.array() });
        }
        // check wether the user with the email exists already
        let User = await user.findOne({email:req.body.email});
        if(!User){
          return res.status(400).send({success:false,error:"Invalid email or password"})
        }
        const match = await bcrypt.compare(req.body.password, User.password);
        if(!match){
          return res.status(400).send({success:false,error:"Invalid email or password"})
        }
        console.log({id:User.id})
        const token = jwt.sign({id:User.id}, jwt_secret);

        success=true;
        res.send({success,token});
  }
  catch(err){
    console.log(err);
    res.status(500).send({success:false,error:"some error occured",message:err.message})
  }

})


//ROUTE 3 : get user from token using middleware fetchUser 
router.get("/getUser",fetchUser,async(req,res)=>{
    try{
        const userId = req.id;
        const User = await user.findById(userId).select("-password"); 
        res.send(User);
    }
    catch(err){
      console.log(err);
      res.status(500).send({error:"some error occured",message:err.message})
    }
}) 

//ROUTER:4 find user via email
router.post("/findUser",async(req,res)=>{
  try{
     let User = await user.findOne({email:req.body.email});
      if(User){
        res.send(true);
      }
      else{
        res.send(false);
      }
  }
  catch(err){
    console.log(err);
    res.status(500).send({error:"some error occured",message:err.message})
  }
}) 
 module.exports = router