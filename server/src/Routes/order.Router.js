import express from 'express';
export const orderRouter = express.Router();
import { upload, verifyJwt } from '../Middlewares/index.js';

import {
    getOrderHistory,
    placeOrder,
} from '../Controllers/order.Controller.js';

orderRouter.use(verifyJwt);

orderRouter.route('/order').post(placeOrder);

orderRouter.route('/history').get(getOrderHistory);
