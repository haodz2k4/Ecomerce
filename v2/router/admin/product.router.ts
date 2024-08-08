import { Router } from "express";
const router = Router()
import * as controller from "../../controllers/admin/product.controller" 

//validate 
import * as validator from "../../validates/admin/product.validate";
router.get("/", controller.index)
router.patch("/change/status/:id",controller.changeStatus)
router.patch("/change/multi/:type",controller.changeMulti)
router.patch("/edit/:id",validator.edit,controller.edit)
export default router