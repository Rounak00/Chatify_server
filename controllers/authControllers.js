const UserSchema = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config/secret").JWT_SECRET;
const bcrypt=require("bcrypt")
const maxage = 3 * 24 * 60 * 60 * 1000;

const authControllers = {
  async signup(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ msg: "Email or Password is Empty" });

      const user = await UserSchema.create({ email, password });

      const generateToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        JWT_SECRET,
        { expiresIn: maxage }
      );

      
      return res
      .cookie("chatify", generateToken, {
        maxAge: maxage,
        httpOnly:true
      })
      .status(201)
      .json({
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      });
    } catch (error) {
    //   console.error("Signup Error:", error); // Log the error for debugging
      res.status(500).json({ msg: "Internal Server Error" });
      next(error);
    }
  },
  async login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password)
          return res.status(400).json({ msg: "Email or Password is Empty" });
  
        const user = await UserSchema.findOne({ email });
         if(!user)return res.status(404).json({msg:"User of given email not found"});
        
        const auth = await bcrypt.compareSync(password,user.password);
         if(!auth) return res.status(400).json({msg:"wrong password"})

        const generateToken = jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          JWT_SECRET,
          { expiresIn: maxage }
        );
  
        
        return res
        .cookie("chatify", generateToken, {
          maxAge: maxage,
          httpOnly:true
        })
        .status(200)
        .json({
          id: user.id,
          email: user.email,
          profileSetup: user.profileSetup,
          fname: user.fname,
          lname: user.lname,
          image: user.image,
          color: user.color
        });
      } catch (error) {
        next(error);
      }
    },
    async getUserInfo(req, res, next) {
      try {
        const ID=req.userId;
        const userData=await UserSchema.findById(ID);
        if(!userData){
          return res.status(404).send("User with given ID not found");
        }
          return res
          .status(200)
          .json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            fname: userData.fname,
            lname: userData.lname,
            image: userData.image,
            color: userData.color
          });
        } catch (error) {
          next(error);
        }
      },
    
    async updateProfile(req,res,next){
      
        try {
          const ID=req.userId;
          const {fname,lname,color}=req.body;
          if(!fname || !lname){
            return res.status(400).send("First name , last name and color need to be give");
          }
          const userData=await UserSchema.findByIdAndUpdate(ID,{
            fname,lname,color,profileSetup:true
          },{new:true,runValidators:true})

            return res
            .status(200)
            .json({
              id: userData.id,
              email: userData.email,
              profileSetup: userData.profileSetup,
              fname: userData.fname,
              lname: userData.lname,
              image: userData.image,
              color: userData.color
            });
          } catch (error) {
            next(error);
          }    
    }  
  };

module.exports = authControllers;
