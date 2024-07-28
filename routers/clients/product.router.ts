import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/clients/product.controller";
router.get("/",controller.index);
router.get("/detail/:slug",controller.detail);
router.get("/:slug",controller.category)
export default router;