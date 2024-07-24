import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/auth.controller";
import * as validate from "../../validates/admin/auth.validate";
router.post("/login",validate.login,controller.login);

export default router;