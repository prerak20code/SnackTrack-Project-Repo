import express from 'express';
export const adminRouter = express.Router();
import { upload, verifyJwt } from '../Middlewares/index.js';

import {
    login,
    register,
    updateAccountDetails,
    updatePassword,
    updateAvatar,
    registerContractor,
    changeContractor,
    getContractor,
    addCanteen,
    removeCanteen,
    getCanteens,
} from '../Controllers/admin.Controller.js';

adminRouter.route('/register').post(register);
adminRouter.route('/login').post(login);

adminRouter.use(verifyJwt);

// personal usage
adminRouter.route('/account').patch(updateAccountDetails);
adminRouter.route('/password').patch(updatePassword);
adminRouter.route('/avatar').patch(upload.single('avatar'), updateAvatar);

// contractor management tasks
adminRouter
    .route('/contractors/:canteenId')
    .post(registerContractor)
    .patch(changeContractor)
    .get(getContractor);

// canteen management tasks
adminRouter
    .route('/canteens')
    .get(getCanteens)
    .post(addCanteen)
    .delete(removeCanteen);
