import express from "express";
import tryCatch from "../utils/trycatch";
import { adminMiddleware, authMiddleware } from "../middleware/authMiddleware";
import { allorders, allusers, payment_approved } from "../services/adminServices";
import { removeUser } from "../services/userServices";
const router = express.Router();

router.route("/allusers").get(authMiddleware, adminMiddleware, tryCatch(allusers));
router.route("/allorders").get(authMiddleware, adminMiddleware, tryCatch(allorders));
router.route("/removeuser/:u_id").delete(authMiddleware, adminMiddleware, tryCatch(removeUser));
router.route("/payment/approve/:o_id").get(authMiddleware, adminMiddleware, tryCatch(payment_approved));

export default router;