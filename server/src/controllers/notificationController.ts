import express from "express";
import tryCatch from "../utils/trycatch";
import { myNotification } from "../services/notificationServices";
const router = express.Router();

router.route("/:u_id").get(tryCatch(myNotification));

export default router;