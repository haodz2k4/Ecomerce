import { Router } from "express";
const router: Router = Router();
import* as controller from "../../controllers/admin/inventory.controller";
router.get("/",controller.index);
router.patch("/edit",controller.update)
export default router;