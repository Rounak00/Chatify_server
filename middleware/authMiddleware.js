const jwt =require("jsonwebtoken");
const JWT_SECRET=require("../config/secret").JWT_SECRET

// const verifyToken=(req,res,next)=>{
//       const token=req.cookies.chatify;
//       console.log("Token is  :" ,token);
//       if(!token){
//         return res.status(401).send("You are not authenticated!")
//       }else{
//         jwt.verify(token,JWT_SECRET,function(err,payload){
//            if(err) return res.status(403).send("Token is not valid")
//            req.userId=payload.id;
//            next();
//         });
//       }
   
// }
const verifyToken = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({"msg":"Token is not available"});
	}

	const token = authHeader.split(" ")[1];

	try {
		jwt.verify(token, JWT_SECRET, (err, user) => {
			if (err) {
				return res.status(401).json({"msg":"Token is not valid"});
			}
			req.userId = user.id;
			next();
		});
	} catch (err) {
		return next(err);

	}
}

module.exports={verifyToken}