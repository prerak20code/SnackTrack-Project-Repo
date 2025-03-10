import express from 'express';
export const snackRouter = express.Router();
import { upload, verifyJwt } from '../Middlewares/index.js';

import {
    getSnacks,
    addSnack,
    deleteSnack,
    updateSnackDetails,
    updateImage,
    toggleSnackAvailability,
} from '../Controllers/snack.Controller.js';

snackRouter.route('/:canteenId').get(getSnacks);

snackRouter.use(verifyJwt);

snackRouter.route('/add').post(upload.single('image'), addSnack);

snackRouter.route('/delete/:snackId').delete(deleteSnack);

snackRouter.route('/details/:snackId').patch(updateSnackDetails);

snackRouter.route('/image/:snackId').patch(upload.single('image'), updateImage);

snackRouter.route('/availability/:snackId').patch(toggleSnackAvailability);
