import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/account.controller";
//validate
import * as validate from "../../validates/admin/account.validate";
//middleware 
import { createLog } from "../../middlewares/admin/logger.middlware"; 
import { requirePermission } from "../../middlewares/admin/auth.middleware"; 


router.get("/",requirePermission('account_view'),controller.index);
router.post("/add",requirePermission('account_create'),validate.add,createLog('create'), controller.add);
router.patch("/change/roles",requirePermission('account_edit'),createLog('update'),validate.changeRoles,controller.changeRoles);
router.patch("/change/status",requirePermission('account_edit'),createLog('update'),controller.changeStatus);
router.patch("/change/multi",requirePermission('account_edit'),createLog('update'),validate.changeMulti,controller.changeMulti);
router.patch("/delete/:id",requirePermission('account_delete'),createLog('delete'),controller.deleteAccount)
export default router;