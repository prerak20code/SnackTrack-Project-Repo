import { Schema, model, Types } from 'mongoose';

const orderSchema = new Schema(
    {
        studentId: {
            type: Types.ObjectId,
            required: true,
            ref: 'Student',
        },
        canteenId: {
            type: Types.ObjectId,
            required: true,
            ref: 'Canteen',
        },
        amount: {
            type: Number,
            required: true,
        },
        items: [
            {
                type: Types.ObjectId,
                required: true,
                ref: 'Snack',
            },
        ],
    },
    { timestamps: true }
);

export const Order = model('Order', orderSchema);
