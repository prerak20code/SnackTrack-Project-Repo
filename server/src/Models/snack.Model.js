import { model, Schema, Types } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const snackSchema = new Schema(
    {
        image: {
            type: String,
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default: false,
        },
        canteenId: {
            type: Types.ObjectId,
            required: true,
            ref: 'Canteen',
        },
    },
    {
        timestamps: true,
    }
);

snackSchema.plugin(aggregatePaginate);

export const Snack = model('Snack', snackSchema);
