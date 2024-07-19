import { Router } from "express";
const router: Router = Router();
import * as controller from '../../controllers/admin/category.controller';
router.get("/",controller.index);
router.patch("/change-status/:status/:id",controller.changeStatus)

export default router;