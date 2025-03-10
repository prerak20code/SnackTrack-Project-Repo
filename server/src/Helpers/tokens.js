import jwt from 'jsonwebtoken';

/**
 * Util to generate both Access & Refresh JWT Token
 * @param {Object} user - The data which needs to be in the token (only userId)
 * @returns Tokens as {accessToken, refreshToken}
 */

const generateTokens = async (user) => {
    try {
        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        return { accessToken, refreshToken };
    } catch (err) {
        throw new Error(`error occured while generating tokens, error: ${err}`);
    }
};

/**
 * Util to generate Access Token
 * @param {Object} user - The data which needs to be in the token (only userId)
 * @returns JWT Token
 */

const generateAccessToken = async (user) => {
    return jwt.sign(
        {
            userId: user.user_id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

/**
 * Util to generate Refresh Token
 * @param {Object} user - The data which needs to be in the token (only userId)
 * @returns JWT Token
 */

const generateRefreshToken = async (user) => {
    return jwt.sign(
        {
            userId: user.user_id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

/**
 * @param {object} req - The http req object to extract the token from.
 * @param {object} tokenName - Name of the token (snackTrack_accessToken or snackTrack_RefreshToken).
 * @returns Token
 */
const extractTokens = (req) => {
    const accessToken =
        req.cookies?.snackTrack_accessToken ||
        req.headers['authorization']?.split(' ')[1]; // BEAREER TOKEN
    const refreshToken =
        req.cookies?.snackTrack_refreshToken ||
        req.headers['authorization']?.split(' ')[1]; // BEAREER TOKEN
    return { accessToken, refreshToken };
};

export {
    extractTokens,
    generateTokens,
    generateAccessToken,
    generateRefreshToken,
};
