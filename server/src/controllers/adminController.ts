import express from "express";
import tryCatch from "../utils/trycatch";
import { allorders, allusers, payment_approved } from "../services/adminServices";
import { adminMiddleware, authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();

router.route("/allusers").get(authMiddleware, adminMiddleware, tryCatch(allusers));
router.route("/allorders").get(tryCatch(allorders));
router.route("/payment/approve/:o_id").get(tryCatch(payment_approved));

export default router;