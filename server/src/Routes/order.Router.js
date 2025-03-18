import express from 'express';
export const orderRouter = express.Router();
import { upload, verifyJwt } from '../Middlewares/index.js';

import {
    getOrders,
    placeOrder,
    changeOrderStatus,
    addToCart,
    removeFromCart,
} from '../Controllers/order.Controller.js';

orderRouter.use(verifyJwt);

orderRouter.route('/cart').post(addToCart).delete(removeFromCart);

orderRouter.route('/place').post(placeOrder);

orderRouter.route('/history').get(getOrders);

orderRouter.route('/:orderId').patch(changeOrderStatus);
