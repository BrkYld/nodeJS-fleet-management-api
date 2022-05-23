import mongoose from "mongoose";
import toJson from '@meanie/mongoose-to-json';

const Schema = mongoose.Schema;
const model = mongoose.model;

const vehicle = new Schema(
    {
        licence_plate: {
            type: String,
            required: true,
            trim: false,
            unique:true
        }
    },
    {
        timestamps: true,
    }
)

// add plugin that converts mongoose to json
vehicle.plugin(toJson);

export const Vehicle = model('Vehicle', vehicle, 'Vehicle');