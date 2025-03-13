import express from 'express';
export const orderRouter = express.Router();
import { upload, verifyJwt } from '../Middlewares/index.js';

import {
    getOrderHistory,
    placeOrder,
    markOrderAsDelivered,
} from '../Controllers/order.Controller.js';

orderRouter.use(verifyJwt);

orderRouter.route('/order').post(placeOrder);

orderRouter.route('/history').get(getOrderHistory);

orderRouter.route('/:orderId').patch(markOrderAsDelivered);
