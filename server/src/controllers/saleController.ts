import express from 'express';
import tryCatch from '../utils/trycatch';
import { mysales } from '../services/saleServices';
const router = express.Router();

router.route('/:u_id').get(tryCatch(mysales));

export default router;