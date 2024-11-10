import { Router } from "express";
import * as controller from "./cart-controller.js";
import { authUser } from "../../middlewares/auth-middleware.js";

const router = Router();

router.post("/get", authUser, controller.getUserCart);

router.post("/add", authUser, controller.addToCart);

router.post("/update", authUser, controller.updateCart);

export default router;
