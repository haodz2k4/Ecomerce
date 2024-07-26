import { Express } from "express"
import homeRouter from "./home.router";

export default (app: Express) =>{
    app.use("/",homeRouter);
}