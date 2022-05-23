import { Log } from '../model/index.js'

export default {
    getAll: async () => {
        return await Log.find({}, { __v: 0 }).sort("-createdAt")
    },
    create: async newLog => {
        return await Log.create(newLog)
    }
}