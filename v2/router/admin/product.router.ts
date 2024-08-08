import { Router } from "express";
const router = Router()
import * as controller from "../../controllers/admin/product.controller" 

//validate 
import * as validates from "../../validates/admin/product.validate";
router.get("/", controller.index)
router.patch("/change/status/:id",controller.changeStatus)
router.patch("/change/multi/:type",controller.changeMulti)
router.patch("/edit/:id",validates.edit,controller.edit)
router.patch("/delete/:id",controller.deleteUser)
router.post("/add",validates.add,controller.add) 
router.patch("/change/position/:id",controller.changePosition)
router.patch("/change/category/:id",validates.changeCategory,controller.changeCategory)
router.get("/detail/:id",controller.detail)
export default router