import mongoose,{ Schema } from "mongoose";

const bookschema = new mongoose.Schema({
    bookname:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },

    image:{
        type:String,
        required:true
    },
    public_id:{
        type:String,
        required:true
    }    
    ,
    ratting:{
        type:Number,
        max:5,
        required:true
    },
    byuser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const bookmodel = mongoose.model('book',bookschema);
export default bookmodel;