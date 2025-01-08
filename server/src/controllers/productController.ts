import express from "express";
import tryCatch from "../utils/trycatch";
import { AllProducts, deleteProduct, newProduct, singleproduct } from "../services/productServices";
import { upload } from "../middleware/multer";
const router = express.Router();

router.route("/new/:u_id").post(upload.array("images", 5), tryCatch(newProduct));
router.route("/delete/:p_id").delete(tryCatch(deleteProduct));
router.route("/all").get(tryCatch(AllProducts));
router.route("/:p_id").get(tryCatch(singleproduct));

export default router;