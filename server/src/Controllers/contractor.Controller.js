import {
    OK,
    BAD_REQUEST,
    NOT_FOUND,
    COOKIE_OPTIONS,
} from '../Constants/index.js';
import bcrypt from 'bcrypt';
import { verifyExpression, tryCatch, ErrorHandler } from '../Utils/index.js';
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
    generateTokens,
} from '../Helpers/index.js';
import { Canteen, Contractor, Snack, Student } from '../Models/index.js';

// personal usage
const login = tryCatch('login as contractor', async (req, res, next) => {
    const { emailOrPhoneNo, password } = req.body;

    if (!emailOrPhoneNo || !password) {
        return next(new ErrorHandler('missing fields', BAD_REQUEST));
    }

    const contractor = await Contractor.findOne({
        $or: [{ email: emailOrPhoneNo }, { phoneNumber: emailOrPhoneNo }],
    });
    if (!contractor) {
        return next(new ErrorHandler('contractor not found', NOT_FOUND));
    }

    const isPassValid = bcrypt.compareSync(password, contractor.password);
    if (!isPassValid) {
        return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
    }

    // generate tokens
    const { accessToken, refreshToken } = await generateTokens({
        _id: contractor._id,
        role: 'contractor',
    });

    const [loggedInContractor, canteen] = await Promise.all([
        Contractor.findByIdAndUpdate(contractor._id, {
            $set: { refreshToken },
        })
            .select('-password -refreshToken')
            .lean(),
        Canteen.findById(contractor.canteenId)
            .select('hostelType hostelNumber hostelName')
            .lean(),
    ]);

    return res
        .status(OK)
        .cookie('snackTrack_accessToken', accessToken, {
            ...COOKIE_OPTIONS,
            maxAge: parseInt(process.env.ACCESS_TOKEN_MAXAGE),
        })
        .cookie('snackTrack_refreshToken', refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: parseInt(process.env.REFRESH_TOKEN_MAXAGE),
        })
        .json({ ...loggedInContractor, role: 'contractor', ...canteen });
});

const updateAccountDetails = tryCatch(
    'update account details',
    async (req, res, next) => {
        const { _id, password } = req.user;
        const data = {
            fullName: req.body.fullName.trim(),
            email: req.body.email.trim(),
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
        };

        // input error handling
        if (!data.fullName || !data.email || !data.phoneNumber) {
            return next(new ErrorHandler('missing fields', BAD_REQUEST));
        }
        for (const [key, value] of Object.entries(data)) {
            if (value && key !== 'password') {
                const isValid = verifyExpression(key, value);
                if (!isValid) {
                    return next(
                        new ErrorHandler(`${key} is invalid.`, BAD_REQUEST)
                    );
                }
            }
        }

        const isPassValid = bcrypt.compareSync(data.password, password);
        if (!isPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        // update or keep prev details if empty
        await Contractor.findByIdAndUpdate(
            _id,
            {
                $set: {
                    ...(data.email && { email: data.email }),
                    ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
                    ...(data.fullName && { fullName: data.fullName }),
                },
            },
            { new: true }
        );

        return res
            .status(OK)
            .json({ message: 'account details updated successfully' });
    }
);

const updatePassword = tryCatch('update password', async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const contractor = req.user;

    const isPassValid = bcrypt.compareSync(oldPassword, contractor.password);
    if (!isPassValid) {
        return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
    }

    const isValid = verifyExpression('password', newPassword);
    if (!isValid) {
        return next(new ErrorHandler('invalid password', BAD_REQUEST));
    }

    // hash new password
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

    await Contractor.findByIdAndUpdate(contractor._id, {
        $set: { password: hashedNewPassword },
    });

    return res.status(OK).json({ message: 'password updated successfully' });
});

const updateAvatar = tryCatch('update avatar', async (req, res, next) => {
    let avatarURL;
    try {
        const { _id, avatar } = req.user;
        if (!req.file) {
            return next(new ErrorHandler('missing avatar', BAD_REQUEST));
        }

        // upload new avatar on cloudinary
        avatarURL = await uploadOnCloudinary(req.file.path);
        avatarURL = avatarURL.secure_url;

        // update user avatar
        const updatedContractor = await Contractor.findByIdAndUpdate(
            _id,
            {
                $set: { avatar: avatarURL },
            },
            { new: true }
        );

        // delete old avatar
        if (updatedContractor && avatar) await deleteFromCloudinary(avatar);
        return res.status(OK).json({ newAvatar: updatedContractor.avatar });
    } catch (err) {
        if (avatarURL) await deleteFromCloudinary(avatarURL);
        throw err;
    }
});

