import { Router } from "express";
import { getAllProducts } from "../controllers/productsController.js";

const productsRouter = Router();

productsRouter.route("/").get(getAllProducts);

export default productsRouter;
