import { OK, COOKIE_OPTIONS } from '../Constants/index.js';
import { tryCatch } from '../Utils/tryCatch.js';
import { Admin, Canteen, Student, Contractor } from '../Models/index.js';

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

const logout = tryCatch('logout user', async (req, res, next) => {
    const { _id, role } = req.user;
    const query = [{ $set: { refreshToken: '' } }, { new: true }];

    if (role === 'student') {
        await Student.findByIdAndUpdate(_id, ...query);
    } else if (role === 'admin') {
        await Admin.findByIdAndUpdate(_id, ...query);
    } else {
        await Contractor.findByIdAndUpdate(_id, ...query);
    }
    return res
        .status(OK)
        .clearCookie('snackTrack_accessToken', COOKIE_OPTIONS)
        .clearCookie('snackTrack_refreshToken', COOKIE_OPTIONS)
        .json({ message: 'user loggedout successfully' });
});

const getCanteens = tryCatch('get canteens', async (req, res) => {
    const canteens = await Canteen.find();
    return res.status(200).json(canteens);
});

export { getCurrentUser, logout, getCanteens };