// student management tasks
const registerNewStudent = tryCatch(
    'register as student',
    async (req, res, next) => {
        try {
            const contractor = req.user; // only contractor can register a student
            const data = {
                fullName: req.body.fullName.trim(),
                rollNo: req.body.rollNo.trim(),
                phoneNumber: req.body.phoneNumber,
                password: req.body.password,
            };

            // input error handling
            if (
                !data.fullName ||
                !data.rollNo ||
                !data.phoneNumber ||
                !data.password
            ) {
                return next(new ErrorHandler('missing fields', BAD_REQUEST));
            }
            for (const [key, value] of Object.entries(data)) {
                const isValid = verifyExpression(key, value);
                if (!isValid) {
                    return next(
                        new ErrorHandler(`${key} is invalid.`, BAD_REQUEST)
                    );
                }
            }
            data.userName =
                contractor.hostelType +
                contractor.hostelNumber +
                '-' +
                data.rollNo;

            // check if user already exists with this roll no
            const existingStudent = await Student.findOne({
                userName: data.userName,
            });
            if (existingStudent) {
                return next(
                    new ErrorHandler('user already exists', BAD_REQUEST)
                );
            }

            // hash the password (auto done by pre hook in model)

            const student = await Student.create({
                fullName: data.fullName,
                canteenId: contractor.canteenId,
                userName: data.userName,
                phoneNumber: data.phoneNumber,
                password: data.password,
            });

            return res.status(OK).json(student);
        } catch (err) {
            throw err;
        }
    }
);

