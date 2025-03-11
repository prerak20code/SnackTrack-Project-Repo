import {
    OK,
    BAD_REQUEST,
    NOT_FOUND,
    COOKIE_OPTIONS,
} from '../Constants/index.js';
import bcrypt from 'bcrypt';
import { verifyExpression, tryCatch, ErrorHandler } from '../Utils/index.js';
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
    generateTokens,
} from '../Helpers/index.js';
import { Contractor, Canteen } from '../Models/index.js';

// under admin
const register = tryCatch('register as contractor', async (req, res, next) => {
    try {
        const data = {
            fullName: req.body.fullName.trim(),
            email: req.body.email.trim(),
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
        };

        const { canteenId } = req.params;

        // input error handling
        if (!fullName || !email || !phoneNumber || !password || !canteenId) {
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
});

const change = tryCatch('change contractor', async (req, res, next) => {
    try {
        const data = {
            fullName: req.body.fullName.trim(),
            email: req.body.email.trim(),
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            refreshToken: '',
        };

        const { contractorId } = req.params;

        // input error handling
        if (!fullName || !email || !phoneNumber || !contractorId) {
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

        const contractor = await Contractor.findById(contractorId);
        if (!contractor) {
            return next(new ErrorHandler('contractor not found', NOT_FOUND));
        }

        // update contractor details
        const updatedContractor = await Contractor.findByIdAndUpdate(
            contractorId,
            data,
            { new: true }
        );
        return res.status(OK).json(updatedContractor);
    } catch (err) {
        if (avatarURL) await deleteFromCloudinary(avatarURL);
        throw err;
    }
});

// under contractor (personal)
const login = tryCatch('login as contractor', async (req, res, next) => {
    const { emailOrPhoneNo, password } = req.body;

    if (!emailOrPhoneNo || !password) {
        return next(new ErrorHandler('missing fields', BAD_REQUEST));
    }

    const contractor = await Contractor.findOne({
        $or: [{ email: emailOrPhoneNo }, { phoneNumber: emailOrPhoneNo }],
    });
    if (!contractor) {
        return next(new ErrorHandler('contractor not found', NOT_FOUND));
    }

    const isPassValid = bcrypt.compareSync(password, contractor.password);
    if (!isPassValid) {
        return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
    }

    // generate tokens
    const { accessToken, refreshToken } = await generateTokens(contractor);

    const loggedInContractor = await Contractor.findByIdAndUpdate(
        contractor._id,
        {
            $set: { refreshToken },
        }
    ).select('-password -refreshToken');

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
        .json(loggedInContractor);
});

const updateAccountDetails = tryCatch(
    'update account details',
    async (req, res, next) => {
        const { fullName, phoneNumber, email, password } = req.body;

        // input error handling
        if (!fullName || !email || !phoneNumber) {
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

        const isPassValid = bcrypt.compareSync(password, req.user.password);
        if (!isPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        const contractor = await Contractor.findById(req.user._id);

        contractor.email = email || contractor.email;
        contractor.phoneNumber = phoneNumber || contractor.phoneNumber;
        contractor.fullName = fullName || contractor.fullName;
        await contractor.save();

        return res.status(OK).json(contractor);
    }
);

const updatePassword = tryCatch('update password', async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    const isPassValid = bcrypt.compareSync(oldPassword, req.user.password);
    if (!isPassValid) {
        return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
    }

    const isValid = verifyExpression('password', newPassword);
    if (!isValid) {
        return next(new ErrorHandler('invalid password', BAD_REQUEST));
    }

    // hash new password
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

    await Contractor.findByIdAndUpdate(req.user._id, {
        $set: { password: hashedNewPassword },
    });

    return res.status(OK).json({ message: 'password updated successfully' });
});

const updateAvatar = tryCatch('update avatar', async (req, res, next) => {
    let avatarURL;
    try {
        const { _id, avatar } = req.user;
        if (!req.file) {
            return next(new ErrorHandler('missing avatar', BAD_REQUEST));
        }

        // upload new avatar on cloudinary
        avatarURL = await uploadOnCloudinary(req.file.path);
        avatarURL = avatarURL.secure_url;

        // update user avatar
        const updatedContractor = await Contractor.updateAvatar(_id, avatarURL);

        // delete old avatar
        if (updatedContractor && avatar) await deleteFromCloudinary(avatar);
        return res.status(OK).json(updatedContractor);
    } catch (err) {
        if (avatarURL) await deleteFromCloudinary(avatarURL);
        throw err;
    }
});

export {
    register,
    change,
    login,
    updateAccountDetails,
    updatePassword,
    updateAvatar,
};
