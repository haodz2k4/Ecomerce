import { forgotPassword } from './../../controllers/clients/user.controller';
import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/clients/user.controller";
import * as validate from "../../validates/clients/user.validate"; 
import { requireAuth } from './../../middlewares/clients/auth.middleware';
router.post("/registers",validate.register,controller.register);
router.post("/login",validate.login,controller.login)
router.post("/password/forgot",validate.forgotPassword,controller.forgotPassword);
router.post("/password/otp",controller.otpPassword);
router.post("/password/reset",controller.resetPassword);
router.get("/profiles",requireAuth,controller.profiles);
router.post("/favorites/add/:productId",requireAuth,validate.addFavorite,controller.addFavorties)
export default router;