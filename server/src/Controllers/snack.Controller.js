import { OK } from '../Constants/index.js';
import { tryCatch } from '../Utils/index.js';
import { Snack, PackagedFood, Hostel } from '../Models/index.js';

const getSnacks = tryCatch('get snacks', async (req, res) => {
    const user = req.user;
    const { limit = 10, page = 1 } = req.query; // for pagination

    const canteenId =
        user.role === 'student'
            ? (await Hostel.findById(user.hostelId))?.canteenId
            : user.canteenId;

    const result = await Snack.aggregatePaginate([{ $match: { canteenId } }], {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
    });

    if (result.docs.length) {
        const data = {
            snacks: result.docs,
            snacksInfo: {
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                totalSnacks: result.totalDocs,
            },
        };
        return res.status(OK).json(data);
    } else {
        return res.status(OK).json({ message: 'no snacks found' });
    }
});

const getPackagedFoodItems = tryCatch(
    'get packaged food items',
    async (req, res) => {
        const user = req.user;
        const { limit = 10, page = 1 } = req.query; // for pagination

        const canteenId =
            user.role === 'student' // only student has a userName
                ? (await Hostel.findById(user.hostelId))?.canteenId
                : user.canteenId;

        const result = await PackagedFood.aggregatePaginate(
            [{ $match: { canteenId } }],
            {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: { createdAt: -1 },
            }
        );

        if (result.docs.length) {
            const data = {
                items: result.docs,
                itemsInfo: {
                    hasNextPage: result.hasNextPage,
                    hasPrevPage: result.hasPrevPage,
                    totalItems: result.totalDocs,
                },
            };
            return res.status(OK).json(data);
        } else {
            return res
                .status(OK)
                .json({ message: 'no packaged food items found' });
        }
    }
);

export { getSnacks, getPackagedFoodItems };
