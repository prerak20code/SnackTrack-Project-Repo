import {
    OK,
    BAD_REQUEST,
    NOT_FOUND,
    COOKIE_OPTIONS,
    USER_PLACEHOLDER_IMAGE_URL,
    SNACK_PLACEHOLDER_IMAGE_URL,
} from '../Constants/index.js';
import bcrypt from 'bcrypt';
import { verifyExpression, tryCatch, ErrorHandler } from '../Utils/index.js';
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
    generateTokens,
} from '../Helpers/index.js';
import { nanoid } from 'nanoid';
import {
    Canteen,
    Contractor,
    Snack,
    Student,
    PackagedFood,
} from '../Models/index.js';
import { Types } from 'mongoose';
import fs from 'fs';
import { sendMail } from '../mailer.js';

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
        Contractor.findByIdAndUpdate(contractor._id, { $set: { refreshToken } })
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
        avatarURL = (await uploadOnCloudinary(req.file.path))?.secure_url;

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
                email: req.body.email.trim().toLowerCase(),
            };

            const password = req.body.password;

            const isPassValid = bcrypt.compareSync(
                password,
                contractor.password
            );
            if (!isPassValid) {
                return next(
                    new ErrorHandler('invalid credentials', BAD_REQUEST)
                );
            }

            // input error handling
            if (
                !data.fullName ||
                !data.rollNo ||
                !data.phoneNumber ||
                !data.email ||
                !password
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

            // check if user already exists with this roll no
            const [canteen, existingStudent] = await Promise.all([
                Canteen.findById(contractor.canteenId),
                Student.findOne({
                    $or: [
                        { userName: data.userName },
                        { phoneNumber: data.phoneNumber },
                        { email: data.email },
                    ],
                }),
            ]);

            if (existingStudent) {
                return next(
                    new ErrorHandler('user already exists', BAD_REQUEST)
                );
            }

            const randomCode = nanoid(6, '0123456789'), // Generate a random 6-digit numeric code for email verification
                randomPassword = nanoid(8); // unique temporary random password

            // EMAIL verification code
            // await sendMail({
            //     to: data.email,
            //     subject: 'Welcome to SnackTrack',
            //     html: `Hello ${data.fullName}, <br> Your Email verification code is ${randomCode}.`,
            // });

            data.userName =
                canteen.hostelType + canteen.hostelNumber + '-' + data.rollNo;

            // hash the password (auto done by pre hook in model)

            const student = await Student.create({
                fullName: data.fullName,
                canteenId: contractor.canteenId,
                userName: data.userName,
                phoneNumber: data.phoneNumber,
                email: data.email,
                password: randomPassword,
                avatar: USER_PLACEHOLDER_IMAGE_URL,
            });

            // send this password on student's email
            await sendMail({
                to: data.email,
                subject: 'Welcome to SnackTrack',
                html: `Hello ${data.fullName}, <br> Your temporary password is ${randomPassword}, You can update it anytime after logging in from settings.`,
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

        await Student.deleteMany({
            canteenId: new Types.ObjectId(contractor.canteenId),
        });
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

        const isPassValid = bcrypt.compareSync(password, contractor.password);
        if (!isPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        // a contractor can remove the student only if the student belongs to his canteen
        const student = await Student.findOneAndDelete({
            _id: new Types.ObjectId(studentId),
            canteenId: new Types.ObjectId(contractor.canteenId),
        });
        if (!student) {
            return next(new ErrorHandler('student not found', NOT_FOUND));
        }

        if (student.avatar !== USER_PLACEHOLDER_IMAGE_URL) {
            await deleteFromCloudinary(student.avatar);
        }

        return res.status(OK).json({ message: 'account deleted successfully' });
    }
);

// if two students are exchanging there roll no due to some reason then will have to delete one and update details of there and register first one again
const updateStudentAccountDetails = tryCatch(
    'update account details',
    async (req, res, next) => {
        const contractor = req.user;
        const { studentId } = req.params;
        const {
            fullName,
            phoneNumber,
            email,
            rollNo,
            password,
            contractorPassword,
        } = req.body;

        const [student] = await Student.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(studentId),
                    canteenId: new Types.ObjectId(contractor.canteenId),
                },
            },
            {
                $lookup: {
                    from: 'canteens',
                    localField: 'canteenId',
                    foreignField: '_id',
                    as: 'canteen',
                },
            },
            { $unwind: '$canteen' },
        ]);

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

        let alreadyExists = null;
        const newUserName =
            student.canteen.hostelType +
            student.canteen.hostelNumber +
            '-' +
            rollNo;

        if (student.userName !== newUserName) {
            alreadyExists = await Student.findOne({ userName: newUserName });
        } else if (student.phoneNumber !== phoneNumber) {
            alreadyExists = await Student.findOne({ phoneNumber });
        } else if (student.email !== email.toLowerCase()) {
            alreadyExists = await Student.findOne({
                email: email.toLowerCase(),
            });
        }
        if (alreadyExists) {
            return next(new ErrorHandler('user already exists', BAD_REQUEST));
        }

        const updatedStudent = await Student.findByIdAndUpdate(studentId, {
            $set: {
                ...(rollNo && {
                    userName:
                        student.canteen.hostelType +
                        student.canteen.hostelNumber +
                        '-' +
                        rollNo,
                }),
                ...(phoneNumber && { phoneNumber }),
                ...(fullName && { fullName }),
                ...(email && { email }),
            },
        });

        return res.status(OK).json(updatedStudent);
    }
);

