import { OK, COOKIE_OPTIONS, BAD_REQUEST } from '../Constants/index.js';
import { tryCatch, ErrorHandler } from '../Utils/index.js';
import {
    Admin,
    Canteen,
    Student,
    Contractor,
    EmailVerification,
} from '../Models/index.js';
import { customAlphabet } from 'nanoid';
import { sendMail } from '../mailer.js';

const getCurrentUser = tryCatch('get current user', async (req, res, next) => {
    const { password, refreshToken, ...user } = req.user;
    let data = user;
    if (user.role !== 'admin') {
        // populate canteen Info
        const canteen = await Canteen.findById(user.canteenId);
        data = {
            ...data,
            hostelType: canteen.hostelType,
            hostelNumber: canteen.hostelNumber,
            hostelName: canteen.hostelName,
        };
    }
    return res.status(OK).json(data);
});

const logout = tryCatch('logout user', async (req, res, next) => {
    const { _id, role } = req.user;
    const query = [{ $set: { refreshToken: '' } }, { new: true }];

    if (role === 'student') {
        await Student.findByIdAndUpdate(_id, ...query);
    } else if (role === 'admin') {
        await Admin.findByIdAndUpdate(_id, ...query);
    } else {
        await Contractor.findByIdAndUpdate(_id, ...query);
    }
    return res
        .status(OK)
        .clearCookie('snackTrack_accessToken', COOKIE_OPTIONS)
        .clearCookie('snackTrack_refreshToken', COOKIE_OPTIONS)
        .json({ message: 'user loggedout successfully' });
});

// for hostel dropdown during student login
const getCanteens = tryCatch('get canteens', async (req, res) => {
    const canteens = await Canteen.find();
    return res.status(200).json(canteens);
});

const sendVerificationEmail = tryCatch(
    'send verification email',
    async (req, res, next) => {
        const { email } = req.body;
        const randomCode = customAlphabet('0123456789', 6)(); // Generate a random 6-digit numeric code for email verification

        if (!email) {
            return next(new ErrorHandler('missing fields', BAD_REQUEST));
        }

        // send mail
        await sendMail({
            to: email,
            subject: 'Welcome to SnackTrack',
            html: `Your Email verification code is ${randomCode}. This code will expire in 1 minute`,
        });

        // save record in db
        await EmailVerification.create({ email, code: randomCode });

        return res.status(OK).json({ message: 'email sent successfully' });
    }
);

const verifyEmail = tryCatch('verify email', async (req, res, next) => {
    const { email, code } = req.body;
    const record = await EmailVerification.findOne({ email, code });
    if (!record) {
        return next(new ErrorHandler('invalid code', BAD_REQUEST));
    }

    // email verified, delete the record from the database
    await EmailVerification.deleteMany({ email });

    return res.status(OK).json({ message: 'email verified successfully' });
});

export {
    getCurrentUser,
    logout,
    getCanteens,
    sendVerificationEmail,
    verifyEmail,
};
