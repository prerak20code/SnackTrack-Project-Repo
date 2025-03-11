import { tryCatch } from '../Utils';
import { Order } from '../Models/index.js';

const placeOrder = tryCatch('place order', async (req, res, next) => {});

const getOrderHistory = tryCatch('get order history', async (req, res) => {});

export { placeOrder, getOrderHistory };
