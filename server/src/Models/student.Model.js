import { model, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

const studentSchema = new Schema(
    {
        hostelId: {
            type: Types.ObjectId,
            required: true,
            ref: 'Hostel',
        },
        rollNo: {
            type: String,
            unique: true,
            required: true,
            index: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

// Hash password before saving pre hook
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export const Student = model('Student', studentSchema);
