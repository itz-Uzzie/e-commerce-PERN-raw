import tryCatch from "../utils/trycatch";
import { Router } from "express";
import { validateUser } from "../utils/Validators";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateMiddleware } from "../middleware/validateMiddleware";
import { signup, login, profile, removeUser, updPassword } from "../services/userServices";

const router = Router();

router.route("/login").post(tryCatch(login));
router.route("/signup").post(validateUser, validateMiddleware, tryCatch(signup));
router.route("/profile/:u_id").get(authMiddleware, tryCatch(profile));
router.route("/updPass/:u_id").patch(authMiddleware, tryCatch(updPassword));
router.route("/remove/:u_id").delete(authMiddleware, tryCatch(removeUser));

export default router;
