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
// register as admin
const register = tryCatch('register as admin', async (req, res, next) => {
    const { fullName, email, phoneNumber, password } = req.body;

    // Input validation
    if (!fullName || !email || !phoneNumber || !password) {
        return next(new ErrorHandler('missing fields', BAD_REQUEST));
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
        $or: [{ email }, { phoneNumber }],
    });
    if (existingAdmin) {
        return next(new ErrorHandler('admin already exists', BAD_REQUEST));
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new admin
    const admin = await Admin.create({
        fullName,
        email,
        phoneNumber,
        password: hashedPassword,
    });

    return res.status(OK).json({
        message: 'Admin registered successfully',
        admin,
    });
});
// login as admin
const login = tryCatch('login as admin', async (req, res, next) => {
    const { emailOrPhoneNo, password } = req.body;

    // Validate input fields
    if (!emailOrPhoneNo || !password) {
        return next(new ErrorHandler('missing fields', BAD_REQUEST));
    }

    // Find admin by email or phone number
    const admin = await Admin.findOne({
        $or: [{ email: emailOrPhoneNo }, { phoneNumber: emailOrPhoneNo }],
    });

    if (!admin) {
        return next(new ErrorHandler('admin not found', NOT_FOUND));
    }

    // Verify password
    const isPassValid = bcrypt.compareSync(password, admin.password);
    if (!isPassValid) {
        return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens({
        _id: admin._id,
        role: 'admin',
    });

    // Save refresh token in the database
    const loggedInAdmin = await Admin.findByIdAndUpdate(admin._id, {
        $set: { refreshToken },
    }).select('-password -refreshToken');

    // Set tokens as cookies and return response
    return res
        .status(OK)
        .cookie('snackTrack_accessToken', accessToken, {
            ...COOKIE_OPTIONS,
            maxAge: parseInt(process.env.ACCESS_TOKEN_MAXAGE),
        })
        .cookie('snackTrack_refreshToken', refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: parseInt(process.env.REFRESH_TOKEN_MAXAGE),
        })
        .json({ ...loggedInAdmin, role: 'admin' });
});

const updateAccountDetails = tryCatch(
    'update account details',
    async (req, res, next) => {}
);

const updatePassword = tryCatch(
    'update password',
    async (req, res, next) => {}
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

            const contractor = await Contractor.create({
                ...data,
                canteenId: canteen._id,
            });
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
            return res
                .status(OK)
                .json({
                    message: 'Contractor details updated successfully',
                    updatedContractor,
                });
        } catch (err) {
            if (avatarURL) await deleteFromCloudinary(avatarURL);
            throw err;
        }
    }
);

// update contractor password if forget
const updateContractorPassword = tryCatch(
    'update contractor password',
    async (req, res, next) => {
        const { contractorId, newPassword } = req.body;

        if (!contractorId || !newPassword) {
            return next(new ErrorHandler('missing fields', BAD_REQUEST));
        }

        // Find contractor
        const contractor = await Contractor.findById(contractorId);
        if (!contractor) {
            return next(new ErrorHandler('contractor not found', NOT_FOUND));
        }

        // Validate new password format
        const isValid = verifyExpression('password', newPassword);
        if (!isValid) {
            return next(
                new ErrorHandler('invalid password format', BAD_REQUEST)
            );
        }

        // Hash new password
        contractor.password = bcrypt.hashSync(newPassword, 10);
        await contractor.save();

        return res
            .status(OK)
            .json({ message: 'Contractor password updated successfully' });
    }
);

// get all contractors
const getContractor = tryCatch('get contractors', async (req, res) => {
    const { limit = 10, page = 1 } = req.query; // Pagination

    const result = await Contractor.aggregatePaginate(
        [
            { $match: {} }, // Fetch all contractors
            { $project: { password: 0, refreshToken: 0 } }, // Exclude sensitive fields
        ],
        {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
        }
    );

    if (result.docs.length) {
        const data = {
            contractors: result.docs,
            contractorsInfo: {
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                totalContractors: result.totalDocs,
            },
        };
        return res.status(200).json(data);
    } else {
        return res.status(200).json({ message: 'No contractors found' });
    }
});

// canteen management tasks
const addCanteen = tryCatch('add canteen', async (req, res, next) => {});

const removeCanteen = tryCatch('remove canteen', async (req, res, next) => {});

// hostel management tasks
const getCanteens = tryCatch('get canteens', async (req, res) => {
    const { limit = 10, page = 1 } = req.query; // Pagination

    const result = await Canteen.aggregatePaginate(
        [
            { $match: {} }, // Fetch all canteens
            {
                $lookup: {
                    from: 'hostels',
                    localField: 'hostelId',
                    foreignField: '_id',
                    as: 'hostelInfo',
                },
            },
            {
                $unwind: {
                    path: '$hostelInfo',
                    preserveNullAndEmptyArrays: true,
                },
            }, // Keeps canteens even if no hostel is linked
            {
                $project: {
                    name: 1,
                    location: 1,
                    contractor: 1,
                    'hostelInfo.type': 1,
                    'hostelInfo.number': 1,
                },
            },
        ],
        {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
        }
    );

    if (result.docs.length) {
        const data = {
            canteens: result.docs,
            canteensInfo: {
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                totalCanteens: result.totalDocs,
            },
        };
        return res.status(200).json(data);
    } else {
        return res.status(200).json({ message: 'No canteens found' });
    }
});

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
    register,
};
