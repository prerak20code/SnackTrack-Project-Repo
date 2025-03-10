import { Schema, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';

const contractorSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        hostelId: {
            type: Types.ObjectId,
            ref: 'Hostel',
        },
        canteenId: {
            type: Types.ObjectId,
            ref: 'Canteen',
        },
    },
    { timestamps: true }
);

// Hash password before saving
contractorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export const Contractor = model('Contractor', contractorSchema);
