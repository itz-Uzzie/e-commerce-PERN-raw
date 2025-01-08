import { createServer } from "http";
import { Server } from "socket.io";
import db from "./db";
import cors from 'cors';
import userController from './controllers/userController';
import cartController from './controllers/cartController';
import orderController from './controllers/orderController';
import errorMiddleware from "./middleware/errorMiddleware";
import saleController from "./controllers/saleController";
import adminController from "./controllers/adminController";
import productController from './controllers/productController';
import categoryController from './controllers/categoryController';
import express, { NextFunction, Request, Response } from "express";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
    }
});
app.use((req, res, next) => {
    if (req.path.startsWith("/api/v1/product/new")) {
        next();
    } else {
        express.json()(req, res, next);
    }
})
app.use(cors({
    origin: "http://localhost:5173",
    methods: "POST, GET, PUT, PATCH, DELETE",
    credentials: true
}));

app.use("/api/v1/user", userController);
app.use("/api/v1/cart", cartController);
app.use("/api/v1/order", orderController);
app.use("/api/v1/sales", saleController);
app.use("/api/v1/admin", adminController);
app.use("/api/v1/product", productController);
app.use("/api/v1/category", categoryController);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorMiddleware(err, req, res, next);
});

io.on('connection', (socket) => {
    console.log("User connected : ", socket.id);
    socket.on("orderplaced", (orderData) => {
        io.emit("updateOrderStatus", orderData)
    });
    socket.on('disconnect', () => {
        console.log("User disconnected");
    })
})

const PORT = 4000;

db.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`app is running on port ${PORT}`);
    });
});