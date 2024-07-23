import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/role.controller"; 
import multer from "multer";
const upload = multer();
import {uploadSingle} from "../../middlewares/admin/uploadCloud.middlewares";
//validate
import * as validate from "../../validates/admin/role.validate";
router.get("/",controller.index);
router.post("/add",upload.single('thumbnail'),uploadSingle,validate.add,controller.add)
export default router;