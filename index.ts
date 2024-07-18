import express,{Express} from "express"; 
import {getConnection} from "./config/database";
import {config} from 'dotenv';
const app: Express = express();

//dotenv 
config();
//end dotenv 
//connect database 
const urlDatabase = process.env.URL_DATABASE;
getConnection(urlDatabase) 
//end connect database 


const port = process.env.PORT || 5000; 
app.listen(port, () =>{
    console.log("server is running on PORT: " + port)
})

