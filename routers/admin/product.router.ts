import { Router } from "express";

const router: Router = Router();
import * as controller from "../../controllers/admin/product.controller";

import * as validate from "../../validates/admin/product.validate"; 
import {uploadSingle} from "../../middlewares/admin/uploadCloud.middlewares"; 

import multer from "multer";
const upload = multer()
router.get("/",controller.index);
router.post("/add",upload.single('avatar'),uploadSingle,validate.add,controller.add);
router.patch("/change-status/:status/:id",controller.changeStatus);
router.patch("/edit/:id",upload.single('avatar'),uploadSingle,validate.edit,controller.edit);
export default router;