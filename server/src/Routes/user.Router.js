import express from 'express';
export const userRouter = express.Router();
import { verifyJwt } from '../Middlewares/index.js';
import { getCurrentUser } from '../Controllers/user.Controller.js';

userRouter.use(verifyJwt);
userRouter.route('/current').get(getCurrentUser);
