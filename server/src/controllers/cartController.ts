import express from "express";
import tryCatch from "../utils/trycatch";
import { addtocart, mycart, removeFromCart } from "../services/cartServices";
const router = express.Router();

router.route("/mycart/:u_id").get(tryCatch(mycart));
router.route("/remove/:c_id/:p_id").delete(tryCatch(removeFromCart));
router.route("/addtocart/:u_id/:p_id").post(tryCatch(addtocart));

export default router;