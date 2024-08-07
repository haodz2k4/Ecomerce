import { Express } from "express"
import productRouter from "../../router/admin/product.router";
import system from "../../../config/system";
const {prefixAdmin} = system
export default (app: Express) =>{ 
    const path = `/api/v2/${prefixAdmin}`
    app.use(path+"/products",productRouter)
}