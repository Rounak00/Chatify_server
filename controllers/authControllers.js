const UserSchema=require("../models/UserModel");
const jwt = require('jsonwebtoken');
const JWT_SECRET=require("../config/secret").JWT_SECRET;
const maxage=3*24*60*60*1000;

const authControllers={
      async signup(req,res,next){
         try{
            const {email,password}=req.body;
            if(!email|| !password)return res.status(400).json({msg:"Email or Password is Empty"});

            const user=await UserSchema.create({email,password});
            
            // generate token
			const generateToken = jwt.sign({
				id: isExist._id,
				isAdmin: isExist.isAdmin
			}, JWT_SECRET,{expiresIn:maxage})

            res.cookie("chatify",generateToken,{
                maxage,
                secure:true,
                sameSite:"None",
            });
            return res.status(201).json({
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup,  
            })
         }catch(error){
           next(error)
         }
      },
      async login(req,res,next){

      }
}

module.exports=authControllers;