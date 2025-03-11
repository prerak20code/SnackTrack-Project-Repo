import { OK, BAD_REQUEST, NOT_FOUND } from '../Constants/index.js';
import { tryCatch, ErrorHandler } from '../Utils/index.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../Helpers/index.js';
import { Snack } from '../Models/snack.Model.js';
import fs from 'fs';

// general
const getSnacks = tryCatch('get snacks', async (req, res) => {
    const { canteenId } = req.params;
    const { orderBy = 'desc', limit = 10, page = 1 } = req.query; // for pagination

    const result = await Snack.aggregatePaginate(
        [
            { $match: { canteenId } },
            { $sort: { createdAt: orderBy === 'asc' ? 1 : -1 } },
        ],
        { page, limit }
    );

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

// under contractor
const addSnack = tryCatch('add snack', async (req, res, next) => {
    let imageURL;
    try {
        const contractor = req.user;
        const { name } = req.body;
        let image = req.file?.path;

        if (!name) {
            if (image) fs.unlinkSync(image);
            return next(new ErrorHandler('missing fields', BAD_REQUEST));
        }
        // upload image on cloudinary if have any
        if (image) {
            image = await uploadOnCloudinary(image);
            image = image.secure_url;
            imageURL = image;
        }

        const snack = await Snack.create({
            canteenId: contractor.canteenId,
            name,
            image,
        });
        return res.status(OK).json(snack);
    } catch (err) {
        if (imageURL) await deleteFromCloudinary(imageURL);
        throw err;
    }
});

const deleteSnack = tryCatch('delete post', async (req, res) => {
    const { snackId } = req.params;
    const contractor = req.user;
    // to delete a snack that should belong to the contractor's canteen
    const snack = await Snack.findOne({
        _id: snackId,
        canteenId: contractor.canteenId,
    });
    if (!snack) return next(new ErrorHandler('snack not found', NOT_FOUND));
    if (snack.image) await deleteFromCloudinary(snack.image);
    await snack.remove();
    return res.status(OK).json({ message: 'snack deleted successfully' });
});

const updateSnackDetails = tryCatch(
    'update snack details',
    async (req, res, next) => {
        const { snackId } = req.params;
        const contractor = req.user;
        const { name, price } = req.body;
        const image = req.file?.path;

        if (!name && !price && !req.file) {
            return next(new ErrorHandler('missing fields', BAD_REQUEST));
        }

        // a contractor can update the snack details only if the snack belongs to his canteen
        const snack = await Snack.findOne({
            _id: snackId,
            canteenId: contractor.canteenId,
        });
        if (!snack) {
            if (image) fs.unlinkSync(image);
            return next(new ErrorHandler('snack not found', NOT_FOUND));
        }

        snack.image = image || snack.image;
        snack.name = name || snack.name;
        snack.price = price || snack.price;
        await snack.save();

        return res
            .status(OK)
            .json({ message: 'snack details updated successfully' });
    }
);

const toggleSnackAvailability = tryCatch(
    'toggle snack availability',
    async (req, res) => {
        const { snackId } = req.params;
        const contractor = req.user;
        // a contractor can update the snack details only if the snack belongs to his canteen
        const snack = await Snack.findOne({
            _id: snackId,
            canteenId: contractor.canteenId,
        });
        if (!snack) {
            if (image) fs.unlinkSync(image);
            return next(new ErrorHandler('snack not found', NOT_FOUND));
        }

        snack.isAvailable = !snack.isAvailable;
        await snack.save();
        return res
            .status(OK)
            .json({ message: 'snack availability toggled successfully' });
    }
);

export {
    getSnacks,
    addSnack,
    deleteSnack,
    updateSnackDetails,
    updateSnackPrice,
    toggleSnackAvailability,
};
