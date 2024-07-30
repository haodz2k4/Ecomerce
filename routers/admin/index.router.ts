import { Express } from "express";
import system from "../../config/system";
//router
import categoryRouter from '../../routers/admin/category.router';
import productRouter from '../../routers/admin/product.router';
import inventoryRouter from '../../routers/admin/inventory.router';
import accountRouter from '../../routers/admin/account.router';
import roleRouter from '../../routers/admin/role.router';
import authRouter from './auth.router';
import myAccountRouter from './my-account.router';
import settingRouter from "./setting.router";
import userRouter from "./user.router";
import orderRouter from "./order.router";
//end router
//middleware 
import { requireAuth } from "../../middlewares/admin/auth.middleware";
const {prefixAdmin} = system;
export default (app: Express): void =>{

    const path = `/${prefixAdmin}`;
    app.use(`${path}/categories`,requireAuth,categoryRouter);
    app.use(`${path}/products`,requireAuth,productRouter);
    app.use(`${path}/orders`,requireAuth,orderRouter)
    app.use(`${path}/inventories`,requireAuth,inventoryRouter);
    app.use(`${path}/accounts`,requireAuth,accountRouter);
    app.use(`${path}/roles`,requireAuth,roleRouter);
    app.use(`${path}/auth`,authRouter);
    app.use(`${path}/my-account`,requireAuth,myAccountRouter);
    app.use(`${path}/settings`,requireAuth,settingRouter)
    app.use(`${path}/users`,requireAuth,userRouter);

}