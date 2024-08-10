const router=require("express").Router();
const authControllers=require("../controllers/authControllers");


router.post("/signup",authControllers.signup);
router.post("/login",authControllers.login);

module.exports=router;

