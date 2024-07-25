import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/my-account.controller";
import * as validate from './../../validates/admin/my-account.validate';
router.get("/",controller.index);
router.patch("/edit",validate.edit,controller.edit);
export default router;