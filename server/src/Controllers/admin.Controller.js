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
import { Admin, Contractor, Canteen } from '../Models/index.js';

// personal usage
const register = tryCatch('register as admin', async (req, res, next) => {});

const login = tryCatch('login student', async (req, res, next) => {});

const updateAccountDetails = tryCatch(
    'update account details',
    async (req, res, next) => {}
);

const updatePassword = tryCatch(
    'update password',
    async (req, res, next) => {
        const { oldPassword, newPassword } = req.body;
        const admin = req.user;

        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler('missing fields', BAD_REQUEST));
        }

        const isPassValid = bcrypt.compareSync(oldPassword, admin.password);
        if (!isPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        const updatedAdmin = await Admin.findByIdAndUpdate(
            admin._id,
            { password: hashedPassword },
            { new: true }
        ).select('-password');
        return res.status(OK).json(updatedAdmin);
    }
);

const updateAvatar = tryCatch('update avatar', async (req, res, next) => {});

// contractor management tasks
const registerContractor = tryCatch(
    'register as contractor',
    async (req, res, next) => {
        try {
            const data = {
                fullName: req.body.fullName.trim(),
                email: req.body.email.trim(),
                phoneNumber: req.body.phoneNumber,
                password: req.body.password,
            };

            const { canteenId } = req.params;

            // input error handling
            if (
                !fullName ||
                !email ||
                !phoneNumber ||
                !password ||
                !canteenId
            ) {
                return next(new ErrorHandler('missing fields', BAD_REQUEST));
            }
            for (const [key, value] of Object.entries(data)) {
                if (value) {
                    const isValid = verifyExpression(key, value);
                    if (!isValid) {
                        return next(
                            new ErrorHandler(`${key} is invalid.`, BAD_REQUEST)
                        );
                    }
                }
            }

            const canteen = await Canteen.findById(canteenId);
            if (!canteen) {
                return next(new ErrorHandler('canteen not found', NOT_FOUND));
            }

            // since a canteen can have only one contractor
            if (canteen.contractorId) {
                return next(
                    new ErrorHandler(
                        'canteen already has a contractor',
                        BAD_REQUEST
                    )
                );
            }

            // hash the password (auto done by pre hook in model)

            const contractor = await Contractor.create(data);
            canteen.contractorId = contractor._id;
            await canteen.save();
            return res.status(OK).json(contractor);
        } catch (err) {
            throw err;
        }
    }
);

const changeContractor = tryCatch(
    'change contractor',
    async (req, res, next) => {
        try {
            const data = {
                fullName: req.body.fullName.trim(),
                email: req.body.email.trim(),
                phoneNumber: req.body.phoneNumber,
                password: req.body.password,
                refreshToken: '',
            };

            const { canteenId } = req.params;

            // input error handling
            if (!fullName || !email || !phoneNumber || !canteenId) {
                return next(new ErrorHandler('missing fields', BAD_REQUEST));
            }
            for (const [key, value] of Object.entries(data)) {
                if (value) {
                    const isValid = verifyExpression(key, value);
                    if (!isValid) {
                        return next(
                            new ErrorHandler(`${key} is invalid.`, BAD_REQUEST)
                        );
                    }
                }
            }

            const canteen = await Canteen.findById(canteenId);
            if (!canteen) {
                return next(new ErrorHandler('canteen not found', NOT_FOUND));
            }

            // update contractor details
            const updatedContractor = await Contractor.findByIdAndUpdate(
                canteen.contractorId,
                data,
                { new: true }
            );
            return res.status(OK).json(updatedContractor);
        } catch (err) {
            if (avatarURL) await deleteFromCloudinary(avatarURL);
            throw err;
        }
    }
);

const getContractor = tryCatch('get contractor', async (req, res, next) => {
    const contractor = await Canteen.find({ contractor: { $ne: null } });
    return res.status(OK).json(contractor);
});

// canteen management tasks
const addCanteen = tryCatch('add canteen', async (req, res, next) => {});

const removeCanteen = tryCatch('remove canteen', async (req, res, next) => {});

// hostel management tasks
const getCanteens = tryCatch('get canteens', async (req, res, next) => {});

const addHostel = tryCatch('add hostel', async (req, res, next) => {});

const removeHostel = tryCatch('remove hostel', async (req, res, next) => {});

export {
    login,
    updateAccountDetails,
    updatePassword,
    updateAvatar,
    registerContractor,
    changeContractor,
    getContractor,
    addCanteen,
    removeCanteen,
    getCanteens,
    addHostel,
    removeHostel,
    register,
};
