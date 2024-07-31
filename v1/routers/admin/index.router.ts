import { Express } from "express";
import system from "../../../config/system";
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
import poinRouter from "./point.router";
import orderRouter from "./order.router";
//end router
//middleware 
import { requireAuth } from "../../middlewares/admin/auth.middleware";
const {prefixAdmin} = system;
const v1 = "/api/v1";
export default (app: Express): void =>{

    const path = `/${prefixAdmin}`;
    app.use(v1+`${path}/categories`,requireAuth,categoryRouter);
    app.use(v1+`${path}/products`,requireAuth,productRouter);
    app.use(v1+`${path}/orders`,requireAuth,orderRouter)
    app.use(v1+`${path}/inventories`,requireAuth,inventoryRouter);
    app.use(v1+`${path}/accounts`,requireAuth,accountRouter);
    app.use(v1+`${path}/roles`,requireAuth,roleRouter);
    app.use(v1+`${path}/auth`,authRouter);
    app.use(v1+`${path}/my-account`,requireAuth,myAccountRouter);
    app.use(v1+`${path}/settings`,requireAuth,settingRouter)
    app.use(v1+`${path}/users`,requireAuth,userRouter);
    app.use(v1+`${path}/points`,requireAuth,poinRouter);

}