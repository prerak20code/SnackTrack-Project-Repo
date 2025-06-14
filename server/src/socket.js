import { app } from './app.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { CORS_OPTIONS } from './Constants/options.js';
import { getSocketId, deleteSocketId, setSocketId } from './Utils/index.js';

const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://localhost:5173',
      'http://snacktrack.me',
      'https://snacktrack.me',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
});

io.on('connection', async (socket) => {
    const userId = socket.handshake.auth.userId;
    console.log('🔗 Connected socket:', socket.id, 'for user:', userId);

    if (!userId) {
        console.error('User ID not provided in socket connection');
        return socket.disconnect();
    }
    console.log('a user connected:', socket.id);
    // store its socket id in cache (redis)
    try {
        await setSocketId(userId, socket);
        console.log(`socket id of user ${userId} stored in cache.`);
    } catch (err) {
        return console.error("Error store user's socket id in cache: ", err);
    }

    // EVENT LISTENERS

    // new order => notify canteen
    socket.on('newOrder', async (order) => {
        console.log('📥 New order event received!');
        if (!order) {
            console.error('❌ Invalid order data:', order);
            return;
        }
        try {
            // Add detailed logging of the order object
            console.log('📋 Order details:', {
                orderId: order._id,
                studentId: order.studentId,
                specialInstructions:
                    order.specialInstructions || 'No instructions provided',
                items: order.items,
            });

            const socketId1 = await getSocketId(order.canteenId);
            const socketId2 = await getSocketId(order.contractorId);

            if (!socketId1) {
                console.warn(
                    `⚠️ No active socket for canteen ${order.canteenId}. Order notification cannot be sent.`
                );
                if (!socketId2) {
                    console.warn(
                        `No active socket for canteen ${order.contractorId}.Order notification cannot be sent to the kitchen and contractor`
                    );
                    return;
                }
            }
            if (!socketId2) {
                console.warn(
                    `⚠️ No active socket for contractor ${order.contractorId}. Order notification cannot be sent.`
                );
            }
            // Ensure the order object is properly structured before emitting
            const orderToSend = {
                ...order,
                specialInstructions: order.specialInstructions || '',
            };

            console.log(
                `📤 Sending order to canteen (Socket ID: ${socketId1})`
            );
            io.to(socketId1).emit('newOrder', orderToSend);

            console.log(
                `📤 Sending order to contractor (Socket ID: ${socketId2})`
            );
            io.to(socketId2).emit('newOrder', orderToSend);
        } catch (error) {
            console.error('⚠️ Error processing order:', error);
        }
    });

    // order rejected => notify student
    socket.on('orderRejected', async (order) => {
        console.log('order is rejected');
        const socketId = await getSocketId(order.studentId);
        const socketId2 = await getSocketId(order.canteenId);
        socket.to(socketId).emit('orderRejected', order);
        socket.to(socketId2).emit('orderRejected', order);
    });

    // order prepared  => notify student

    socket.on('orderPrepared', async (order) => {
        console.log('order is prepared');
        const socketId = await getSocketId(order.studentId);
        const socketId2 = await getSocketId(order.canteenId);
        socket.to(socketId).emit('orderPrepared', order);
        socket.to(socketId2).emit('orderPrepared', order);
    });

    // order picked up => notify student
    socket.on('orderPickedUp', async (order) => {
        console.log('in backend orderpickedup');
        const socketId = await getSocketId(order.studentId);
        const socketId2 = await getSocketId(order.canteenId);
        socket.to(socketId).emit('orderPickedUp', order);
        socket.to(socketId2).emit('orderPickedUp', order);
    });

    socket.on('disconnect', async () => {
        console.log('a user disconnected:', socket.id);

        // delete the socket id from cache (redis)
        try {
            await deleteSocketId(userId, socket);
            console.log(`socket id of user ${userId} deleted from cache.`);
        } catch (err) {
            return console.error(
                "Error deleting user's socket id from cache: ",
                err
            );
        }
    });
});

export { io, http };
