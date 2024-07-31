import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/role.controller"; 
import multer from "multer";
const upload = multer();
import {uploadSingle} from "../../middlewares/admin/uploadCloud.middlewares";
//validate
import * as validate from "../../validates/admin/role.validate";
//middleware 
import { createLog } from './../../middlewares/admin/logger.middlware';
router.get("/",controller.index);
router.post("/add",upload.single('thumbnail'),uploadSingle,createLog('create'),validate.add,controller.add);
router.patch("/edit/:id",validate.edit,createLog('update'),controller.edit);
router.patch("/delete/:id",createLog('delete'),controller.deleteRole)
export default router;