import express from 'express';
export const userRouter = express.Router();
import { verifyJwt } from '../Middlewares/index.js';
import {
    getCurrentUser,
    logout,
    getCanteens,
} from '../Controllers/user.Controller.js';

userRouter.route('/canteens').get(getCanteens);

userRouter.use(verifyJwt);

userRouter.route('/current').get(getCurrentUser);

userRouter.route('/logout').patch(logout);
