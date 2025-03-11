import { Schema, Types, model } from 'mongoose';

// idea: single canteen has a single contractor
//       single canteen has multiple snacks (limited: so array would be more efficient)
//       single canteen belongs to a single hostel
const canteenSchema = new Schema(
    {
        contractorId: {
            type: Types.ObjectId,
            ref: 'Contractor',
        },
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
    },
    { timestamps: true }
);

export const Canteen = model('Canteen', canteenSchema);
