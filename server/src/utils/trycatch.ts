import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../middleware/authMiddleware';

const tryCatch =
    (fn: (req: CustomRequest, res: Response, next: NextFunction) => Promise<any | Response | void>) =>
        (req: CustomRequest, res: Response, next: NextFunction) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };

export default tryCatch;
