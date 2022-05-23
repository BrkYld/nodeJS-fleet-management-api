import { Vehicle } from '../model/index.js'

export default {
    create: async newVehicle => {
        return await Vehicle.create({ ...newVehicle })
    }
}