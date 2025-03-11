import express from 'express';
export const studentRouter = express.Router();
import { upload, verifyJwt } from '../middlewares/index.js';

import {
    registerStudent,
    loginStudent,
    logoutStudent,
    deleteAccount,
    updateAccountDetails,
    updateAvatar,
    updatePassword,
    getCurrentStudent,
    getOrderHistory,
} from '../Controllers/student.Controller.js';

studentRouter
    .route('/register')
    .post(upload.fields([{ name: 'avatar', maxCount: 1 }]), registerStudent);

studentRouter.route('/login').post(loginStudent);

studentRouter.use(verifyJwt);

studentRouter.route('/logout').patch(logoutStudent);

studentRouter.route('/delete').delete(deleteAccount);

studentRouter.route('/current').get(getCurrentStudent);

studentRouter.route('/account').patch(updateAccountDetails);

studentRouter.route('/password').patch(updatePassword);

studentRouter.route('/avatar').patch(upload.single('avatar'), updateAvatar);

studentRouter.route('/history').get(getOrderHistory);
