import express from 'express';
export const adminRouter = express.Router();
import { verifyAdminKeyJwt } from '../Middlewares/index.js';
import { OK } from '../Constants/index.js';
import {
    getCanteens,
    verifyKey,
    changeContractor,
    removeContractor,
} from '../Controllers/admin.Controller.js';

adminRouter.route('/verify-key').post(verifyKey);

adminRouter.use(verifyAdminKeyJwt);

adminRouter.route('/verify').get((req, res) =>
    res.status(OK).json({
        message: req.adminVerified ? 'verified' : 'unverified',
    })
);

adminRouter
    .route('/contractors/:canteenId')
    .delete(removeContractor)
    .patch(changeContractor);

adminRouter.route('/').get(getCanteens);
