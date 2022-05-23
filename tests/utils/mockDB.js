
import ApiResponse from '../../src/utils/ApiResponse.js';
import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';
import config from '../../src/config/config.js';
const mockgoose = new Mockgoose(mongoose);



const mockDB = {
    start: async () => {
        await mockgoose.prepareStorage();
        await mongoose.connect(config.mongoDB.url, config.mongoDB.options);
    },
    stop: async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mockgoose.shutdown();
    },
    refresh: async () => {
        await mockgoose.helper.reset();
    }
}


export default mockDB;