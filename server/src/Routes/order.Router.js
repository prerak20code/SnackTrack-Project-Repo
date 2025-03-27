import express from 'express';
export const orderRouter = express.Router();
import { verifyJwt } from '../Middlewares/index.js';

import {
    getStudentOrders,
    getCanteenOrders,
    placeOrder,
    changeOrderStatus,
} from '../Controllers/order.Controller.js';

orderRouter.use(verifyJwt);

orderRouter.route('/:orderId').patch(changeOrderStatus);

orderRouter.route('/:studentId').get(getStudentOrders);

orderRouter.route('/').get(getCanteenOrders).post(placeOrder);
