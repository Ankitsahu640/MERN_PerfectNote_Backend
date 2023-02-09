const mongoose =require("mongoose");
const { Schema } = mongoose;

const ShareNotesSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    title:{
        type:String,
        required:true
    },
    discription:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: Date.now,
        required:true
    },
    friendEmail:{
        type: String,
        required:true
    }   
})
module.exports = mongoose.model("shareNotes",ShareNotesSchema);