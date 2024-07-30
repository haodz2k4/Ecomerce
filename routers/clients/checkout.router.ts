import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/clients/checkout.controller";
router.post("/orders",controller.index);
router.get("/orders/success/:id",controller.orderSuccess)
router.get("/orders/detail/:id",controller.orderDetail)
export default router;