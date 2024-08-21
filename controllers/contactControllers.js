const MessageSchema = require("../models/MessageModel");
const UserSchema = require("../models/UserModel");
const ChannelSchema=require("../models/ChannelModel");
const mongoose=require("mongoose")

const contactControllers={
    async searchContects(req,res,next){
        try{
            const {searchTerm}=req.body;
            if(searchTerm===null || searchTerm===undefined){
                return res.status(400).send("Search Term is required")
            }
            const sanitizedSearchTerm = searchTerm.replace(/[.*+?^&{}()|[\]\\]/g, "\\$&");
            const regex=new RegExp(sanitizedSearchTerm,"i");
            const contacts=await UserSchema.find({
                $and: [
                    {_id:{$ne:req.userId}},
                    {$or:[{fname:regex},{lname:regex},{email:regex}]},
                ],
            })
            return res.status(200).json({contacts});
        }catch(err){next(err)}
    },
    async getContactsForDMList(req, res, next) {
        try {
            let { userId } = req;
            userId = new mongoose.Types.ObjectId(userId); // Converted correctly
    
            const contacts = await MessageSchema.aggregate([
                {
                    $match: {
                        $or: [{ sender: userId }, { recipient: userId }],
                    },
                },
                {
                    $sort: { timestamp: -1 },
                },
                {
                    $group: {
                        _id: {
                            $cond: {
                                if: { $eq: ["$sender", userId] },
                                then: "$recipient",
                                else: "$sender",
                            },
                        },
                        lastMessageTime: { $first: "$timestamp" },
                    },
                },
                {
                    $lookup: {
                        from: "users", 
                        localField: "_id",
                        foreignField: "_id",
                        as: "contactInfo",
                    },
                },
                {
                    $unwind: "$contactInfo",
                },
                {
                    $project: {
                        _id: 1,
                        lastMessageTime: 1,
                        email: "$contactInfo.email",
                        fname: "$contactInfo.fname",
                        lname: "$contactInfo.lname",
                        image: "$contactInfo.image",
                        color: "$contactInfo.color",
                    },
                },
                {
                    $sort: { lastMessageTime: -1 },
                },
            ]);
    
            return res.status(200).json({ contacts });
        } catch (err) {
            console.error("Error fetching contacts:", err); // Optional logging
            next(err);
        }
    },
    async getAllContacts(req,res,next){
        try{
            const users=await UserSchema.find({_id:{$ne:req.userId}},"fname lname _id email");

            const contacts=users.map((user)=>({
               label:user.fname?`${user.fname} ${user.lname}`:user.email,
               value:user._id
            }))
            return res.status(200).json({contacts});
        }catch(err){next(err)}
    },
    async createChannel(req,res,next){
        try{
          const {name , members}=req.body;
          const userId=req.userId;
          const admin=await UserSchema.findById(userId); 
          if(!admin){
            return res.status(400).send("Admin user not found");
        }
          const validMembers=await UserSchema.find({_id:{$in:members}});
          if(members.length!==validMembers.length){
            return res.status(400).send("All members are not valid");
          }

          const newChannel= new ChannelSchema({
            name,admin:userId,members
          })
          await newChannel.save()
          return res.status(201).json({channel:newChannel})
        }catch(err){next(err)}
      },
      async getUserChannels(req,res,next){
        try{
            const userId=new mongoose.Types.ObjectId(req.userId);
            const channels=await ChannelSchema.find({
                $or:[{admin:userId},{members:userId}],
            }).sort({updatedAt:-1});

            return res.status(201).json({channels})
        }catch(err){next(err);}
      },
      
}
module.exports=contactControllers;