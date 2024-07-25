
import { Router } from "express";

const router: Router = Router();
import * as controller from "../../controllers/admin/product.controller";

import * as validate from "../../validates/admin/product.validate"; 
import {uploadSingle} from "../../middlewares/admin/uploadCloud.middlewares"; 
import { createLog } from './../../middlewares/admin/logger.middlware';
import multer from "multer";
const upload = multer()
router.get("/",controller.index);
router.post("/add",upload.single('avatar'),uploadSingle,validate.add,createLog('create'),controller.add);
router.patch("/change-status/:status/:id",createLog('update'),controller.changeStatus);
router.patch("/edit/:id",upload.single('avatar'),uploadSingle,validate.edit,createLog('update'),controller.edit);
router.patch("/soft-delete/:id",createLog('update'),controller.softDelete);
router.get("/garbages",controller.garbages);
router.delete("/garbages/delete-permanently/:id",controller.deletePermanently);
router.patch("/garbages/restore/all",createLog('update'),controller.restoreAll);
router.patch("/garbages/restore/:id",controller.restore); 
router.get("/detail/:id",controller.detail)
router.patch("/change-multi/:type",validate.changeMulti,createLog('update'),controller.changeMulti);
router.get("/suggestions",controller.suggestions);
export default router;