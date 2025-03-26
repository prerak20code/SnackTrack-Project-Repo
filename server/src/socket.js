import { app } from './app.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { CORS_OPTIONS } from './Constants/options.js';
import { redisClient } from './server.js';

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: CORS_OPTIONS });

// connection
io.on('connection', async (socket) => {
    const userId = socket.handshake.auth.userId;

    console.log('a user connected:', socket.id);

    // store its socket id in redis
    try {
        await redisClient.setEx(userId, 3600, socket.id); // 1hr exp
        console.log(`socket id of user ${userId} stored in redis.`);
    } catch (err) {
        return console.error("Error store user's socket id in redis: ", err);
    }

    // EVENT LISTENERS

    // new order => notify canteen
    socket.on('newOrder', (order) => {
        const socketId = redisClient.get(order.canteenId);
        socket.to(socketId).emit('newOrder', order);
    });

    // order rejected => notify student
    socket.on('orderRejected', (order) => {
        const socketId = redisClient.get(order.studentId);
        socket.to(socketId).emit('orderRejected', order);
    });

    // order prepared  => notify student
    socket.on('orderPrepared', (order) => {
        const socketId = redisClient.get(order.studentId);
        socket.to(socketId).emit('orderPrepared', order);
    });

    // order picked up => notify student
    socket.on('orderPickedUp', (order) => {
        const socketId = redisClient.get(order.studentId);
        socket.to(socketId).emit('orderPickedUp', order);
    });

    // disconnection
    socket.on('disconnect', async () => {
        console.log('a user disconnected:', socket.id);

        // delete the socket id from redis
        try {
            await redisClient.del(userId);
            console.log(`socket id of user ${userId} deleted from redis.`);
        } catch (err) {
            return console.error(
                "Error deleting user's socket id from redis: ",
                err
            );
        }
    });
});

export { io, httpServer };
