import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/clients/search.controller";
router.get("/",controller.search);

export default router;