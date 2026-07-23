import mongoose from 'mongoose';

const db_url = "mongodb://127.0.0.1:27017/jobs";

export const db_connection = async()=>{
    try{
        await mongoose.connect(db_url);
        console.log("db connected");
    }
    catch(error){
        console.log(error.message);
    }
}
