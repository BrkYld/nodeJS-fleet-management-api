import mongoose from "mongoose";
import toJson from '@meanie/mongoose-to-json';
import Enums from "../enums/index.js";

const Schema = mongoose.Schema;
const model = mongoose.model;

const packet = new Schema(
    {
        barcode: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        delivery_point_for_unloading: {
            type: Number,
            required: true,
        },
        bagBarcode: {
            type: String,
            default: null,
        },
        volumetric_weight: {
            type: Number,
            required: true,
            default: 1
        },
        status: {
            type: Number,
            default: Enums.deliveryStatus.Created
        },
        type: {
            type: String,
            default: 'packet'
        }
    },
    {
        timestamps: true
    }
)

// add plugin that converts mongoose to json
packet.plugin(toJson);

export const Packet = model('Packet', packet, 'Packet');
