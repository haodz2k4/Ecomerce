import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/setting.controller";
import * as validate from "../../validates/admin/setting.validate"; 

import multer from "multer";
const upload = multer();

//middlewares 
import { uploadSingle } from './../../middlewares/admin/uploadCloud.middlewares';
import { createLog } from "../../middlewares/admin/logger.middlware";
router.get("/general",controller.general);
router.patch("/general/edit",upload.single('logo'),uploadSingle,validate.editGeneral,createLog('update'),controller.editGeneral);

export default router;