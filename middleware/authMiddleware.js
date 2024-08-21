const jwt =require("jsonwebtoken");
const JWT_SECRET=require("../config/secret").JWT_SECRET



const verifyToken = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({"msg":"Fucking Damn Token is not here"});
	}

	const token = authHeader.split(" ")[1];

	try {
		jwt.verify(token, JWT_SECRET, (err, user) => {
			if (err) {
				return res.status(401).json({"msg":"Fucking Damn Token is not valid"});
			}
			req.userId = user.id;
			next();
		});
	} catch (err) {
		return next(err);

	}
};
module.exports={verifyToken}