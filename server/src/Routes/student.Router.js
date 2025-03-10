import express from 'express';
export const studentRouter = express.Router();
import { upload, verifyJwt } from '../middlewares/index.js';

import {
    registerUser,
    loginUser,
    logoutUser,
    deleteAccount,
    updateAccountDetails,
    updateAvatar,
    updatePassword,
    getCurrentUser,
    getOrderHistory,
} from '../Controllers/student.Controller.js';

studentRouter
    .route('/register')
    .post(upload.fields([{ name: 'avatar', maxCount: 1 }]), registerUser);

studentRouter.route('/login').post(loginUser);

studentRouter.use(verifyJwt);

studentRouter.route('/logout').patch(logoutUser);

studentRouter.route('/delete').delete(deleteAccount);

studentRouter.route('/current').get(getCurrentUser);

studentRouter.route('/account').patch(updateAccountDetails);

studentRouter.route('/password').patch(updatePassword);

studentRouter.route('/avatar').patch(upload.single('avatar'), updateAvatar);

studentRouter.route('/history').get(getOrderHistory);
