import tryCatch from "../utils/trycatch";
import { Router } from "express";
import { validateUser } from "../utils/Validators";
import { validateMiddleware } from "../middleware/validateMiddleware";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";
import { signup, login, profile, removeUser, updPassword, testing } from "../services/userServices";

const router = Router();

router.route("/login").post(tryCatch(login));
router.route("/testing/:id").get(tryCatch(testing));
router.route("/signup").post(validateUser, validateMiddleware, tryCatch(signup));

// User Routes (Authenticated)
router.route("/profile/:id").get(authMiddleware, tryCatch(profile));
router.route("/updPass/:id").patch(authMiddleware, tryCatch(updPassword));

// Admin Routes
// router.route("/remove/:id").delete(authMiddleware, adminMiddleware, tryCatch(removeUser));
router.route("/remove/:id").delete(authMiddleware, tryCatch(removeUser));

export default router;
