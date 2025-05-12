import mongoose from 'mongoose';
import 'dotenv/config'
const dbConnect= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true});
        console.log('Connected');
        } catch (error) {
            console.log(error);
    }
}

export default dbConnect;