import { Bag } from '../model/index.js'

export default {
    create: async newBag => {
        return await Bag.create(newBag)
    },
    addPacket: async (barcode, packetID) => {
        return await Bag.findOneAndUpdate({ barcode }, { $push: { packets: packetID } }, {
            returnOriginal: false,
        })
    },
    getAll: async () => {
        return await Bag.find({}, { __v: 0 }).populate('packets')
    },
    getByBarcode: async barcode => {
        return await Bag.findOne({ barcode }).populate('packets')
    },
    getByStatus: async status => {
        return await Bag.find({ status })
    },
    updateStatus: async (barcode, status) => {
        return await Bag.findOneAndUpdate({ barcode }, { status }, {
            returnOriginal: false
        })
    }
}