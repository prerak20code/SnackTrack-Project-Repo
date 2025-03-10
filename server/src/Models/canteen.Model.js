import { Schema, Types, model } from 'mongoose';

const canteenSchema = new Schema(
    {
        hostelId: {
            type: Types.ObjectId,
            required: true,
        },
        snacks: [
            {
                type: Types.ObjectId,
                ref: 'Snack',
            },
        ],
        contractors: [
            // in case a canteen has multiple contractors
            {
                type: Types.ObjectId,
                ref: 'Contractor',
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Canteen = model('Canteen', canteenSchema);
