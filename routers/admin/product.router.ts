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
router.patch("/soft-delete/:id",controller.softDelete);
router.get("/garbages",controller.garbages);
router.delete("/garbages/delete-permanently/:id",controller.deletePermanently);
router.patch("/garbages/restore/all",controller.restoreAll);
router.patch("/garbages/restore/:id",controller.restore); 
router.get("    /detail/:id",controller.detail)
router.patch("/change-multi/:type",validate.changeMulti,controller.changeMulti);
router.get("/suggestions",controller.suggestions);
export default router;