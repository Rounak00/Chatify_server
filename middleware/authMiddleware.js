const jwt =require("jsonwebtoken");
const JWT_SECRET=require("../config/secret").JWT_SECRET

const verifyToken=(req,res,next)=>{
      const token=req.cookies.chatify;
      if(!token){
        return res.status(401).send("You are not authenticated!")
      }else{
        jwt.verify(token,JWT_SECRET,function(err,payload){
           if(err) return res.status(403).send("Token is not valid")
           req.userId=payload.id;
           next();
        });
      }
   
}

module.exports={verifyToken}