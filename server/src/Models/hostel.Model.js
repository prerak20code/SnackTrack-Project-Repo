import { Schema, model, Types } from 'mongoose';

// idea: single hostel has a single canteen
const hostelSchema = new Schema(
    {
        hostelType: {
            type: String,
            enum: ['GH', 'BH'],
            required: true,
        },
        hostelNumber: {
            type: Number,
            required: true,
            unique: true,
        },
        canteenId: {
            type: Types.ObjectId,
            ref: 'Canteen',
        },
    },
    { timestamps: true }
);

export const Hostel = model('Hostel', hostelSchema);
