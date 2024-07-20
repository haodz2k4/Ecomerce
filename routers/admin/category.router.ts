import { Router } from "express";
const router: Router = Router();
import * as controller from '../../controllers/admin/category.controller'; 

import * as validate from "../../validates/admin/category.validate";
router.get("/",controller.index);
router.patch("/change-status/:status/:id",controller.changeStatus);
router.post("/add",validate.add,controller.add);
router.patch("/edit/:id",validate.edit,controller.edit);
router.patch("/soft-delete/:id",controller.softDelete);
router.get("/garbages",controller.garbages);
router.delete("/garbages/delete-permanently/:id",controller.deletePermanently);
router.patch("/garbages/restore/all",controller.restoreAll);
router.patch("/garbages/restore/:id",controller.restore);
router.patch("/change-multi/:type",validate.changeMulti, controller.changeMulti);
router.get("/suggestions",controller.suggestions);
export default router;