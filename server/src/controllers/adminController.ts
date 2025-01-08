import express from "express";
import tryCatch from "../utils/trycatch";
import { allusers } from "../services/adminServices";
import { adminMiddleware, authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();

router.route("/allusers").get(authMiddleware, adminMiddleware, tryCatch(allusers));

export default router;