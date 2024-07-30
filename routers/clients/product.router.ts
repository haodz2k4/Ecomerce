import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/clients/product.controller";
import { verifyPurchase } from './../../middlewares/clients/verify.middleware';
import { requireAuth } from './../../middlewares/clients/auth.middleware';
router.get("/",controller.index);
router.get("/detail/:slug",controller.detail);
router.get("/:slug",controller.category);
router.post("/:productId/feedbacks/add/",requireAuth,verifyPurchase,controller.addFeedback);
router.patch("/:productId/feedback/edit/:feedbackId",requireAuth,verifyPurchase,controller.editFeedback);
router.patch("/:productId/feedback/delete/:feedbackId",requireAuth,verifyPurchase,controller.deleteFeedback)
export default router;