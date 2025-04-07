import { OK } from '../Constants/index.js';
import { tryCatch } from '../Utils/index.js';
import { Order } from '../Models/index.js';
import { Snack } from '../Models/snack.Model.js';
import mongoose, { Types } from 'mongoose';

// only student can do

const placeOrder = tryCatch('place order', async (req, res) => {
    const { cartItems, total } = req.body;
    const student = req.user;

    const order = await Order.create({
        studentId: student._id,
        canteenId: student.canteenId,
        amount: total,
        items: cartItems,
    });

    return res.status(OK).json(order);
});

// implement something to flush all the orders after 6 months to save space
const getStudentOrders = tryCatch('get student orders', async (req, res) => {
    const { limit = 10, page = 1 } = req.query;
    const { studentId } = req.params;

    const result = await Order.aggregatePaginate(
        [
            { $match: { studentId: new Types.ObjectId(studentId) } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'snacks',
                    localField: 'items.itemId',
                    foreignField: '_id',
                    as: 'snackDetails',
                    pipeline: [{ $project: { name: 1, image: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'packagedfoods',
                    localField: 'items.itemId',
                    foreignField: '_id',
                    as: 'packagedFoodDetails',
                    pipeline: [{ $project: { category: 1 } }],
                },
            },
            {
                $addFields: {
                    'items.name': {
                        $cond: [
                            { $eq: ['$items.itemType', 'Snack'] },
                            { $arrayElemAt: ['$snackDetails.name', 0] },
                            null,
                        ],
                    },
                    'items.image': {
                        $cond: [
                            { $eq: ['$items.itemType', 'Snack'] },
                            { $arrayElemAt: ['$snackDetails.image', 0] },
                            null,
                        ],
                    },
                    'items.category': {
                        $cond: [
                            { $eq: ['$items.itemType', 'PackagedFood'] },
                            {
                                $arrayElemAt: [
                                    '$packagedFoodDetails.category',
                                    0,
                                ],
                            },
                            null,
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: '$_id',
                    amount: { $first: '$amount' },
                    status: { $first: '$status' },
                    canteenId: { $first: '$canteenId' },
                    studentId: { $first: '$studentId' },
                    items: { $push: '$items' },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' },
                },
            },
            { $project: { snackDetails: 0, packagedFoodDetails: 0 } },
        ],
        {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
        }
    );

    return res.status(OK).json(
        result.docs.length
            ? {
                  orders: result.docs,
                  ordersInfo: {
                      hasNextPage: result.hasNextPage,
                      hasPrevPage: result.hasPrevPage,
                      totalOrders: result.totalDocs,
                  },
              }
            : { message: 'No orders found' }
    );
});

// const getStudentMonthlyBill = async (req, res) => {
//     const { studentId } = req.params;
//     const { year, month } = req.query;

//     if (!studentId || !year || !month) {
//         return res.status(400).json({ message: 'Missing parameters' });
//     }

//     try {
//         const bills = await Order.find({
//             studentId,
//             createdAt: {
//                 $gte: new Date(`${year}-${month}-01`),
//                 $lt: new Date(`${year}-${month}-31`),
//             },
//         }).populate('items.itemId', 'name');

//         // ✅ Calculate total amount
//         const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

//         res.json({ orders: bills, totalAmount }); // ✅ Send totalAmount in response
//     } catch (error) {
//         console.error('Error fetching bills:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

const getStudentMonthlyBill = async (req, res) => {
    const { studentId } = req.params;
    const { year, month } = req.query;

    if (!studentId || !year || !month) {
        return res.status(400).json({ message: 'Missing parameters' });
    }

    try {
        // Convert studentId to ObjectId
        const objectIdStudentId = new mongoose.Types.ObjectId(studentId);

        // Create proper date range for the month
        const startDate = new Date(year, parseInt(month) - 1, 1);
        const endDate = new Date(year, parseInt(month), 0); // Last day of the specified month

        const bills = await Order.find({
            studentId: objectIdStudentId,
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            },
        }).populate('items.itemId', 'name');

        // Calculate total amount
        const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

        res.json({ orders: bills, totalAmount });
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// const getContractorStudentMonthlyBill = async (req, res) => {
//     const { studentId } = req.params;
//     const { year, month } = req.query;

//     if (!studentId || !year || !month) {
//         return res.status(400).json({ message: 'Missing parameters' });
//     }

//     try {
//         // Convert studentId to ObjectId
//         const objectIdStudentId = new mongoose.Types.ObjectId(studentId);

//         // Create proper date range for the month
//         const startDate = new Date(year, parseInt(month) - 1, 1);
//         const endDate = new Date(year, parseInt(month), 0); // Last day of the specified month

//         const bills = await Order.find({
//             studentId: objectIdStudentId,
//             createdAt: {
//                 $gte: startDate,
//                 $lte: endDate,
//             },
//         }).populate('items.itemId', 'name');

//         // Calculate total amount
//         const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

//         res.json({ orders: bills, totalAmount });
//     } catch (error) {
//         console.error('Error fetching bills:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

const getCanteenMonthlyBill = async (req, res) => {
    try {
        const { canteenId } = req.params;
        const year = parseInt(req.query.year);
        const month = parseInt(req.query.month);

        if (!year || !month) {
            return res.status(400).json({ message: 'Invalid year or month' });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const orders = await Order.aggregate([
            {
                $match: {
                    canteenId: new mongoose.Types.ObjectId(canteenId),
                    status: 'PickedUp',
                    createdAt: { $gte: startDate, $lt: endDate },
                },
            },
            {
                $lookup: {
                    from: 'students',
                    localField: 'studentId',
                    foreignField: '_id',
                    as: 'student',
                },
            },
            { $unwind: '$student' },
            // Add this to unwind the items array
            { $unwind: '$items' },
            // Add lookup for Snacks
            {
                $lookup: {
                    from: 'snacks',
                    localField: 'items.itemId',
                    foreignField: '_id',
                    as: 'snackItem',
                },
            },
            // Add lookup for PackagedFood
            {
                $lookup: {
                    from: 'packagedfoods',
                    localField: 'items.itemId',
                    foreignField: '_id',
                    as: 'packagedFoodItem',
                },
            },
            // Combine results and add item name
            {
                $addFields: {
                    'items.name': {
                        $cond: [
                            { $eq: ['$items.itemType', 'Snack'] },
                            { $arrayElemAt: ['$snackItem.name', 0] },
                            { $arrayElemAt: ['$packagedFoodItem.category', 0] },
                        ],
                    },
                },
            },
            // Group back to original structure
            {
                $group: {
                    _id: '$_id',
                    status: { $first: '$status' },
                    amount: { $first: '$amount' },
                    createdAt: { $first: '$createdAt' },
                    studentName: { $first: '$student.fullName' },
                    studentRollNumber: { $first: '$student.userName' },
                    items: { $push: '$items' },
                },
            },
            { $sort: { createdAt: -1 } },
        ]);

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error in getCanteenMonthlyBill:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// only contractor can do

const updateOrderStatus = tryCatch(
    'update order status',
    async (req, res, next) => {
        const { orderId } = req.params;
        const { status } = req.query; // status: "PickedUp" or "Prepared" or "Rejected"
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

// today's only
const getCanteenOrders = tryCatch('get canteen orders', async (req, res) => {
    const { limit = 10, page = 1, status = 'Pending' } = req.query;
    const canteenId = req.user.canteenId; // contractor

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    // Fetch today's orders from this canteen
    const result = await Order.aggregatePaginate(
        [
            {
                $match: {
                    canteenId: new Types.ObjectId(canteenId),
                    $or: [
                        { createdAt: { $gte: startOfDay, $lt: endOfDay } },
                        { updatedAt: { $gte: startOfDay, $lt: endOfDay } },
                    ],
                    status,
                },
            },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'students',
                    localField: 'studentId',
                    foreignField: '_id',
                    as: 'studentInfo',
                    pipeline: [
                        {
                            $project: {
                                fullName: 1,
                                phoneNumber: 1,
                                rollNo: 1,
                                avatar: 1,
                                userName: 1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'snacks',
                    localField: 'items.itemId',
                    foreignField: '_id',
                    as: 'snackDetails',
                    pipeline: [{ $project: { name: 1, image: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'packagedfoods',
                    localField: 'items.itemId',
                    foreignField: '_id',
                    as: 'packagedFoodDetails',
                    pipeline: [{ $project: { category: 1 } }],
                },
            },
            {
                $addFields: {
                    'items.name': {
                        $cond: [
                            { $eq: ['$items.itemType', 'Snack'] },
                            { $arrayElemAt: ['$snackDetails.name', 0] },
                            null,
                        ],
                    },
                    'items.image': {
                        $cond: [
                            { $eq: ['$items.itemType', 'Snack'] },
                            { $arrayElemAt: ['$snackDetails.image', 0] },
                            null,
                        ],
                    },
                    'items.category': {
                        $cond: [
                            { $eq: ['$items.itemType', 'PackagedFood'] },
                            {
                                $arrayElemAt: [
                                    '$packagedFoodDetails.category',
                                    0,
                                ],
                            },
                            null,
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: '$_id',
                    amount: { $first: '$amount' },
                    status: { $first: '$status' },
                    canteenId: { $first: '$canteenId' },
                    studentId: { $first: '$studentId' },
                    items: { $push: '$items' },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' },
                    studentInfo: {
                        $first: { $arrayElemAt: ['$studentInfo', 0] },
                    },
                },
            },
            { $project: { snackDetails: 0, packagedFoodDetails: 0 } },
        ],
        {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
        }
    );

    return res.status(OK).json(
        result.docs.length
            ? {
                  orders: result.docs,
                  ordersInfo: {
                      hasNextPage: result.hasNextPage,
                      hasPrevPage: result.hasPrevPage,
                      totalOrders: result.totalDocs,
                  },
              }
            : { message: 'No orders found' }
    );
});

const getCanteenStatistics = async (req, res, next) => {
    try {
        const { canteenId } = req.params;
        const { year, month } = req.query;

        if (!canteenId || !year || !month) {
            return res
                .status(400)
                .json({ message: 'canteenId, year, and month are required' });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1); // first day of next month
        const canteenObjectId = new mongoose.Types.ObjectId(canteenId);

        // 1. Revenue trend (line chart)
        const trend = await Order.aggregate([
            {
                $match: {
                    canteenId: canteenObjectId,
                    status: 'PickedUp',
                    createdAt: { $gte: startDate, $lt: endDate },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$createdAt',
                        },
                    },
                    revenue: { $sum: '$amount' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const revenueTrend = trend.map((day) => ({
            date: day._id,
            revenue: day.revenue,
        }));

        // 2. Revenue by item (pie chart)
        const revenueByItem = await Order.aggregate([
            {
                $match: {
                    canteenId: canteenObjectId,
                    status: 'PickedUp',
                    createdAt: { $gte: startDate, $lt: endDate },
                },
            },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'snacks',
                    localField: 'items.itemId',
                    foreignField: '_id',
                    as: 'itemDetails',
                },
            },
            { $unwind: '$itemDetails' },
            {
                $group: {
                    _id: '$itemDetails.name',
                    totalRevenue: {
                        $sum: {
                            $multiply: ['$items.quantity', '$items.price'],
                        },
                    },
                },
            },
            {
                $project: {
                    name: '$_id',
                    value: '$totalRevenue',
                    _id: 0,
                },
            },
            { $sort: { value: -1 } },
        ]);

        // // 3. Revenue by item type (pie chart)
        // const revenueByItemType = await Order.aggregate([
        //     {
        //         $match: {
        //             canteenId: canteenObjectId,
        //             status: 'PickedUp',
        //             createdAt: { $gte: startDate, $lt: endDate },
        //         },
        //     },
        //     { $unwind: '$items' },
        //     {
        //         $lookup: {
        //             from: 'snacks',
        //             localField: 'items.itemId',
        //             foreignField: '_id',
        //             as: 'itemDetails',
        //         },
        //     },
        //     { $unwind: '$itemDetails' },
        //     {
        //         $group: {
        //             _id: '$itemDetails.type', // 'snack' or 'packaged'
        //             totalRevenue: {
        //                 $sum: {
        //                     $multiply: ['$items.quantity', '$items.price'],
        //                 },
        //             },
        //         },
        //     },
        //     {
        //         $project: {
        //             type: '$_id',
        //             value: '$totalRevenue',
        //             _id: 0,
        //         },
        //     },
        // ]);

        // 4. Top selling items (bar chart)
        const topSellingItems = await Order.aggregate([
            {
                $match: {
                    canteenId: canteenObjectId,
                    status: 'PickedUp',
                    createdAt: { $gte: startDate, $lt: endDate },
                },
            },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'snacks',
                    localField: 'items.itemId',
                    foreignField: '_id',
                    as: 'itemDetails',
                },
            },
            { $unwind: '$itemDetails' },
            {
                $group: {
                    _id: '$itemDetails.name',
                    quantity: { $sum: '$items.quantity' },
                },
            },
            {
                $project: {
                    name: '$_id',
                    quantity: 1,
                    _id: 0,
                },
            },
            { $sort: { quantity: -1 } },
            { $limit: 5 },
        ]);

        // 5. Daily order counts (line chart)
        const dailyOrderCounts = await Order.aggregate([
            {
                $match: {
                    canteenId: canteenObjectId,
                    status: 'PickedUp',
                    createdAt: { $gte: startDate, $lt: endDate },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$createdAt',
                        },
                    },
                    orders: { $addToSet: '$_id' },
                },
            },
            {
                $project: {
                    date: '$_id',
                    orderCount: { $size: '$orders' },
                    _id: 0,
                },
            },
            { $sort: { date: 1 } },
        ]);

        // // 6. Average order value (line chart)
        // const averageOrderValue = await Order.aggregate([
        //     {
        //         $match: {
        //             canteenId: canteenObjectId,
        //             status: 'PickedUp',
        //             createdAt: { $gte: startDate, $lt: endDate },
        //         },
        //     },
        //     {
        //         $group: {
        //             _id: {
        //                 $dateToString: {
        //                     format: '%Y-%m-%d',
        //                     date: '$createdAt',
        //                 },
        //             },
        //             totalRevenue: { $sum: '$amount' },
        //             orderIds: { $addToSet: '$_id' },
        //         },
        //     },
        //     {
        //         $project: {
        //             date: '$_id',
        //             averageValue: {
        //                 $cond: [
        //                     { $gt: [{ $size: '$orderIds' }, 0] },
        //                     {
        //                         $divide: [
        //                             '$totalRevenue',
        //                             { $size: '$orderIds' },
        //                         ],
        //                     },
        //                     0,
        //                 ],
        //             },
        //             _id: 0,
        //         },
        //     },
        //     { $sort: { date: 1 } },
        // ]);

        return res.status(200).json({
            revenueTrend,
            revenueByItem,
            // revenueByItemType,
            topSellingItems,
            dailyOrderCounts,
            // averageOrderValue,
        });
    } catch (err) {
        console.error('Error in getCanteenStatistics:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export {
    getStudentOrders,
    getCanteenOrders,
    placeOrder,
    updateOrderStatus,
    getStudentMonthlyBill,
    getCanteenMonthlyBill,
    getCanteenStatistics,
};
