import express from 'express';
export const contractorRouter = express.Router();
import { upload, verifyJwt } from '../middlewares/index.js';

import {
    login,
    updateAccountDetails,
    updatePassword,
    updateAvatar,
    registerNewStudent,
    removeAllStudents,
    removeStudent,
    updateStudentAccountDetails,
    addSnack,
    deleteSnack,
    updateSnackDetails,
    toggleSnackAvailability,
    addItem,
    deleteItem,
    updateItemDetails,
    toggleAvaialbleCount,
    markOrderAsDelivered,
} from '../Controllers/contractor.Controller.js';

contractorRouter.route('/login').post(login);

contractorRouter.use(verifyJwt);

// personal usage
contractorRouter.route('/account').patch(updateAccountDetails);
contractorRouter.route('/password').patch(updatePassword);
contractorRouter.route('/avatar').patch(upload.single('avatar'), updateAvatar);

// student management tasks
contractorRouter
    .route('/students')
    .post(registerNewStudent)
    .delete(removeAllStudents);
contractorRouter
    .route('/students/:studentId')
    .delete(removeStudent)
    .patch(updateStudentAccountDetails);

// snack management tasks
contractorRouter.route('/snacks').post(addSnack);
contractorRouter
    .route('/snacks/:snackId')
    .delete(deleteSnack)
    .patch(updateSnackDetails);
contractorRouter
    .route('/snacks/toggle/:snackId')
    .patch(toggleSnackAvailability);

// packaged food management tasks
contractorRouter.route('/packaged').post(addItem);
contractorRouter
    .route('/packaged/:itemId')
    .delete(deleteItem)
    .patch(updateItemDetails);
contractorRouter.route('/packaged/toggle/:itemId').patch(toggleAvaialbleCount);

// order management tasks
contractorRouter.route('/orders/:orderId').patch(markOrderAsDelivered);
