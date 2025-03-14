import { Schema, model, Types } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const packagedFoodSchema = new Schema(
    {
        canteenId: {
            type: Types.ObjectId,
            required: true,
            ref: 'Canteen',
        },
        category: {
            type: String,
            required: true,
            enum: ['Biscuits', 'Chips', 'Chocolates', 'Drinks', 'instant food'], // Example categories
        },
        variants: [
            {
                price: {
                    type: Number,
                    required: true,
                },
                availableCount: {
                    type: Number,
                    default: 0,
                },
            },
        ],
    },
    { timestamps: true }
);

packagedFoodSchema.plugin(aggregatePaginate);

export const PackagedFood = new model('PackagedFood', packagedFoodSchema);
