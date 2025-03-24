import express from 'express';
export const orderRouter = express.Router();
import { verifyJwt } from '../Middlewares/index.js';

import {
    getOrders,
    placeOrder,
    changeOrderStatus,
} from '../Controllers/order.Controller.js';

orderRouter.use(verifyJwt);

orderRouter.route('/:orderId').patch(changeOrderStatus);

orderRouter.route('/').get(getOrders).post(placeOrder);
