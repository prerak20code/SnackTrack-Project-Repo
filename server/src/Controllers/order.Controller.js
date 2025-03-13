import { OK } from '../Constants/index.js';
import { tryCatch } from '../Utils/index.js';
import { Order } from '../Models/index.js';

// student can do
const placeOrder = tryCatch('place order', async (req, res, next) => {});

// both contractor & student can do
const getOrderHistory = tryCatch('get order history', async (req, res) => {
    const { limit = 10, page = 1, month } = req.query;
    const studentId = req.user.id;

    let filter = { studentId };

    if (month) {
        const year = new Date().getFullYear();
        filter.createdAt = {
            $gte: new Date(`${year}-${month}-01`),
            $lt: new Date(`${year}-${parseInt(month) + 1}-01`), // grouped the orders of a particular month
        };
    }

    const result = await Order.aggregatePaginate([{ $match: filter }], {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
    });

    if (result.docs.length) {
        return res.status(OK).json({
            orders: result.docs,
            ordersInfo: {
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                totalOrders: result.totalDocs,
            },
        });
    } else {
        return res.status(OK).json({ message: 'No orders found' });
    }
});

// contractor can do
const markOrderAsDelivered = tryCatch(
    'mark order as delivered',
    async (req, res, next) => {
        const { orderId } = req.params;
        const contractor = req.user;

        // Find the order and ensure it belongs to the contractor's canteen
        const order = await Order.findOne({
            _id: orderId,
            canteenId: contractor.canteenId,
        });
        if (!order) {
            return next(new ErrorHandler('order not found', NOT_FOUND));
        }

        // Mark the order as delivered
        order.status = 'Completed';
        await order.save();

        return res.status(OK).json(order);
    }
);

export { getOrderHistory, placeOrder, markOrderAsDelivered };
