import express from 'express';
export const studentRouter = express.Router();
import { upload, verifyJwt } from '../Middlewares/index.js';

import {
    login,
    updateAvatar,
    updatePassword,
} from '../Controllers/student.Controller.js';

studentRouter.route('/login').post(login);

studentRouter.use(verifyJwt);

studentRouter.route('/password').patch(updatePassword);
studentRouter.route('/avatar').patch(upload.single('avatar'), updateAvatar);
