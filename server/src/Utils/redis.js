import { redisClient } from '../server.js';

async function setSocketId(userId, socket) {
    return await redisClient.setEx(userId, 3600, socket.id); // 1hr exp
}

async function getSocketId(userId) {
    if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId provided to getSocketId');
    }

    try {
        const socketId = await redisClient.get(userId);
        console.log(`Fetched socketId for userId ${userId}:`, socketId);
        return socketId;
    } catch (err) {
        console.error('Redis get error:', err);
        throw err;
    }
}

async function deleteSocketId(userId) {
    return await redisClient.del(userId);
}

export { setSocketId, getSocketId, deleteSocketId };
