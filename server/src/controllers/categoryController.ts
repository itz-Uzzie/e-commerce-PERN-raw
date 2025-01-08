import express from "express";
import { addCategory, allCategories } from "../services/categoryServices";
import tryCatch from "../utils/trycatch";
const router = express.Router();

router.route("/new").post(tryCatch(addCategory));
router.route("/all").get(tryCatch(allCategories));

export default router;