import express,{Express} from "express"; 
import {getConnection} from "./config/database";
import {config} from 'dotenv'; 
import cors from "cors";
const app: Express = express();

//cors 
app.use(cors())
//end cors 
//dotenv 
config();
//end dotenv 
//connect database 
const urlDatabase = process.env.URL_DATABASE;
getConnection(urlDatabase) 
//end connect database 
//body parser 
import bodyParser from "body-parser";
app.use(bodyParser.json())
//admin router
import adminRouter from './routers/admin/index.router';
adminRouter(app);
//port 
const port = process.env.PORT || 5000; 
app.listen(port, () =>{
    console.log("server is running on PORT: " + port)
})

