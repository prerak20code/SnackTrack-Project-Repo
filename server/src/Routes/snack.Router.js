import express from 'express';
export const snackRouter = express.Router();

import {
    getSnacks,
    getPackagedFoodItems,
    getTopSnacks,
} from '../Controllers/snack.Controller.js';
import { verifyJwt } from '../Middlewares/index.js';

snackRouter.use(verifyJwt);

snackRouter.route('/packaged').get(getPackagedFoodItems);
snackRouter.route('/').get(getSnacks);
snackRouter.route('/top-snacks').get(getTopSnacks);
