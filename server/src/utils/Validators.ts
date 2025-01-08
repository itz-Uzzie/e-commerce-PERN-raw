import { body } from "express-validator";

export const validateUser = [
    body("name", "Enter a valid name").isLength({ min: 4 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be 4 characters long").isLength({ min: 4 }),
];

export const validateProduct = [
    body("name", "Enter a valid name").isLength({ min: 4 }),
    body("price", "Enter a valid price").isInt({ min: 100 }).toInt(),
    body("description", "Enter some description about your product").isLength({ min: 10 })
];