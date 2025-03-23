import express from 'express';
export const adminRouter = express.Router();

import {
    getCanteens,
    verifyAdminKey,
    changeContractor,
    removeContractor,
} from '../Controllers/admin.Controller.js';

adminRouter.route('/verify-key').post(verifyAdminKey);

adminRouter
    .route('/contractors/:canteenId')
    .delete(removeContractor)
    .patch(changeContractor);

adminRouter.route('/').get(getCanteens);
