import jwt, { decode } from 'jsonwebtoken';
import { FORBIDDEN, COOKIE_OPTIONS, BAD_REQUEST } from '../Constants/index.js';
import {
    extractTokens,
    generateAdminKeyToken,
    generateStaffKeyToken,
} from '../Helpers/index.js';
import { Canteen } from '../Models/index.js';

const verifyAdminKeyJwt = async (req, res, next) => {
    try {
        const { adminKeyToken } = extractTokens(req);

        if (adminKeyToken) {
            // verify
            const decodedToken = jwt.verify(
                adminKeyToken,
                process.env.ADMIN_KEY_TOKEN_SECRET
            );
            if (!decodedToken) {
                return res
                    .status(FORBIDDEN)
                    .clearCookie('snackTrack_adminKeyToken', COOKIE_OPTIONS)
                    .json({ message: 'Invalid admin key token' });
            }
            return next();
        } else {
            const { key } = req.body;
            if (!key) {
                return res.status(BAD_REQUEST).json({ message: 'missing key' });
            }
            if (key !== process.env.ADMIN_KEY) {
                return res.status(BAD_REQUEST).json({ message: 'Invalid key' });
            }
            const adminKeyToken = await generateAdminKeyToken(key);
            res.cookie('snackTrack_adminKeyToken', adminKeyToken, {
                ...COOKIE_OPTIONS,
                maxAge: parseInt(process.env.ADMIN_KEY_TOKEN_MAXAGE),
            });
            return next();
        }
    } catch (err) {
        return res
            .status(FORBIDDEN)
            .clearCookie('snackTrack_adminKeyToken', COOKIE_OPTIONS)
            .json({
                message: 'expired or invalid admin key jwt token',
                err: err.message,
            });
    }
};

const verifyStaffKeyJwt = async (req, res, next) => {
    try {
        const { staffKeyToken, accessToken, refreshToken, adminKeyToken } =
            extractTokens(req);

        // ⬅️ Attach tokens to request
        req.staffKeyToken = staffKeyToken;
        req.accessToken = accessToken;
        req.refreshToken = refreshToken;
        req.adminKeyToken = adminKeyToken;

        if (staffKeyToken) {
            // verify
            const decodedToken = jwt.verify(
                staffKeyToken,
                process.env.STAFF_KEY_TOKEN_SECRET
            );
            if (!decodedToken) {
                return res
                    .status(FORBIDDEN)
                    .clearCookie('snackTrack_staffKeyToken', COOKIE_OPTIONS)
                    .json({ message: 'Invalid staff key token' });
            }
            console.log('decoded Token', decodedToken);
            const canteen = await Canteen.findOne({
                kitchenKey: decodedToken.key,
            });
            req.hostelType = canteen.hostelType;
            req.hostelNumber = canteen.hostelNumber;
            req.hostelName = canteen.hostelName;
            req.canteenId = canteen._id;
            return next();
        } else {
            const { key } = req.body;
            if (!key) {
                return res.status(BAD_REQUEST).json({ message: 'missing key' });
            }
            const record = await Canteen.findOne({ kitchenKey: key });
            if (!record) {
                return res.status(BAD_REQUEST).json({ message: 'Invalid key' });
            }
            const staffKeyToken = await generateStaffKeyToken(key);
            res.cookie('snackTrack_staffKeyToken', staffKeyToken, {
                ...COOKIE_OPTIONS,
                maxAge: parseInt(process.env.STAFF_KEY_TOKEN_MAXAGE),
            });
            req.hostelType = record.hostelType;
            req.hostelNumber = record.hostelNumber;
            req.hostelName = record.hostelName;
            req.canteenId = record._id;
            return next();
        }
    } catch (err) {
        return res
            .status(FORBIDDEN)
            .clearCookie('snackTrack_staffKeyToken', COOKIE_OPTIONS)
            .json({
                message: 'expired or invalid staff key jwt token',
                err: err.message,
            });
    }
};

export { verifyAdminKeyJwt, verifyStaffKeyJwt };
