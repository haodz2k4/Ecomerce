import { Router } from "express";
const router: Router = Router();
import* as controller from "../../controllers/admin/inventory.controller";
import { createLog } from './../../middlewares/admin/logger.middlware';
router.get("/",controller.index);
router.patch("/add/multi",createLog('update'),controller.addMultipleInventory);
router.patch("/delete/:id",createLog('delete'),controller.deleteInventory);
export default router;