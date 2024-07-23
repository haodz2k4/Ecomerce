import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/account.controller";
//validate
import * as validate from "../../validates/admin/account.validate";
router.get("/",controller.index);
router.post("/add",validate.add, controller.add);
router.patch("/change/roles",validate.changeRoles,controller.changeRoles)
export default router;