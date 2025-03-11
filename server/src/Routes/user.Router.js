import express from 'express';
export const userRouter = express.Router();
import { verifyJwt } from '../Middlewares/index.js';
import { tryCatch } from '../Utils/index.js';
import { OK } from '../Constants/index.js';

userRouter.route('/current').get(
    verifyJwt,
    tryCatch('get current user', async (req, res, next) => {
        const { password, refreshToken, ...user } = req.user;
        return res.status(OK).json(user);
    })
);
