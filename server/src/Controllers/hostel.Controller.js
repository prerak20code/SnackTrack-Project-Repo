import { tryCatch } from '../Utils';
import { Hostel } from '../Models/index.js';

// under admin
const getCanteens = tryCatch('get canteens', async (req, res, next) => {});

const addHostel = tryCatch('add hostel', async (req, res, next) => {});

const removeHostel = tryCatch('remove hostel', async (req, res, next) => {});

export { addHostel, removeHostel, getCanteens };
