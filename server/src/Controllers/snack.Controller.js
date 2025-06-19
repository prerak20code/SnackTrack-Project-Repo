import { OK } from '../Constants/index.js';
import { tryCatch } from '../Utils/index.js';
import { Snack, PackagedFood } from '../Models/index.js';
import { Types } from 'mongoose';

const getSnacks = tryCatch('get snacks', async (req, res) => {
    const user = req.user; // could be student or contractor
    const snacks = await Snack.find({
        canteenId: new Types.ObjectId(user.canteenId),
    }).sort({ createdAt: -1 });

    if (snacks.length) {
        return res.status(OK).json(snacks);
    } else {
        return res.status(OK).json({ message: 'no snacks found' });
    }
});

const getPackagedFoodItems = tryCatch(
    'get packaged food items',
    async (req, res) => {
        const user = req.user; // could be student or contractor
        const items = await PackagedFood.find({
            canteenId: new Types.ObjectId(user.canteenId),
        }).sort({ createdAt: -1 });

        if (items.length) {
            return res.status(OK).json(items);
        } else {
            return res.status(OK).json({ message: 'no items found' });
        }
    }
);

const getTopSnacks = tryCatch('get top snacks', async (req, res) => {
    const user = req.user; // could be student or contractor
    const topSnacks = await Snack.find({
        canteenId: new Types.ObjectId(user.canteenId),
        isAvailable: true,
    })
        .sort({ orderCount: -1 }) // Most ordered first
        .limit(3);

    if (topSnacks.length) {
        return res.status(OK).json(topSnacks);
    } else {
        return res.status(OK).json({ message: 'no top snacks found' });
    }
});

export { getSnacks, getPackagedFoodItems, getTopSnacks };
