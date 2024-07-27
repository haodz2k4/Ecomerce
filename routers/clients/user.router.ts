import { forgotPassword } from './../../controllers/clients/user.controller';
import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/clients/user.controller";
import * as validate from "../../validates/clients/user.validate";
router.post("/registers",validate.register,controller.register);
router.post("/login",validate.login,controller.login)
router.post("/forgot/password",validate.forgotPassword,controller.forgotPassword)
export default router;