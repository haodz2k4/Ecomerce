import express,{Express} from "express"; 
import {getConnection} from "./config/database";
import {config} from 'dotenv'; 
import cors from "cors";
const app: Express = express();

//dotenv 
config();
//end dotenv 
//session 
import session from "express-session";
app.use(session({
    secret: process.env.SECRET_KEY as string, 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
    
}));
//cors 
app.use(cors())
//end cors 

//connect database 
const urlDatabase = process.env.URL_DATABASE;
getConnection(urlDatabase) 
//end connect database 
//body parser 
import bodyParser from "body-parser";
app.use(bodyParser.json())
//v1
import adminRouter from './v1/routers/admin/index.router';
adminRouter(app); 
import clientRouter from './v1/routers/clients/index.router';
clientRouter(app);
//end v1 
//v2  
import v2AdminRouter from './v2/router/admin/index.router'
v2AdminRouter(app)


//handle error 
import { errorHandler } from "./v2/middlewares/errorHandle.middleware";
app.use(errorHandler)
//end v2
//port 
const port = process.env.PORT || 5000; 
app.listen(port, () =>{
    console.log("server is running on PORT: " + port)
})

