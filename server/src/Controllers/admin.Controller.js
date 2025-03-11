import {
    OK,
    BAD_REQUEST,
    NOT_FOUND,
    COOKIE_OPTIONS,
} from '../Constants/index.js';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { verifyExpression, tryCatch, ErrorHandler } from '../Utils/index.js';
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
    generateTokens,
} from '../Helpers/index.js';
import { Admin } from '../Models/index.js';

// personal
const register = tryCatch('register as admin', async (req, res, next) => {});

const login = tryCatch('login student', async (req, res, next) => {});

const updateAccountDetails = tryCatch(
    'update account details',
    async (req, res, next) => {}
);

const updatePassword = tryCatch(
    'update password',
    async (req, res, next) => {}
);

const updateAvatar = tryCatch('update avatar', async (req, res, next) => {});

export { register, login, updateAccountDetails, updatePassword, updateAvatar };
