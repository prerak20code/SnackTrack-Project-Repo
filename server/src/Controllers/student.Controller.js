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
import { Canteen, Student } from '../Models/index.js';

const login = tryCatch('login as student', async (req, res, next) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return next(new ErrorHandler('missing fields', BAD_REQUEST));
    }

    const student = await Student.findOne({ userName });
    if (!student) {
        return next(new ErrorHandler('student not found', NOT_FOUND));
    }

    const isPassValid = bcrypt.compareSync(password, student.password);
    if (!isPassValid) {
        return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
    }

    // generate tokens
    const { accessToken, refreshToken } = await generateTokens({
        _id: student._id,
        role: 'student',
    });

    // login user
    const [loggedInStudent, canteen] = await Promise.all([
        Student.findByIdAndUpdate(student._id, {
            $set: { refreshToken },
        })
            .select('-password -refreshToken')
            .lean(),
        Canteen.findById(student.canteenId)
            .select('hostelType hostelNumber hostelName')
            .lean(),
    ]);

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
        .json({ ...loggedInStudent, role: 'student', ...canteen });
});

const updatePassword = tryCatch('update password', async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const student = req.user;

    const isPassValid = bcrypt.compareSync(oldPassword, student.password);
    if (!isPassValid) {
        return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
    }

    const isValid = verifyExpression('password', newPassword);
    if (!isValid) {
        return next(new ErrorHandler('invalid password', BAD_REQUEST));
    }

    // hash new password
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

    await Student.findByIdAndUpdate(student._id, {
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
        const updatedStudent = await Student.findByIdAndUpdate(
            _id,
            {
                $set: { avatar: avatarURL },
            },
            { new: true }
        );

        // delete old avatar
        if (updatedStudent && avatar) {
            await deleteFromCloudinary(avatar);
        }

        return res.status(OK).json({ newAvatar: updatedStudent.avatar });
    } catch (err) {
        if (avatarURL) await deleteFromCloudinary(avatarURL);
        throw err;
    }
});

export { login, updateAvatar, updatePassword };
