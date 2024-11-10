import { Router } from "express";
import * as controller from "./user-controller.js";

const router = Router();

router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);
router.post("/admin", controller.loginAdmin);

export default router;