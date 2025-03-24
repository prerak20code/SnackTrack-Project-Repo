import jwt from 'jsonwebtoken';
import { FORBIDDEN, COOKIE_OPTIONS } from '../Constants/index.js';
import { extractTokens } from '../Helpers/index.js';

export const verifyAdminKeyJwt = async (req, res, next) => {
    try {
        const { adminKeyToken } = extractTokens(req);

        if (adminKeyToken) {
            // verify
            const decodedToken = jwt.verify(
                adminKeyToken,
                process.env.ADMIN_KEY_TOKEN_SECRET
            );
            if (!decodedToken) throw new Error(`invalid admin key token`);
            else req.adminVerified = true;
        }
        return next();
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
