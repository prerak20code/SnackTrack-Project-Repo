import { tryCatch } from '../Utils';

const getContractors = tryCatch(
    'get contractors',
    async (req, res, next) => {}
);

const addCanteen = tryCatch('add canteen', async (req, res, next) => {});

const deleteCanteen = tryCatch('delete canteen', async (req, res, next) => {});

export { getContractors, addCanteen, deleteCanteen };
