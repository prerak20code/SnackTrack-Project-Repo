import express from 'express';
export const snackRouter = express.Router();

import {
    getSnacks,
    getPackagedFoodItems,
} from '../Controllers/snack.Controller.js';

snackRouter.route('/:canteenId').get(getSnacks);
snackRouter.route('/packaged/:canteenId').get(getPackagedFoodItems);
