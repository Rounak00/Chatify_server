const router=require("express").Router();
const authControllers=require("../controllers/authControllers");
const contactControllers=require("../controllers/contactControllers");
const messageControllers = require("../controllers/messageControllers");
const { verifyToken } = require("../middleware/authMiddleware");
const multer=require("multer");

const upload_dp=multer({dest:"uploads/profiles/"})
const upload_file=multer({dest:"uploads/files"})

router.post("/signup",authControllers.signup);
router.post("/login",authControllers.login);
router.get("/user_info",verifyToken,authControllers.getUserInfo);
router.post("/update_profile",verifyToken,authControllers.updateProfile);

router.post("/add_profile_image",
             verifyToken,
             upload_dp.single("profile-image"),
             authControllers.addProfileImage);

router.delete("/remove_profile_image",verifyToken,authControllers.removeProfileImage)
router.post("/logout",authControllers.logout);  


router.post("/contact/search",verifyToken, contactControllers.searchContects)
router.get("/contact/get_contacts_for_DM",verifyToken,contactControllers.getContactsForDMList);
router.get("/contact/get_all_contacts",verifyToken,contactControllers.getAllContacts)
router.post("/contact/create_channel",verifyToken,contactControllers.createChannel)
router.get("/contact/get_user_channels",verifyToken,contactControllers.getUserChannels)


router.post("/message/get_messages",verifyToken,messageControllers.getMessages)
router.get("/message/get_channel_messages/:channelId",verifyToken,messageControllers.getChannelMessages)
router.post("/message/upload_file",verifyToken,upload_file.single("file"),messageControllers.uploadFile)
module.exports=router;

