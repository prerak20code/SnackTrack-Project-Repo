import { OK, BAD_REQUEST } from '../Constants/index.js';
import { tryCatch } from '../Utils/index.js';
import { Canteen } from '../Models/index.js';

const getCanteens = tryCatch('get canteens', async (req, res) => {
    const canteens = await Canteen.aggregate([
        { $match: {} },
        {
            $lookup: {
                from: 'contractors',
                localField: 'contractorId',
                foreignField: '_id',
                as: 'contractor',
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            email: 1,
                            phoneNumber: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        { $unwind: '$contractor' },
        { $project: { snacks: 0, packagedItems: 0 } },
    ]);
    return res.status(OK).json(canteens);
});

const verifyAdminKey = tryCatch('verify admin key', async (req, res) => {
    const { key } = req.body;
    if (key !== process.env.ADMIN_KEY) {
        return res.status(BAD_REQUEST).json({ message: 'Invalid key' });
    } else return res.status(OK).json({ message: 'Correct key' });
});

const changeContractor = tryCatch(
    'change contractor',
    async (req, res, next) => {}
);

const removeContractor = tryCatch(
    'remove contractor',
    async (req, res, next) => {}
);

export { getCanteens, verifyAdminKey, changeContractor, removeContractor };
