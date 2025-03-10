import { tryCatch } from '../Utils';

const getCanteens = tryCatch('get canteens', async (req, res, next) => {});

const addHostel = tryCatch('add hostel', async (req, res, next) => {});

const deleteHostel = tryCatch('delete hostel', async (req, res, next) => {});

export { addHostel, deleteHostel, getCanteens };
