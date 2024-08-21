const express=require("express");
const {PORT}=require("./config/secret");
const Connection=require("./utils/connection");
const cors=require("cors");
const cookieParser =require("cookie-parser")
const errorHandler=require("./middleware/errorHandler");
const router=require("./routes/routes");
const setupSocket = require("./socket.js");

const app=express();
app.use(cors(
     {
        origin: '*',
        credentials: true,
      }
));
app.use("/uploads/profiles",express.static("uploads/profiles"));
app.use("/uploads/files",express.static("uploads/files"));
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use(errorHandler);

const server=app.listen(PORT,()=>{
    console.log("Hello from server : ",PORT );
    Connection();
})
setupSocket(server);