import { Router } from "express";
const router = Router()
import * as controller from "../../controllers/admin/product.controller"
router.get("/", controller.index)
router.patch("/change/status/:id",controller.changeStatus)
export default router