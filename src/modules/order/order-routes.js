import { Router } from "express";
import * as controller from "./order-controller.js";
import { adminAuth, authUser } from "./../../middlewares/auth-middleware.js";

const router = Router();

router.post("/list", adminAuth, controller.allOrders);

router.post("/status", adminAuth, controller.updateOrderStatus);

router.post("/place", authUser, controller.placeOrder);

router.post("/stripe", authUser, controller.placeOrderStripe);

router.post("/razorpay", authUser, controller.placeOrderRazorpay);

router.post("/userorders", authUser, controller.userOrders);

router.post("/verifyStripe", authUser, controller.verifyStripe);

export default router;
