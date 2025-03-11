import { tryCatch } from '../Utils';
import { Canteen } from '../Models/index.js';

const addCanteen = tryCatch('add canteen', async (req, res, next) => {});

const deleteCanteen = tryCatch('delete canteen', async (req, res, next) => {});

export { getContractors, addCanteen, deleteCanteen };
