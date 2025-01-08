import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        // console.log(file.originalname, "  ||  ", ext);

        if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
            return cb(new Error("Only images allowed"));
        }
        cb(null, true);
    },
});
