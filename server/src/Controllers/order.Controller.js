import { OK } from '../Constants/index.js';
import { tryCatch } from '../Utils/index.js';
import { Order } from '../Models/index.js';
import { Types } from 'mongoose';

// only student can do

const placeOrder = async (req, res) => {
    try {
        const { studentId, canteenId } = req.body;

        if (!studentId || !canteenId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID and Canteen ID are required!',
            });
        }

        // Get cart from cookies
        let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

        console.log('Raw cart data:', cart);

        if (!Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty!',
            });
        }

        // Map cart data to match Order schema
        const orderItems = cart.map((item) => {
            if (!item.productId || !item.productType) {
                console.error('Invalid cart item:', item);
                throw new Error(
                    'Cart item is missing productId or productType!'
                );
            }
            return {
                itemId: item.productId,
                itemType: item.productType,
                quantity: item.quantity,
                price: item.price,
            };
        });

        // Calculate total amount
        const totalAmount = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,0);

        // Create order object
        const order = new Order({
            studentId,
            canteenId,
            status: 'Pending',
            amount: totalAmount,
            items: orderItems,
        });

        await order.save();
        res.clearCookie('cart');

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            order,
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({
            success: false,
            message: 'Error placing order',
            error: error.message,
        });
    }
};

// only contractor can do

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

export { getOrders, placeOrder, changeOrderStatus };
