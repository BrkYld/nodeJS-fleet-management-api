import mongoose from "mongoose";
import toJson from '@meanie/mongoose-to-json';

const Schema = mongoose.Schema;
const model = mongoose.model;

const log = new Schema(
    {
        description: {
            type: String,
            required: true
        },
        stack: {
            type: Object,
            default: {}
        }
    },
    {
        timestamps: true,
    }
)

// add plugin that converts mongoose to json
log.plugin(toJson);

export const Log = model('Log', log, 'Log');