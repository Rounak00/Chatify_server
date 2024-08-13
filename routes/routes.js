const router=require("express").Router();
const authControllers=require("../controllers/authControllers");
const { verifyToken } = require("../middleware/authMiddleware");


router.post("/signup",authControllers.signup);
router.post("/login",authControllers.login);
router.get("/user_info",verifyToken,authControllers.getUserInfo);
router.post("/update_profile",verifyToken,authControllers.updateProfile);

module.exports=router;

