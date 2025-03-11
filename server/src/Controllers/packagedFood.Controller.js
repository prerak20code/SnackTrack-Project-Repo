import { tryCatch } from '../Utils';

// general
const getItems = tryCatch('get items', async (req, res, next) => {});

// under contractor
const addItem = tryCatch('add item', async (req, res, next) => {});

const deleteItem = tryCatch('delete item', async (req, res, next) => {});

const updateItemDetails = tryCatch(
    'update item details',
    async (req, res, next) => {}
);

const toggleAvaialbleCount = tryCatch(
    'toggle available count',
    async (req, res, next) => {}
);

export {
    getItems,
    addItem,
    deleteItem,
    updateItemDetails,
    toggleAvaialbleCount,
};
