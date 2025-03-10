import { model, Schema, Types } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import bcrypt from 'bcrypt';

const studentSchema = new Schema(
    {
        canteenId: {
            type: Types.ObjectId,
            required: true,
            ref: 'Canteen',
        },
        rollNo: {
            type: String,
            unique: true,
            required: true,
            index: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const orderHistorySchema = new Schema(
    {
        snackId: {
            type: Types.ObjectId,
            required: true,
            ref: 'Snack',
        },
        studentId: {
            type: Types.ObjectId,
            required: true,
            ref: 'Student',
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

orderHistorySchema.plugin(aggregatePaginate);

// Hash password before saving
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const Student = model('Student', studentSchema);
const OrderHistory = model('OrderHistory', orderHistorySchema);

export { Student, OrderHistory };
