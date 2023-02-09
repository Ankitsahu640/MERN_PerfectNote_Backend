const express = require("express");
const Notes = require("../models/notes");
const ShareNotes = require("../models/shareNotes");
const user = require("../models/user");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchUser = require("../middleware/fetchUser");

router.use(express.json());


//ROUTE 1 : add notes
router.post("/addNotes",fetchUser,[
    body("title","Title is too short").isLength({min:3}),
    body("discription","Discription is too short").isLength({min:5})
],async(req,res)=>{
    try{
        const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() });
            }
            const notes = await Notes.create({
                user: req.id,
                title: req.body.title,
                discription: req.body.discription,
                tag: req.body.tag
              })
            res.send(notes);
            // const {title,discription,tag} = req.body;
            // const notes = new Notes({title,discription,tag,user:req.id});
            // const saveNotes = await notes.save();
            // res.send(SaveNotes);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error:"some error occured",message:err.message})
      }
})


// ROUTE 2 : Get all the notes
router.get("/fetchNotes",fetchUser,async(req,res)=>{
    try{
        const notes = await Notes.find({user:req.id}).sort({ 'createdAt': -1 });
    res.send(notes);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error:"some error occured",message:err.message})
      }
})


//ROUTE 3 : Update Notes
router.put("/updateNotes/:id",fetchUser,async(req,res)=>{
    try{
            const {title,discription,tag} = req.body;
        const newNotes = {};
        if(title) {newNotes.title=title};
        if(discription) {newNotes.discription=discription};
        if(tag) {newNotes.tag=tag};
        // if(newNotes.title||newNotes.discription||newNotes.tag){newNotes.date = Date.now()};

        let note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not Found");
        }
        if(note.user.toString() !== req.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNotes},{new:true});
        res.send(note);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error:"some error occured",message:err.message})
      }
})


//ROUTE 4 : delete note
router.delete("/deleteNotes/:id",fetchUser,async(req,res)=>{
    try{
        let note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not Found");
        }
        if(note.user.toString() !== req.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.send(note);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error:"some error occured",message:err.message});
      }
})



//ROUTE 5 : Shared notes adding
router.post("/sharingNote/:id",fetchUser,async(req,res)=>{
    try{
        let User = await user.findOne({email:req.body.email});
        if(!User){
            return res.status(400).send({error:"Sorry no user with this email is exist"});
        }
        let note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not Found");
        }
        if(note.user.toString() !== req.id){
            return res.status(401).send("Not Allowed");
        }
        let sendingUser = await user.findById(req.id);
        const notes = await ShareNotes.create({
            user: User.id,
            title: note.title,
            discription: note.discription,
            tag: note.tag,
            friendEmail: sendingUser.email
          })
        res.send(notes);
        // const {title,discription,tag} = req.body;
        // const notes = new Notes({title,discription,tag,user:req.id});
        // const saveNotes = await notes.save();
        // res.send(SaveNotes);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error:"some error occured",message:err.message})
      }
})


// ROUTE 6 : Get all the SharedNotes
router.get("/fetchSharedNotes",fetchUser,async(req,res)=>{
    try{
        let note = await ShareNotes.find({user:req.id}).sort({ 'createdAt': -1 });
        res.send(note);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error:"some error occured",message:err.message});
      }
})


//ROUTE 7 : delete shared note
router.delete("/delShareNotes/:id",fetchUser,async(req,res)=>{
    try{
        let notee = await ShareNotes.findById(req.params.id);
        if(!notee){
            return res.status(404).send("Not Found");
        }
        if(notee.user.toString() !== req.id){
            return res.status(401).send("Not Allowed");
        }

        notee = await ShareNotes.findByIdAndDelete(req.params.id);
        res.send(notee);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error:"some error occured",message:err.message});
      }
})



module.exports = router;