import { Schema, model, Types } from 'mongoose';

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
        // could use an array: in case a hostel has multiple canteens with canteen No
        canteen: {
            type: Types.ObjectId,
            ref: 'Canteen',
        },
    },
    { timestamps: true }
);

export const Hostel = model('Hostel', hostelSchema);
