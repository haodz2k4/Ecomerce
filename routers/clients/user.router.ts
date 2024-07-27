import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/clients/user.controller";
import * as validate from "../../validates/clients/user.validate";
router.post("/registers",validate.register,controller.register);

export default router;