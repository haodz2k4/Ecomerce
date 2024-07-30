import { Express } from "express"
import homeRouter from "./home.router";
import productRouter from "./product.router";
import searchRouter from "./search.router";
import userRouter from "./user.router";
import cartRouter from "./cart.router";
import checkoutRouter from "./checkout.router";
import {user} from "../../middlewares/clients/user.middleware";
import { requireAuth } from "../../middlewares/clients/auth.middleware";
export default (app: Express) =>{ 
    app.use(user);
    app.use("/",homeRouter);
    app.use("/products",productRouter);
    app.use("/search",searchRouter);
    app.use("/users",userRouter);
    app.use("/cart",requireAuth,cartRouter);
    app.use("/checkout",requireAuth,checkoutRouter)
}