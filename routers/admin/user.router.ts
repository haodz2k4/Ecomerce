import { Router } from "express";

const router: Router = Router();
import * as controller from "../../controllers/admin/user.controller";

import * as validates from "../../validates/admin/user.validate";
router.get("/",controller.index);
router.get("/detail/:id",controller.detail);
router.patch("/change/status/:id",controller.changeStatus);
router.patch("/change/multi/:type",validates.changeMulti,controller.changeMulti);
export default router;