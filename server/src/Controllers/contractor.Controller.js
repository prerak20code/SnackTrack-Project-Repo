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
import { Contractor, Canteen, Snack, Student } from '../Models/index.js';

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
    const { accessToken, refreshToken } = await generateTokens(contractor);

    const loggedInContractor = await Contractor.findByIdAndUpdate(
        contractor._id,
        {
            $set: { refreshToken },
        }
    ).select('-password -refreshToken');

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
        .json(loggedInContractor);
});

const updateAccountDetails = tryCatch(
    'update account details',
    async (req, res, next) => {
        const { fullName, phoneNumber, email, password } = req.body;

        // input error handling
        if (!fullName || !email || !phoneNumber) {
            return next(new ErrorHandler('missing fields', BAD_REQUEST));
        }
        for (const [key, value] of Object.entries(data)) {
            if (value) {
                const isValid = verifyExpression(key, value);
                if (!isValid) {
                    return next(
                        new ErrorHandler(`${key} is invalid.`, BAD_REQUEST)
                    );
                }
            }
        }

        const isPassValid = bcrypt.compareSync(password, req.user.password);
        if (!isPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        const contractor = await Contractor.findById(req.user._id);

        contractor.email = email || contractor.email;
        contractor.phoneNumber = phoneNumber || contractor.phoneNumber;
        contractor.fullName = fullName || contractor.fullName;
        await contractor.save();

        return res.status(OK).json(contractor);
    }
);

const updatePassword = tryCatch('update password', async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    const isPassValid = bcrypt.compareSync(oldPassword, req.user.password);
    if (!isPassValid) {
        return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
    }

    const isValid = verifyExpression('password', newPassword);
    if (!isValid) {
        return next(new ErrorHandler('invalid password', BAD_REQUEST));
    }

    // hash new password
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

    await Contractor.findByIdAndUpdate(req.user._id, {
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
        const updatedContractor = await Contractor.updateAvatar(_id, avatarURL);

        // delete old avatar
        if (updatedContractor && avatar) await deleteFromCloudinary(avatar);
        return res.status(OK).json(updatedContractor);
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
            if (!fullName || !rollNo || !phoneNumber || !password) {
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
            const existingStudent = await Student.findOne({
                rollNo: data.rollNo,
            });
            if (existingStudent) {
                return next(
                    new ErrorHandler('user already exists', BAD_REQUEST)
                );
            }

            data.hostelId = (
                await Canteen.findById(contractor.canteenId)
            )?.hostelId;

            // hash the password (auto done by pre hook in model)

            // generate tokens
            const { accessToken, refreshToken } = await generateTokens(student);
            data.refreshToken = refreshToken;

            const student = await Student.create(data);

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
                .json(student);
        } catch (err) {
            throw err;
        }
    }
);

const removeAllStudents = tryCatch(
    'remove all students',
    async (req, res, next) => {
        const contractor = req.user;
        const canteen = await Canteen.findById(contractor.canteenId);
        await Student.deleteMany({ hostelId: canteen.hostelId });
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

        const [canteen, student] = await Promise.all([
            Canteen.findById(contractor.canteenId),
            Student.findById(studentId),
        ]);
        if (!student) {
            return next(new ErrorHandler('student not found', NOT_FOUND));
        }
        // a contractor can remove the student only if the student belongs to his canteen
        if (canteen.hostelId !== student.hostelId) {
            return next(new ErrorHandler('unauthorized access', BAD_REQUEST));
        }

        if (student.avatar) await deleteFromCloudinary(student.avatar);

        await Student.findByIdAndDelete(studentId);

        return res.status(OK).json({ message: 'student removed successfully' });
    }
);

const updateStudentAccountDetails = tryCatch(
    'update account details',
    async (req, res, next) => {
        const contractor = req.user;
        const { studentId } = req.params;
        const { fullName, phoneNumber, rollNo, password } = req.body;

        const [student, canteen] = await Promise.all([
            Student.findById(studentId),
            Canteen.findById(contractor.canteenId),
        ]);
        if (!student) {
            return next(new ErrorHandler('student not found', NOT_FOUND));
        }
        if (student.hostelId !== canteen.hostelId) {
            return next(new ErrorHandler('unauthorized access', BAD_REQUEST));
        }

        const isPassValid = bcrypt.compareSync(password, student.password);
        if (!isPassValid) {
            return next(new ErrorHandler('invalid credentials', BAD_REQUEST));
        }

        student.rollNo = rollNo || student.rollNo;
        student.fullName = fullName || student.fullName;
        student.phoneNumber = phoneNumber || student.phoneNumber;
        await student.save();

        return res.status(OK).json(student);
    }
);

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

// order management tasks
const markOrderAsDelivered = tryCatch(
    'mark order as delivered',
    async (req, res, next) => {}
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
    toggleAvaialbleCount,
    markOrderAsDelivered,
};
