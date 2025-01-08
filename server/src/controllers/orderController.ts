import express from "express";
import tryCatch from "../utils/trycatch";
import { myorders, placeOrder } from "../services/orderServices";

const router = express.Router();

router.route("/placeorder/:u_id").post(tryCatch(placeOrder));
router.route("/myorders/:u_id").get(tryCatch(myorders));

export default router;