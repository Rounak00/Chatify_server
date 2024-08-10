const { genSalt } = require("bcrypt");
const  mongoose  = require("mongoose");
const bcrypt =require("bcrypt")


const UserSchema=new mongoose.Schema({
    email: {type:String, required:[true,"Email is required"],unique:true},
    password: {type:String,required:[true,"Password is required"]},
    fname: {type:String,required:false},
    lname: {type:String,required:false},
    image: {type:String,required:false},
    color:{type:Number,required:false},
    profileSetup:{type:Boolean,default:false}, 
})

UserSchema.pre("save",async function(next){
    const salt=await bcrypt.genSaltSync(10);
    this.password=await bcrypt.hashSync(this.password, salt);
    next();
})

module.exports=mongoose.model("User",UserSchema);