const  mongoose  = require("mongoose");

const MessageSchema=new mongoose.Schema(
    {
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Users",
            required:true
        },
        recipient:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Users",
            required:false
        },
        messageType:{
            type:String,
            enum:["text","file"],
            required:true
        },
        content:{
            type: String,
            required: function(){ return this.messageType==='text'}
        },
        fileUrl:{
            type:String,
            required:function(){return this.messageType==='file'}
        },
        timestamp:{
            type:Date,
            default: Date.now,
        }
    })

module.exports=mongoose.model("Messages",MessageSchema);
