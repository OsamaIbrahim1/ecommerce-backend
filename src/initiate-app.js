import db_connection from "../db/connection.js";
import { globalResponse } from "./middlewares/global-response.middleware.js";
import { rollbackSavedDocuments } from "./middlewares/rollback-saved-Documents.js";
import { rollbackUploadedFiles } from "./middlewares/rollback-uploaded-files.middleware.js";
import * as Routers from "./modules/index.routes.js";
import cors from "cors";
import cloudinaryConnection from "./utils/cloudinary.js";

export const initiateApp = (app, express) => {
  const port = +process.env.port || 3000;

  app.use(express.json());

  app.use(cors());

  app.use("/api/user", Routers.userRouter);
  app.use("/api/product", Routers.productRouter);
  app.use("/api/cart", Routers.cartRouter);
  app.use("/api/order", Routers.orderRouter);
  app.use("*", (req, res, next) => {
    res.status(404).json({ message: "Not Found" });
  });

  app.use(globalResponse, rollbackUploadedFiles, rollbackSavedDocuments);

  db_connection();
  cloudinaryConnection();
  app.listen(port, () => {
    console.log(`app listening on ${port}`);
  });
};
