import { OK } from '../Constants/index.js';
import { tryCatch } from '../Utils/tryCatch.js';
import { Canteen } from '../Models/index.js';

const getCurrentUser = tryCatch('get current user', async (req, res, next) => {
    const { password, refreshToken, ...user } = req.user;
    let data = user;
    if (user.role !== 'admin') {
        // populate canteen Info
        const canteen = await Canteen.findById(user.canteenId);
        data = {
            ...data,
            hostelType: canteen.hostelType,
            hostelNumber: canteen.hostelNumber,
            hostelName: canteen.hostelName,
        };
    }
    return res.status(OK).json(data);
});

export { getCurrentUser };
