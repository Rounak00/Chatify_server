const { Server } = require("socket.io");
const CLIENT_ROOT=require("./config/secret").CLIENT_ROOT;
const MessageSchema=require("./models/MessageModel");
const ChannelSchema=require("./models/ChannelModel");


const userSocketMap=new Map();

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: CLIENT_ROOT,
      method:["GET","POST"],
      credentials: true,
    },
  });


  
  const sendMessage = async (message) => {
    try {
      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);
      
      const createdMessage = await MessageSchema.create(message);
      const messageData = await MessageSchema.findById(createdMessage._id)
        .populate("sender", "id email fname lname image color")
        .populate("recipient", "id email fname lname image color");
      
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("recieveMessage", messageData);
      }
      if (senderSocketId) {
        io.to(senderSocketId).emit("recieveMessage", messageData);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Additional error handling or logging can be done here
    }
  }


  const sendChannelMessage = async (message) => {
    try {
      const { channelId, sender, content, messageType, fileUrl } = message;
      
      // Create the message in the database
      const createdMessage = await MessageSchema.create({
        sender,
        recipient: null,
        content,
        fileUrl,
        messageType,
        timeStamp: new Date(),
      });
  
      // Populate sender details in the created message
      const messageData = await MessageSchema.findById(createdMessage._id)
        .populate("sender", "id fname lname image email color")
        .exec();
  
      // Update the channel with the new message
      await ChannelSchema.findByIdAndUpdate(channelId, {
        $push: { messages: createdMessage._id },
      },);
  
      // Populate channel members
      const channel = await ChannelSchema.findById(channelId).populate("members");
       
      // Prepare the final data to emit
      const finalData = { ...messageData._doc, channelId: channel._id };
       
      // Emit the message to all members and admin
      if (channel && channel.members) {
        channel.members.forEach((member) => {
          const memberSocketId = userSocketMap.get(member._id.toString());
          if (memberSocketId) {
            io.to(memberSocketId).emit("receive-channel-message", finalData);
          }
        });
  
        // Emit to the admin if they're not already a member
        if (channel.admin && !channel.members.some(m => m._id.equals(channel.admin._id))) {
          const adminSocketId = userSocketMap.get(channel.admin._id.toString());
          if (adminSocketId) {
            io.to(adminSocketId).emit("receive-channel-message", finalData);
          }
        }
      }
    } catch (error) {
      console.error("Error sending channel message:", error);
      // Optionally, emit an error event or perform some recovery action
    }
  };

  const disconnect=(socket)=>{
    console.log(`User Disconnected : ${socket.id}`)
    for(const [userId,socketId] of userSocketMap.entries()){
        if(socketId===socket.id){
          userSocketMap.delete(userId)
          break;
        }
    }
  };

  io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId;
    if(userId){
        userSocketMap.set(userId,socket.id)
        console.log(`User Connected : ${userId} with socket : ${socket.id}`)
    }else{
        console.log("UserId not provided during connection")
    }

    socket.on("sendMessage",sendMessage)
    socket.on("send-channel-message",sendChannelMessage)
    socket.on("disconnect",()=>disconnect(socket))
  })
};
module.exports= setupSocket;
