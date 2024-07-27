import { Express } from "express"
import homeRouter from "./home.router";
import productRouter from "./product.router";
import searchRouter from "./search.router";
import userRouter from "./user.router";
export default (app: Express) =>{
    app.use("/",homeRouter);
    app.use("/products",productRouter);
    app.use("/search",searchRouter);
    app.use("/users",userRouter);
}