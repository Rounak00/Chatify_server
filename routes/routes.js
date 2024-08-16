const router=require("express").Router();
const authControllers=require("../controllers/authControllers");
const { verifyToken } = require("../middleware/authMiddleware");
const multer=require("multer");

const upload=multer({dest:"uploads/profiles/"})

router.post("/signup",authControllers.signup);
router.post("/login",authControllers.login);
router.get("/user_info",verifyToken,authControllers.getUserInfo);
router.post("/update_profile",verifyToken,authControllers.updateProfile);

router.post("/add_profile_image",
             verifyToken,
             upload.single("profile-image"),
             authControllers.addProfileImage);

router.delete("/remove_profile_image",verifyToken,authControllers.removeProfileImage)
router.post("/logout",authControllers.logout);             
module.exports=router;

