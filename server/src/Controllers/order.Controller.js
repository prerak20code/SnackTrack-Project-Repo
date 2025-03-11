import { tryCatch } from '../Utils';
import { Order } from '../Models/index.js';

const getOrderHistory = tryCatch('get order history', async (req, res) => {
    const { page = 1, limit = 10, month } = req.query;

    // send orders grouped by month and per day (if separate orders per day were made)
});

export { getOrderHistory };
