import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/clients/cart.controller";
router.get("/",controller.index);
router.post("/add/:productId",controller.add);
router.delete("/remove/multi",controller.removeMulti);
router.delete("/remove/:cartItemId",controller.remove);
router.patch("/change/quantity",controller.changeQuantity)
export default router;