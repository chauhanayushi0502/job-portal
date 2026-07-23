import mongoose from "mongoose";
export const selected = async (req,res)=>{
    try{
        if(req.user.role!="Company"){
           return res.status(403).json({message:"only company can do"});
        }
        const {candidateid} = req.body;
        const select = await select.find()
    }
    catch(error){
        console.log(error.message);
    }
}