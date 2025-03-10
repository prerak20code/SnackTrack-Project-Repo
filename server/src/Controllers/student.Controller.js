import { OK, BAD_REQUEST, NOT_FOUND } from '../Constants/errorCodes.js';
import { COOKIE_OPTIONS } from '../Constants/options.js';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { verifyExpression, tryCatch, ErrorHandler } from '../Utils/index.js';
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
    generateTokens,
} from '../Helpers/index.js';
import { Student } from '../Models/index.js';

const registerStudent = tryCatch('register student', async (req, res, next) => {
    let avatarURL;
    try {
        const data = {
            fullName: req.body.fullName.trim(),
            rollNo: req.body.rollNo.trim(),
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            avatar: req.files?.avatar?.[0].path,
        };

        // input error handling
        if (!fullName || !rollNo || !phoneNumber || !password) {
            return next(new ErrorHandler('missing fields', BAD_REQUEST));
        }
        for (const [key, value] of Object.entries(data)) {
            if (value) {
                const isAvatar = key === 'avatar';
                const isValid = verifyExpression(
                    isAvatar ? key : 'file',
                    value
                );
                if (!isValid) {
                    if (data.avatar) fs.unlinkSync(data.avatar);
                    return next(
                        new ErrorHandler(
                            isAvatar
                                ? `Only PNG, JPG/JPEG files are allowed for avatar, and the file size must be < 5MB.`
                                : `${key} is invalid.`,
                            BAD_REQUEST
                        )
                    );
                }
            }
        }

        // check if user already exists with this roll no
        const existingStudent = await Student.findOne({ rollNo: data.rollNo });
        if (existingStudent) {
            if (data.avatar) fs.unlinkSync(data.avatar);
            return next(new ErrorHandler('user already exists', BAD_REQUEST));
        }

        // upload avatar on cloudinary
        if (data.avatar) {
            data.avatar = await uploadOnCloudinary(data.avatar);
            data.avatar = data.avatar.secure_url;
            avatarURL = data.avatar;
        }

        // hash the password (auto done by pre hook in model)

        const student = await Student.create(data);
        return res.status(OK).json(student);
    } catch (err) {
        if (avatarURL) await deleteFromCloudinary(avatarURL);
        throw err;
    }
});

const loginStudent = tryCatch('login student', async (req, res, next) => {
    const { rollNo, password, hostelNo, hostelType } = req.body;

    if (!rollNo || !password || !hostelNo || !hostelType) {
        return next(new ErrorHandler('missing fields', BAD_REQUEST));
    }

    const canteen = await Canteen.findOne({ hostelNo, hostelType });
    if (!canteen) {
        return next(new ErrorHandler('canteen not found', NOT_FOUND));
    }

    const student = await Student.findOne({ rollNo, canteenId: canteen._id });
    if (!student) {
        return next(new ErrorHandler('student not found', NOT_FOUND));
    }
    const isPassValid = bcrypt.compareSync(password, student.password);
    if (!isPassValid) {
        return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
    }

    // generate tokens
    const { accessToken, refreshToken } = await generateTokens(student);

    // login user
    const loggedInStudent = await User.findByIdAndUpdate(student._id, {
        $set: { refreshToken },
    }).select('-password -refreshToken');

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
        .json(loggedInStudent);
});

const deleteAccount = tryCatch(
    'delete student account',
    async (req, res, next) => {
        const { password } = req.body;

        const isPassValid = bcrypt.compareSync(password, req.user.password);
        if (!isPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        if (req.user.avatar) await deleteFromCloudinary(req.user.avatar);

        await Student.findByIdAndDelete(req.user._id);

        return res
            .status(OK)
            .clearCookie('snackTrack_accessToken', COOKIE_OPTIONS)
            .clearCookie('snackTrack_refreshToken', COOKIE_OPTIONS)
            .json({ message: 'account deleted successfully' });
    }
);

const logoutStudent = tryCatch('logout student', async (req, res) => {
    await Student.findByIdAndUpdate(req.user?._id, {
        $set: { refreshToken: '' },
    });
    return res
        .status(OK)
        .clearCookie('snackTrack_accessToken', COOKIE_OPTIONS)
        .clearCookie('snackTrack_refreshToken', COOKIE_OPTIONS)
        .json({ message: 'student loggedout successfully' });
});

const getCurrentStudent = tryCatch('get Current student', (req, res) => {
    const { password, refreshToken, ...student } = req.user;
    return res.status(OK).json(student);
});

const updateAccountDetails = tryCatch(
    'update account details',
    async (req, res, next) => {
        const { fullName, phoneNumber, rollNo, password } = req.body;

        const isPassValid = bcrypt.compareSync(password, req.user.password);
        if (!isPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        const student = await Student.findById(req.user._id);

        if (!student) {
            return next(new ErrorHandler('student not found', NOT_FOUND));
        }
        student.rollNo = rollNo || student.rollNo;
        student.fullName = fullName || student.fullName;
        student.phoneNumber = phoneNumber || student.phoneNumber;
        await student.save();

        return res.status(OK).json(student);
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

    await Student.findByIdAndUpdate(req.user._id, {
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
        const updatedStudent = await Student.updateAvatar(_id, avatarURL);

        // delete old avatar
        if (updatedStudent && avatar) await deleteFromCloudinary(avatar);
        return res.status(OK).json(updatedStudent);
    } catch (err) {
        if (avatarURL) await deleteFromCloudinary(avatarURL);
        throw err;
    }
});

export {
    registerStudent,
    loginStudent,
    logoutStudent,
    deleteAccount,
    updateAccountDetails,
    updateAvatar,
    updatePassword,
    getCurrentStudent,
};
