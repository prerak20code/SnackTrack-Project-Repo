import { tryCatch } from '../Utils';
import { Canteen } from '../Models/index.js';

// under admin
const getContractor = tryCatch('get contractor', async (req, res, next) => {
    const contractor = await Canteen.find({ contractor: { $ne: null } });
    return res.status(OK).json(contractor);
});

const addCanteen = tryCatch('add canteen', async (req, res, next) => {});

const removeCanteen = tryCatch('remove canteen', async (req, res, next) => {});

export { getContractor, addCanteen, removeCanteen };
