import express from 'express';
import tryCatch from '../utils/trycatch';
import { mysales, update_delivery_status } from '../services/saleServices';
const router = express.Router();

router.route('/:u_id').get(tryCatch(mysales));
router.route('/update/delivery/:oi_id').patch(tryCatch(update_delivery_status));

export default router;