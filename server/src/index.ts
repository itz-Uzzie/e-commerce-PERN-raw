import { createServer } from "http";
import { Server } from "socket.io";
import db from "./db";
import cors from 'cors';
import userController from "./controllers/userController";
import cartController from "./controllers/cartController";
import saleController from "./controllers/saleController";
import errorMiddleware from "./middleware/errorMiddleware";
import orderController from "./controllers/orderController";
import adminController from "./controllers/adminController";
import productController from "./controllers/productController";
import categoryController from "./controllers/categoryController";
import express, { NextFunction, Request, Response } from "express";

const app = express();
const server = createServer(app);
export const io = new Server(server, {
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

const userSockets: { [key: string]: string } = {};

io.on('connection', (socket) => {
    const u_id = socket.handshake.query.u_id as string;

    if (u_id) {
        userSockets[u_id] = socket.id;
        console.log(`User ${u_id} connected with socket ID: ${socket.id}`);
    }

    socket.on('disconnect', () => {
        console.log(`User ${u_id} disconnected`);
        if (u_id) delete userSockets[u_id];
    });
})

const PORT = 4000;

db.connect().then(() => {
    db.query(`LISTEN sale_channel`);
    db.on('notification', (msg) => {
        const oi_id = msg.payload;
        db.query(`select * from notification where u_id = (select owner from product where
            p_id = (select p_id from order_items where oi_id = $1) )`, [oi_id]).then((result) => {
            if (result.rows.length > 0) {
                const notification = result.rows[0];
                const socketID = userSockets[notification.u_id];
                if (socketID) {
                    io.to(socketID).emit("new_notification", notification)
                }
            }
        }).catch((err) => console.log(`Error fetching notifications : `, err)
        )
    })
    app.listen(PORT, () => {
        console.log(`app is running on port ${PORT}`);
    });
});