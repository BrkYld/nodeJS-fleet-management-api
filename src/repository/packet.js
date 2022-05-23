import { Packet } from '../model/index.js'

export default {
    create: async newPacket => {
        return await Packet.create(newPacket)
    },
    getAll: async () => {
        return await Packet.find({}, { __v: 0 })
    },
    getByBarcode: async barcode => {
        return await Packet.findOne({ barcode })
    },
    getByStatus: async status => {
        return await Packet.find({ status })
    },
    updateStatus: async (barcode, status) => {
        return await Packet.findOneAndUpdate({ barcode }, { status }, {
            returnOriginal: false
        })
    },
    updateBagBarcode: async (barcode, bagBarcode ) => {
        return await Packet.findOneAndUpdate({ barcode }, { bagBarcode }, {
            returnOriginal: false
        })
    }
}