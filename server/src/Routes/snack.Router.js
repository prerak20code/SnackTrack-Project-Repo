import express from 'express';
export const snackRouter = express.Router();
import { upload, verifyJwt } from '../Middlewares/index.js';

import {
    getSnacks,
    addSnack,
    deleteSnack,
    updateSnackDetails,
    updateSnackPrice,
    toggleAvailability,
} from '../Controllers/snack.Controller.js';

snackRouter.route('/:canteenId').get(getSnacks);

snackRouter.use(verifyJwt);

snackRouter.route('/add').post(upload.single('image'), addSnack);

snackRouter.route('/delete/:snackId').delete(deleteSnack);

snackRouter
    .route('/details/:snackId')
    .patch(upload.single('image'), updateSnackDetails);

snackRouter.route('/price/:snackId').patch(updateSnackPrice);

snackRouter.route('/availability/:snackId').patch(toggleAvailability);
