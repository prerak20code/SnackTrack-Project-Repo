import { tryCatch } from '../Utils';
import { Order } from '../Models/index.js';

// under student
const placeOrder = tryCatch('place order', async (req, res, next) => {});

const getOrderHistory = tryCatch('get order history', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 },
    };

    const { docs, totalPages, totalDocs } =
        await OrderHistory.aggregatePaginate(
            OrderHistory,
            { studentId: req.user._id },
            options
        );

    return res.status(OK).json({ docs, totalPages, totalDocs });
});

// under contractor
const markOrderAsDelivered = tryCatch(
    'mark order as delivered',
    async (req, res, next) => {}
);

export { placeOrder, getOrderHistory, markOrderAsDelivered };