const removeAllStudents = tryCatch(
    'remove all students',
    async (req, res, next) => {
        const { password } = req.body;
        const contractor = req.user;
        if (!password) {
            return next(new ErrorHandler('missing fields', BAD_REQUEST));
        }

        const isPasswordValid = bcrypt.compareSync(
            password,
            contractor.password
        );
        if (!isPasswordValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        await Student.deleteMany({ canteenId: contractor.canteenId });
        return res
            .status(OK)
            .json({ message: 'all students removed successfully' });
    }
);

const removeStudent = tryCatch(
    'remove student account',
    async (req, res, next) => {
        const { studentId } = req.params;
        const contractor = req.user;
        const { password } = req.body;

        // a contractor can remove the student only if the student belongs to his canteen
        const student = await Student.findOne({
            _id: studentId,
            canteenId: contractor.canteenId,
        });
        if (!student) {
            return next(new ErrorHandler('student not found', NOT_FOUND));
        }

        const isPassValid = bcrypt.compareSync(password, contractor.password);
        if (!isPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        if (student.avatar) await deleteFromCloudinary(student.avatar);

        await Student.findByIdAndDelete(studentId);

        return res.status(OK).json({ message: 'account deleted successfully' });
    }
);

const getStudents = tryCatch('get students', async (req, res) => {
    const contractor = req.user;
    const { limit = 10, page = 1 } = req.query; // for pagination
    const result = await Student.aggregatePaginate(
        [
            { $match: { canteenId: contractor.canteenId } },
            { $project: { password: 0, refreshToken: 0 } },
        ],
        {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
        }
    );
    if (result.docs.length) {
        const data = {
            students: result.docs,
            studentsInfo: {
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                totalStudents: result.totalDocs,
            },
        };
        return res.status(OK).json(data);
    } else {
        return res.status(OK).json({ message: 'no students found' });
    }
});

// if two students are exchanging there roll no due to some reason then will have to delete one and update details of there and register first one again
const updateStudentAccountDetails = tryCatch(
    'update account details',
    async (req, res, next) => {
        const contractor = req.user;
        const { studentId } = req.params;
        const { fullName, phoneNumber, rollNo, password, contractorPassword } =
            req.body;

        const student = await Student.findOne({
            _id: studentId,
            canteenId: contractor.canteenId,
        });
        if (!student) {
            return next(new ErrorHandler('student not found', NOT_FOUND));
        }

        const [isStudentPassValid, isContractorPassValid] = await Promise.all([
            bcrypt.compare(password, student.password),
            bcrypt.compare(contractorPassword, contractor.password),
        ]);
        if (!isStudentPassValid) {
            return next(
                new ErrorHandler('invalid student password', BAD_REQUEST)
            );
        }
        if (!isContractorPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        const alreadyExists = await Student.findOne({
            userName:
                contractor.hostelType + contractor.hostelNumber + '-' + rollNo,
        });
        if (alreadyExists) {
            return next(new ErrorHandler('user already exists', BAD_REQUEST));
        }

        student.userName =
            contractor.hostelType + contractor.hostelNumber + '-' + rollNo ||
            student.userName;
        student.fullName = fullName || student.fullName;
        student.phoneNumber = phoneNumber || student.phoneNumber;
        await student.save();

        return res.status(OK).json(student);
    }
);

// TODO: ⭐PENDING FOR CHECKING
// snack management tasks
const addSnack = tryCatch('add snack', async (req, res, next) => {
    let imageURL;
    try {
        const contractor = req.user;
        const { name, price } = req.body;
        let image = req.file?.path;

        if (!name || !price) {
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
            price,
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

// packaged food management tasks
const addItem = tryCatch('add item', async (req, res, next) => {
    let imageURL;
    try {
        const contractor = req.user;
        const { name, price, availableCount } = req.body;
        let image = req.file?.path;

        // Validate required fields
        if (!name || !price || !availableCount) {
            if (image) fs.unlinkSync(image);
            return next(new ErrorHandler('missing fields', BAD_REQUEST));
        }

        // Upload image on cloudinary if provided
        if (image) {
            image = await uploadOnCloudinary(image);
            image = image.secure_url;
            imageURL = image;
        }

        // Create new packaged food item
        const item = await PackagedFood.create({
            canteenId: contractor.canteenId,
            name,
            price,
            availableCount,
            image,
        });

        return res.status(OK).json(item);
    } catch (err) {
        // Clean up uploaded image if error occurs
        if (imageURL) await deleteFromCloudinary(imageURL);
        throw err;
    }
});

const deleteItem = tryCatch('delete item', async (req, res, next) => {
    const { itemId } = req.params;
    const contractor = req.user;

    // Find the item and ensure it belongs to the contractor's canteen
    const item = await PackagedFood.findOne({
        _id: itemId,
        canteenId: contractor.canteenId,
    });
    if (!item) {
        return next(new ErrorHandler('item not found', NOT_FOUND));
    }

    // Delete the item's image from Cloudinary if it exists
    if (item.image) {
        await deleteFromCloudinary(item.image);
    }

    // Delete the item
    await item.remove();

    return res.status(OK).json({ message: 'item deleted successfully' });
});

const updateItemDetails = tryCatch(
    'update item details',
    async (req, res, next) => {
        const { itemId } = req.params;
        const contractor = req.user;
        const { name, category, variants } = req.body;
        const image = req.file?.path;

        // Validate required fields
        if (!name && !category && !variants && !req.file) {
            if (image) fs.unlinkSync(image);
            return next(new ErrorHandler('missing fields', BAD_REQUEST));
        }

        // Find the item and ensure it belongs to the contractor's canteen
        const item = await PackagedFood.findOne({
            _id: itemId,
            canteenId: contractor.canteenId,
        });
        if (!item) {
            if (image) fs.unlinkSync(image);
            return next(new ErrorHandler('item not found', NOT_FOUND));
        }

        let imageURL;
        try {
            // Upload new image on cloudinary if provided
            if (image) {
                imageURL = await uploadOnCloudinary(image);
                imageURL = imageURL.secure_url;
            }

            // Update item details
            item.name = name || item.name;
            item.category = category || item.category;
            item.variants = variants || item.variants;
            item.image = imageURL || item.image;

            await item.save();

            // Delete old image if it exists and a new image was uploaded
            if (imageURL && item.image !== imageURL) {
                await deleteFromCloudinary(item.image);
            }

            return res.status(OK).json(item);
        } catch (err) {
            if (imageURL) await deleteFromCloudinary(imageURL);
            throw err;
        }
    }
);

const toggleAvaialbleCount = tryCatch(
    'toggle available count',
    async (req, res, next) => {
        const { itemId } = req.params;
        const contractor = req.user;

        // Find the item and ensure it belongs to the contractor's canteen
        const item = await PackagedFood.findOne({
            _id: itemId,
            canteenId: contractor.canteenId,
        });
        if (!item) {
            return next(new ErrorHandler('item not found', NOT_FOUND));
        }

        // Toggle the available count
        item.variants.forEach((variant) => {
            variant.availableCount = variant.availableCount === 0 ? 1 : 0;
        });

        await item.save();

        return res.status(OK).json(item);
    }
);

export {
    login,
    updateAccountDetails,
    updatePassword,
    updateAvatar,
    registerNewStudent,
    removeAllStudents,
    removeStudent,
    getStudents,
    updateStudentAccountDetails,
    addSnack,
    deleteSnack,
    updateSnackDetails,
    toggleSnackAvailability,
    addItem,
    deleteItem,
    updateItemDetails,
    toggleAvaialbleCount,
};
