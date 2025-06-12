import { Schema, model, Types } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const orderSchema = new Schema(
    {
        studentId: {
            type: Types.ObjectId,
            required: true,
            ref: 'Student',
        },
        contractorId: {
            type: Types.ObjectId,
            required: true,
            ref: 'Contractor',
        },
        canteenId: {
            type: Types.ObjectId,
            required: true,
            ref: 'Canteen',
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Prepared', 'PickedUp', 'Rejected'], // Cancellation not allowed
            default: 'Pending',
        },
        amount: {
            type: Number,
            required: true,
        },
        packingCharges: {
            type: Number,
            default: 0,
        },
        tableNumber: {
            type: String, // You can change this to Number if needed
            required: false, // or true if always required
        },
        items: [
            {
                name: {
                    type: String,
                    required: false,
                },
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
        specialInstructions: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

orderSchema.plugin(aggregatePaginate);

export const Order = model('Order', orderSchema);
