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
import { Student, Canteen, Hostel } from '../Models/index.js';

// under contractor
const register = tryCatch('register as student', async (req, res, next) => {
    try {
        const contractor = req.user; // only contractor can register a student
        const data = {
            fullName: req.body.fullName.trim(),
            rollNo: req.body.rollNo.trim(),
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
        };

        // input error handling
        if (!fullName || !rollNo || !phoneNumber || !password) {
            return next(new ErrorHandler('missing fields', BAD_REQUEST));
        }
        for (const [key, value] of Object.entries(data)) {
            const isValid = verifyExpression(key, value);
            if (!isValid) {
                return next(
                    new ErrorHandler(`${key} is invalid.`, BAD_REQUEST)
                );
            }
        }

        // check if user already exists with this roll no
        const existingStudent = await Student.findOne({ rollNo: data.rollNo });
        if (existingStudent) {
            return next(new ErrorHandler('user already exists', BAD_REQUEST));
        }

        data.hostelId = (
            await Canteen.findById(contractor.canteenId)
        )?.hostelId;

        // hash the password (auto done by pre hook in model)

        // generate tokens
        const { accessToken, refreshToken } = await generateTokens(student);
        data.refreshToken = refreshToken;

        const student = await Student.create(data);

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
            .json(student);
    } catch (err) {
        throw err;
    }
});

const removeAll = tryCatch('remove all students', async (req, res, next) => {
    const { canteenId } = req.params;
    const contractor = req.user;
    const canteen = await Canteen.findById(canteenId);
    if (canteen.contractorId !== contractor._id) {
        return next(new ErrorHandler('unauthorized access', BAD_REQUEST));
    }

    await Student.deleteMany({ hostelId: canteen.hostelId });

    return res
        .status(OK)
        .json({ message: 'all students removed successfully' });
});

const remove = tryCatch('remove student account', async (req, res, next) => {
    const { canteenId, studentId } = req.params;
    const contractor = req.user;

    const [canteen, student] = await Promise.all([
        Canteen.findById(canteenId),
        Student.findById(studentId),
    ]);
    if (!student) {
        return next(new ErrorHandler('student not found', NOT_FOUND));
    }
    // a contractor can remove the student only if the student belongs to his canteen
    if (
        !canteen.contractorId !== contractor._id ||
        canteen.hostelId !== student.hostelId
    ) {
        return next(new ErrorHandler('unauthorized access', BAD_REQUEST));
    }

    if (student.avatar) await deleteFromCloudinary(student.avatar);

    await Student.findByIdAndDelete(studentId);

    return res.status(OK).json({ message: 'student removed successfully' });
});

const updateAccountDetails = tryCatch(
    'update account details',
    async (req, res, next) => {
        const contractor = req.user;
        const { fullName, phoneNumber, rollNo, password } = req.body;

        const isPassValid = bcrypt.compareSync(password, req.user.password);
        if (!isPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        const canteen = await Canteen.findById(contractor.canteenId);
        const student = await Student.findOne({
            rollNo,
            hostelId: canteen.hostelId,
        });
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

// under student (personal)
const login = tryCatch('login as student', async (req, res, next) => {
    const { rollNo, password, hostelNo, hostelType } = req.body;

    if (!rollNo || !password || !hostelNo || !hostelType) {
        return next(new ErrorHandler('missing fields', BAD_REQUEST));
    }

    const hostel = await Hostel.findOne({ hostelNo, hostelType });
    if (!hostel) {
        return next(new ErrorHandler('hostel not found', NOT_FOUND));
    }

    const student = await Student.findOne({ rollNo, hostelId: hostel._id });
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
    const loggedInStudent = await Student.findByIdAndUpdate(student._id, {
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
        const student = req.user;
        if (!req.file) {
            return next(new ErrorHandler('missing avatar', BAD_REQUEST));
        }

        // upload new avatar on cloudinary
        avatarURL = await uploadOnCloudinary(req.file.path);
        avatarURL = avatarURL.secure_url;

        // update user avatar
        const updatedStudent = await Student.updateAvatar(
            student._id,
            avatarURL
        );

        // delete old avatar
        if (updatedStudent && student.avatar) {
            await deleteFromCloudinary(student.avatar);
        }

        return res.status(OK).json(updatedStudent);
    } catch (err) {
        if (avatarURL) await deleteFromCloudinary(avatarURL);
        throw err;
    }
});

export {
    register,
    login,
    remove,
    removeAll,
    updateAccountDetails,
    updateAvatar,
    updatePassword,
};
