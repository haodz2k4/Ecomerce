import { Express } from "express"
import homeRouter from "./home.router";
import productRouter from "./product.router";
import searchRouter from "./search.router";
import userRouter from "./user.router";
import {user} from "../../middlewares/clients/user.middleware";
export default (app: Express) =>{ 
    app.use(user);
    app.use("/",homeRouter);
    app.use("/products",productRouter);
    app.use("/search",searchRouter);
    app.use("/users",userRouter);
}