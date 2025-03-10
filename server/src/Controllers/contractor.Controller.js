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
import { Contractor, Canteen } from '../Models/index.js';

// const registerContractor = tryCatch(
//     'register contractor',
//     async (req, res, next) => {
//         let avatarURL;
//         try {
//             const data = {
//                 fullName: req.body.fullName.trim(),
//                 email: req.body.email.trim(),
//                 phoneNumber: req.body.phoneNumber,
//                 password: req.body.password,
//                 avatar: req.files?.avatar?.[0].path,
//             };

//             const { canteenId } = req.params;

//             // input error handling
//             if (
//                 !fullName ||
//                 !email ||
//                 !phoneNumber ||
//                 !password ||
//                 !canteenId
//             ) {
//                 return next(new ErrorHandler('missing fields', BAD_REQUEST));
//             }

//             const canteen = await Canteen.findById(canteenId);
//             if (!canteen) {
//                 return next(new ErrorHandler('canteen not found', NOT_FOUND));
//             }

//             for (const [key, value] of Object.entries(data)) {
//                 if (value && key !== 'canteenId') {
//                     const isAvatar = key === 'avatar';
//                     const isValid = verifyExpression(
//                         isAvatar ? key : 'file',
//                         value
//                     );
//                     if (!isValid) {
//                         if (data.avatar) fs.unlinkSync(data.avatar);
//                         return next(
//                             new ErrorHandler(
//                                 isAvatar
//                                     ? `Only PNG, JPG/JPEG files are allowed for avatar, and the file size must be < 5MB.`
//                                     : `${key} is invalid.`,
//                                 BAD_REQUEST
//                             )
//                         );
//                     }
//                 }
//             }

//             // check if user already exists with this roll no
//             const existingContractor = await Contractor.findOne({
//                 canteen: canteenId,
//                 $or: [{ phoneNumber }, { email }],
//             });
//             if (existingContractor) {
//                 if (data.avatar) fs.unlinkSync(data.avatar);
//                 return next(
//                     new ErrorHandler('contractor already exists', BAD_REQUEST)
//                 );
//             }

//             // upload avatar on cloudinary
//             if (data.avatar) {
//                 data.avatar = await uploadOnCloudinary(data.avatar);
//                 data.avatar = data.avatar.secure_url;
//                 avatarURL = data.avatar;
//             }

//             // hash the password (auto done by pre hook in model)

//             const contractor = await Contractor.create(data);
//             return res.status(OK).json(contractor);
//         } catch (err) {
//             if (avatarURL) await deleteFromCloudinary(avatarURL);
//             throw err;
//         }
//     }
// );

// const loginContractor = tryCatch('login contractor', async (req, res, next) => {
//     const { rollNo, password, hostelType, hostelNo } = req.body;

//     if (!rollNo || !password || !hostelNo || !hostelType) {
//         return next(new ErrorHandler('missing fields', BAD_REQUEST));
//     }

//     const hostel = await Hostel.findOne({ hostelNo, hostelType });
//     if (!hostel) {
//         return next(new ErrorHandler('hostel not found', NOT_FOUND));
//     }

//     const student = await Student.findOne({ rollNo, canteenId: canteen._id });
//     if (!student) {
//         return next(new ErrorHandler('student not found', NOT_FOUND));
//     }
//     const isPassValid = bcrypt.compareSync(password, student.password);
//     if (!isPassValid) {
//         return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
//     }

//     // generate tokens
//     const { accessToken, refreshToken } = await generateTokens(student);

//     // login user
//     const loggedInStudent = await User.findByIdAndUpdate(student._id, {
//         $set: { refreshToken },
//     }).select('-password -refreshToken');

//     return res
//         .status(OK)
//         .cookie('snackTrack_accessToken', accessToken, {
//             ...COOKIE_OPTIONS,
//             maxAge: parseInt(process.env.ACCESS_TOKEN_MAXAGE),
//         })
//         .cookie('snackTrack_refreshToken', refreshToken, {
//             ...COOKIE_OPTIONS,
//             maxAge: parseInt(process.env.REFRESH_TOKEN_MAXAGE),
//         })
//         .json(loggedInStudent);
// });

// const deleteAccount = tryCatch(
//     'delete student account',
//     async (req, res, next) => {
//         const { password } = req.body;

//         const isPassValid = bcrypt.compareSync(password, req.user.password);
//         if (!isPassValid) {
//             return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
//         }

//         if (req.user.avatar) await deleteFromCloudinary(req.user.avatar);

//         await Student.findByIdAndDelete(req.user._id);

//         return res
//             .status(OK)
//             .clearCookie('snackTrack_accessToken', COOKIE_OPTIONS)
//             .clearCookie('snackTrack_refreshToken', COOKIE_OPTIONS)
//             .json({ message: 'account deleted successfully' });
//     }
// );

// const logoutStudent = tryCatch('logout student', async (req, res) => {
//     await Student.findByIdAndUpdate(req.user?._id, {
//         $set: { refreshToken: '' },
//     });
//     return res
//         .status(OK)
//         .clearCookie('snackTrack_accessToken', COOKIE_OPTIONS)
//         .clearCookie('snackTrack_refreshToken', COOKIE_OPTIONS)
//         .json({ message: 'student loggedout successfully' });
// });

const getCurrentContractor = tryCatch('get Current contractor', (req, res) => {
    const { password, refreshToken, ...contractor } = req.user;
    return res.status(OK).json(contractor);
});

const updateAccountDetails = tryCatch(
    'update account details',
    async (req, res, next) => {
        const { fullName, phoneNumber, email, password } = req.body;

        if (email && !verifyExpression('email', email)) {
            return next(new ErrorHandler('invalid email', BAD_REQUEST));
        }

        const isPassValid = bcrypt.compareSync(password, req.user.password);
        if (!isPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        const contractor = await Contractor.findById(contractorId);

        if (!contractor) {
            return next(new ErrorHandler('contractor not found', NOT_FOUND));
        }
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
    // registerContractor,
    // loginContractor,
    // logoutContractor,
    // deleteAccount,
    updateAccountDetails,
    updateAvatar,
    updatePassword,
    getCurrentContractor,
};
