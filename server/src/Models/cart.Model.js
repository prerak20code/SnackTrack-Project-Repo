import { Schema, Types, model } from 'mongoose';

const CartSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            required: true,
            ref: 'User',
        },
        items: [
            {
                productId: {
                    type: Types.ObjectId,
                    required: true,
                },
                productType: {
                    type: String,
                    enum: ['snack', 'packagedFood'],
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
    },
    { timestamps: true }
);

export const Cart = new model('Cart', CartSchema);
