import mongoose from "mongoose";
import toJson from '@meanie/mongoose-to-json';

const Schema = mongoose.Schema;
const model = mongoose.model;

const deliveryPoint = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: false,
            unique: true
        },
        value: {
            type: Number,
            required: true,
            unique: true,
            min: 1,
        },
        allow_to_unload: {
            type: [String],
            required: true
        }
    },
    {
        timestamps: true,
    }
)

// add plugin that converts mongoose to json
deliveryPoint.plugin(toJson);

export const DeliveryPoint = model('DeliveryPoint', deliveryPoint, 'DeliveryPoint');