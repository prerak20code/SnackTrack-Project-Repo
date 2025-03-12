import jwt from 'jsonwebtoken';

/**
 * Util to generate both Access & Refresh JWT Tokens
 * @param {Object} data - The data which needs to be in the tokens
 * @returns Tokens as {accessToken, refreshToken}
 */

const generateTokens = async (data) => {
    try {
        const accessToken = await generateAccessToken(data);
        const refreshToken = await generateRefreshToken(data);

        return { accessToken, refreshToken };
    } catch (err) {
        throw new Error(`error occured while generating tokens, error: ${err}`);
    }
};

/**
 * Util to generate Access Token
 * @param {Object} data - The data which needs to be in the token
 * @returns JWT Token
 */

const generateAccessToken = async (data) => {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
};

/**
 * Util to generate Refresh Token
 * @param {Object} data - The data which needs to be in the token
 * @returns JWT Token
 */

const generateRefreshToken = async (data) => {
    return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
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
