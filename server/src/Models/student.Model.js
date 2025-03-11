import { model, Schema, Types } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

// student of hostel & canteen with ids hostelId & canteenId
const studentSchema = new Schema(
    {
        hostelId: {
            type: Types.ObjectId,
            required: true,
            ref: 'Hostel',
        },
        canteenId: {
            type: Types.ObjectId,
            required: true,
            ref: 'Canteen',
        },
        // for general details from user table
        userId: {
            type: Types.ObjectId,
            required: true,
            ref: 'User',
        },
        // student specific fields
        rollNo: {
            type: String,
            unique: true,
            required: true,
            index: true,
        },
    },
    { timestamps: true }
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
    { timestamps: true }
);

orderHistorySchema.plugin(aggregatePaginate);

const Student = model('Student', studentSchema);
const OrderHistory = model('OrderHistory', orderHistorySchema);

export { Student, OrderHistory };
