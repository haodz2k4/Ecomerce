import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/account.controller";
//validate
import * as validate from "../../validates/admin/account.validate";

//middleware 
import { createLog } from "../../middlewares/admin/logger.middlware";
router.get("/",controller.index);
router.post("/add",validate.add,createLog('create'), controller.add);
router.patch("/change/roles",createLog('update'),validate.changeRoles,controller.changeRoles);
router.patch("/change/status",createLog('update'),controller.changeStatus);
router.patch("/change/multi",createLog('update'),validate.changeMulti,controller.changeMulti);
export default router;