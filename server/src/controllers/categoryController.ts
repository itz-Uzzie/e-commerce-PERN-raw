import express from "express";
import tryCatch from "../utils/trycatch";
import { addCategory, allCategories } from "../services/categoryServices";
const router = express.Router();

router.route("/new").post(tryCatch(addCategory));
router.route("/all").get(tryCatch(allCategories));

export default router;