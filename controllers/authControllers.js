const UserSchema = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config/secret").JWT_SECRET;
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
        secure: true,
        sameSite: "None",
        path: '/',
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
          secure: false,
          sameSite: "Lax",
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
    }
  };

module.exports = authControllers;
