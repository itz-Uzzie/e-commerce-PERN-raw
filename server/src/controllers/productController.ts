import express from "express";
import tryCatch from "../utils/trycatch";
import { upload } from "../middleware/multer";
import { AllProducts, deleteProduct, myProducts, newProduct, singleproduct } from "../services/productServices";
const router = express.Router();

router.route("/all").get(tryCatch(AllProducts));
router.route("/delete/:p_id").delete(tryCatch(deleteProduct));
router.route("/myproducts/:u_id").get(tryCatch(myProducts));
router.route("/new/:u_id").post(upload.array("images", 5), tryCatch(newProduct));
router.route("/:p_id").get(tryCatch(singleproduct));

export default router;