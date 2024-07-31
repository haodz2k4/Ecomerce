import { Express } from "express"
import homeRouter from "./home.router";
import productRouter from "./product.router";
import searchRouter from "./search.router";
import userRouter from "./user.router";
import cartRouter from "./cart.router";
import checkoutRouter from "./checkout.router";
import {user} from "../../middlewares/clients/user.middleware";
import { requireAuth } from "../../middlewares/clients/auth.middleware";
const v1 = "/api/v1"
export default (app: Express) =>{ 
    app.use(user);
    app.use(v1+"/",homeRouter);
    app.use(v1+"/products",productRouter);
    app.use(v1+"/search",searchRouter);
    app.use(v1+"/users",userRouter);
    app.use(v1+"/cart",requireAuth,cartRouter);
    app.use(v1+"/checkout",requireAuth,checkoutRouter)
}