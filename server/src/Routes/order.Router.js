import express from 'express';
export const orderRouter = express.Router();
import { verifyJwt } from '../Middlewares/index.js';

import {
    getStudentOrders,
    getCanteenOrders,
    placeOrder,
    updateOrderStatus,
    getStudentMonthlyBill,
    getCanteenMonthlyBill,
    getCanteenStatistics,
} from '../Controllers/order.Controller.js';

orderRouter.use(verifyJwt);

orderRouter.route('/:orderId').patch(updateOrderStatus);

orderRouter.route('/:studentId').get(getStudentOrders);

orderRouter.route('/').get(getCanteenOrders).post(placeOrder);

orderRouter.get('/bills/student/:studentId', getStudentMonthlyBill);

orderRouter.get('/bills/canteen/:canteenId', getCanteenMonthlyBill);

orderRouter.get('/statistics/:canteenId', getCanteenStatistics);
