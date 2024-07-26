import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/clients/home.controller";
router.get("/",controller.index);
export default router;