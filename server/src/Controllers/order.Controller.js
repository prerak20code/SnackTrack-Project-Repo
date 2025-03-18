import { OK } from '../Constants/index.js';
import { tryCatch } from '../Utils/index.js';
import { Order } from '../Models/index.js';
import { Types } from 'mongoose';

// student can do

const addToCart = tryCatch('add to cart', async (req, res, next) => {});

const removeFromCart = tryCatch('add to cart', async (req, res, next) => {});

const placeOrder = tryCatch('place order', async (req, res, next) => {});

// contractor can do

const changeOrderStatus = tryCatch(
    'change order status',
    async (req, res, next) => {
        const { orderId, status } = req.params; // status: "complete" or "prepared" or "rejected"
        const contractor = req.user;

        // Find the order and ensure it belongs to the contractor's canteen
        const order = await Order.findOneAndUpdate(
            {
                _id: new Types.ObjectId(orderId),
                canteenId: new Types.ObjectId(contractor.canteenId),
            },
            { $set: { status } },
            { new: true }
        );
        if (!order) {
            return next(new ErrorHandler('order not found', NOT_FOUND));
        }

        return res
            .status(OK)
            .json({ message: 'order status updated successfully' });
    }
);

// both contractor & student can do

const getOrders = tryCatch('get orders', async (req, res) => {
    const {
        limit = 10,
        page = 1,
        month = new Date().getMonth() + 1, // JavaScript months are 0-indexed
    } = req.query;
    const { studentId } = req.params;

    const year = new Date().getFullYear();

    const result = await Order.aggregatePaginate(
        [
            {
                $match: {
                    studentId,
                    createdAt: {
                        $gte: new Date(`${year}-${parseInt(month)}-01`),
                        $lt: new Date(`${year}-${parseInt(month) + 1}-01`),
                    },
                },
            },
        ],
        {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
        }
    );

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

export { getOrders, placeOrder, changeOrderStatus, addToCart, removeFromCart };
