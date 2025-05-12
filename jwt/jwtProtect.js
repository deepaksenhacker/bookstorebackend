
import jwt from "jsonwebtoken";
import 'dotenv/config'

const ProtectedRoute = async(req,res,next)=>{
    
    const token = req.header('authentication');
    if(!token){
        res.status(400).json({error:"Authentication not found"});
    }
    try {
    const {userId} = jwt.verify(token,process.env.SECRET);
    req.userId = userId;
    console.log(req.userId);
    next();

} catch (error) {
    res.status(400).json({error:"Please authenticate using a valid token"});
    
    }
}


export default ProtectedRoute;