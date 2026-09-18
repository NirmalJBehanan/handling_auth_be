import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connection from "./database/dbConfig.js";
import router from "./router/Router.js";
dotenv.config()
const app=express();
app.use(express.json());
app.use(cors());
connection();
app.use("/api",router)
app.listen(process.env.PORT,()=>{
    console.log("server connected")
})