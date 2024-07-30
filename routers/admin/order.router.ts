import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/order.controller";
router.get("/",controller.index);
router.get("/detail/:id",controller.detail)
export default router;