import { Express } from "express";
import system from "../../config/system";
//router
import categoryRouter from '../../routers/admin/category.router';
import productRouter from '../../routers/admin/product.router';
import inventoryRouter from '../../routers/admin/inventory.router';
import supplierRouter from "../../routers/admin/supplier.router";
//end router
const {prefixAdmin} = system;
export default (app: Express): void =>{

    const path = `/${prefixAdmin}`;
    app.use(`${path}/categories`,categoryRouter);
    app.use(`${path}/products`,productRouter);
    app.use(`${path}/inventories`,inventoryRouter);
    app.use(`${path}/suppliers`,supplierRouter);
}