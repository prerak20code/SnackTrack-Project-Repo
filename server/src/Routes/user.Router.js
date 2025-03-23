import express from 'express';
export const userRouter = express.Router();
import { verifyJwt, upload } from '../Middlewares/index.js';
import {
    updateAvatar,
    updatePassword,
    getCurrentUser,
    logout,
    getCanteens,
    login,
} from '../Controllers/user.Controller.js';

userRouter.route('/canteens').get(getCanteens);

userRouter.route('/login').patch(login);

userRouter.use(verifyJwt);

userRouter.route('/password').patch(updatePassword);

userRouter.route('/avatar').patch(upload.single('avatar'), updateAvatar);

userRouter.route('/current').get(getCurrentUser);

userRouter.route('/logout').patch(logout);
