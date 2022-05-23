import mongoose from "mongoose";
import toJson from '@meanie/mongoose-to-json';
import Enums from "../enums/index.js";

const Schema = mongoose.Schema;
const model = mongoose.model;


const bag = new Schema(
    {
        barcode: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        delivery_point_for_unloading: {
            type: Schema.Types.Number,
            required: true,
        },
        packets: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Packet',
                }
            ],
            default: []
        },
        status: {
            type: Number,
            default: Enums.deliveryStatus.Created
        },
        type: {
            type: String,
            default: 'bag'
        }
    },
    {
        timestamps: true,
    }
)

// add plugin that converts mongoose to json
bag.plugin(toJson);

export const Bag = model('Bag', bag, 'Bag');