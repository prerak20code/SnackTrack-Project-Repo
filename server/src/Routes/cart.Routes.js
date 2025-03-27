import express from 'express';
export const cartRouter = express.Router();
import { upload, verifyJwt } from '../Middlewares/index.js';

import {
    addToCart,
    fetchCartItems,
    updateCartItemQty,
    deleteCartItem,
} from '../Controllers/cart.Controller.js';

cartRouter.use(verifyJwt);

cartRouter.route('/add').post(addToCart);

cartRouter.route('/cart').get(fetchCartItems);

cartRouter.route('/cart/:productId').patch(updateCartItemQty);

cartRouter.route('/cart/delete').delete(deleteCartItem);
