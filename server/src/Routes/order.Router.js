import express from 'express';
export const orderRouter = express.Router();
import { upload, verifyJwt } from '../Middlewares/index.js';

import { getOrderHistory } from '../Controllers/order.Controller.js';

orderRouter.route('/history').get(verifyJwt, getOrderHistory);
