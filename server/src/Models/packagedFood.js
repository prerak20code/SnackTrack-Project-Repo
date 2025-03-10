import { Schema, model } from 'mongoose';

const packagedFoodSchema = new Schema(
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
        category: [
            {
                price: {
                    enum: ['10', ''],
                },
                type: {
                    type: String,
                    required: true,
                },
                availableCount: {
                    type: Number,
                    default: 0,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

packagedFoodSchema.plugin(aggregatePaginate);

export const PackagedFood = model('PackagedFood', packagedFoodSchema);
