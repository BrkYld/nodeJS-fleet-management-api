import { DeliveryPoint } from '../model/index.js'

const autoValueIncrease = async () => {
    let max = (await DeliveryPoint.findOne({}).sort("-value").limit(1))
    let maxValue = max ? max.value : 0;
    return ++maxValue;
}

export default {
    create: async newDeliveryPoint => {
        return await DeliveryPoint.create({ ...newDeliveryPoint, value: await autoValueIncrease() })
    },
    getAll: async () => {
        return await DeliveryPoint.find({}, { __v: 0 })
    },
    getByValue: async (value) => {
        return await DeliveryPoint.findOne({ value }, { __v: 0 })
    }
}