// snack management tasks

const addSnack = tryCatch('add snack', async (req, res, next) => {
    let imageURL;
    try {
        const contractor = req.user;
        const { name, price, password } = req.body;
        let image = req.file?.path;

        if (!name || !price) {
            if (image) fs.unlinkSync(image);
            return next(new ErrorHandler('missing fields', BAD_REQUEST));
        }
        const isPassValid = bcrypt.compareSync(password, contractor.password);
        if (!isPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        const alreadyExists = await Snack.findOne({
            // case insensitive
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            canteenId: new Types.ObjectId(contractor.canteenId),
        });
        if (alreadyExists) {
            if (image) await deleteFromCloudinary(image);
            return next(new ErrorHandler('snack already exists', BAD_REQUEST));
        }

        // upload image on cloudinary if have any
        if (image) {
            image = (await uploadOnCloudinary(image))?.secure_url;
            imageURL = image;
        }

        const snack = await Snack.create({
            canteenId: contractor.canteenId,
            name,
            price,
            image: image || SNACK_PLACEHOLDER_IMAGE_URL,
        });
        return res.status(OK).json(snack);
    } catch (err) {
        if (imageURL) await deleteFromCloudinary(imageURL);
        throw err;
    }
});

const deleteSnack = tryCatch('delete post', async (req, res, next) => {
    const { snackId } = req.params;
    const contractor = req.user;
    const { password } = req.body;
    const isPassValid = bcrypt.compareSync(password, contractor.password);
    if (!isPassValid) {
        return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
    }
    // to delete a snack that should belong to the contractor's canteen
    const snack = await Snack.findOneAndDelete({
        _id: new Types.ObjectId(snackId),
        canteenId: new Types.ObjectId(contractor.canteenId),
    });
    if (!snack) return next(new ErrorHandler('snack not found', NOT_FOUND));
    if (snack.image !== SNACK_PLACEHOLDER_IMAGE_URL) {
        await deleteFromCloudinary(snack.image);
    }
    return res.status(OK).json({ message: 'snack deleted successfully' });
});

const updateSnackDetails = tryCatch(
    'update snack details',
    async (req, res, next) => {
        let imageURL;
        try {
            const { snackId } = req.params;
            const contractor = req.user;
            const { name, price, password } = req.body;
            let image = req.file?.path;

            if (!name && !price && !image) {
                return next(new ErrorHandler('missing fields', BAD_REQUEST));
            }
            const isPassValid = bcrypt.compareSync(
                password,
                contractor.password
            );
            if (!isPassValid) {
                return next(
                    new ErrorHandler('invalid credentials', BAD_REQUEST)
                );
            }

            const snack = await Snack.findOne({
                _id: new Types.ObjectId(snackId),
                canteenId: new Types.ObjectId(contractor.canteenId),
            });
            if (!snack) {
                if (image) fs.unlinkSync(image);
                return next(new ErrorHandler('snack not found', NOT_FOUND));
            }

            if (snack.name.toLowerCase() !== name.toLowerCase()) {
                const alreadyExists = await Snack.findOne({
                    // case insensitive
                    name: { $regex: new RegExp(`^${name}$`, 'i') },
                });
                if (alreadyExists) {
                    return next(
                        new ErrorHandler('snack already exists', BAD_REQUEST)
                    );
                }
            }

            if (image) {
                imageURL = (await uploadOnCloudinary(image))?.secure_url;
            }
            snack.image = imageURL || snack.image;
            snack.name = name || snack.name;
            snack.price = price || snack.price;
            await snack.save();

            return res.status(OK).json(snack);
        } catch (err) {
            if (imageURL) await deleteFromCloudinary(imageURL);
            throw err;
        }
    }
);

const toggleSnackAvailability = tryCatch(
    'toggle snack availability',
    async (req, res) => {
        const { snackId } = req.params;
        const contractor = req.user;

        // a contractor can update the snack details only if the snack belongs to his canteen
        const snack = await Snack.findOne({
            _id: new Types.ObjectId(snackId),
            canteenId: new Types.ObjectId(contractor.canteenId),
        });
        if (!snack) return next(new ErrorHandler('snack not found', NOT_FOUND));

        snack.isAvailable = !snack.isAvailable;
        await snack.save();
        return res
            .status(OK)
            .json({ message: 'snack availability toggled successfully' });
    }
);

// packaged food management tasks

const addItem = tryCatch('add item', async (req, res, next) => {
    const contractor = req.user;
    const { category, variants, password } = req.body;

    // Validate required fields
    if (!category || !variants.length) {
        return next(new ErrorHandler('missing fields', BAD_REQUEST));
    }
    const isPassValid = bcrypt.compareSync(password, contractor.password);
    if (!isPassValid) {
        return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
    }

    const alreadyExists = await PackagedFood.findOne({
        canteenId: new Types.ObjectId(contractor.canteenId),
        // case insensitive
        category: { $regex: new RegExp(`^${category}$`, 'i') },
    });
    if (alreadyExists) {
        return next(new ErrorHandler('category already exists', BAD_REQUEST));
    }

    // Create new packaged food item
    const item = await PackagedFood.create({
        canteenId: contractor.canteenId,
        category,
        variants,
    });

    return res.status(OK).json(item);
});

const deleteItem = tryCatch('delete item', async (req, res, next) => {
    const { itemId } = req.params;
    const contractor = req.user;
    const { password } = req.body;
    const isPassValid = bcrypt.compareSync(password, contractor.password);
    if (!isPassValid) {
        return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
    }
    // Find the item and ensure it belongs to the contractor's canteen
    const item = await PackagedFood.findOneAndDelete({
        _id: new Types.ObjectId(itemId),
        canteenId: new Types.ObjectId(contractor.canteenId),
    });
    if (!item) {
        return next(new ErrorHandler('item not found', NOT_FOUND));
    }

    return res.status(OK).json({ message: 'item deleted successfully' });
});

const updateItemDetails = tryCatch(
    'update item details',
    async (req, res, next) => {
        const { itemId } = req.params;
        const contractor = req.user;
        const { category, variants, password } = req.body;

        // Validate required fields
        if (!category && !variants.length) {
            return next(new ErrorHandler('missing fields', BAD_REQUEST));
        }

        const isPassValid = bcrypt.compareSync(password, contractor.password);
        if (!isPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        const item = await PackagedFood.findOne({
            _id: new Types.ObjectId(itemId),
            canteenId: new Types.ObjectId(contractor.canteenId),
        });
        if (!item) return next(new ErrorHandler('item not found', NOT_FOUND));

        if (item.category.toLowerCase() !== category.toLowerCase()) {
            const existingItem = await PackagedFood.findOne({
                canteenId: new Types.ObjectId(contractor.canteenId),
                // case insensitive
                category: { $regex: new RegExp(`^${category}$`, 'i') },
            });

            if (existingItem) {
                return next(
                    new ErrorHandler('category already exists', BAD_REQUEST)
                );
            }
        }
        item.category = category || item.category;
        item.variants = variants || item.variants;
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
    updateStudentAccountDetails,
    addSnack,
    deleteSnack,
    updateSnackDetails,
    toggleSnackAvailability,
    addItem,
    deleteItem,
    updateItemDetails,
};
