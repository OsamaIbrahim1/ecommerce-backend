import Route from "express";
import * as controller from "./product-controller.js";
import upload from "../../middlewares/multer-middleware.js";
import { adminAuth } from "../../middlewares/auth-middleware.js";

const router = Route();

router.post(
  "/add-product",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  controller.addProduct
);

router.post("/remove", adminAuth, controller.removeProduct);

router.get("/single", controller.singleProduct);

router.get(
  "/list",
  controller.listProducts
);

export default router;
