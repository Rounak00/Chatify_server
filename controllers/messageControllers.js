const MessageSchema=require("../models/MessageModel");
const ChannelSchema=require("../models/ChannelModel");
const UserSchema = require("../models/UserModel");
const fs=require("fs");

const messageControllers={
    async getMessages(req,res,next){
        try{
            const user1=req.userId;
            const user2=req.body.id;
            if(!user1 || !user2){
                return res.status(400).send("Users Ids Required")
            }
            const messages=await MessageSchema.find({ 
                $or:[
                    {sender:user1,recipient:user2},
                    {sender:user2,recipient:user1},
                ]
        }).sort({timestamp:1});
            return res.status(200).json({messages});
        }catch(err){next(err)}
    },
    async uploadFile(req,res,next){
        try{
            if(!req.file){
                return res.status(400).send("File is required");
            }
            const date=Date.now();
            let fileDir=`uploads/files`
            let fileName=`${fileDir}/${req.file.originalname}`
            fs.mkdirSync(fileDir,{recursive:true});
            fs.renameSync(req.file.path,fileName)
            return res.status(200).json({filePath:fileName});
        }catch(err){next(err)}
    }, 
    async getChannelMessages(req,res,next){
        try{
            const{channelId}=req.params;
           
            const channel=await ChannelSchema.findById(channelId)
                                            .populate(
                                            {path:"messages",
                                            populate:{
                                                path:"sender",
                                                select:"fname lname email _id image color", 
                                            }
                                        })
            if(!channel){
                return res.status(404).send("Channel not found");
            }
            const messages=channel.messages;
            return res.status(201).json({messages})
        }catch(err){next(err);}
      }
};
module.exports=messageControllers;