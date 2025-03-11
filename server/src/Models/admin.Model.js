import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const adminSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false,
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

// Hash password before saving
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export const Admin = model('Admin', adminSchema);
