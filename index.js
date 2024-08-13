const express=require("express");
const {PORT}=require("./config/secret");
const Connection=require("./utils/connection");
const cors=require("cors");
const cookieParser =require("cookie-parser")
const errorHandler=require("./middleware/errorHandler");
const router=require("./routes/routes");

const app=express();
app.use(cors(
     {
        origin: 'http://localhost:5173',
        credentials: true,
      }
));
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log("Hello from server : ",PORT );
    Connection();
})