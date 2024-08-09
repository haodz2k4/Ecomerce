import { Express } from "express"
import productRouter from "./product.router";
import supplierRouter from "./supplier.router";
import categoryRouter from "./category.router";
import system from "../../../config/system";
const {prefixAdmin} = system
export default (app: Express) =>{ 
    const path = `/api/v2/${prefixAdmin}`
    app.use(path+"/products",productRouter)
    app.use(path+"/suppliers",supplierRouter)
    app.use(path+"/categories",categoryRouter)
}