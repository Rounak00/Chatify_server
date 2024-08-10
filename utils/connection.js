const mongoose=require("mongoose");
const {DB_URL}=require("../config/secret");

const connection=async()=>{
    try{
        await mongoose.connect(DB_URL);
        console.log("DB Connected Succesfully !!!");
    }catch(err){
        console.log(err);
    }
}
module.exports=connection;