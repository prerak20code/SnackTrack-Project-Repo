import { Schema, model, Types } from 'mongoose';

const contractorSchema = new Schema(
    {
        canteenId: {
            type: Types.ObjectId,
            ref: 'Canteen',
        },
        // for general details from user table
        userId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // contractor specific fields if any
    },
    { timestamps: true }
);

export const Contractor = model('Contractor', contractorSchema);
