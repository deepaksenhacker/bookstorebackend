import express from "express";
import userModel from "../db/models/user.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import 'dotenv/config'
import ProtectedRoute from "../jwt/jwtProtect.js";
const router  = express.Router();

let salt =12;

router.post('/sign-up',async(req,res)=>{
   const {username ,email ,password} = req.body;
try {
    if(!username || !email || !password){
        return res.status(400).json({error:"Please Fill All"});
    }
    const existingUser = await userModel.findOne({email:email});
    if(existingUser){
            return res.status(404).json({error:'Please Login User is already exists'});
        }
        const securePass = await bcrypt.hash(password,salt);


    const user = new userModel({
            username:username,
            email:email,
            password:securePass
    });

    await user.save();

    res.status(200).json({success:"Successfully Sign Up."});
} catch (error) {
    console.log(error);
    res.status(400).json({error:'error in backend !'});
}
});


// login

router.post('/sign-in',async(req,res)=>{
    const {email ,password} =req.body;
    try {
        if(!email || !password){
            return res.status(400).json({error:"Please Fill All"});
        }
        const existingUser = await userModel.findOne({email:email});
        if(!existingUser){
            return res.status(404).json({error:'Account is not exists ! '});
        }
        const passwordMatch = await bcrypt.compare(password,existingUser.password);
        if(!passwordMatch){
            return res.status(404).json({error:'Wrong password ! '});
            
        }
        const token = jwt.sign({userId:existingUser._id},process.env.SECRET,{expiresIn:'3d'});
        res.status(200).json({token:token});
        
    } catch (error) {
        console.log(error);
    }
})


// getuser


router.post('/getuser',ProtectedRoute,async(req,res)=>{
    try {
        const id =req.userId;
        const user = await userModel.findById({_id:id}).select("-password");
        if(user){
            return res.status(200).json({user});
        }
        res.status(400).json({error:"token not found"});
    } catch (error) {
         res.status(400).json({error:"Internel Error"});
        console.log(error);
    }
})


export default router;