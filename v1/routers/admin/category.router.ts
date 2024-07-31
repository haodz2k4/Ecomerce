import { Router } from "express";
const router: Router = Router();
import * as controller from '../../controllers/admin/category.controller'; 

import * as validate from "../../validates/admin/category.validate";
//middleware 
import { createLog } from './../../middlewares/admin/logger.middlware';
router.get("/",controller.index);
router.patch("/change-status/:status/:id",createLog('update'),controller.changeStatus);
router.post("/add",validate.add,createLog('create'),controller.add);
router.patch("/edit/:id",createLog('update'),validate.edit,controller.edit);
router.patch("/soft-delete/:id",createLog('delete'),controller.softDelete);
router.get("/garbages",controller.garbages);
router.delete("/garbages/delete-permanently/:id",controller.deletePermanently);
router.patch("/garbages/restore/all",createLog('update'),controller.restoreAll);
router.patch("/garbages/restore/:id",createLog('update'),controller.restore);
router.patch("/change-multi/:type",validate.changeMulti,createLog('update'), controller.changeMulti);
router.get("/suggestions",controller.suggestions);
router.get("/create-tree",controller.createTree)
export default router;