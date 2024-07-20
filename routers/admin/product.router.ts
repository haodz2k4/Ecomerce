import { Router } from "express";

const router: Router = Router();
import * as controller from "../../controllers/admin/product.controller";

import * as validate from "../../validates/admin/product.validate";
router.get("/",controller.index);
router.post("/add",validate.add,controller.add);

export default router;