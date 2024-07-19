import { Express } from "express";
import system from "../../config/system";
//router
import categoryRouter from '../../routers/admin/category.router';

//end router
const {prefixAdmin} = system;
export default (app: Express): void =>{

    const path = `/${prefixAdmin}`;
    app.use(`${path}/categories`,categoryRouter)
}