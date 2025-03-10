import jwt from 'jsonwebtoken';
import { BAD_REQUEST, FORBIDDEN } from '../Constants/errorCodes.js';
import { COOKIE_OPTIONS } from '../Constants/options.js';
import { extractTokens, generateAccessToken } from '../Helpers/index.js';
import { userObject } from '../Controllers/user.Controller.js';

/**
 * @param {Object} res - http response object
 * @param {String} refreshToken  - refresh token
 * @returns {String | Object} null or current user object
 */
export const refreshAccessToken = async (res, refreshToken) => {
    try {
        const decodedToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        if (!decodedToken) {
            throw new Error('invalid refresh token');
        }

        const currentUser = await userObject.getUser(decodedToken.userId);

        if (!currentUser || currentUser.refresh_token !== refreshToken) {
            throw new Error('user with provided refresh token not found');
        } else {
            res.cookie(
                'snackTrack_accessToken',
                await generateAccessToken(currentUser), // new access token
                {
                    ...COOKIE_OPTIONS,
                    maxAge: parseInt(process.env.ACCESS_TOKEN_MAXAGE),
                }
            );
            return currentUser;
        }
    } catch (err) {
        throw new Error('missing or invalid refresh token');
    }
};

const verifyJwt = async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = extractTokens(req);

        if (!accessToken) {
            // generate new access token
            if (refreshToken) {
                req.user = await refreshAccessToken(res, refreshToken);
                return next();
            } else {
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'tokens missing' });
            }
        } else {
            // verify access token
            const decodedToken = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET
            );

            if (!decodedToken) {
                throw new Error('invalid access token');
            } else {
                const currentUser = await userObject.getUser(
                    decodedToken.userId
                );
                if (!currentUser) {
                    throw new Error('user not found');
                } else {
                    req.user = currentUser;
                    return next();
                }
            }
        }
    } catch (err) {
        return res
            .status(FORBIDDEN)
            .clearCookie('snackTrack_accessToken', COOKIE_OPTIONS)
            .clearCookie('snackTrack_refreshToken', COOKIE_OPTIONS)
            .json({ message: 'expired or invalid jwt token' });
    }
};

const optionalVerifyJwt = async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = extractTokens(req);

        if (!accessToken && !refreshToken) {
            return next();
        } else if (accessToken) {
            const decodedToken = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET
            );

            if (!decodedToken) {
                throw new Error('invalid access token');
            } else {
                const currentUser = await userObject.getUser(
                    decodedToken.userId
                );
                if (!currentUser) {
                    throw new Error('user not found');
                } else {
                    req.user = currentUser;
                    return next();
                }
            }
        } else {
            req.user = await refreshAccessToken(res, refreshToken);
            return next();
        }
    } catch (err) {
        return res
            .status(FORBIDDEN)
            .clearCookie('snackTrack_accessToken', COOKIE_OPTIONS)
            .clearCookie('snackTrack_refreshToken', COOKIE_OPTIONS)
            .json({
                message: 'expired or invalid jwt token',
                err: err.message,
            });
    }
};

export { verifyJwt, optionalVerifyJwt };
