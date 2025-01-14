import express from "express";
import tryCatch from "../utils/trycatch";
import { markAsRead, myNotification } from "../services/notificationServices";
const router = express.Router();

router.route("/:u_id").get(tryCatch(myNotification));
router.route("/mark_as_read/:n_id").patch(tryCatch(markAsRead));

export default router;