import { Schema, model, Types } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

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
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Completed'], // cancellation not allowed
            default: 'Pending',
        },
        amount: {
            type: Number,
            required: true,
        },
        items: [
            {
                itemType: {
                    type: String,
                    required: true,
                    enum: ['PackagedFood', 'Snack'],
                },
                itemId: {
                    type: Types.ObjectId,
                    required: true,
                    refPath: 'items.itemType', // Dynamic reference based on itemType
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

orderSchema.plugin(aggregatePaginate);

export const Order = new model('Order', orderSchema);
