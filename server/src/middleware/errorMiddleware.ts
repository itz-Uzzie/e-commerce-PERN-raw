import { NextFunction, Request, Response } from "express";

interface customError extends Error {
    status?: number;
}
const errorMiddleware = (
    err: customError,
    req: Request,
    res: Response,
    next: NextFunction
):void => {
    const status = err.status || 400;
    const message = err.message || "something went wrong in backend";
    res.status(status).json({ msg: message });
};

export default errorMiddleware;