import { OK, BAD_REQUEST, COOKIE_OPTIONS } from '../Constants/index.js';
import { tryCatch } from '../Utils/index.js';
import { Canteen } from '../Models/index.js';
import { generateAdminKeyToken } from '../Helpers/index.js';

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

const verifyKey = tryCatch('verify admin key', async (req, res) => {
    const { key } = req.body;
    if (key !== process.env.ADMIN_KEY) {
        return res.status(BAD_REQUEST).json({ message: 'Invalid key' });
    } else {
        const adminKeyToken = await generateAdminKeyToken(key);
        return res
            .status(OK)
            .cookie('snackTrack_adminKeyToken', adminKeyToken, {
                ...COOKIE_OPTIONS,
                maxAge: parseInt(process.env.ADMIN_KEY_TOKEN_MAXAGE),
            })
            .json({ message: 'Correct key' });
    }
});

export { getCanteens, verifyKey };
